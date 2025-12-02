import { PublicKey } from '@solana/web3.js';
import { CCTP_UNIFIED_ASSETS } from "../constants/cctp";
import { WITHDRAW_DATA_BYTES_LENGTH } from "../constants/codex";
import { Chains } from "../enums/chains.enum";
import { IWithdrawData } from "../interfaces/wallet.interface";
import { generateHash, getDataBytesFromMsg } from "./codex/common.helper";
import { decode, encode, encodeAddress, getAccountBalanceBoxName, makeSigningMessage } from "./codex.helper";
import { concatArrays, encodeBase64 } from "./Encoding";
import { encode32Bytes } from "./eth.helper";
import { WithdrawalWalletData, UpdateWithdrawalWalletData } from '@interfaces';
import { messageForSigning } from '@constants';
import { WithdrawalWalletType } from '@interfaces';

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export function getAssociatedTokenAddressSync(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): PublicKey {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error("TokenOwnerOffCurveError");

  const [address] = PublicKey.findProgramAddressSync(
      [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
      associatedTokenProgramId
  );

  return address;
}

export const getSolanaUsdc = (network: string, tokenIndex: string, recipientChainId: number) => {
  const solanaUsdc = network === 'MainNet' ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' : '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
  if (isSolanaCctp(tokenIndex, recipientChainId)) {
    return solanaUsdc;
  }
}

export const SOLANA_USDC = process.env.ALGO_NETWORK === 'MainNet' ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' : '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

export const isSolanaCctp = (tokenIndex: string, recipientChainId: number) => CCTP_UNIFIED_ASSETS[tokenIndex] && recipientChainId === Chains.Solana;

export const getWithdrawBytesFromMsg = (message: string, encoding: BufferEncoding = 'hex') => {
  return getDataBytesFromMsg(message, encoding, WITHDRAW_DATA_BYTES_LENGTH);
}

export const calcWithdrawHash = (message: string) => {
  return generateHash(getWithdrawBytesFromMsg(message, "hex"));
}

export const decodeWithdrawMsg = (message: string, encoding: BufferEncoding = 'hex'): IWithdrawData => {
  const buffer = getDataBytesFromMsg(message, encoding, WITHDRAW_DATA_BYTES_LENGTH);
  const chainId = Number(decode(buffer.subarray(32, 40), '8B'));
  const recipientChainId = Number(decode(buffer.subarray(104, 112), '8B'));
  const withdrawData: IWithdrawData = {
    loginAddress: String(decode(buffer.subarray(0, 32), 'address', chainId)),
    loginChainId: chainId,
    tokenIndex: String(decode(buffer.subarray(40, 72), 'token', recipientChainId)),
    tokenChainId: recipientChainId, 
    recipient: String(decode(buffer.subarray(72, 104), 'address', recipientChainId)),
    recipientChainId,
    tokenAmount: String(decode(buffer.subarray(112, 144), '32B')),
    isNative: Boolean(decode(buffer.subarray(144, 145), 'bool')),
    fee: Number(decode(buffer.subarray(145, 177), '32B')),
    random: Number(decode(buffer.subarray(177, 185), '8B')),
  }
  return withdrawData;
}

export const makeWithdrawMsg = (data: IWithdrawData, prettyMsg?: string): Uint8Array => {
  const {
    loginAddress,
    loginChainId,
    recipient,
    recipientChainId,
    tokenAmount,
    tokenIndex,
    isNative,
    fee,
    random,
    solanaUsdc,
  } = data;
  let recipientAddressBytes = encodeAddress(recipient, recipientChainId);

  if (isSolanaCctp(String(tokenIndex), recipientChainId)) {
    const USDC_MINT = new PublicKey(solanaUsdc);
    const associatedTokenAddress = getAssociatedTokenAddressSync(USDC_MINT, new PublicKey(recipient));
    console.log("associatedTokenAddress", associatedTokenAddress.toBase58());
    recipientAddressBytes = encodeAddress(associatedTokenAddress.toBase58(), recipientChainId);
  }

  const boxNameBytes = getAccountBalanceBoxName(loginAddress, loginChainId, tokenIndex, recipientChainId);
  const dataBytes = concatArrays([
    boxNameBytes.slice(0, 72),
    recipientAddressBytes,
    encode(recipientChainId, '8B'),
    encode32Bytes(tokenAmount),
    encode(+isNative, 'bool'),
    encode32Bytes(fee),
    encode(random, '8B'),
  ]);

  return makeSigningMessage(prettyMsg || JSON.stringify(data), dataBytes);
}

const chainsMap: Record<WithdrawalWalletType, Chains> = {
  [WithdrawalWalletType.EVM]: Chains.Polygon,
  [WithdrawalWalletType.ALGORAND]: Chains.Algorand,
  [WithdrawalWalletType.SOLANA]: Chains.Solana,
}

export const createWithdrawalWalletMsg = (data: WithdrawalWalletData | UpdateWithdrawalWalletData): Uint8Array => {
  const withdrawalWallet = [
    encode(data.address, 'address', chainsMap[data.type]),
    encode(data.name, 'str'),
    encode(data.type, 'str'),
    encode(data.description || '', 'str'),
  ];
  
  const withdrawalWalletBytes = Buffer.concat(withdrawalWallet);

  const prettyData = messageForSigning(data.address);

  return makeSigningMessage(prettyData, withdrawalWalletBytes);
}
