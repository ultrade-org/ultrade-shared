import { LastLookAction } from "@enums";

export interface LastLookTrade {
  userId: string;
  tradeId: number;
  tradeAmount: string;
  tradePrice: string;
  orderId: number;
  action: LastLookAction;
  timeout: number;
}