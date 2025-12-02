
export interface InnerTxnBody {
  apan?: number;
  apap?: Uint8Array[];
  apsu?: Uint8Array[];
  amt?: number;
  fv: number;
  lv: number;
  rcv?: Uint8Array;
  snd: Uint8Array;
  type: 'appl' | 'pay';
}

export interface MainTxnBody {
  apaa: Uint8Array[];
  apat: Uint8Array[];
  apbx: Array<{ n: Uint8Array[] }>;
  apfa: number[];
  apid: number;
  fee: number;
  fv: number;
  gen: string;
  gh: Uint8Array;
  grp: Uint8Array;
  lv: number;
  note: Uint8Array;
  snd: Uint8Array;
  type: 'appl';
}

export interface InnerTransaction {
  'application-index'?: number;
  'pool-error': string;
  txn: { txn: InnerTxnBody };
}

export interface ConfirmedTxn {
  'confirmed-round': number;
  'inner-txns': InnerTransaction[];
  logs: Uint8Array[];
  'pool-error': string;
  txn: {
    sig: Uint8Array;
    txn: MainTxnBody;
  };
} 