import { Button, Icon } from '@tjallingf/react-utils';
import classNames from 'classnames';
import './DeviceMenuButton.scss';

export interface DeviceMenuButtonProps extends React.PropsWithChildren {
    onClick: (e: any) => unknown;
    icon: string;
    rounded?: 'top' | 'right' | 'bottom' | 'left' | 'all';  
}

const DeviceMenuButton: React.FunctionComponent<DeviceMenuButtonProps> = ({
    onClick, 
    icon, 
    rounded = 'all'
}) => {
    return (
        <Button 
            className={classNames('DeviceMenuButton', `DeviceMenuButton--rounded-${rounded}`)}
            onClick={onClick}>
            <Icon id={icon} size={36} />
        </Button>
    )
}

export default DeviceMenuButton;