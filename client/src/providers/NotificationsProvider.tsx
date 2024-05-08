import { useState } from 'react';
import NotificationsContext from '@/contexts/NotificationsContext';

export interface INotificationsProviderProps {
    children?: React.ReactNode;
}

const NotificationsProvider: React.FunctionComponent<INotificationsProviderProps> = ({ children }) => {
    const [ notifications, setNotifications ] = useState<any[]>([]);
    let [ handler ] = useState(null);
    
    return <NotificationsContext.Provider value={{ notifications, setNotifications, handler }}>{children}</NotificationsContext.Provider>;
};

export default NotificationsProvider;
