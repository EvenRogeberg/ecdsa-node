import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex, hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils';
import { Buffer } from 'buffer';
import { keccak256 } from "ethereum-cryptography/keccak";

export async function signMessage(msg, privateKey) {

  //console.log(secp.secp256k1);
  let signature = await secp.secp256k1.sign(toHex(msg), hexToBytes(privateKey));
  //console.log('signature slutt', signature);
  return signature;
}
