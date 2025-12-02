export * from './interval.helpers';
export * from './ticker.helpers';
export * from './pointSystem.helper';

export function sortKeysInObject(o: object) {
  return Object.keys(o).sort().reduce((acc, key) => ({ ...acc, [key]: o[key] }), {});
}

export function round2(val: number) { return Math.round(val * 100) / 100 }