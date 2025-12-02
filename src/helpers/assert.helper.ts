// import assert from "assert-ts";
import { equal, greaterThan, greaterThanOrEqual, modZero, multiply } from "@common/big-number.helper";
import { equalIgnoreCase } from "@common/utils";
import { FACTOR_PRICE_DECIMAL, MIN_ORDER_EXPIRATION_MINS, ORDER_MSG_VERSION } from "@constants";
import { Chains } from "@enums";
import { IOrderDataInMsg, IOrderData } from "@interfaces";
import { AddressChain } from "@interfaces";
import { IPairInfo } from "@interfaces";

export const assertOrderData = (order: IOrderData, pair: IPairInfo) => {
  assertToken("base", { address: String(order.baseTokenAddress), chainId: order.baseTokenChainId }, pair.baseAsset);
  assertToken("price", { address: String(order.priceTokenAddress), chainId: order.priceTokenChainId }, pair.priceAsset);

  assertOrder(order, pair);
}

const assertToken = (token: "base" | "price", tokenFromOrder: AddressChain, tokenFromPair: AddressChain) => {
  assert(Number(tokenFromOrder.chainId) === Number(tokenFromPair.chainId), `Invalid ${token}TokenChainId, must be ${tokenFromPair.chainId}`);

  assert(
    tokenFromPair.chainId === Chains.Solana && String(tokenFromOrder.address) === String(tokenFromPair.address)
    || tokenFromPair.chainId === Chains.Algorand && Number(tokenFromOrder.address) === Number(tokenFromPair.address)
    || equalIgnoreCase(tokenFromOrder.address, tokenFromPair.address),
    `Invalid ${token}TokenAddress, must be ${tokenFromPair.address}`
  );
}

export const assertOrderExpirationAtCreationMoment = (order: IOrderDataInMsg) => {
  assert(order.expiredTime >= Math.floor(Date.now() / 1000) + MIN_ORDER_EXPIRATION_MINS * 60, `Expiration time shorter than 1 hour`);
}

export const assertOrder = (order: IOrderDataInMsg, pair: { min_size_increment: string, min_order_size: string, min_price_increment: string, base_decimal: number }) => {
  assert(equal(ORDER_MSG_VERSION, order.version), `Invalid order message version. Current is ${ORDER_MSG_VERSION}`);
  assert(equal(order.decimalPrice, 0) || equal(multiply(order.decimalPrice, 10 ** FACTOR_PRICE_DECIMAL), order.price), "Invalid price or decimalPrice");
  assert(!isNaN(order.random), "Invalid random, must be a number");
  assert(order.random > 0, "Invalid random, must be greater than 0");
  assert(order.random <= Number.MAX_SAFE_INTEGER, "Invalid random, must no more than 2^53-1");
  assert(order.expiredTime >= Math.floor(Date.now() / 1000), `Invalid expiration time`);
  assert(["B", "S"].includes(order.orderSide), "Invalid order side");
  assert(["L", "P", "I", "M"].includes(order.orderType), "Invalid order type");
  
  if (order.orderType === "M" && order.orderSide === "S") {
    assert( equal(order.price, 0) && greaterThan(order.amount, 0), "Invalid market order amount or price");
    assert( modZero(order.amount, pair.min_size_increment) && greaterThanOrEqual(order.amount, pair.min_order_size), "Invalid market order amount");
  } else if (order.orderType === "M" && order.orderSide === "B" && equal(order.amount, 0)) {
    throw new Error("Buy murket order by total is not implemented yet");
    // assert( greaterThan(order.price, 0) && modZero(order.price, pair.min_price_increment), "Invalid buy market order by total");
  } else if (order.orderType === "M" && order.orderSide === "B" && greaterThan(order.amount, 0)) {
    assert( greaterThan(order.price, 0) && modZero(order.amount, pair.min_size_increment) && greaterThanOrEqual(order.amount, pair.min_order_size), "Invalid buy market order by amount" );
  } else {
    assert( greaterThan(order.price, 0) && greaterThan(order.amount, 0), "Invalid order amount or price is zero");
    assert( modZero(order.amount, pair.min_size_increment) && greaterThanOrEqual(order.amount, pair.min_order_size) && modZero(order.price, pair.min_price_increment), "Invalid order amount or price");
  }
}

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
}