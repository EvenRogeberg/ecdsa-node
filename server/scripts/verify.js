//import * as secp from 'ethereum-cryptography/secp256k1';
const secp = require("ethereum-cryptography/secp256k1");
const toHexString = require("ethereum-cryptography/utils");
//import { toHexString } from 'ethereum-cryptography/utils';

function verifySignature(signatureString, publicKey) {
  console.log('i verifySignature');
  // Extract the recovery bit, signature, and message from the signature string
  const recovery = parseInt(signatureString.slice(0, 2), 16) - 27;
  const signature = Buffer.from(signatureString.slice(2, 66), 'hex');
  const message = Buffer.from(signatureString.slice(66), 'hex');

  // Convert the public key to a buffer
  const publicKeyBuffer = Buffer.from(publicKey, 'hex');

  // Generate the hash of the message using the SHA-256 algorithm
  const messageHash = secp.keccak256(message);

  // Verify the digital signature using the secp256k1 library
  const isVerified = secp.verify(
    messageHash,
    signature,
    publicKeyBuffer,
    recovery
  );
    console.log('isVerified: ',isVerified)
  // Return whether the signature is verified or not
  return isVerified;
}

module.exports = verifySignature;