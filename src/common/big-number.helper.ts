import BigNumber from 'bignumber.js';
BigNumber.config({ DECIMAL_PLACES: 40, EXPONENTIAL_AT: 45 });

export enum Operations {
  MINUS = '-',
  PLUS = '+',
  MULTIPLY = '*',
  DIVIDE = '/',
  GREATER_THAN_OR_EQUAL = '>=',
  GREATER_THAN = '>',
  LESS_THAN_OR_EQUAL = '<=',
  LESS_THAN = '<',
  EQUAL = '==',
  MOD = 'mod',
}

export function absolute(value: number | string): string {
  let x = new BigNumber(value);
  const res = x.abs().toString();
  // console.log('Absolute value', { value, res })
  return res;
}

export function ceil(value: number | string): string {
  let x = new BigNumber(String(value));
  const res = x.integerValue(BigNumber.ROUND_CEIL).toString();
  if (!equal(value, res)) {
    console.log('Ceil value', { value, res });
  }
  return res;
}

export function toFixed(value: number | string, decimalPlaces: number, roundUpToFirstSignificant: boolean = false): string {
  const x = new BigNumber(String(value));
  let res;

  if (roundUpToFirstSignificant) {
    const valueStr = x.toFixed(); 
    const decimalIndex = valueStr.indexOf('.');
    if (decimalIndex >= 0) {
      const fractionalPart = valueStr.slice(decimalIndex + 1);
      let leadingZeros = 0;
      for (let char of fractionalPart) {
        if (char === '0') {
          leadingZeros++;
        } else {
          break;
        }
      }
      const totalDecimalPlaces = leadingZeros + 1;
      res = x.toFixed(totalDecimalPlaces, BigNumber.ROUND_UP);
    } else {
      res = x.toFixed(0);
    }
  } else {
    res = x.toFixed(decimalPlaces);
  }

  console.log('Fixed value', { value, res });
  return res;
}

export function floor(value: number | string): string {
  let x = new BigNumber(String(value));
  const res = x.integerValue(BigNumber.ROUND_FLOOR).toString();
  console.log('Floor value', { value, res })
  return res;
}

export function round(value: number | string): string {
  let x = new BigNumber(String(value));
  const res = x.integerValue(BigNumber.ROUND_HALF_UP).toString();
  console.log('Round value', { value, res })
  return res;
}

export function plus(value1: number | string | bigint, value2: number | string | bigint): string {
  return bn_operation(
    value1,
    value2,
    Operations.PLUS
  );
}

export function minus(value1: number | string | bigint, value2: number | string | bigint): string {
  return bn_operation(
    value1,
    value2,
    Operations.MINUS
  );
}

export function multiply(value1: number | string | bigint, value2: number | string | bigint): string {
  return bn_operation(
    value1,
    value2,
    Operations.MULTIPLY
  );
}

export function toUsd (amount: string, price: number) {
  return multiply(amount, price || 0);
};

export function divide(value1: number | string | bigint, value2: number | string | bigint): string {
  return bn_operation(
    value1,
    value2,
    Operations.DIVIDE
  );
}

export function greaterThanOrEqual(value1: number | string | bigint, value2: number | string | bigint): boolean {
  return Boolean(bn_operation(
    value1,
    value2,
    Operations.GREATER_THAN_OR_EQUAL
  ));
}

export function greaterThan(value1: number | string | bigint, value2: number | string | bigint): boolean {
  return Boolean(bn_operation(
    value1,
    value2,
    Operations.GREATER_THAN
  ));
}

export function lessThanOrEqual(value1: number | string | bigint, value2: number | string | bigint): boolean {
  return Boolean(bn_operation(
    value1,
    value2,
    Operations.LESS_THAN_OR_EQUAL
  ));
}

export function lessThan(value1: number | string | bigint, value2: number | string | bigint): boolean {
  return Boolean(bn_operation(
    value1,
    value2,
    Operations.LESS_THAN
  ));
}

export function equal(value1: number | string | bigint, value2: number | string | bigint): boolean {
  return Boolean(bn_operation(
    value1,
    value2,
    Operations.EQUAL
  ));
}

export function mod(value1: number | string | bigint, value2: number | string | bigint): string {
  return bn_operation(
    value1,
    value2,
    Operations.MOD
  );
}

export function modZero(value1: number | string | bigint, value2: number | string | bigint): boolean {
  return equal(mod(value1, value2), 0);
}

export function bn_operation(a: any, b: any, operation: Operations) {
  a = new BigNumber(String(a));
  b = new BigNumber(String(b));
  switch (operation.toLowerCase()) {
    case '-':
      return a.minus(b).toString();
    case '+':
      return a.plus(b).toString();
    case '*':
    case 'x':
      return a.multipliedBy(b).toString();
    case '÷':
    case '/':
      return a.dividedBy(b).toString();
    case '>=':
      return a.isGreaterThanOrEqualTo(b)
    case '>':
      return a.isGreaterThan(b);
    case '<=':
      return a.isLessThanOrEqualTo(b)
    case '<':
      return a.isLessThan(b);
    case '==':
      return a.isEqualTo(b);
    case 'mod':
      return a.modulo(b);
    default:
      break;
  }
}

function getExponentialNumberComponents(x: number): [number, number] {
  if (x.toString().includes('e')) {
    const parts = x.toString().split('e');

    return [parseFloat(parts[0]), parseFloat(parts[1])];
  }

  return [x, 0];
}

function generateExponentialNumberFromComponents(
  decimalPart: number,
  exponent: number
) {
  return decimalPart + (exponent < 0 ? `e${exponent}` : `e+${exponent}`);
}

export function roundNumber({ decimalPlaces = 0 }, x: number): number {
  if (decimalPlaces > 0) {
    const [decimal, decimalExponentialPart] = getExponentialNumberComponents(x);

    const [rounded, roundedExponentialPart] = getExponentialNumberComponents(
      Math.round(
        Number(
          generateExponentialNumberFromComponents(
            decimal,
            decimalExponentialPart + decimalPlaces
          )
        )
      )
    );

    return Number(
      generateExponentialNumberFromComponents(
        rounded,
        roundedExponentialPart - decimalPlaces
      )
    );
  }

  return Math.round(x);
}

export function convertFromBaseUnits(
  assetDecimals: number | bigint,
  quantity: number | bigint
) {
  const decimals = Number(assetDecimals);

  return roundNumber(
    { decimalPlaces: decimals },
    // eslint-disable-next-line no-magic-numbers
    Math.pow(10, -decimals) * Number(quantity)
  );
}

/**
 * Computs quantity * 10^(assetDecimals) and rounds the result
 */
export function convertToBaseUnits(
  assetDecimals: number | bigint,
  quantity: number | bigint
) {
  // eslint-disable-next-line no-magic-numbers
  const baseAmount = Math.pow(10, Number(assetDecimals)) * Number(quantity);

  // make sure the final value is an integer. This prevents this kind of computation errors: 0.0012 * 100000 = 119.99999999999999 and rounds this result into 120
  return roundNumber({ decimalPlaces: 0 }, baseAmount);
}