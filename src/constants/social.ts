import { ITwitterAccountSettings } from '@interfaces';
import { ActionEnum, TwitterAction } from '@enums';

export const twitterActionToPermissionMap: Record<TwitterAction, keyof ITwitterAccountSettings> = {
  [ActionEnum.TWITTER_FOLLOW]: 'canFollowAccounts',
  [ActionEnum.TWITTER_LIKE]: 'canLikeTweets',
  [ActionEnum.TWITTER_REPLY]: 'canCreateTweets',
  [ActionEnum.TWITTER_RETWEET]: 'canCreateTweets',
};
