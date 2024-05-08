import { useContext, useEffect, useRef } from 'react';
import useSocketEvent from './useSocketEvent';
import NotificationsContext from '@/contexts/NotificationsContext';
import { NotificationData } from '@/components/notifications/Notification/Notification';
import { v4 as uuidv4 } from 'uuid';

const useNotifications = (handler?: (notification: NotificationData) => unknown) => {
    const ctx = useContext(NotificationsContext);
    
    useEffect(() => {
        if(typeof handler !== 'function') return;
        ctx.handler = handler;
    });

    useSocketEvent('notification', notification => {
        handleReceive(notification);
    })

    const handleReceive = (notification: NotificationData) => {
        if(typeof ctx.handler !== 'function') return;
        ctx.handler(notification);
    }

    const show = (notification: Omit<NotificationData, 'id'>) => {
        return handleReceive({ ...notification, id: uuidv4() });
    }

    return { 
        ...ctx,
        show
    }
}

export default useNotifications;