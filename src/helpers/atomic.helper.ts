import { divide, multiply } from "../common/big-number.helper";
import { FACTOR_PRICE_DECIMAL } from "../constants";

export const factorPrice = (price: number) => {
  return multiply(price, 10 ** FACTOR_PRICE_DECIMAL);
}

/**
 * Convert a factored atomic value to a non-factored atomic value
 * @param price - The price to convert
 * @param decimal - The number of decimal places
 * @returns The price converted to a non factored atomic value
 */
export const defactorPrice = (price: string, decimal: number) => {
  return divide(price, 10 ** (FACTOR_PRICE_DECIMAL - decimal));
}

/**
 * Convert an atomic value to a decimal value. ONLY for non-factored atomic values
 * @param amount - The number to convert
 * @param decimal - The number of decimal places
 * @returns The number converted to a decimal
 */
export const toDecimal = (amount: string, decimal: number) => {
  return divide(amount, 10 ** decimal);
}

/**
 * Convert a factored atomic value to a decimal value
 * @param price - The price to convert
 * @returns The price converted to a decimal
 */
export const toDecimalPrice = (price: string) => {
  return toDecimal(price, FACTOR_PRICE_DECIMAL);
}
