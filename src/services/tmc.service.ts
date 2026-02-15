export interface IEvmChainInfo {
  providerUrl: string;
  token: string;
  tmc: string;
  dispencer: string;
  wss: string;
  chainId: string;
  whChainId: string;
}

type WHConfig = Partial<{
  [key: number]: string;
}>;

// TODO: This is shit, we need to refine it including "active" flag in database and remove garbage functions
// Also currently Solana marked as EMV chain in DB, need to fix it
// Check relayer configs (blockchain facade service, listeners), dispencer, fe, and etc.
export class TMCManager {
  private tmcContracts: Array<IEvmChainInfo>;
  private tmcContractsByWhId: Map<number, IEvmChainInfo>;

  constructor(tmcStrOrArr: string | Array<IEvmChainInfo>) {
    const tmcContracts = typeof tmcStrOrArr === "string" ? JSON.parse(tmcStrOrArr) : tmcStrOrArr;
    this.tmcContracts = tmcContracts;
    this.tmcContractsByWhId = new Map(this.tmcContracts.map((tmc) => [Number(tmc.whChainId), tmc]));
  }

  private hexZeroPad(hexString, length) {
    if (hexString.startsWith('0x')) {
      hexString = hexString.slice(2);
    }

    const zerosNeeded = length * 2 - hexString.length;
    if (zerosNeeded < 0) {
      throw new Error('Hex string is longer than the provided length');
    }
    return '0x' + '0'.repeat(zerosNeeded) + hexString;
  }

  public isSupportedEvmTmcChain(chainId: number): Boolean {
    if (this.tmcContractsByWhId.get(chainId)) return true;
    return false;
  }

  public isEVMTMC(chainId: number, emitter: string): Boolean {
    if (chainId == 1 || chainId == 8) return false;
    if (!this.isSupportedEvmTmcChain(chainId)) return false;
    const tmc = this.getTMC(chainId);
    if (!tmc) return false;
    if (emitter.toLowerCase() == tmc.toLowerCase()) return true;
    return false;
  }

  public getTMC(chainId: number): string | undefined {
    return this.tmcContractsByWhId.get(chainId)?.tmc;
  }

  public getDispencer(chainId: number): string | undefined {
    return this.tmcContractsByWhId.get(chainId)?.dispencer;
  }

  public getProviderUrl(chainId: number): string | undefined {
    return this.tmcContractsByWhId.get(chainId)?.providerUrl;
  }

  public getWssUrl(chainId: number): string | undefined {
    return this.tmcContractsByWhId.get(chainId)?.wss;
  }

  public getTmcContracts(): Map<number, IEvmChainInfo> {
    return this.tmcContractsByWhId;
  }

  public getTmcAddresses(): Array<string> {
    return this.tmcContracts.map((tmc) => tmc.tmc).filter((tmc) => !!tmc);
  }

  public getAvailableChains(): Array<string> {
    return this.tmcContracts.filter((tmc) => !!tmc.tmc).map((tmc) => tmc.chainId);
  }

  public getAvailableWhChains(): Array<number> {
    return this.tmcContracts.filter((tmc) => !!tmc.tmc).map((tmc) => Number(tmc.whChainId));
  }

  public getTmcRelayerConfig(): WHConfig {
    return this.tmcContracts.reduce((config, item) => {
      if (!!item.tmc) {
        config[Number(item.whChainId)] = item.tmc;
      }
      return config;
    }, {});
  }

  public getAvaibleEvmChainIds(): Array<number> {
    //TODO: replace Number(tmc.chainId) with tmc.isEvm
    return this.tmcContracts.filter((tmc) => !!tmc.tmc && Number(tmc.chainId)).map((tmc) => Number(tmc.chainId));
  }

  public getTmcByEvmChainId(chainId: number): string {
    const found = this.tmcContracts.find((config) => Number(config.chainId) === chainId);
    return found!.tmc;
  }

  public getTmcEvmMap(): Map<number, IEvmChainInfo> {
    return new Map(this.tmcContracts.filter(tmc => !!tmc.tmc).map((tmc) => [Number(tmc.chainId), tmc]));
  }
}
