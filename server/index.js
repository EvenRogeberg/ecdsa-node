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

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  //TODO: get a signature from the client-side application
  async function recoverKey(message, signature, recoveryBit) {
    var hash = hashMessage(message);
    var pk = secp.recoverPublicKey(hash, signature, recoveryBit);
    return pk;
}
  //recover the public address from the signature

  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
