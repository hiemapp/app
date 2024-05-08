import Notification, { NotificationData } from '../Notification/Notification';
import './NotificationCenter.scss'
import { Box } from '@tjallingf/react-utils';
import isEqual from 'lodash/isEqual';
import useNotifications from '@/hooks/useNotifications';
import { useEffect } from 'react';

const NOTIFICATION_SHOW_DURATION = 5000;

const NotificationCenter: React.FunctionComponent = () => {
    let { notifications, setNotifications } = useNotifications(handleReceive);

    function handleReceive(n: NotificationData) {
        setNotifications(notifications => {
            notifications.unshift(n);
            return [...notifications];
        })

        setTimeout(() => {
            setNotifications(nots => nots.filter(n2 => n.id !== n2.id))
        }, NOTIFICATION_SHOW_DURATION + 1000);
    }

    return (
        <Box className="NotificationCenter" direction="column" align={null!}>
            {notifications.map(data => (
                <Notification key={data.id} data={data} showDuration={NOTIFICATION_SHOW_DURATION} />            
            ))}
        </Box>
    )
}

export default NotificationCenter;