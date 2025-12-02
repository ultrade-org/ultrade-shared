// import * as CryptoJS from 'crypto-js';
// import { decodeAddress } from 'algosdk';
// import { CHAINS, isEVMChain, ChainId } from "@certusone/wormhole-sdk";
// import { decode as base58decode } from 'bs58';
// import { deriveAddress } from "@certusone/wormhole-sdk/lib/cjs/solana";
// import { checkIfAddressIsNormalized, normalizeAddress } from './codex.helper';

// export const wormholeEmitterFormat = (address: string, chainId: number) => {
//   if (isEVMChain(chainId as ChainId)) {
//     const addressWithoutPrefix = address.startsWith('0x') ? address.slice(2) : address;
//     const paddedAddress = addressWithoutPrefix.padStart(64, '0');
//     return paddedAddress.toLowerCase();
//   }
//   if (chainId === CHAINS.algorand) {
//     const decodedAddress = decodeAddress(address);
//     const addressWithoutChecksum = decodedAddress.publicKey;
//     return Buffer.from(addressWithoutChecksum).toString('hex');
//   }
//   if (chainId === CHAINS.solana) {
//     const emitterAddressKey = deriveAddress([Buffer.from("emitter")], address);
//     const emitterAddress = emitterAddressKey.toString();
//     const decodedBytes = base58decode(emitterAddress);
//     const hexAddress = Buffer.from(decodedBytes).toString('hex');
//     return hexAddress;
//   }
//   console.log("Unsupported chain ID", chainId);
//   return address;
// };

// export const getVaaId = (emitterAddress: string, emitterChainId: number, sequence: string): string => {
//   const isNormalized = checkIfAddressIsNormalized(emitterAddress);
//   if (!isNormalized) {
//     emitterAddress = normalizeAddress(emitterAddress, emitterChainId);
//   }

//   console.info(`[INFO] Get vaa id function called with emitterAddress: ${emitterAddress}, emitterChainId: ${emitterChainId}, sequence: ${sequence}`);
//   const data = emitterChainId + emitterAddress + sequence;
//   console.info("[INFO] Vaa id: ", data)
//   const hash = CryptoJS.SHA256(data.toLowerCase());
//   return CryptoJS.enc.Hex.stringify(hash);
// };
