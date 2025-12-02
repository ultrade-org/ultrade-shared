export interface ITransferDto {
  transferId: number;
  senderAddress: string;
  recipientAddress: string;
  tokenId: number;
  amount: string;
  status: string;
  expiredAt: Date;
  whitelistId: number | null;
  txnId: string | null;
  completedAt: Date | null;
}