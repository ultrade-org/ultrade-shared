import { OrderSideShort } from "@interfaces";
import { mapOrderSideToShort } from "@helpers/order.helper";
import { equalIgnoreCase } from "@common/utils";
import { plus } from "@common/big-number.helper";
import { ICodexAsset, IOrder, ITrade } from "@interfaces";
import { OrderSide } from "@enums";
import { IOrderDto, ITradeDto } from "@interfaces";

export function mapToUserTradeDto(t: ITrade, baseAsset?: ICodexAsset, priceAsset?: ICodexAsset): ITradeDto {
  const o = t.buyOrder && t.sellOrder
    ? (t.buyOrderId > t.sellOrderId ? t.buyOrder : t.sellOrder) // which order is self order
    : (t.buyOrder || t.sellOrder); // user order
  return {
    pairId: t.pairId,
    orderId: o?.id,
    orderSide: (o && mapOrderSideToShort(o.side)) as OrderSideShort,
    ...mapAssets(baseAsset, priceAsset),
    ...mapTrade(t, o),
  };
}

export function mapToOrderTradeDto(order: IOrder, trades?: Partial<ITrade>[], pairKey?: string, baseAsset?: ICodexAsset, priceAsset?: ICodexAsset): IOrderDto {
  return {
    id: order.id,
    pairId: order.pairId,
    // @ts-ignore
    pair: pairKey || order.pair?.pairKey,
    ...mapAssets(baseAsset, priceAsset),
    amount: order.amount,
    price: order.price,
    total: order.total,
    filledAmount: order.filledAmount,
    filledTotal: order.filledTotal,
    avgPrice: order.excutedPrice,
    status: order.status,
    side: order.side,
    type: order.type,
    userId: order.userId,
    createdAt: order.createdAt?.getTime(),
    completedAt: order.completedAt?.getTime() || null,
    updatedAt: order.updatedAt?.getTime(),
    trades: trades && trades.map((t: ITrade) => mapTrade(t, order)),
  };
}

function mapAssets(baseAsset?: ICodexAsset, priceAsset?: ICodexAsset) {
  return {
    baseTokenId: baseAsset?.id,
    baseTokenDecimal: baseAsset?.decimals,
    quoteTokenId: priceAsset?.id,
    quoteTokenDecimal: priceAsset?.decimals,
  }
}

function mapTrade(t: ITrade, o?: IOrder) {
  return {
    tradeId: t.tradeId,
    status: t.txStatus,
    amount: t.amount,
    total: t.total,
    price: t.price,
    fee: o && t.tradeFees
      .filter(f => equalIgnoreCase(f.address, o.userId))
      .reduce((acc, cur) => plus(acc, cur.fee), '0'),
    createdAt: t.createdAt?.getTime(),
    updatedAt: t.updatedAt?.getTime(),
    isBuyer: o && o.side === OrderSide.Buy,
    isMaker: o && isMaker(o.side, t.tradeSide),
  };
}

export function isMaker(oSide: OrderSide, tSide: OrderSide) {
  return oSide === OrderSide.Buy && tSide === OrderSide.Sell
    || oSide === OrderSide.Sell && tSide === OrderSide.Buy;
}