import React, { createContext } from 'react';
import { NotificationData } from '@/components/notifications/Notification/Notification';

export interface INotificationsContext {
    notifications: NotificationData[];
    setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>;
}

const NotificationsContext = createContext({} as INotificationsContext);
export default NotificationsContext;
