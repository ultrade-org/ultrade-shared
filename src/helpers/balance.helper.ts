import { multiply } from '@common/big-number.helper';
import { OrderSide, OrderType } from "@enums";
import { AddressChain, PairToken } from "@interfaces";
import { ICancelingOrder, IPairInfo } from "@interfaces";
import { IBalanceInfo } from "@interfaces";
import { defactorPrice, toDecimal } from "./atomic.helper";
import { getAccountBalanceBoxNameHash } from "./codex.helper";

export const mapToBalanceInfo = (
  pairInfo: IPairInfo,
  { userId, chainId, price, side, type, amount, total, id }: Partial<ICancelingOrder>,
) => {
  const { baseAsset, priceAsset } = pairInfo;
  const account: AddressChain = { address: userId, chainId };
  const token: PairToken = side === OrderSide.Buy ? priceAsset : baseAsset;

  const balanceInfo: IBalanceInfo = {
    action: 'order',
    actionId: id,
    account,
    token,
    amount: side === OrderSide.Buy
      ? (type === OrderType.Market
        ? defactorPrice(total, priceAsset.decimal)
        : multiply( toDecimal(amount, baseAsset.decimal), defactorPrice(price, priceAsset.decimal) )
      )
      : amount,
    ts: Date.now(),
  };

  return balanceInfo;
}

export const mapToCodexBalance = (account: AddressChain, token: PairToken, amount: string, lockedAmount: string = '0') => {
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
