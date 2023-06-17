import axios from "axios";
import { useState, useEffect } from "react"
import { TxInfo } from "./WalletForm";

export default function ContractForm() {
    return (
        <>
            <ContractLoader />
        </>
    );
}

function ContractLoader() {
    const [id, setId] = useState(0);
    const [contracts, setContracts] = useState([]);
    const [foundContract, setFoundContract] = useState();

    async function fetchContracts() {
        try {
            const { data } = await axios.get('http://localhost:3000/contracts');
            setContracts(data);
        }
        catch {
            console.log('failed to fetch contracts')
        }
    }

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        if (!id) return;

        try {
            const found = contracts.find(contract => contract.id === Number(id));
            setFoundContract(found);
        }
        catch {
            setId(0);
            setFoundContract();
        }
    }, [id, contracts]);

    return (
        <>
            <button onClick={fetchContracts}>Refresh</button>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>address</th>
                        <th>tx</th>
                        <th>verified</th>
                    </tr>
                </thead>
                <tbody>
                {contracts.map((ctr) => {
                    return (<tr key={ctr.id}>
                        <td>{ctr.id}</td>
                        <td>{ctr.address}</td>
                        <td>{ctr.tx}</td>
                        <td>{ctr.verified ? 'true' : 'false'}</td>
                    </tr>);
                })}
                </tbody>
            </table>
            
            <label htmlFor="id">Select:</label>
            <input type="number" id="id" value={id} min="0" max={contracts.length} onChange={event => setId(event.target.value)}></input>
            <hr/>
            { foundContract && <ul className="force-wrap">
                    <li><b>id:</b> {foundContract.id}</li>
                    <li><b>address:</b> {foundContract.address}</li>
                    <li><b>tx:</b> {foundContract.tx}</li>
                    <li><b>verified:</b> {foundContract.verified ? 'true' : 'false'}</li>
                    <li><details><summary><b>bytecode:</b></summary>{foundContract.bytecode}</details></li>
                    <li><details><summary><b>source:</b></summary>{foundContract.source}</details></li>
                    <li><b>abi:</b><ul>
                        {foundContract.abi.map(e => {
                            return (<li key={e.name}><details><summary>{e.name}</summary><ul>
                                <li><b>constant:</b> {e.constant ? 'true' : 'false'}</li>
                                <li><b>inputs:</b><ul>{e.inputs.map(input => {
                                    return (<li key={input.name}>{`{
                                        internalType: "${input.internalType}",
                                        name: "${input.name}",
                                        type: "${input.type}"
                                    }`}</li>)
                                })}</ul></li>
                                <li><b>outputs:</b><ul>{e.outputs.map(output => {
                                    return (<li key={output.name}>{`{
                                        internalType: "${output.internalType}",
                                        name: "${output.name}",
                                        type: "${output.type}"
                                    }`}</li>)
                                })}</ul></li>
                                <li><b>payable:</b> {e.payable ? 'true' : 'false'}</li>
                                <li><b>stateMutability:</b> {e.stateMutability}</li>
                                <li><b>type:</b> {e.type}</li>
                            </ul></details></li>);
                        })}
                    </ul></li>
                </ul>
            }
            {foundContract && <hr/>}
            <ContractInteractor contract={foundContract} />
        </>
    );
}

function ContractInteractor(props) {
    const { contract } = props;

    const [selectedFunction, setSelectedFunction] = useState('');
    const [result, setResult] = useState();
    const [args, setArgs] = useState({});

    /*useEffect(() => {
        console.log('args are', args)
    }, [args]);*/

    /*useEffect(() => {
        console.log('result is', result)
    }, [result]);*/
    
    useEffect(() => {
        setSelectedFunction(contract?.abi[0]);
        setResult();
        setArgs({});
    }, [contract]);

    if (!contract) return;

    function prepareArgs() {
        const resultingArgs = [];

        for (const argName in args) {
            const index = selectedFunction.inputs.findIndex(e => e.name === argName);
            resultingArgs[index] = args[argName];

        }

        return resultingArgs;
    }

    async function makeCall() {
        try {
            const get = selectedFunction.inputs.length === 0;
            if (get) {
                const { data } = await axios.get(`http://localhost:3000/contracts/${contract.id}/call/${selectedFunction.name}`);
                setResult(data);
            } else {
                const { data } = await axios.post(`http://localhost:3000/contracts/${contract.id}/call`, {
                    func: selectedFunction.name,
                    args: prepareArgs()
                });
                setResult(data);
            }
        }
        catch {
            console.log(`failed to call '${selectedFunction.name}' on contract '${contract.id}'`)
        }
    }

    return (
        <>
            <label htmlFor="function-name"><b>Function:</b></label>
            <select id="function-name" onChange={event => setSelectedFunction(contract?.abi.find(e => e.name === event.target.value))}>
                {contract.abi.map(e => {
                    return <option value={e.name} key={e.name}>{e.name}</option>;
                })}
            </select>
            <br/>
            {selectedFunction?.inputs.map(input => {
                return (
                    <div key={input.name}>
                        <label htmlFor={input.name}>{input.name}: </label>
                        <input id={input.name} value={args[input.name] ?? ''} onChange={event => {
                            setArgs({...args, [event.target.id]: event.target.value})
                        }}></input>
                    </div>
                );
            })}
            <br/>
            <button onClick={makeCall}>Call</button>
            {typeof result === 'object' ? <TxInfo tx={result}/> : <div>{result}</div>}
        </>
    );
}