export const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(`Assertion error: ${message}`);
  }
}