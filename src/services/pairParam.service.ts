const MAX_TOKEN_DECIMAL = 18;
const MIN_ORDER_SIZE_VALUE_RANGE = 1; // $1
const MAX_ORDER_SIZE_VALUE_RANGE = 20; // $20
const MIN_ORDER_SIZE_INCREMENT_VALUE = 0.1; // $0.1


export class PairParamService {
  validateMos(mos: number | string, baseValue: number, baseDecimal: number): boolean {
    const mosValue = Number(mos);
    const mosValueInDollars = (mosValue / Math.pow(10, baseDecimal)) * baseValue;

    if (mosValueInDollars < MIN_ORDER_SIZE_VALUE_RANGE) {
        throw new Error(`MOS value ($${mosValueInDollars.toFixed(2)}) must be greater or equal to ${MIN_ORDER_SIZE_VALUE_RANGE}$.`);
    }
    if (mosValueInDollars > MAX_ORDER_SIZE_VALUE_RANGE) {
        throw new Error(`MOS value ($${mosValueInDollars.toFixed(2)}) must be less or equal to ${MAX_ORDER_SIZE_VALUE_RANGE}$.`);
    }
    return true;
  }

  validateMsi(msi: number | string, baseValue: number, baseDecimal: number): boolean {
    const msiValue = Number(msi);
    const msiValueInDollars = (msiValue / Math.pow(10, baseDecimal)) * baseValue;

    if (msiValueInDollars < MIN_ORDER_SIZE_INCREMENT_VALUE) {
        throw new Error(`MSI value ($${msiValueInDollars.toFixed(2)}) must be greater or equal to ${MIN_ORDER_SIZE_INCREMENT_VALUE}$.`);
    }
    return true;
  }

  validateMpi(
    mpi: number | string,
    baseValue: number,
    priceValue: number,
    priceDecimal: number,
  ): boolean {
    const mpiNumber = typeof mpi === 'string' ? parseFloat(mpi) : mpi;
    const realMpi = mpiNumber / Math.pow(10, priceDecimal);
    // MPI$ / base$ >= 0.003 <= 0.1

    const ratio = (realMpi * priceValue / baseValue) / 100;

    if (ratio > 0.1 || ratio < 0.003) {
      throw new Error(`MPI validation failed: ratio = ${ratio.toFixed(4)}, must be between 0.3 and 10 bps`);
    }
    return true;
  }

  validateMpiFactored(
    mpi: number | string,
    baseValue: number,
    priceValue: number
  ): boolean {
    const mpiNumber = typeof mpi === 'string' ? parseFloat(mpi) : mpi;
    const realMpi = mpiNumber / Math.pow(10, MAX_TOKEN_DECIMAL);  

    const ratio = (realMpi * priceValue / baseValue) * 100;

    if (ratio > 0.1 || ratio < 0.003) {
      throw new Error(`MPI (factored) validation failed: bps = ${(ratio * 100).toFixed(4)}, must be between 0.3 and 10 bps`);
    }
    return true;
  }

  validateMarketParameters(params: {
    baseDollarValue: number;
    priceDollarValue: number;
    baseDecimal: number;
    mos: number | string;
    msi: number | string;
    mpi: number | string;
  }) {
    const {
      baseDollarValue,
      priceDollarValue,
      baseDecimal,
      mos,
      msi,
      mpi,
    } = params;

    if (baseDollarValue <= 0) {
      throw new Error(`Invalid base token dollar value: ${baseDollarValue}`);
    }

    if (priceDollarValue <= 0) {
      throw new Error(`Invalid price token dollar value: ${priceDollarValue}`);
    }

    // Validate MOS
    this.validateMos(mos, baseDollarValue, baseDecimal);

    // Validate MSI
    this.validateMsi(msi, baseDollarValue, baseDecimal);

    // Validate MPI
    this.validateMpiFactored(mpi, baseDollarValue, priceDollarValue);

    return true; // All validations passed.
  }
}
