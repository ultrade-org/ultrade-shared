import BigNumber from "bignumber.js";

export function computeLiquidityUsd(opts: {
  buy: [string, string][];
  sell: [string, string][];
  baseDec: number;
  baseUsd: number;
}): number {
  const { buy, sell, baseDec, baseUsd } = opts;

  const sumQuoteRaw: BigNumber = buy.reduce(
    (acc, [_, amount]) => acc.plus(new BigNumber(amount)),
    new BigNumber(0)
  );

  const asksBaseTokens: BigNumber = sell.reduce(
    (acc, [, amount]) => acc.plus(new BigNumber(amount)),
    new BigNumber(0)
  );

  const liquidity: BigNumber = sumQuoteRaw.plus(asksBaseTokens).dividedBy(new BigNumber(10).pow(baseDec));

  const liquidityUsd: BigNumber = liquidity.multipliedBy(baseUsd);

  const usdCeil = liquidityUsd.integerValue(BigNumber.ROUND_CEIL)

  return usdCeil.toNumber();
}