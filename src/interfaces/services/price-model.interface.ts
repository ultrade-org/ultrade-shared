import { PriceObject } from '@interfaces';

export interface IPriceModel extends Map<number, number> {
  serialize(): PriceObject;
}
