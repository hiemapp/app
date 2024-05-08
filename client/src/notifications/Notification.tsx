import { Box, Icon } from '@tjallingf/react-utils';
import './Notification.scss';
import { FormattedMessage } from 'react-intl';

export interface NotificationData {
    id: string;
    icon: string;
    color: string;
    level: string;
    priority: number;
    message: { 
        id: string;
        values?: Record<string, any>;
    } | string | number | boolean | undefined | null | any[]
}

export interface NotificationProps extends React.PropsWithChildren {
    data: NotificationData,
    showDuration: number;
}

const Notification: React.FunctionComponent<NotificationProps> = ({
    data, showDuration
}) => {
    function renderMessage() {
        if(!data || typeof data.message === 'undefined' || data.message === null) {
            return null;
        }

        if (typeof data.message === 'string' || typeof data.message === 'boolean' || typeof data.message === 'number') {
            return data.message;
        }

        if (typeof data.message === 'object') {
            if('id' in data.message && typeof data.message.id === 'string') {
                return <FormattedMessage id={data.message.id} values={data.message.values} />
            }
        }

        if(typeof data.message.toString === 'function') {
            return data.message.toString();
        }

        return null;
    }   

    return (
        <Box 
            direction="row" 
            className="Notification" 
            align={null!} 
            justify={null!} 
            style={{'--Notification-show-duration': `${showDuration}ms`} as React.CSSProperties}>
            <Box className="Notification__icon-wrapper" direction="column" justify="center" align="center">
                <Icon className="Notification__icon" id={data.icon} color={data.color} />
            </Box>
            <span className="Notification__message">
                {renderMessage()}
            </span>
        </Box>
    )
}

export default Notification;