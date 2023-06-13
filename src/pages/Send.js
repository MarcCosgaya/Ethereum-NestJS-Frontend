import '../App.css';
import { BalanceForm, SendForm } from '../WalletForm';

function Send() {
  return (
    <>
      <BalanceForm/>
      <hr/>
      <SendForm/>
    </>
  );
}

export default Send;
