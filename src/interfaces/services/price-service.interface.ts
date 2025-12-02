import { ICodexAsset, IPriceModel } from '@interfaces';

export interface PriceProvider {
  getPrices(assets: Pick<ICodexAsset, 'id' | 'coinmarketcapId'>[]): Promise<IPriceModel | null>;
  compareAssetWithCoinmarketId(assets: ICodexAsset[], isMainnet: boolean): Promise<ICodexAsset[]>;
}

export type PriceObject = {
  [key: string]: number;
};

