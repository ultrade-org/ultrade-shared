export enum GlobalNotificationEnum {
  GLOBAL_PAIR_DELISTING = 'GLOBAL_PAIR_DELISTING',
  GLOBAL_NEW_PAIR_LISTING = 'GLOBAL_NEW_PAIR_LISTING',
  GLOBAL_SYSTEM_MAINTENANCE = 'GLOBAL_SYSTEM_MAINTENANCE',
  GLOBAL_SMART_CONTRACT_UPDATE = 'GLOBAL_SMART_CONTRACT_UPDATE',
}

export enum AccountNotificationEnum {
  ACCOUNT_POINTS_UNLOCK_ACHIEVEMENT = 'ACCOUNT_POINTS_UNLOCK_ACHIEVEMENT',
  ACCOUNT_KYC_STATUS_CHANGED = 'ACCOUNT_KYC_STATUS_CHANGED',
  ACCOUNT_AFFILIATE_DASHBOARD_UNLOCKED = 'ACCOUNT_AFFILIATE_DASHBOARD_UNLOCKED',
}

export const CombinedNotificationEnum = {
  ...GlobalNotificationEnum,
  ...AccountNotificationEnum,
};

export type CombinedNotificationEnumType = keyof typeof CombinedNotificationEnum;

export type NotificationType = `${GlobalNotificationEnum}` | `${AccountNotificationEnum}`;

export enum NotificationPriorityEnum {
  CRITICAL = 'CRITICAL',
  IMPORTANT = 'IMPORTANT',
  INFO = 'INFO',
}

export enum NotificationStatusEnum {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export enum ScheduledNotificationStatusEnum {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}
