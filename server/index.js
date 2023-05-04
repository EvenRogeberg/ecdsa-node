const verify = require("./scripts/verify.js");
const secp = require("ethereum-cryptography/secp256k1");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0246835b408dbd490e93fce46a2d39a3ec6cf2fd1180bfede5c4a37a890c5f48dc": 100,
  "03566d03c4ce2e91fa7346a7aca402cc1163a3535281d78e923eae74a4fe9f3cd6": 50,
  "020776f51b5dd3c7bb2cb15981653d8a625721db97b6e5873e159007e7b1b24b64": 75,
};

// const keyPairs = [
//   {
//     privateKey: '40f5ccf7ac255fc7742a0d56743e6c41e8f3b2fa3781769b4070f6fc80cf8309',
//     publicKey: '0246835b408dbd490e93fce46a2d39a3ec6cf2fd1180bfede5c4a37a890c5f48dc'
//   },
//   {
//     privateKey: '1b6146e883f462d8d549ae5e332fa464f0497b10be3f473c17ea697ea396cca4',
//     publicKey: '03566d03c4ce2e91fa7346a7aca402cc1163a3535281d78e923eae74a4fe9f3cd6'
//   },
//   {
//     privateKey: '7dfd0e118ff2a8d334137b9b6bcc40e1f7fb0cc477987e5bff2615150c2f2af6',
//     publicKey: '020776f51b5dd3c7bb2cb15981653d8a625721db97b6e5873e159007e7b1b24b64'
//   }
// ];


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { tx, customJson, hashMsg } = req.body;
  console.log("customJson :", customJson );
  
  setInitialBalance(tx.sender);
  setInitialBalance(tx.recipient);
  console.log(' sender: ',tx.sender);
  console.log('receiver: ', tx.recipient);
  console.log('amount: ', tx.amount);

  const signature = JSON.parse(customJson, (key, value) => {
    if (key === 'r' || key === 's') {
      return BigInt(value);
    }
    return value;
  });

  console.log("signature",signature)

  let sign = new secp.secp256k1.Signature(signature.r, signature.s)
  sign = sign.addRecoveryBit(signature.recovery)
  const pubKey = sign.recoverPublicKey(hashMsg);
  console.log("pub", pubKey.toHex())
  //console.log("pubKey ", pubKey);

  //const isVerfied = secp.verify(signed, msgHash, pubKey);
  //console.log("isVerfied ",isVerfied);
  // if(customJson === undefined) {
  //   console.log('ingen signedMsg');
  //    res.status(400).send({ message: "invalid signature" });
  //  }
  // var senderIsSender = verify(customJson, tx.sender);
   //console.log(senderIsSender);
  //const publicKey = await recoverKey()

  // if (balances[sender] < amount) {
  //   res.status(400).send({ message: "Not enough funds!" });
  // } else {
  //   balances[sender] -= amount;
  //   balances[recipient] += amount;
  //   res.send({ balance: balances[sender] });
  //}
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
