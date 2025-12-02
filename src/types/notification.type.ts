import { NotificationPriorityEnum, NotificationStatusEnum, NotificationType } from "@enums";

export type Notification = {
  id: number | null;
  globalNotificationId: number | null;
  priority: NotificationPriorityEnum;
  status: NotificationStatusEnum;
  type: NotificationType;
  message: string;
  createdAt: Date;
};
