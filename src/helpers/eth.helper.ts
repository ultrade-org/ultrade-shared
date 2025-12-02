import * as ethUtil from 'ethereumjs-util';
import { getPrefixedMessage, getProviderChainId } from './codex/common.helper';

export function decode32Bytes(value: Uint8Array): bigint {
  const bnValue: ethUtil.BN = ethUtil.fromSigned(Buffer.from(value));
  // console.log('bnValue', value, bnValue, bnValue.toString())
  return BigInt(bnValue.toString())
}

export function encodeBigNumber(value: number | bigint | string): Buffer {
  return ethUtil.toUnsigned(new ethUtil.BN(String(value)));
}

export function encode32Bytes(value: number | bigint | string): Uint8Array {
  const buffer = encodeBigNumber(value);
  if (buffer.length > 32) {
    throw new Error("Invalid value. The buffer length of the value is more than 32");
  }
  return new Uint8Array(ethUtil.setLengthLeft(buffer, 32));
}

export const encodeAddress = (address: Uint8Array): string => {
  if (address.length !== 32) {
    throw new Error("Invalid address bytes. The address buffer length is not equel 32");
  }

  const normalizedAddress = Buffer.from(address).toString('hex');

  if (normalizedAddress.slice(0, 24) !== '000000000000000000000000') {
    console.log('normalizedAddress', normalizedAddress);
    throw new Error("Invalid normalized address");
  }

  const hexAddress = '0x' + normalizedAddress.slice(-40);

  if (!isAddress(hexAddress)) {
    throw new Error("Invalid hex address");
  }

  return hexAddress;
}

export const decodeAndNormalizeAddress = (address: string): Uint8Array => {
  return new Uint8Array(ethUtil.setLengthLeft(decodeHexString(address), 32));
}

export const decodeHexString = (address: string): Buffer => {
  return Buffer.from(unpadHexPrefix(address), 'hex');
}

export const unpadHexPrefix = (value: string): string => {
  return value.startsWith('0x') ? value.slice(2) : value;
}

export const isAddress = (address: string): boolean => ethUtil.isValidAddress(address);

export const recoverPublicKey = (message: Buffer, signature: string): Buffer => {
  const messageHash = ethUtil.keccak256(message); // Ensure message is correctly formatted
  const { r, s, v } = ethUtil.fromRpcSig(signature);
  // Recover the public key
  return ethUtil.ecrecover(messageHash, v, r, s);
}

export const verifySignature = (signature: string, address: string, message: string, encoding?: BufferEncoding): boolean => {
  return verifyMessage(getPrefixedMessage(message, encoding, getProviderChainId('EVM')), signature, address);
}

export const verifyMessage = (message: Buffer, signature: string, address: string): boolean => {
  const pk = recoverPublicKey(message, signature);
  const ra = ethUtil.bufferToHex(ethUtil.publicToAddress(pk));
  return ra.toLowerCase() === address.toLowerCase();
}

export const keccak256 = (data: Uint8Array): Uint8Array => {
  return new Uint8Array(ethUtil.keccak256(Buffer.from(data)));
}