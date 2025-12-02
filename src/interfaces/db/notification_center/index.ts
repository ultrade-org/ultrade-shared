import {
  GlobalNotificationEnum,
  NotificationPriorityEnum,
  NotificationStatusEnum,
  NotificationType,
  ScheduledNotificationStatusEnum,
} from '@enums';
import { IAccount } from '@interfaces';

export interface INotificationModel {
  id: number;
  priority: NotificationPriorityEnum;
  message: string;
  referenceId?: number;
  companyId: number;
  createdAt: Date;
}

export interface IGlobalNotification extends INotificationModel {
  type: GlobalNotificationEnum;
}

export interface IScheduledNotification extends INotificationModel {
  type: GlobalNotificationEnum;
  scheduledAt: Date;
  status: ScheduledNotificationStatusEnum;
}

export interface IUserNotification extends INotificationModel {
  account: IAccount;
  address: string;
  type: NotificationType;
  status: NotificationStatusEnum;
  globalNotificationId?: number;
  globalNotification: IGlobalNotification;
}

export interface INotificationTemplate {
  type: NotificationType;
  priority: NotificationPriorityEnum;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}



