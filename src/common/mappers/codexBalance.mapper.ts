import { ICodexBalance, ICodexBalanceDto } from "@interfaces";

export function mapToCodexBalanceDto(o: ICodexBalance): ICodexBalanceDto {
  return {
    hash: o.hash,
    loginAddress: o.loginAddress,
    loginChainId: o.loginChainId,
    tokenId: o.token?.id,
    tokenAddress: o.tokenId,
    tokenChainId: o.tokenChainId,
    amount: o.amount,
    lockedAmount: o.lockedAmount
  };
}