import { DeviceMenuProps } from '../../DeviceMenuContainer/DeviceMenuContainer';
import DeviceMenuButton from '../../DeviceMenu/DeviceMenuButton';
import './OpenCloseMenu.scss';

const OpenCloseMenu: React.FunctionComponent<DeviceMenuProps> = ({
    execute, options
}) => {
    return (
        <div className="OpenCloseMenu">
            <div className="OpenCloseMenu__box">
                <DeviceMenuButton 
                    rounded="top"
                    onClick={() => execute('open', {})}
                    icon="arrow-up" />
                {options.stoppable && (
                    <DeviceMenuButton 
                        rounded="none"
                        onClick={() => execute('stop', {})}
                        icon="stop" />
                )}
                <DeviceMenuButton 
                    rounded="bottom"
                    onClick={() => execute('close', {})}
                    icon="arrow-down" />
            </div>
        </div>
    )
}

export default OpenCloseMenu;