import { AddressChain, ICodexBalance, PairToken } from "@interfaces";
import { getAccountBalanceBoxNameHash } from "./codex.helper";

export const mapToCodexBalance = (account: AddressChain, token: PairToken, amount: string, lockedAmount: string = '0'): ICodexBalance => {
  return {
    hash: getAccountBalanceBoxNameHash(account, token),
    loginAddress: account.address,
    loginChainId: account.chainId,
    tokenId: token.address,
    tokenChainId: token.chainId,
    amount,
    lockedAmount
  }
}
