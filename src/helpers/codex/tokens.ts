import { PairToken } from '../../interfaces/pair.interface';

export const unified_CCTP_token = 'CCTPUSDC';
export const unified_CCTP_ChainID = 65537;

export function getUnifiedUSDC(): Buffer {
  const unified_buf = Buffer.alloc(32, 0);
  Buffer.from(unified_CCTP_token, 'utf-8').copy(unified_buf);
  return unified_buf;
}

export function getUnifiedUSDCToken(): PairToken {
  return {
    address: "0x" + getUnifiedUSDC().toString('hex'),
    chainId: unified_CCTP_ChainID
  };
}