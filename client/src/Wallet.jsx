import server from "./server";



function Wallet({ address, setAddress, balance, setBalance, nonce, setNonce }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance, nonce },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      setNonce(nonce);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type in your wallet address" value={address} onChange={onChange}></input>
      </label>

      <div>
        Address: {address.slice(0, 10)}...
      </div>

      <label>
        Nonce
        <span>{nonce}</span>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
