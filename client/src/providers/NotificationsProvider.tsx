import { useState } from 'react';
import NotificationsContext from '@/contexts/NotificationsContext';

export interface INotificationsProviderProps {
    children?: React.ReactNode;
}

const NotificationsProvider: React.FunctionComponent<INotificationsProviderProps> = ({ children }) => {
    const [ notifications, setNotifications ] = useState<any[]>([]);
    
    return <NotificationsContext.Provider value={{ notifications, setNotifications }}>{children}</NotificationsContext.Provider>;
};

export default NotificationsProvider;
