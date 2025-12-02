import { AccountInfo } from '@interfaces';

export interface SocialAccountInfo extends AccountInfo {
  companyId: number;
  companyWallet?: string;
}

export type SaveCompanyTweet = {
  tweetId: string;
  companyId: number;
  createdAt: Date;
  text: string;
  isProcessed: boolean; //default false
  isComment: boolean;
  expiresAt?: Date;
  seasonId: number;
};

export type ConnectTelegram = {
  telegramId: string;
  userName: string;
  companyId: number;
};

export type TwitterAccSettings = {
  refreshToken?: string;
  canFollowAccounts: boolean;
  canCreateTweets: boolean;
  canLikeTweets: boolean;
};

export type ConnectTwitter = {
  userName: string;
  address: string;
  id: string;
  name: string;
  companyId: number;
  settings: TwitterAccSettings;
};

export type ConnectDiscord = {
  userName: string;
  id: string;
  name: string;
  companyId: number;
};

export type SaveAction<ActionType> = {
  socialId?: string;
  userName?: string;
  actionId: ActionType;
  companyId: number;
  referenceId?: string;
  seasonId: number;
};

