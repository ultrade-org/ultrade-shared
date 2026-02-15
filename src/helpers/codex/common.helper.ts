import algosdk from 'algosdk';
import * as bs58 from 'bs58';
import * as algoHelper from "../algo.helper";
import * as ethHelper from "../eth.helper";
import { encode } from '../codex.helper';
import { decodeHexString, keccak256, recoverPublicKey } from '../eth.helper';
import { concatArrays, decodeBase64, encodeString } from '../Encoding';
import { Chains } from '../../enums';
import { AddressChain } from '../../interfaces/pair.interface';
import { TechnologyType } from '../../interfaces/wallet.interface';

export interface IMsgArgs {
  message: string,
  signature: string,
  signerAddress: string,
  signerChainId: number,
}

export const generateHash = (message: Uint8Array) => {
  return Buffer.from(keccak256(message)).toString("hex");
}

export const getBoxKey = (message: Uint8Array, prefix: string) => {
  const boxName = concatArrays([
    encode(prefix, 'str'),
    keccak256(message),
  ]);
  return boxName;
}

export const getBoxKeyFromHash = (hash: string, prefix: string) => {
  const boxName = concatArrays([
    encode(prefix, 'str'),
    Buffer.from(hash, 'hex'),
  ]);
  return boxName;
}

export const getAppArgs = (methodSignature: string, args: Array<Uint8Array | Buffer | number>): Uint8Array[] => {
  const m: algosdk.ABIMethod = algosdk.ABIMethod.fromSignature(methodSignature);
  const selector = m.getSelector();
  const txnArgsLog = {};
  const txnArgs = args.map((value: Uint8Array | Buffer | number, index: number) => {
    const v = (m.args[index].type as any).encode(value);
    txnArgsLog[`txnArgs${index}`] = Array.apply([], Array.from(v)).join(", ");
    return v;
  });
  // console.log('getAppArgs', methodSignature, JSON.stringify(txnArgsLog));
  // console.log('TOTAL TXN ARGS BYTES', txnArgs.reduce((prev, curr: Uint8Array | Buffer) => curr.length + prev, 0));
  return [ selector, ...txnArgs ];
}

export const getDataBytesFromMsg = (message: string, encoding: BufferEncoding, dataBytesLength: number) => {
  const bufferMsg = Buffer.from(message, encoding);
  const b64Buffer = bufferMsg.subarray(bufferMsg.length - dataBytesLength);
  const strBuffer = Buffer.from(b64Buffer).toString();
  const buffer = decodeBase64(strBuffer);
  return buffer;
}

export const getMsgArgs = (
  message: string,
  signature: string,
  signerAddress: string,
  signerChainId: number,
  encoding: BufferEncoding = 'hex'
): Array<Buffer | Uint8Array> => {
  const msgArgs = [
    getPrefixedMessage(message, encoding, signerChainId),
    decodeSignature(signature, signerChainId),
    getPublicKey(signerAddress, signerChainId, message, signature, encoding),
  ];
  // console.log('MSG ARGS', msgArgs)
  return msgArgs;
}

export const decodeSignature = (
  signature: string,
  chain: number
) => {
  if (chain === Chains.Algorand) {
    return decodeBase64(signature);
  }
  if (chain === Chains.Solana) {
    return bs58.decode(signature);
  }
  return decodeHexString(signature);
}

export const getPublicKey = (
  address: string,
  chain: number,
  message: string,
  signature: string,
  encoding?: BufferEncoding
): Uint8Array | Buffer => {
  if (chain === Chains.Algorand || chain === Chains.Solana) {
    return encodeAddress(address, chain);
  }
  return recoverPublicKey(getPrefixedMessage(message, encoding, chain), signature);
}

const getPrefixMessage = (
  message: Buffer,
  chain: number
): string => {
  if (chain === Chains.Algorand) {
    return 'MX';
  }
  if (chain === Chains.Solana) {
    return '';
  }
  return `\x19Ethereum Signed Message:\n${message.length}`;
}

export const getPrefixedMessage = (
  message: string,
  encoding: BufferEncoding | undefined,
  chain: number
): Buffer => {
  const messageBytes = Buffer.from(message, encoding);
  return Buffer.concat([ encodeString(getPrefixMessage(messageBytes, chain)), messageBytes ]);
}

export const getProviderChainId = (technology: TechnologyType): Chains => {
  switch (technology) {
    case "ALGORAND": return Chains.Algorand;
    case "SOLANA": return Chains.Solana;
    case "EVM": return Chains.Polygon;
    default: return Chains.Polygon;
  }
}

export const encodeAddress = (
  address: string,
  chain: number
): Uint8Array => {
  if (chain === Chains.Algorand) {
    return algoHelper.decodeAndNormalizeAddress(address);
  }
  if (chain === Chains.Solana) {
    return bs58.decode(address);
  }
  return ethHelper.decodeAndNormalizeAddress(address);
}

export const getChainId = (address: string) => {
  if (algosdk.isValidAddress(address)) return Chains.Algorand;
  if (address.startsWith('0x')) return Chains.Polygon;
  return Chains.Solana;
}

export const detectChainByAddress = (address: string) => {
  const cleanAddress = address.trim();
  
  if (cleanAddress.startsWith('0x') && cleanAddress.length === 42) {
    return Chains.Polygon;
  }
  
  if (cleanAddress.length === 58 && /^[A-Z2-7]+$/.test(cleanAddress)) {
    return Chains.Algorand;
  }
  
  if (cleanAddress.length >= 32 && cleanAddress.length <= 44 && 
      /^[1-9A-HJ-NP-Za-km-z]+$/.test(cleanAddress)) {
    return Chains.Solana;
  }
  
  return 0;
}
