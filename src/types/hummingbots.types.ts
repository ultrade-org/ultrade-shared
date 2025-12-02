import { IHummingbotInstance } from '@interfaces';

export interface HummingbotUserData {
  password: string;
  tradingKey: string;
  loginAddress: string;
  mnemonic: string;
}

export interface HummingbotStrategyBase {
  strategy: string;
  [key: string]: any;
}

export interface HummingbotStrategy extends HummingbotStrategyBase {
  id: number;
}

export enum HummingbotInstanceStatus {
  PREPARING = 'provisioning',
  STOPPING = 'stopping',
  RUNNING = 'running',
  STOPPED = 'stopped',
  FAILED = 'failed',
}

export type CreateHummingbotInstanceDto = Omit<IHummingbotInstance, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateStrategyDto = Omit<HummingbotStrategy, 'id'>;