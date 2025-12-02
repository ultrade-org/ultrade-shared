export enum FeeTier {
  FEE_TIER_1 = 1,
  FEE_TIER_2,
  FEE_TIER_3,
  FEE_TIER_4,
  FEE_TIER_5,
  FEE_TIER_6,
}

export enum LastLookAction {
  Approve = 1,
  Reject = 0,
}

export enum KYCAuthenticationStatus {
  INITIATED = 'INITIATED',
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
