import axios from "axios";
import { useState } from "react"

export function PKForm(props) {
    const { mnemonic, setMnemonic, path, setPath} = props;

    return (
        <>
            <label htmlFor="mnemonic">Mnemonic</label>
            <input id="mnemonic" value={mnemonic} onChange={event => setMnemonic(event.target.value)}/>
            <br/>
            <label htmlFor="path">Path</label>
            <input id="path" value={path} onChange={event => setPath(event.target.value)}/>
        </>
    );
}

export function TxInfo(props) {
    const { tx } = props;

    return (
        <table>
            <thead><tr><th width="750px" colSpan={2}>Last TX</th></tr></thead>
            <tbody>
                <tr>
                    <th width="20%">Id</th>
                    <td>{tx?.id ?? 'ERROR'}</td>
                </tr>
                <tr>
                    <th>From</th>
                    <td>{tx?.from ?? 'ERROR'}</td>
                </tr>
                <tr>
                    <th>To</th>
                    <td>{tx?.to ?? 'ERROR'}</td>
                </tr>
                <tr>
                    <th>Value</th>
                    <td>{tx?.quantity ?? 'ERROR'} Ξ</td>
                </tr>
                <tr>
                    <th>Hash</th>
                    <td>{tx?.hash ?? 'ERROR'}</td>
                </tr>
            </tbody>
        </table>
    );
}

export function SendForm() {
    const [recipient, setRecipient] = useState('');
    const [quantity, setQuantity] = useState(0);

    const [mnemonic, setMnemonic] = useState('exact aim smooth dizzy tobacco bridge stable document tumble vehicle clap gesture');
    const [path, setPath] = useState(`m/44'/60'/0'/0/1`);

    const [lastTx, setLastTx] = useState();

    async function send() {
        const sendData = { new: { mnemonic: { mnemonic, path }, to: recipient, quant: Number(quantity) } };
        try {
            const { data } = await axios.post('http://localhost:3000/transactions', sendData);
            setLastTx(data);
        }
        catch (error) {
            console.error(error);
            setLastTx();
        }
    }

    return (
        <>
            <PKForm mnemonic={mnemonic} setMnemonic={setMnemonic} path={path} setPath={setPath}/>
            <br/>
            <label htmlFor="recipient">Recipient</label>
            <input id="recipient" value={recipient} onChange={event => setRecipient(event.target.value)}/>
            <br/>
            <label htmlFor="quantity">Quantity</label>
            <input id="quantity" value={quantity} onChange={event => setQuantity(event.target.value)}/>
            <br/>
            <button onClick={send}>Send</button>
            <TxInfo tx={lastTx}/>
        </>
    );
}

export function BalanceForm() {
    const [address, setAddress] = useState('0xe64e40EF4def381F28eC7a08296DD7df521f8ea8');
    const [balance, setBalance] = useState(0);

    async function fetchBalance() {
        try {
            const { data } = await axios.get('http://localhost:3000/transactions/balance/'+address);
            setBalance(data);
        }
        catch {
            setBalance(0)
        }
    }

    return (
        <>
            <label htmlFor="address">Address</label>
            <input id="address" value={address} onChange={event => setAddress(event.target.value)}/>
            <br/>
            <button onClick={fetchBalance}>Fetch Balance</button>
            <div>Balance is: {balance}</div>
        </>
    );
}