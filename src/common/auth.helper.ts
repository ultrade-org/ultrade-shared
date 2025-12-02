import algosdk from 'algosdk';
import { encodeString } from "../helpers/Encoding";

export function encodeMessage(msg: string) {
  return encodeString(msg)
  const enc = new TextEncoder();
  return enc.encode(msg);
}

export function generateTxnForSign(addr: string, note?: string, encoding?: BufferEncoding): algosdk.Transaction {
  return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: addr,
    to: addr,
    amount: 0,
    note: note && new Uint8Array(Buffer.from(note, encoding)),
    suggestedParams: {
      fee: 0,
      firstRound: 1,
      lastRound: 2,
      genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      genesisID: 'testnet-v1.0',
    },
  });
}

export function signTxn(
  activeAddress: string,
  data: string,
  encoding: BufferEncoding,
  signTransactions: (
    transactions: Uint8Array[], 
    indexesToSign?: number[], 
    returnGroup?: boolean
  ) => Promise<Uint8Array[]>
): Promise<Uint8Array> {
  return signTransaction(generateTxnForSign(activeAddress, data, encoding), signTransactions);
}

async function signTransaction(
  rawTxn: algosdk.Transaction,
  signTransactions: (
    transactions: Uint8Array[], 
    indexesToSign?: number[], 
    returnGroup?: boolean
  ) => Promise<Uint8Array[]>
): Promise<Uint8Array> {
  const encodedTransaction = algosdk.encodeUnsignedTransaction(rawTxn);
  const signedTransactions = await signTransactions([encodedTransaction]);

  const decodedTxns = algosdk.decodeSignedTransaction(signedTransactions[0]);
  const signature = new Uint8Array(decodedTxns.sig as Buffer);
  return signature;
}
