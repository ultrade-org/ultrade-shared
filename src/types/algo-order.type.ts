import { OrderSideShort, OrderTypeShort } from "../interfaces/order.interface";

export type AlgoOrder = {
  orderID: number,
  side: OrderSideShort,
  price: string,
  amount: string,
  type: OrderTypeShort,
  directSettle: any,
  storageSlot: any
};