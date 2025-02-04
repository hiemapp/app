import { DeviceMenuProps } from '../../DeviceMenuContainer/DeviceMenuContainer';
import DeviceMenuButton from '../../DeviceMenu/DeviceMenuButton';
import './OpenCloseMenu.scss';

const OpenCloseMenu: React.FunctionComponent<DeviceMenuProps> = ({
    execute, options
}) => {
    return (
        <div className="OpenCloseMenu">
            <DeviceMenuButton 
                onClick={() => execute('open', {})}
                icon="arrow-up" />
            {options.stoppable && (
                <DeviceMenuButton 
                    onClick={() => execute('stop', {})}
                    icon="stop" />
            )}
            <DeviceMenuButton 
                onClick={() => execute('close', {})}
                icon="arrow-down" />
        </div>
    )
}

export default OpenCloseMenu;