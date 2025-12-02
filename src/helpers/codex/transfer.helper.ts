import algosdk from 'algosdk';
import { Chains } from '../../enums';
import { createBoxes, decode, encode, getAccountBalanceBoxName, getBase64EncodedData, getTradingKeyBoxName, makeSigningMessage } from "../codex.helper";
import { concatArrays } from '../Encoding';
import { equalIgnoreCase } from '../../common/utils';
import { AddressChain } from '../../interfaces/pair.interface';
import { IDtwData, IDtwDto, ISignedMessage, ITransferData } from "../../interfaces/wallet.interface";
import { generateHash, getAppArgs, getBoxKey, getBoxKeyFromHash, getDataBytesFromMsg, getMsgArgs } from './common.helper';
import { CCTP_UNIFIED_ASSETS } from '../../constants/cctp';

export const DTW_DATA_BYTES_LENGTH = 160;
export const TRANSFER_DATA_BYTES_LENGTH = 224;

export const getTransferBoxKey = (message: string, encoding: BufferEncoding) => {
  return getBoxKey(getTransferBytesFromMsg(message, encoding), "T_");
}

export const getTransferBoxKeyFromHash = (hash: string) => {
  return getBoxKeyFromHash(hash, 'T_');
}

export const calcTransferHash = (message: string) => {
  return generateHash(getTransferBytesFromMsg(message));
}

export const getTransferBytesFromMsg = (message: string, encoding: BufferEncoding = 'hex') => {
  return getDataBytesFromMsg(message, encoding, TRANSFER_DATA_BYTES_LENGTH);
}

export const decodeDtwMsg = (message: string, encoding: BufferEncoding = 'hex'): IDtwData => {
  const buffer = getDataBytesFromMsg(message, encoding, DTW_DATA_BYTES_LENGTH);
  const chainId = Number(decode(buffer.subarray(32, 40), '8B'));
  const recipientChainId = Number(decode(buffer.subarray(72, 80), '8B'));
  return {
    loginAddress: String(decode(buffer.subarray(0, 32), 'address', chainId)),
    loginChainId: chainId,
    recipient: String(decode(buffer.subarray(40, 72), 'address', recipientChainId)),
    recipientChainId,
    tkAddress: String(decode(buffer.subarray(80, 112), 'address', Chains.Algorand)),
    expiredDate: Number(decode(buffer.subarray(112, 120), '8B')),
  }
}

export const makeDtwMsg = (data: IDtwData): Uint8Array => {
  const {
    loginAddress,
    loginChainId,
    recipient,
    recipientChainId,
    tkAddress,
    expiredDate,
  } = data;
  const dataBytes = concatArrays([
    encode(loginAddress, 'address', loginChainId),
    encode(loginChainId, '8B'),
    encode(recipient, 'address', recipientChainId),
    encode(recipientChainId, '8B'),
    encode(tkAddress, 'address', Chains.Algorand),
    encode(expiredDate, '8B'),
  ]);
  const bs64OrderBytes = getBase64EncodedData(dataBytes);
  console.log(`Dtw data should be ${DTW_DATA_BYTES_LENGTH} bytes`, bs64OrderBytes.length, bs64OrderBytes);
  return bs64OrderBytes;

  // return makeSigningMessage(JSON.stringify(data), dataBytes);
}

export const decodeTransferMsg = (message: string, encoding: BufferEncoding = 'hex'): ITransferData => {
  const buffer = getDataBytesFromMsg(message, encoding, TRANSFER_DATA_BYTES_LENGTH);
  const chainId = Number(decode(buffer.subarray(32, 40), '8B'));
  const recipientChainId = Number(decode(buffer.subarray(72, 80), '8B'));
  const tokenChainId = Number(decode(buffer.subarray(112, 120), '8B'));
  return {
    loginAddress: String(decode(buffer.subarray(0, 32), 'address', chainId)),
    loginChainId: chainId,
    recipient: String(decode(buffer.subarray(40, 72), 'address', recipientChainId)),
    recipientChainId,
    tokenIndex: String(decode(buffer.subarray(80, 112), 'token', tokenChainId)),
    tokenChainId,
    tokenAmount: String(decode(buffer.subarray(120, 152), '32B')),
    expiredDate: Number(decode(buffer.subarray(152, 160), '8B')),
    random: Number(decode(buffer.subarray(160, 168), '8B')),
  }
}

export const makeTransferMsg = (data: ITransferData): Uint8Array => {
  const {
    loginAddress,
    loginChainId,
    recipient,
    recipientChainId,
    tokenAmount,
    tokenIndex,
    tokenChainId,
    expiredDate,
    random,
  } = data;
  const dataBytes = concatArrays([
    encode(loginAddress, 'address', loginChainId),
    encode(loginChainId, '8B'),
    encode(recipient, 'address', recipientChainId),
    encode(recipientChainId, '8B'),
    encode(tokenIndex, 'token', tokenChainId),
    encode(tokenChainId, '8B'),
    encode(tokenAmount, '32B'),
    encode(expiredDate, '8B'),
    encode(random, '8B'),
  ]);

  const bs64OrderBytes = getBase64EncodedData(dataBytes);
  console.log(`Transfer data should be ${TRANSFER_DATA_BYTES_LENGTH} bytes`, bs64OrderBytes.length, bs64OrderBytes);
  return bs64OrderBytes;

  // return makeSigningMessage(JSON.stringify(data), dataBytes);
}

export const makeTransferTxn = async (
  { data, message, signature }: ISignedMessage<ITransferData>,
  dtw: IDtwDto | null,
  options: {
    transferId: number,
    appId: number,
    sender: string,
    superAppId: number,
    superWallet: AddressChain,
    getTxnParams: (txnsCount?: number) => Promise<algosdk.SuggestedParams>
  }
) => {
  const {
    loginAddress, loginChainId,
    recipient, recipientChainId,
    tokenIndex, tokenChainId
  } = data;
  const { appId, sender, superWallet } = options;
  const methodArgs = dtw
    ? [
      ...getMsgArgs(message, signature, dtw.data.tkAddress, Chains.Algorand),
      ...getMsgArgs(dtw.message, dtw.signature, loginAddress, loginChainId),
    ] : [
      ...getMsgArgs(message, signature, loginAddress, loginChainId),
      Buffer.alloc(0), Buffer.alloc(0), Buffer.alloc(0),
    ];

  const appArgs = getAppArgs("directTransfer(byte[],byte[],byte[],byte[],byte[],byte[],uint64)uint64", [
    ...methodArgs,
    options.transferId,
  ]);

  const cctpIndex = '0x4343545055534443000000000000000000000000000000000000000000000000';
  const cctpChain = CCTP_UNIFIED_ASSETS[cctpIndex];

  const boxes = [
    getAccountBalanceBoxName(loginAddress, loginChainId, tokenIndex, tokenChainId),
    getAccountBalanceBoxName(recipient, recipientChainId, tokenIndex, tokenChainId),
    getAccountBalanceBoxName(superWallet.address, superWallet.chainId, tokenIndex, tokenChainId),
  ];

  if (!equalIgnoreCase(tokenIndex, cctpIndex)) {
    boxes.push(...[
      getAccountBalanceBoxName(loginAddress, loginChainId, cctpIndex, cctpChain),
      getAccountBalanceBoxName(superWallet.address, superWallet.chainId, cctpIndex, cctpChain),
    ]);
  }

  if (dtw) {
    boxes.push(getTradingKeyBoxName(loginAddress, loginChainId));
  }

  const allBoxes = [
    ...createBoxes(appId, boxes),
    ...createBoxes(appId, [
      getTransferBoxKey(message, 'hex'),
    ], (data) => data)
  ];
  const foreignApps = [options.superAppId];
  const txnsCount = dtw ? 9 : 6;

  const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: appId,
    from: sender,
    suggestedParams: await options.getTxnParams(txnsCount),
    appArgs,
    foreignApps,
    boxes: allBoxes,
  });
  // console.log('directTransfer txn', appCallTxn);

  return appCallTxn;
}
