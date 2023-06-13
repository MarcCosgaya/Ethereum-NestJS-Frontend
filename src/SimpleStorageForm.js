import axios from "axios";
import { useState, useEffect } from "react"

export function SimpleStorageForm(props) {
    return (
        <>
            <ContractLoader />
        </>
    );
}

function ContractLoader() {
    const [id, setId] = useState(1);
    const [contracts, setContracts] = useState([]);
    const [foundContract, setFoundContract] = useState();

    async function fetchContracts() {
        try {
            const { data } = await axios.get('http://localhost:3000/contracts');
            setContracts(data);
        }
        catch {}
    }

    useEffect(() => {
        fetchContracts();
    }, []);

    async function fetchContract() {
        if (!id) return;

        try {
            const { data } = await axios.get('http://localhost:3000/contracts/'+id);
            console.log(data.abi)
            setFoundContract(data)
        }
        catch {
            setId(1)
        }
    }

    return (
        <>
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
            <hr/>
            <label htmlFor="id">Id:</label><br/>
            <input type="number" id="id" value={id} onChange={event => setId(event.target.value)}></input>
            <button onClick={fetchContract}>Fetch contract</button>
            { foundContract && <ul className="force-wrap">
                    <li><b>id:</b> {foundContract.id}</li>
                    <li><b>address:</b> {foundContract.address}</li>
                    <li><b>bytecode:</b> {foundContract.bytecode}</li>
                    <li><b>source:</b> {foundContract.source}</li>
                    <li><b>tx:</b> {foundContract.tx}</li>
                    <li><b>verified:</b> {foundContract.verified ? 'true' : 'false'}</li>
                    <li><b>abi:</b><ul>
                        {foundContract.abi.map(e => {
                            return (<li key={e.name}>{e.name}<ul>
                                <li><b>constant:</b> {e.constant ? 'true' : 'false'}</li>
                                <li><b>inputs:</b><ul>{e.inputs.map(input => {
                                    return (<li>{`{
                                        internalType: "${input.internalType}",
                                        name: "${input.name}",
                                        type: "${input.type}"
                                    }`}</li>)
                                })}</ul></li>
                                <li><b>outputs:</b><ul>{e.outputs.map(output => {
                                    return (<li>{`{
                                        internalType: "${output.internalType}",
                                        name: "${output.name}",
                                        type: "${output.type}"
                                    }`}</li>)
                                })}</ul></li>
                                <li><b>payable:</b> {e.payable ? 'true' : 'false'}</li>
                                <li><b>stateMutability:</b> {e.stateMutability}</li>
                                <li><b>type:</b> {e.type}</li>
                            </ul></li>);
                        })}
                    </ul></li>
                </ul>
            }
        </>
    );
}