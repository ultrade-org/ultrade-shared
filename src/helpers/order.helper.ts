import { OrderSide, OrderType } from "@enums";
import { OrderSideShort, OrderTypeShort } from "../interfaces/order.interface";

export function mapOrderSideFromShort(value: OrderSideShort): OrderSide {
  switch (value) {
    case "B": return OrderSide.Buy;
    case "S": return OrderSide.Sell;
    default:
      throw new Error("Unknown order side short type: " + value);
  }
}

export function mapOrderSideToShort(value: OrderSide): OrderSideShort {
  switch (value) {
    case OrderSide.Buy: return "B";
    case OrderSide.Sell: return "S";
    default:
      throw new Error("Unknown order side type: " + value);
  }
}

export function mapOrderTypeShort(value: OrderTypeShort): OrderType {
  switch (value) {
    case "I": return OrderType.IOC;
    case "P": return OrderType.POST;
    case "M": return OrderType.Market;
    case "L":
    default:
      return OrderType.Limit;
  }
}

export function mapOrderSideFromShortToLong(value: OrderSideShort): string {
  switch (value) {
    case "B": return "BUY";
    case "S": return "SELL";
    default:
      throw new Error("Unknown order side short type: " + value);
  }
}

export function mapOrderTypeShortToLong(value: OrderTypeShort): string {
  switch (value) {
    case "I": return "IOC";
    case "P": return "POST";
    case "M": return "Market";
    case "L":
    default:
      return "Limit";
  }
}