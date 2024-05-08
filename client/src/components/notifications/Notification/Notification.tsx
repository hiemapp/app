import { Box, Icon, getPalette } from '@tjallingf/react-utils';
import './Notification.scss';
import { FormattedMessage } from 'react-intl';

export interface NotificationData {
    id: string;
    icon?: string;
    palette?: string;
    level?: string;
    message?: { 
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
    const palette = getPalette(data.palette, 'blue');

    function renderMessage() {
        if(!data || typeof data.message === 'undefined' || data.message === null) {
            return null;
        }

        if (typeof data.message === 'string' || typeof data.message === 'boolean' || typeof data.message === 'number') {
            return data.message;
        }

        console.log(data.message);

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
        style={{
            '--Notification-show-duration': `${showDuration}ms`,
            '--Notification-accent': palette[4].value()
        } as React.CSSProperties}>
            <Box className="Notification__icon-wrapper" direction="column" justify="center" align="center">
                <Icon className="Notification__icon" id={data.icon ?? 'circle-info'} weight="solid" />
            </Box>
            <span className="Notification__message">
                {renderMessage()}
            </span>
            <div className="Notification__background"></div>
        </Box>
    )
}

export default Notification;