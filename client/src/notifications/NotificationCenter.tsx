import useSocketEvent from '@/hooks/useSocketEvent';
import { useState } from 'react';
import Notification from './Notification';
import _ from 'lodash';
import './NotificationCenter.scss'
import { Box } from '@tjallingf/react-utils';

const NOTIFICATION_SHOW_DURATION = 5000;

const NotificationCenter: React.FunctionComponent = () => {
    const [ notifications, setNotifications ] = useState<any[]>([]);


    useSocketEvent('notification', n => {
        setNotifications(notifications => {
            notifications.unshift(n);
            return [...notifications];
        })

        setTimeout(() => {
            setNotifications(notifications => {
                return notifications.filter(n2 => n.id !== n2.id);
            })
        }, NOTIFICATION_SHOW_DURATION + 1000);
    })

    return (
        <Box className="NotificationCenter" direction="column" align={null!}>
            {notifications.map(data => (
                <Notification key={data.id} data={data} showDuration={NOTIFICATION_SHOW_DURATION} />            
            ))}
        </Box>
    )
}

export default NotificationCenter;