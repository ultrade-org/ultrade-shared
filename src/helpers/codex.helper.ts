import algosdk from 'algosdk';
import * as bs58 from 'bs58';
import { divide } from '../common/big-number.helper';
import { listDateFormat } from '../common/utils';
import { getAppArgs, getDataBytesFromMsg, getMsgArgs, getOrderBoxKey, getOrderBytesFromMsg, encodeAddress, IMsgArgs, getOrderBoxKeyFromHash } from './codex';
import { makeDummyTxn, makeGroupTxnsWithDummy } from './codex/txn.helper';
import {
  concatArrays, encodeBase64, decodeString, encodeUint64, encodeString
} from './Encoding';
import { ICancelOrderMsgData, ICreateSpotOrderData, IOrderData, OrderSideShort, OrderTypeShort } from '../interfaces/order.interface';
import { AddressChain, PairToken, PairTokenInfo} from "../interfaces/pair.interface";
import { MatchArgs, ICollectionWallet, MatchShareWallet } from "../interfaces/trading.interface";
import { ITradingKeyData, ITradingKeyMessageData } from "../interfaces/tradingKey.interface";
import { Chains } from '../enums';
import { CollectionWalletData, DepositData, IWithdrawData } from "../interfaces/wallet.interface";
import { getAccountAssetBalances, getAppGlobalState, getBoxByName, getTxnParams, isAssetOptedIn } from './algo.helper';
import { decode32Bytes, encode32Bytes, keccak256, decodeHexString } from "./eth.helper";
import * as ethHelper from "./eth.helper";
import { mapOrderSideFromShortToLong, mapOrderTypeShortToLong } from "./order.helper";
import { CodexState, CompanyBox, OrderBox, PairBox, TokenBox } from '../types';
import { CCTP_UNIFIED_ASSETS, DEFAULT_ORDER_EXPIRATION_DAYS, ORDER_DATA_BYTES_LENGTH, SHARE_DATA_LENGTH } from '../constants';

export {
  encodeAddress
}

export const getAddressChainFromNormalized = (address: string, chain: number | string, type: 'address' | 'token' = 'address'): AddressChain => {
  const fromNormalized = type === 'token' ? getTokenFromNormalized : getAddressFromNormalized;
  return {
    address: fromNormalized(address, Number(chain)),
    chainId: Number(chain),
  };
}

export const getAddressFromNormalized = (address: string, chain: number): string => {
  const addressBuffer = Buffer.from(
    address.startsWith("0x")
      ? address.substring(2)
      : address
    , 'hex');

  if (chain === Chains.Algorand) {
    return algosdk.encodeAddress(addressBuffer);
  }

  if (chain === Chains.Solana) {
    return bs58.encode(addressBuffer);
  }

  return ethHelper.encodeAddress(addressBuffer);
};

export function getTokenFromNormalized(token: string, chainId: string | number) {
  if (Number(chainId) === Chains.Algorand) {
    return String(Number(token));
  }

  if (CCTP_UNIFIED_ASSETS["0x" + token]) {
    return "0x" + token;
  }
  return getAddressFromNormalized(token, Number(chainId));
}

export const encode = (
  value: string | number | bigint,
  type: '32B' | '8B' | '4B'  | '2B' | 'str' | 'address' | 'token' | 'bool' | 'float',
  chain?: number
): Uint8Array => {
  // console.log('encode', JSON.stringify({ value: typeof value === "bigint" ? `${value}n` : value, type, chain }));
  switch (type) {
    case '8B': return algosdk.encodeUint64(Number(value));
    case '32B': return encode32Bytes(value);
    case 'str': return encodeString(String(value));
    case 'address': return encodeAddress(String(value), chain);
    case 'token': return encodeToken(String(value), chain);
    case 'float': {
      var b = Buffer.alloc(8);
      b.writeDoubleBE(Number(value), 0);
      return new Uint8Array(b);
    }
    case 'bool': return new Uint8Array(Buffer.from(algosdk.encodeUint64(Number(value))).subarray(-1));
    case '2B': return new Uint8Array(Buffer.from(algosdk.encodeUint64(Number(value))).subarray(-2));
    case '4B': return new Uint8Array(Buffer.from(algosdk.encodeUint64(Number(value))).subarray(-4));
    default: return Buffer.from(value.toString())
  }
}

export const decode = (
  value: Uint8Array | Buffer,
  type: '32B' | '8B' | '2B'  | 'str' | 'address' | 'token' | 'bool' | 'float',
  chain?: number
): string | number | bigint => {
  switch (type) {
    case '8B': return algosdk.decodeUint64(value, 'safe');
    case '32B': return decode32Bytes(value);
    case 'str': return decodeString(value);
    case 'address': return decodeAddress(value, chain);
    case 'token': return decodeToken(value, chain);
    case 'float': return Buffer.from(value).readDoubleBE(0);
    case 'bool': case '2B': return decode(value, '8B');
    default: return Buffer.from(value).toString();
  }
}

export const extractAddress = (
  buffer: Uint8Array,
  startAt: number,
  chain: number,
): string => decodeAddress(buffer.subarray(startAt, startAt + 32), chain);

export const extractToken = (
  buffer: Uint8Array,
  startAt: number,
  chain: number,
): string => decodeToken(buffer.subarray(startAt, startAt + 32), chain);

export const extractDouble = (
  buffer: Uint8Array,
  startAt: number = 0,
): number => Number(decode(buffer.subarray(startAt, startAt + 8), 'float'));

export const extractStr = (
  buffer: Uint8Array,
  startAt: number,
  length: number,
): string => String(decode(buffer.subarray(startAt, startAt + length), 'str'));

export const extractUint16 = (
  buffer: Uint8Array,
  startAt: number = 0,
): number => Number(decode(buffer.subarray(startAt, startAt + 2), '8B'));

export const extractUint32 = (
  buffer: Uint8Array,
  startAt: number = 0,
): number => Number(decode(buffer.subarray(startAt, startAt + 4), '8B'));

export const extractUint64 = (
  buffer: Uint8Array,
  startAt: number = 0,
): number => Number(decode(buffer.subarray(startAt, startAt + 8), '8B'));

export const extractUint256 = (
  buffer: Uint8Array,
  startAt: number = 0,
): string => String(decode(buffer.subarray(startAt, startAt + 32), '32B'));

export const decodeAddress = (
  address: Uint8Array,
  chain: number,
): string => {
  if (chain === Chains.Algorand) {
    return algosdk.encodeAddress(address);
  }
  if (chain === Chains.Solana) {
    return bs58.encode(address)
  }
  return ethHelper.encodeAddress(address);
}

export const decodeToken = (
  token: Uint8Array,
  chain: number
): string => {
  let decodedAddress = Buffer.from(token).toString('hex');
  if (!decodedAddress.startsWith('0x')) {
    decodedAddress = "0x" + decodedAddress;
  }
  if (CCTP_UNIFIED_ASSETS[decodedAddress]) {
    return decodedAddress;
  }
  
  if (chain === Chains.Algorand) {
    return String(decode32Bytes(token));
  }
  if (chain === Chains.Solana) {
    return bs58.encode(token)
  }
  return decodeAddress(token, chain);
}

export const normalizeAddress = (
  address: string,
  chain: number,
  withPrefix: boolean = false,
): string => {

  let normalizedAddress = Buffer.from(encodeAddress(address, chain)).toString('hex');
  if (withPrefix && !normalizedAddress.startsWith('0x')) {
    return `0x${normalizedAddress}`;
  }

  return normalizedAddress;
}

export const checkIfAddressIsNormalized = (address: string): boolean => {
  if (address.startsWith('0x')) {
    return Buffer.from(address.substring(2), 'hex').length === 32;
  }
  return Buffer.from(address, 'hex').length === 32;
}

export const encodeToken = (
  token: string | number,
  chain: number
): Uint8Array => {
  if (chain === Chains.Algorand) {
    return encode32Bytes(+token);
  }
  if (CCTP_UNIFIED_ASSETS[token]) {
    return new Uint8Array(decodeHexString(String(token)));
  }
  return encodeAddress(String(token), chain);
}

export const getCodexStateValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
) => {
  const globalState = await getAppGlobalState(algoClient, appId);
  // console.log('codexState', appId, globalState);
  // if (globalState["MNA"]) {
  //   console.log('MNA', decodeAddress(Buffer.from(globalState["MNA"]), 8));
  // }
  // if (globalState["BKA"]) {
  //   console.log('BKA', decodeAddress(Buffer.from(globalState["BKA"]), 8));
  // }
  const msgProcId = globalState["MSG_PROCESSOR"];
  const superAppId = globalState["UL_SUPERADMIN_APP"];
  let superWallet = globalState["UL_SUPERADMIN_WALLET"];
  superWallet = superWallet?.length ? superWallet : undefined;
  const collectionWalletChainId = superWallet && Number(decode(superWallet.subarray(32, 40), '8B'));
  const parsedCodexState: CodexState = {
    collectionWallet: superWallet && decodeAddress(superWallet.subarray(0, 32), collectionWalletChainId),
    collectionWalletChainId,
    msgProcId,
    superAppId,
  };
  console.log('CodexState parsed', parsedCodexState);
  return parsedCodexState;
}

export const getCodexAccountInfo = async (
  algoClient: algosdk.Algodv2,
  appId: number,
) => {
  const appAddress = algosdk.getApplicationAddress(appId);
  console.log('appAddress', appAddress)
  const accountInfo = await algoClient.accountInformation(appAddress).do();
  console.log('CODEX AccountInfo', accountInfo);
}

export const getAccountBalanceBoxNameHash = (
  account: AddressChain,
  token: AddressChain,
): string => {
  const boxName = getAccountBalanceBoxName(account.address, account.chainId, token.address, token.chainId);
  const hash = Buffer.from(keccak256(boxName)).toString('hex');
  return hash;
}

export const getAccountBalanceBoxName = (
  loginAddress: string,
  loginChainId: number,
  tokenAddress: string | number,
  tokenChainId: number
) => {
  const addressBytes = encodeAddress(loginAddress, loginChainId);
  const chainIdBytes = algosdk.encodeUint64(loginChainId);
  const tokenChainIdBytes = algosdk.encodeUint64(tokenChainId);
  const tokenBytes = encodeToken(tokenAddress, tokenChainId);

  const boxName = concatArrays([addressBytes, chainIdBytes, tokenBytes, tokenChainIdBytes]);
  return boxName;
}

export const getCCTPBalanceBoxName = (
  tokenAddress: string,
  tokenChainId: number
) => {
  const boxBytes = concatArrays([ encodeToken(tokenAddress, tokenChainId), algosdk.encodeUint64(tokenChainId)]);
  return keccak256(boxBytes);
}

export const getCCTPBalanceBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  tokenAddress: string,
  tokenChainId: number
) => {
  const boxName = getCCTPBalanceBoxName(tokenAddress, tokenChainId);
  const boxValue = await getAccountBox(algoClient, appId, boxName);
  console.log('Box CCTP balance', tokenAddress.substring(0, 18), tokenChainId, boxValue);
  return boxValue;
}

export const getCCTPBalancesBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  tokenAddress: string,
  tokenChainIds: number[] = [1, 6, 10002, 10003, 10004, 10005],
  // formatBalance: (b: bigint) => string = (b: bigint) => String(b)
) => {
  const balances = await Promise.all(
    tokenChainIds.map(id => 
      getAccountBox(algoClient, appId, getCCTPBalanceBoxName(tokenAddress, id))
    )
  )
  const formatBalance = (b: bigint, decimal = 6) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: decimal,
    }).format(+divide(b, 10**decimal));
  }
  const result = {}
  for (let i = 0; i < tokenChainIds.length; i++) {
    const element = tokenChainIds[i];
    result[element] = formatBalance(balances[i]);
  }
  console.log('Box CCTP balance', result);
  return result;
}

export const getRebalanceBoxName = (
  dbEntryId: number,
) => {
  const boxBytes = concatArrays([ encode('Rebalance_', 'str'), algosdk.encodeUint64(dbEntryId) ]);
  return boxBytes;
}

export const getTmcBoxName = (
  tmcChainId: number,
) => {
  const boxBytes = concatArrays([ encode('TokenManager', 'str'), algosdk.encodeUint64(tmcChainId) ]);
  return keccak256(boxBytes);
}

export const getTmcBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  tmcChainId: number,
) => {
  const boxName = getTmcBoxName(tmcChainId);
  const box = await getBoxByName(algoClient, appId, boxName);
  if (!box) return;
  const boxValue = decodeAddress(box, tmcChainId);
  console.log('Box TokenManager of chain', tmcChainId, boxValue);
  return boxValue;
}

export const getTradingKeyBoxName = (
  loginAddress: string,
  loginChainId: number,
) => {
  const addressBytes = encodeAddress(loginAddress, loginChainId);
  const prefixBytes = encodeString("TK_");
  const boxName = concatArrays([prefixBytes, addressBytes]);
  return boxName;
}

export const getTradingKeyBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  loginAddress: string,
  loginChainId: number,
) => {
  const boxName = keccak256(getTradingKeyBoxName(loginAddress, loginChainId));
  const box = await getBoxByName(algoClient, appId, boxName);
  if (!box) return;
  const boxValues: string[] = [];
  for (let index = 0; index + 32 <= box.length; index += 32) {
    const boxValue = decodeAddress(box.subarray(index, index + 32), Chains.Algorand);
    boxValues.push(boxValue);
  }
  console.log('Box account trading keys', loginAddress.substring(0, 8), boxValues, Buffer.from(boxName).toString('hex'));
  return boxValues;
}

export const getAssetBalancesByAppIndex = async (
  algoClient: algosdk.Algodv2,
  appIndex: number
) => {
  const appAddress = algosdk.getApplicationAddress(appIndex);
  return await getAssetBalancesByAppAddress(algoClient, appAddress);
}

export const getAssetBalancesByAppAddress = async (
  algoClient: algosdk.Algodv2,
  appAddress: string
) => {
  const appInfo = await algoClient.accountInformation(appAddress).do();
  const balances = getAccountAssetBalances(appInfo);
  return balances;
}

export const getBoxes = async (
  algoClient: algosdk.Algodv2,
  appId: number,
) => {
  const { boxes } = await algoClient.getApplicationBoxes(appId).do();
  console.log(`boxes of ${appId}`, boxes.map(b => b.name));
}

export const getAccountBalanceBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  login: AddressChain,
  token: AddressChain,
) => {
  return getAccountBoxValue(algoClient, appId, login.address, login.chainId, token.address, token.chainId);
}

export const getAccountBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  loginAddress: string,
  loginChainId: number,
  tokenAddress: string | number,
  tokenChainId: number
) => {
  // console.log('getAccountBoxValue', { loginAddress, loginChainId, tokenAddress, tokenChainId });
  const boxName = keccak256(getAccountBalanceBoxName(loginAddress, loginChainId, tokenAddress, tokenChainId));
  const boxValue = await getAccountBox(algoClient, appId, boxName);
  console.log('Box account value', loginAddress.substring(0, 8), tokenAddress, boxValue, Buffer.from(boxName).toString('hex'));
  return String(boxValue);
}

export const getAccountBoxByHash = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  hash: string
) => {
  const boxName = Buffer.from(hash, 'hex');
  const box = await getBoxByName(algoClient, appId, boxName);
  let boxValue: bigint = 0n;
  if (box) boxValue = decode32Bytes(box);
  console.log('Box account value', JSON.stringify({
    hash: hash.substring(0, 8),
    boxValue: String(boxValue),
    box: `[${box?.toString()}]`
  }));
  return boxValue;
}

const getAccountBox = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  boxName: Uint8Array
) => {
  const box = await getBoxByName(algoClient, appId, boxName);
  let boxValue: bigint = 0n;
  if (box) boxValue = decode32Bytes(box);
  return boxValue;
}

export const getCompanyBoxName = (companyId: number): Uint8Array => encode(companyId, '8B');

export const getCompanyBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  companyId: number,
) => {
  const boxName = getCompanyBoxName(companyId);
  const box = await getBoxByName(algoClient, appId, boxName);
  if (!box) return;
  const collectionWalletChainId = Number(decode(box.subarray(32, 40), '8B'));
  const boxValue: CompanyBox = {
    collectionWallet: decodeAddress(box.subarray(0, 32), collectionWalletChainId),
    collectionWalletChainId,
    takerFee: Number(decode(box.subarray(40, 48), '8B')),
    makerFee: box.length > 48 ? Number(decode(box.subarray(48, 56), '8B')) : 0,
  };
  console.log(`Box company #${companyId} value`, boxValue);
  return boxValue;
}

export const getPairBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  baseToken: PairToken,
  priceToken: PairToken
) => {
  const boxKey = keccak256(getPairBoxKey(baseToken, priceToken));
  const box = await getBoxByName(algoClient, appId, boxKey);
  if (!box) return;
  const boxValue: PairBox = {
    minSize: decode32Bytes(box.subarray(0, 32)),
    minPriceIncrement: decode32Bytes(box.subarray(32, 64)),
    minSizeIncrement: decode32Bytes(box.subarray(64, 96)),
  };
  console.log('Box pair value', box, boxValue);
  return boxValue;
}

export const getOrderBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  o: { boxName?: Uint8Array, hash?: string, message?: string },
  log: boolean = true,
) => {
  const boxName = o.boxName
    || (o.hash && getOrderBoxKeyFromHash(o.hash))
    || getOrderBoxKey(o.message, 'hex');
  const box = await getBoxByName(algoClient, appId, boxName);
  if (!box) return;
  const boxValue: OrderBox = {
    hash: Buffer.from(boxName).toString('hex'),
    amount: decode32Bytes(box.subarray(0, 32)),
    price: decode32Bytes(box.subarray(32, 64)),
    expiredTime: decode32Bytes(box.subarray(64, 72)),
    expiredDate: new Date(Number(decode32Bytes(box.subarray(64, 72))) * 1000)
  };
  log && console.log('Box order value', JSON.stringify({
    expiredDate: boxValue.expiredDate,
    expiredTime: String(boxValue.expiredTime),
    hash: boxValue.hash,
    price: String(boxValue.price),
    amount: String(boxValue.amount),
  }));
  return boxValue;
}

export const getTokenBoxValue = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  token: PairToken,
) => {
  const boxName = keccak256(getTokenBoxKey(token))
  const box = await getBoxByName(algoClient, appId, boxName);
  if (!box) return;
  const boxValue: TokenBox = {
    decimal: Number(decode(box.subarray(2, 10), '8B')),
    name: String(decode(box.subarray(12, box.length), 'str')),
  };
  console.log('Box token value', box, boxValue);
  return boxValue;
}

export const makeAssetOptInTxn = (
  appId: number,
  superId: number,
  sender: string,
  params: algosdk.SuggestedParams,
  balances: Record<string, number>,
  token: PairToken,
): algosdk.Transaction | undefined => {
  if (token.chainId !== Chains.Algorand) {
    return;
  }

  const tokenIndex = Number(token.address);
  if (tokenIndex === 0 || isAssetOptedIn(balances, tokenIndex)) {
    return;
  }

  console.log('Make optin to codex for', tokenIndex);
  const m = algosdk.ABIMethod.fromSignature("asset_opt_in(asset)void");
  const selector = m.getSelector();
  const sp = {
    ...params,
    fee: algosdk.ALGORAND_MIN_TX_FEE * 2,
    flatFee: true
  } as algosdk.SuggestedParams;

  return algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: appId,
    from: sender,
    suggestedParams: sp,
    appArgs: [selector, encodeUint64(tokenIndex)],
    foreignApps: [superId],
    foreignAssets: [tokenIndex],
  })
}

export const makeDepositTxns = async (
  appId: number,
  algoClient: algosdk.Algodv2,
  sender: string,
  loginAddress: string,
  loginChainId: number,
  tokenAmount: number,
  tokenIndex: number,
  tokenChainId: number,
) => {
  console.log('makeDeposit args', {
    sender,
    loginAddress,
    loginChainId,
    tokenAmount,
    tokenIndex,
    appId
  });
  const txns = [];
  const params = await getTxnParams(algoClient, 1);
  const codexAddress = algosdk.getApplicationAddress(appId);

  const xfer = {
    suggestedParams: params,
    from: sender,
    to: codexAddress,
    amount: tokenAmount,
  };

  txns.push(
    tokenIndex === 0
      ? algosdk.makePaymentTxnWithSuggestedParamsFromObject(xfer)
      : algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        ...xfer,
        assetIndex: tokenIndex,
      })
  )

  const m = algosdk.ABIMethod.fromSignature("depositToCodex(byte[])uint64");
  const selector = m.getSelector();
  const messageBytes = makeDepositMsg({ loginAddress, loginChainId });
  const msgArg = (m.args[0].type as algosdk.ABIByteType).encode(messageBytes);
  const boxName = keccak256(
    getAccountBalanceBoxName(loginAddress, loginChainId, tokenIndex, tokenChainId)
  );

  txns.push(
    algosdk.makeApplicationNoOpTxnFromObject({
      appIndex: appId,
      from: sender,
      suggestedParams: params,
      appArgs: [selector, msgArg],
      boxes: [{
        appIndex: appId,
        name: boxName
      }]
    })
  )

  return txns;
}

const makeAddressChainMsg = (loginAddress: string, loginChainId: number) => {
  const addressBytes = encodeAddress(loginAddress, loginChainId);
  const chainIdBytes = algosdk.encodeUint64(loginChainId);
  const messageBytes = concatArrays([ addressBytes, chainIdBytes ]);
  console.log('messageBytes', messageBytes, JSON.stringify(messageBytes), encodeBase64(messageBytes));

  return messageBytes;
}

export const makeDepositMsg = ({
  loginAddress,
  loginChainId,
}: DepositData) => {
  return makeAddressChainMsg(loginAddress, loginChainId);
}

const makeSuperCollectionWalletMsg = ({
  loginAddress,
  loginChainId,
}: {
  loginAddress: string,
  loginChainId: number,
}) => {
  return makeAddressChainMsg(loginAddress, loginChainId);
}

export const makeCreateOrderMsg = (data: ICreateSpotOrderData): Uint8Array => {
  try {
    const orderBytes = Buffer.concat([
      Buffer.from(encode(data.version, '2B')),
      Buffer.from(encode(data.expiredTime, '4B')),
      Buffer.from(encode(data.orderSide, 'str')),
      Buffer.from(encode(data.price, '32B')),
      Buffer.from(encode(data.amount, '32B')),
      Buffer.from(encode(data.orderType, 'str')),
      Buffer.from(encode(data.address, 'address', data.chainId)),
      Buffer.from(encode(data.chainId, '2B')),
      Buffer.from(encode(data.baseTokenAddress, 'token', data.baseTokenChainId)),
      Buffer.from(encode(data.baseTokenChainId, '4B')),
      Buffer.from(encode(data.priceTokenAddress, 'token', data.priceTokenChainId)),
      Buffer.from(encode(data.priceTokenChainId, '4B')),
      Buffer.from(encode(data.companyId, '2B')),
      Buffer.from(encode(data.random, '8B')),
      Buffer.from(encode(data.decimalPrice, 'float')),
      Buffer.alloc(50), // extra 50 zero bytes
    ]);
    const bs64OrderBytes = new Uint8Array(Buffer.from(encodeBase64(orderBytes)));
    const messageBytes = new Uint8Array([
      ...getOrderDataJsonBytes(data),
      ...bs64OrderBytes,
    ]);
    console.log(`Order data should be ${ORDER_DATA_BYTES_LENGTH} bytes`, bs64OrderBytes.length, bs64OrderBytes);
  
    return messageBytes;
  } catch (error) {
    console.error(error)
  }
}

const getOrderDataJsonBytes = (data: ICreateSpotOrderData): Uint8Array => {
  const {
    amount, price,
    baseTokenAddress, baseChain, baseCurrency, baseDecimal,
    priceTokenAddress, priceChain, priceCurrency, priceDecimal,
  } = data;
  const baseTokenName = baseCurrency?.toUpperCase();
  const priceTokenName = priceCurrency?.toUpperCase();
  const orderAmount = divide(amount, 10 ** baseDecimal);
  const orderPrice = divide(price, 10 ** priceDecimal);
  const orderSide = mapOrderSideFromShortToLong(data.orderSide);
  const orderType = mapOrderTypeShortToLong(data.orderType);
  const getToken = (token: string, chain: string) => `${token}` + (chain && ` (${chain})`);
  const priceOrTotal = data.orderType === 'M'
    ? `ESTIMATED TOTAL ${orderPrice} ${priceTokenName}`
    : `LIMIT PRICE ${orderPrice} ${priceTokenName} per ${baseTokenName}`;
  const rows = [
    `NEW ${orderType.toUpperCase()} ORDER ${getToken(baseTokenName, baseChain)} / ${getToken(priceTokenName, priceChain)}:`,
    `${orderSide} ${orderAmount} ${baseTokenName}, ${priceOrTotal}`,
    `${baseTokenName} ID: ${baseTokenAddress}`,
    `${priceTokenName} ID: ${priceTokenAddress}`,
    `Exp: ${DEFAULT_ORDER_EXPIRATION_DAYS} Days`,
  ];
  const jsonOrder = rows.join('\n') + '\n';

  return new Uint8Array(Buffer.from(jsonOrder, 'utf-8'));
}

export const getCancelOrderDataJsonBytes = (data: ICancelOrderMsgData): Uint8Array => {
  const {
    orderId, amount, price,
    baseTokenAddress, baseChain, baseCurrency, baseDecimal,
    priceTokenAddress, priceChain, priceCurrency, priceDecimal,
  } = data;

  const baseTokenName = baseCurrency?.toUpperCase();
  const priceTokenName = priceCurrency?.toUpperCase();
  const getToken = (token: string, chain: string) => `${token}` + (chain && ` (${chain})`);
  const orderAmount = divide(amount, 10 ** baseDecimal);
  const orderPrice = divide(price, 10 ** priceDecimal);
  const orderSide = mapOrderSideFromShortToLong(data.orderSide);
  const orderType = mapOrderTypeShortToLong(data.orderType);
  const priceOrTotal = data.orderType === 'M'
    ? `ESTIMATED TOTAL ${orderPrice} ${priceTokenName}`
    : `LIMIT PRICE ${orderPrice} ${priceTokenName} per ${baseTokenName}`;

  const rows = [
    `CANCEL ${orderType.toUpperCase()} ORDER ${getToken(baseTokenName, baseChain)} / ${getToken(priceTokenName, priceChain)}:`,
    `${orderSide} ${orderAmount} ${baseTokenName}, ${priceOrTotal}`,
    `Order ID: ${orderId}`,
    `${baseTokenName} ID: ${baseTokenAddress}`,
    `${priceTokenName} ID: ${priceTokenAddress}`,
  ];
  const jsonOrder = rows.join('\n') + '\n';

  return new Uint8Array(Buffer.from(jsonOrder, 'utf-8'));
}

export const decodeCreateOrderMsg = (message: string, encoding: BufferEncoding = 'hex'): IOrderData => {
  const buffer = getOrderBytesFromMsg(message, encoding);
  const chainId = extractUint16(buffer, 104);
  const baseTokenChainId = extractUint32(buffer, 138);
  const priceTokenChainId = extractUint32(buffer, 174);
  const orderData: IOrderData = {
    version: extractUint16(buffer),
    expiredTime: extractUint32(buffer, 2),
    orderSide: extractStr(buffer, 6, 1) as OrderSideShort,
    price: extractUint256(buffer, 7),
    amount: extractUint256(buffer, 39),
    orderType: extractStr(buffer, 71, 1) as OrderTypeShort,
    address: extractAddress(buffer, 72, chainId),
    chainId,
    baseTokenAddress: extractToken(buffer, 106, baseTokenChainId),
    baseTokenChainId,
    priceTokenAddress: extractToken(buffer, 142, priceTokenChainId),
    priceTokenChainId,
    companyId: extractUint16(buffer, 178),
    random: extractUint64(buffer, 180),
    decimalPrice: extractDouble(buffer, 188),
  };
  return {
    ...orderData,
    expiredDate: String(orderData.expiredTime).length > 10
      ? new Date(orderData.expiredTime) // TODO: fix pysdk to send time in sec
      : new Date(orderData.expiredTime * 1000)
  }
}

const getMatchOrderArgs = (order: {
  id: number,
  address: string,
  chain: number,
  message: string,
  signature: string,
  tradingKey?: string,
  encoding: BufferEncoding
}): Array<Uint8Array | number> => {
  const { id, address, chain, message, encoding, signature, tradingKey } = order;
  // console.log('getMatchOrderArgs', JSON.stringify(order));
  const signAddress = tradingKey || address;
  const signChain = tradingKey ? Chains.Algorand : chain;
  return [
    ...getMsgArgs(message, signature, signAddress, signChain, encoding),
    id,
  ];
}

export const getPairBoxKey = (baseToken: PairToken, priceToken: PairToken) => {
  const boxName = concatArrays([
    getTokenBoxKey(baseToken),
    getTokenBoxKey(priceToken),
  ]);
  return boxName;
}

export const getTokenBoxKey = ({ address, chainId }: PairToken) => {
  const boxNameKey = concatArrays([
    encode(address, 'token', chainId),
    encode(chainId, '8B'),
  ]);
  return boxNameKey;
}

export const createBoxes = (appIndex: number, boxNames: Uint8Array[], encode: (data: Uint8Array) => Uint8Array = keccak256) => {
  const boxes = boxNames.map((boxName) => ({
    appIndex,
    name: encode(boxName)
  }));
  // console.log('createBoxes', boxes.map(b => Buffer.from(b.name).toString('hex')))
  // console.log(`createBoxesBytes`, boxes.map(b => Array.apply([], Array.from(b.name)).join(", ")));
  return boxes;
}

const getShareWalletBytes = (shareData?: MatchShareWallet) => {
  if (!shareData) {
    return Buffer.alloc(SHARE_DATA_LENGTH);
  }

  return concatArrays([
    encode(shareData.address, 'address', shareData.chainId),
    encode(shareData.chainId, '2B'),
    encode(shareData.feeShare, '2B'),
  ]);
}

const getShareWalletBoxKey = (shareData: MatchShareWallet, token: PairToken) => {
  let boxKey: undefined | Uint8Array;
  if (shareData?.address && shareData?.chainId) {
    boxKey = getAccountBalanceBoxName(shareData.address, shareData.chainId, token.address, token.chainId);
  }
  return boxKey;
}

const getCollectionWalletBoxKey = (company: ICollectionWallet, token: PairToken) => {
  let boxKey: undefined | Uint8Array;
  if (company.collectionWallet && company.collectionWalletChainId) {
    boxKey = getAccountBalanceBoxName(company.collectionWallet, company.collectionWalletChainId, token.address, token.chainId);
  }
  return boxKey;
}

export const makeMatchTxns = (
  appId: number,
  args: MatchArgs,
  params: algosdk.SuggestedParams,
  sender: string,
  encoding: BufferEncoding = 'hex'
): algosdk.Transaction[] => {
  const { id, amount, buy, sell, baseAsset, priceAsset, superCompany, superAppId, fee } = args;
  const { b_share, s_share, tfee_tier, mfee_tier, mmfee_tier, mm_tfee, p_mfee, p_tfee, bdMaker, bdTaker, afMaker, afTaker } = fee;

  if (!superCompany) {
    throw new Error('Collection wallet for super user was not provided');
  }

  const feeData = concatArrays([
    encode(b_share, '2B'),
    encode(s_share, '2B'),
    encode(mfee_tier, 'str'),
    encode(tfee_tier, 'str'),
    encode(mmfee_tier, 'str'),
    encode(mm_tfee, '2B'),
    encode(p_tfee, '2B'),
    encode(p_mfee, '2B'),
  ]);

  const shareData = concatArrays([
    getShareWalletBytes(bdMaker),
    getShareWalletBytes(afMaker),
    getShareWalletBytes(bdTaker),
    getShareWalletBytes(afTaker),
  ]);

  const msgArgs = [
    ...getMatchOrderArgs({ ...buy, encoding }),
    ...getMatchOrderArgs({ ...sell, encoding }),
    encode(amount, '32B'),
    feeData,
    encode(id, '8B'),
    shareData,
  ];
  const appArgs = getAppArgs("match(byte[],byte[],byte[],uint64,byte[],byte[],byte[],uint64,byte[],byte[],byte[],byte[])uint64", msgArgs);
  
  const pairBoxKey = getPairBoxKey(baseAsset, priceAsset);
  const buyOrderBoxKey = getOrderBoxKey(buy.message, encoding);
  const sellOrderBoxKey = getOrderBoxKey(sell.message, encoding);
  const baseTokenBoxKey = getTokenBoxKey(baseAsset);
  const priceTokenBoxKey = getTokenBoxKey(priceAsset);
  const buyBaseAssetBoxKey = getAccountBalanceBoxName(buy.address, buy.chain, baseAsset.address, baseAsset.chainId);
  const buyPriceAssetBoxKey = getAccountBalanceBoxName(buy.address, buy.chain, priceAsset.address, priceAsset.chainId);
  const sellBaseAssetBoxKey = getAccountBalanceBoxName(sell.address, sell.chain, baseAsset.address, baseAsset.chainId);
  const sellPriceAssetBoxKey = getAccountBalanceBoxName(sell.address, sell.chain, priceAsset.address, priceAsset.chainId);
  const buyOrderCompanyBoxKey = getCompanyBoxName(buy.companyId);
  const sellOrderCompanyBoxKey = getCompanyBoxName(sell.companyId);

  const filteredBoxes = [
    ...new Set(
      [
        pairBoxKey,
        baseTokenBoxKey,
        priceTokenBoxKey,
        buyBaseAssetBoxKey,
        buyPriceAssetBoxKey,
        getTradingKeyBoxName(buy.address, buy.chain),
        getTradingKeyBoxName(sell.address, sell.chain),
        sellBaseAssetBoxKey,
        sellPriceAssetBoxKey,
        getCollectionWalletBoxKey(superCompany, baseAsset),
        getCollectionWalletBoxKey(superCompany, priceAsset),
        getCollectionWalletBoxKey(buy, baseAsset),
        getCollectionWalletBoxKey(sell, priceAsset),
        getShareWalletBoxKey(bdMaker, baseAsset),
        getShareWalletBoxKey(bdMaker, priceAsset),
        getShareWalletBoxKey(bdTaker, baseAsset),
        getShareWalletBoxKey(bdTaker, priceAsset),
        getShareWalletBoxKey(afMaker, baseAsset),
        getShareWalletBoxKey(afMaker, priceAsset),
        getShareWalletBoxKey(afTaker, baseAsset),
        getShareWalletBoxKey(afTaker, priceAsset),
      ]
      .filter(Boolean) // filter possible undefined args
      .map(o => Buffer.from(o).toString('hex'))
    )
  ].map(o => Buffer.from(o, 'hex'));

  const allBoxes = [
    ...createBoxes(appId, filteredBoxes),
    ...createBoxes(appId, [
      buyOrderBoxKey,
      sellOrderBoxKey,
      buyOrderCompanyBoxKey,
      sellOrderCompanyBoxKey
    ], (data) => data)
  ];
  const allBoxesUnique = [...new Set(allBoxes.map(o => Buffer.from(o.name).toString('hex')))];
  console.log(`[TradeID: ${id}] All boxes`, JSON.stringify(allBoxesUnique));
  // allBoxes = allBoxesUnique.map(o => Buffer.from(o.name))

  const foreignApps = [superAppId];

  const MAX_REFS = 8;
  const mainTxnBoxes = allBoxes.slice(0, MAX_REFS - foreignApps.length);
  const restBoxes = allBoxes.slice(MAX_REFS - foreignApps.length);

  const matchTxn = algosdk.makeApplicationNoOpTxnFromObject({
    from: sender,
    suggestedParams: params,
    appIndex: appId,
    appArgs,
    boxes: mainTxnBoxes,
    foreignApps,
    note: algosdk.encodeUint64(id)
  });

  const dummyParams = { ...params, fee: 0, flatFee: true } as algosdk.SuggestedParams;
  const txns = [matchTxn];
  let dummyTxnIndex = 1;

  while (restBoxes.length > 0) {
    const extBoxes = restBoxes.splice(0, MAX_REFS);
    txns.push(
      makeDummyTxn(appId, sender, dummyParams, extBoxes, `${id}_${dummyTxnIndex++}`)
    );
  }

  return txns;
}

export const makeLoginMsg = (
  data: {
    address: string;
    chainId?: number;
    technology: string;
  },
  signingMessage?: string
): Uint8Array => {
  // const dataBytes = concatArrays([
  //   encode(data.address, 'address', data.chainId),
  //   encode(data.chainId, '8B'),
  //   encode(data.provider, 'str'),
  // ]);
  // return makeSigningMessage(data.signingMessage, dataBytes);
  const { address, technology } = data;
  return getUtf8EncodedData(signingMessage || JSON.stringify({ address, technology }));
}

export const makeTradingKeyMsg = ({
  tkAddress,
  loginAddress,
  loginChainId,
  expiredDate,
  type
}: ITradingKeyData, addKey: boolean = true): Uint8Array => {
  const titleText = `${addKey ? 'Add' : 'Revoke'} ${type} key: ${tkAddress}`;
  const expirationText = expiredDate ? `Expires On: ${listDateFormat(expiredDate)}` : `No Expiration`;
  const prettyData = titleText + (addKey ? '\n' + expirationText : '');
  const dataBytes = concatArrays([
    encode(tkAddress, 'address', Chains.Algorand),
    encode(loginAddress, 'address', loginChainId),
    encode(loginChainId, '8B'),
    encode(expiredDate || 0, '8B'),
  ]);
  return makeSigningMessage(prettyData, dataBytes);
}

const TK_DATA_BYTES_LENGTH = 108;

export const decodeTradingKeyMsg = (message: string, encoding: BufferEncoding = 'hex') => {
  const buffer = getDataBytesFromMsg(message, encoding, TK_DATA_BYTES_LENGTH);
  const chainId = extractUint64(buffer, 64);
  const tkData = {
    tkAddress: extractAddress(buffer, 0, Chains.Algorand),
    address: extractAddress(buffer, 32, chainId),
    chainId,
    expiredTime: extractUint64(buffer, 72),
  };
  return {
    ...tkData,
    expiredDate: new Date(tkData.expiredTime)
  }
}

export const makeAddTradingKeyTxn = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  superId: number,
  sender: string,
  {
    loginAddress,
    loginChainId,
  }: ITradingKeyMessageData,
  message: string,
  // encoding: BufferEncoding | undefined,
  signature: string
): Promise<algosdk.Transaction> => {
  const msgArgs = getMsgArgs(message, signature, loginAddress, loginChainId);
  const appArgs = getAppArgs("manageTradingKey(byte[],byte[],byte[],byte[])uint64", [
    encode('add', 'str'),
    ...msgArgs,
  ]);
  const tkBoxKey = getTradingKeyBoxName(loginAddress, loginChainId);

  const params = await getTxnParams(algoClient, 5);
  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    from: sender,
    suggestedParams: params,
    appIndex: appId,
    appArgs,
    boxes: createBoxes(appId, [
      tkBoxKey,
    ]),
    foreignApps: [superId],
  });

  return txn;
}

export const makeRevokeTradingKeyTxn = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  superId: number,
  sender: string,
  {
    loginAddress,
    loginChainId,
  }: ITradingKeyMessageData,
  message: string,
  // encoding: BufferEncoding | undefined,
  signature: string
): Promise<algosdk.Transaction> => {
  const msgArgs = getMsgArgs(message, signature, loginAddress, loginChainId);
  const appArgs = getAppArgs("manageTradingKey(byte[],byte[],byte[],byte[])uint64", [
    encode('delete', 'str'),
    ...msgArgs,
  ]);
  const boxName = getTradingKeyBoxName(loginAddress, loginChainId);

  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    from: sender,
    suggestedParams: await getTxnParams(algoClient, 5),
    appIndex: appId,
    appArgs,
    boxes: createBoxes(appId, [ boxName ]),
    foreignApps: [superId],
  });

  return txn;
}

export const makeSetCollectionWalletMsg = (data: CollectionWalletData): Uint8Array => {
  const {
    loginAddress,
    loginChainId,
    companyId,
  } = data;
  const companyIdBytes = algosdk.encodeUint64(companyId);
  const senderBytes = encodeAddress(loginAddress, loginChainId);
  const chainIdBytes = algosdk.encodeUint64(loginChainId);
  const dataBytes = concatArrays([ senderBytes, chainIdBytes, companyIdBytes ]);

  const messageBytes = new Uint8Array([
    // ...getUtf8EncodedData(JSON.stringify(data)),
    ...getBase64EncodedData(dataBytes),
  ]);
  console.log('MESSAGE LENGTH: ', messageBytes);
  return messageBytes;
}

export const makeSigningMessage = (jsonData: string, data: Uint8Array): Uint8Array => concatArrays([
  getUtf8EncodedData(jsonData), getBase64EncodedData(data)
]);
export const getUtf8EncodedData = (jsonData: string) => new Uint8Array(Buffer.from((jsonData + '\n'), 'utf-8'));
export const getBase64EncodedData = (data: Uint8Array) => new Uint8Array(Buffer.from(encodeBase64(data)));

export const makeWithdrawTxns = async (
  algoClient: algosdk.Algodv2,
  {
    loginAddress,
    loginChainId,
    tokenIndex,
    recipient,
    recipientChainId
  }: IWithdrawData,
  message: string,
  signature: string,
  // encoding: BufferEncoding | undefined,
  sender: string,
  options: {
    appId: number,
    coreId: number,
    lsaAddress: string,
    msgProcessorId: number,
    unifiedChainId?: number,
    cctpSupportedChains?: number[],
    superWallet: AddressChain,
  }
) => {
  const msgArgs = getMsgArgs(message, signature, loginAddress, loginChainId);
  const appArgs = getAppArgs("withdraw(byte[],byte[],byte[])uint64", msgArgs);
  
  const isAlgoChain = recipientChainId === Chains.Algorand;
  
  // TODO: calc actual txn fee
  // const params = await getTxnParams(algoClient, 7);
  const params = await getTxnParams(algoClient, isAlgoChain ? 6 : 2);
  params.fee = params.fee + (algosdk.ALGORAND_MIN_TX_FEE * 5);
  const { appId, coreId, lsaAddress, msgProcessorId, unifiedChainId, cctpSupportedChains, superWallet } = options;
  const accountBoxName = keccak256(
    getAccountBalanceBoxName(loginAddress, loginChainId, tokenIndex, unifiedChainId || recipientChainId)
  );
  const superBoxName = keccak256(
    getAccountBalanceBoxName(superWallet.address, superWallet.chainId, tokenIndex, unifiedChainId || recipientChainId)
  );
  const boxes = [
    { appIndex: appId, name: accountBoxName },
    { appIndex: appId, name: superBoxName },
  ];

  if (!isAlgoChain && !unifiedChainId) {
    boxes.push({ appIndex: msgProcessorId, name: getTmcBoxName(recipientChainId) });
  }

  if (unifiedChainId) {
    boxes.push(
      ...cctpSupportedChains.map((chainId: Chains) =>
        ([
          { appIndex: msgProcessorId, name: getCCTPBalanceBoxName(String(tokenIndex), chainId) },
          { appIndex: msgProcessorId, name: getTmcBoxName(chainId) },
        ])
      ).flat()
    );
  }

  const foreignAssets = isAlgoChain && tokenIndex != 0 ? [+tokenIndex] : undefined;
  const foreignApps = isAlgoChain ? [ coreId ] : [ coreId, msgProcessorId ];
  const whAddress = algosdk.getApplicationAddress(coreId);
  const accounts = [ lsaAddress, whAddress ];

  if (isAlgoChain) {
    accounts.push(recipient);
  }

  const txns = makeGroupTxnsWithDummy("withdraw", {
    appIndex: appId,
    from: sender,
    suggestedParams: params,
    appArgs,
    accounts,
    foreignAssets,
    foreignApps,
    boxes,
    note: algosdk.encodeUint64(Date.now()),
  });
  console.log('withdraw txns', txns);

  return txns;
}

export const makeSetCollectionWalletTxn = async (
  algoClient: algosdk.Algodv2,
  sender: string,
  { message, signature, signerAddress, signerChainId }: IMsgArgs,
  appId: number,
  superAppId: number,
  companyId: number,
) => {
  const msgArgs = getMsgArgs(message, signature, signerAddress, signerChainId);
  const appArgs = getAppArgs("setCollectionWallet(byte[],byte[],byte[])void", msgArgs);

  const params = await getTxnParams(algoClient, 4);
  const boxName = getCompanyBoxName(companyId);
  const foreignApps = [superAppId];

  const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: appId,
    from: sender,
    suggestedParams: params,
    appArgs,
    foreignApps,
    boxes: [ { appIndex: appId, name: boxName } ],
  });
  console.log('setCollectionWallet txn', appCallTxn);

  return appCallTxn;
}

export const makeSetSuperCollectionWalletTxns = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  superId: number,
  sender: string,
  address: string,
  chainId: number,
): Promise<algosdk.Transaction> => {
  const messageBytes = makeSuperCollectionWalletMsg({ loginAddress: address, loginChainId: chainId });
  return makeSetGlobalTxn(algoClient, appId, superId, sender, {key: "UL_SUPERADMIN_WALLET", type: "S", value: messageBytes});
}

export const makeSetSuperAppTxns = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  superId: number,
  sender: string,
  superAppId: number,
): Promise<algosdk.Transaction> => {
  const message = encode(superAppId, "8B");
  return makeSetGlobalTxn(algoClient, appId, superId, sender, {key: "UL_SUPERADMIN_APP", type: "N", value: message});
}

const makeSetGlobalTxn = async (
  algoClient: algosdk.Algodv2,
  appId: number,
  superId: number,
  sender: string,
  data: {
    type: "S" | "N",
    key: string,
    value: Uint8Array
  }
): Promise<algosdk.Transaction> => {
  const { key, type, value } = data;
  const appArgs = getAppArgs("setGlobal(byte[],byte[],byte[])void", [encodeString(key), value, encodeString(type)]);
  const params = await getTxnParams(algoClient, 6);
  const foreignApps = [superId];

  const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: appId,
    from: sender,
    suggestedParams: params,
    appArgs,
    foreignApps,
  });

  return appCallTxn;
}

export const makeSetCompanyFeeTxn = async (
  algoClient: algosdk.Algodv2,
  { fee, feeType, companyId }: { fee: number, feeType: "M" | "T", companyId: number },
  sender: string,
  appId: number,
  superAppId: number,
) => {
  const appArgs = getAppArgs("setCompanyFee(uint64,uint64,byte[])void", [fee, companyId, encodeString(feeType)]);
  
  const params = await getTxnParams(algoClient, 1);
  const boxName = getCompanyBoxName(companyId);
  const foreignApps = [superAppId];

  const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
    appIndex: appId,
    from: sender,
    suggestedParams: params,
    appArgs,
    boxes: [ { appIndex: appId, name: boxName } ],
    foreignApps,
  });
  console.log('setCompanyFee txn', appCallTxn);

  return appCallTxn;
}

export const makeUpdateTokenInfoTxns = (
  appId: number,
  superId: number,
  sender: string,
  params: algosdk.SuggestedParams,
  balances: Record<string, number>,
  token: PairTokenInfo,
): algosdk.Transaction[] => {
  const tokenBoxKey = getTokenBoxKey(token);
  const msgArgs = [
    encode(token.address, 'token', token.chainId),
    token.chainId,
    encode(token.name, 'str'),
    token.decimal,
  ];
  const appArgs = getAppArgs("updateTokenInfo(byte[],uint64,byte[],uint64)uint64", msgArgs);

  const tokenTxn = algosdk.makeApplicationNoOpTxnFromObject({
    from: sender,
    suggestedParams: params,
    appIndex: appId,
    appArgs,
    boxes: createBoxes(appId, [
      tokenBoxKey,
    ]),
    foreignApps: [superId],
  });
  const txns = [tokenTxn];
  const optInTxn = makeAssetOptInTxn(appId, superId, sender, params, balances, token);
  if (optInTxn) {
    txns.unshift(optInTxn);
  }
  return txns;
}

export const makeUpdatePairInfoTxn = (
  appId: number,
  superId: number,
  sender: string,
  params: algosdk.SuggestedParams,
  baseToken: PairToken,
  priceToken: PairToken,
  minSize: string,
  minPriceIncrement: string,
  minSizeIncrement: string
) => {
  const baseTokenBoxKey = getTokenBoxKey(baseToken);
  const priceTokenBoxKey = getTokenBoxKey(priceToken);
  const pairBoxKey = getPairBoxKey(baseToken, priceToken);
  const appArgs = getAppArgs("updatePairInfo(byte[],uint64,byte[],uint64,byte[],byte[],byte[])uint64", [
    encode(baseToken.address, 'token', baseToken.chainId),
    baseToken.chainId,
    encode(priceToken.address, 'token', priceToken.chainId),
    priceToken.chainId,
    encode(minSize, '32B'),
    encode(minPriceIncrement, '32B'),
    encode(minSizeIncrement, '32B'),
  ]);

  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    from: sender,
    suggestedParams: params,
    appIndex: appId,
    appArgs,
    boxes: createBoxes(appId, [
      pairBoxKey,
      baseTokenBoxKey,
      priceTokenBoxKey,
    ]),
    foreignApps: [superId],
  });
  return txn;
}

export const getUpgradeImpMsg = (chainId: number, implementationAddress: string) => {
  return concatArrays([
    encode('upgradee', "str"),
    encode(chainId, '8B'),
    encodeAddress(implementationAddress, chainId),
    encode(0, '8B'),
  ]);
}
