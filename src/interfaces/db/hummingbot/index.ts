import { HummingbotInstanceStatus } from '@types';
import { IUser } from '@interfaces';

export interface IStrategy {
  id: number;
  name: string;
  description: string;
  configTemplate: string;
}

export interface IHummingbotInstance {
  id: number;
  awsId: string | null;
  partner: IUser | number;
  strategy: IStrategy | number;
  configHash: string;
  status: HummingbotInstanceStatus;
  createdAt: Date;
  updatedAt: Date;
}



