import { ActionSource, PromptTypeEnum, SeasonStatusEnum, TweetType } from '@enums';
import { IAccount, ICompany } from '@interfaces';

export interface ISocialAccount {
  address: string;
  companyId: number;
  account: IAccount;
  email?: string;
  originalEmail?: string;
  emailSentDate?: Date;
  randomHash?: string;
  emailVerified: boolean;
  totalTradingVolumeUsd: number;
  twitterAccount?: ITwitterAccount;
  telegramAccount?: ITelegramAccount;
  discordAccount?: IDiscordAccount;
  accountSeasonStats: IAccountSeasonStats[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITwitterAccount {
  address: string;
  companyId: number;
  account: ISocialAccount;
  twitterAccountSettings?: ITwitterAccountSettings;
  userName: string;
  twitterId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface ITwitterAccountSettings {
  address: string;
  companyId: number;
  twitterAccount: ITwitterAccount;
  refreshToken: string;
  canFollowAccounts: boolean;
  canCreateTweets: boolean;
  canLikeTweets: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITelegramAccount {
  address: string;
  companyId: number;
  account: ISocialAccount;
  telegramId: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IDiscordAccount {
  address: string;
  companyId: number;
  account: ISocialAccount;
  discordId: string;
  userName: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface ICompanyFollower {
  userName: string;
  companyId: number;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISocialSeason {
  id: number;
  companyId: number;
  startDate: Date;
  endDate?: Date;
  name: string;
  isSelected: boolean;
  status: SeasonStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAction {
  id: number;
  companyId: number;
  seasonId: number;
  socialSeason: ISocialSeason;
  source: ActionSource;
  name: string;
  description: string;
  points: number;
  enabled: boolean;
}

export interface IActionTemplate {
  id: number;
  source: ActionSource;
  name: string;
  description: string;
  points: number;
  enabled: boolean;
}

export interface IActionHistory {
  id: number;
  address: string;
  companyId: number;
  account: IAccountSeasonStats;
  actionId: number;
  seasonId: number;
  action: IAction;
  source: ActionSource;
  points: number;
  referenceId?: string;
  createdAt: Date;
}

export interface IUnlock {
  id: number;
  companyId: number;
  seasonId: number;
  socialSeason: ISocialSeason;
  name: string;
  description: string;
  points: number;
  enabled: boolean;
}

export interface IUnlockTemplate {
  id: number;
  name: string;
  description: string;
  points: number;
  enabled: boolean;
}

export interface IAccountSeasonStats {
  address: string;
  companyId: number;
  seasonId: number;
  socialSeason: ISocialSeason;
  socialAccount: ISocialAccount;
  points: number;
  tasksCompleted: number;
  unlocksAchieved: number;
}

export interface IPrompt {
  id: number;
  title: string;
  content: string;
  enabled: boolean;
  type: PromptTypeEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISystemPrompt extends IPrompt {
  default: boolean;
  weight: number;
}

export interface ICompanyPrompt extends IPrompt {
  companyId: number;
  company: ICompany;
}

export interface ICompanyChatGPTConfiguration {
  companyId: number;
  companyDescription: string;
  apiKey: string;
  enabled: boolean;
  company: ICompany;
}

export interface ICompanyTweet {
  id: string;
  companyId: number;
  seasonId: number;
  type: TweetType;
  text: string;
  enabled: boolean;
  isProcessed: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAIRequestQuota {
  address: string;
  companyId: number;
  socialAccount: ISocialAccount;
  requestCount: number;
  requestThreshold: number;
  requestDate: Date;
}

export interface IUltradeOldUserEmail {
  email: string;
}

