import { AvailablePairSettings } from "@enums";
import { IPair, IPairSetting, PairTokenInfo } from "@interfaces";

export const fetchTokensFromPair = (pair: IPair) => {
  const {
    base_id, base_chain_id, base_decimal, base_currency,
    price_id, price_chain_id, price_decimal, price_currency,
  } = pair;
  const [baseAsset, priceAsset] = ([
    [base_id, base_chain_id, base_decimal, base_currency],
    [price_id, price_chain_id, price_decimal, price_currency],
  ] as [string, number, number, string][]).map(
    ([address, chainId, decimal, name]) => ({ address, chainId, decimal, name } as PairTokenInfo)
  );
  return { baseAsset, priceAsset };
}

export const parsePairSettings = (settings: IPairSetting[], companyId?: number): { [ name: string ]: string | object } => {
  return settings?.reduce((acc, o) => {
    const { settingId, value } = o;
    if (o.companyId && o.companyId !== companyId) {
      return acc;
    }
    if (settingId === AvailablePairSettings.MODE_PRE_SALE) {
      acc[settingId] = JSON.parse(value);
    } else {
      acc[settingId] = value;
    }
    return acc;
  }, {})
}

export const extractPairFee = (pairSettings: IPairSetting[], companyId: number, feeType: "M" | "T") => {
  const pSettings = parsePairSettings(pairSettings, companyId);
  const feeSetting = feeType === "M" ? AvailablePairSettings.MAKER_FEE : AvailablePairSettings.TAKER_FEE;
  const pairFee = Number(pSettings[feeSetting]);
  if (pairFee) {
    return pairFee;
  }
}