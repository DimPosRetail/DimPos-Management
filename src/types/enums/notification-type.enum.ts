export const NotificationTypeEnum = {
    Information : 0,
    Error : 1,
} as const;
export type TNotificationTypeEnum = typeof NotificationTypeEnum[keyof typeof NotificationTypeEnum];