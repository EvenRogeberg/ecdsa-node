import { useState } from "react";
import server from "./server";
import { hashMessage } from "./scripts/hash";
import { signMessage } from "./scripts/signWithPrivateKey";
import { toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, nonce, setNonce }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState("");
 // const [recoveryBit, setRecoveryBit] = useState(0);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const tx = {
      sender: publicKey,
      amount: parseInt(sendAmount),
      recipient,
    }

    const hashMsg = hashMessage(JSON.stringify(tx));

    //console.log('hashMsg før signed: ',hashMsg);
    //console.log('typed signature før signed: ',signature);
    const signed = await signMessage(hashMsg, signature);

    const customJson = JSON.stringify(signed , (key, value) => {  
      return typeof value === 'bigint' ? value.toString() : value;  
  });  

    console.log('ute av signed: ', customJson);
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        tx,
        customJson,
        hashMsg: toHex(hashMsg),
        
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>


      <label>
        Hash
        <span>
          {
          hashMessage(JSON.stringify({
            recipient,
            amount: parseInt(sendAmount),
          //  nonce: parseInt(nonce),
          }))
          }
        </span>
      </label>
      <label>
        Your Public key
        <input
          placeholder="From what wallet would you like to send?"
          value={publicKey}
          onChange={setValue(setPublicKey)}
        ></input>
      </label>
      <label>
        Signature
        <input
          placeholder="sign here with private key"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
