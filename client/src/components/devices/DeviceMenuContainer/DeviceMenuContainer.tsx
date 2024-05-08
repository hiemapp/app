import React from 'react';
import { DevicePropsSerialized } from 'hiem';
import OpenCloseMenu from '../menus/OpenCloseMenu';
import ColorMenu from '../menus/ColorMenu';
import './DeviceMenuContainer.scss';
import { Box, Palette } from '@tjallingf/react-utils';

const MENU_COMPONENTS: Record<string, React.FC<DeviceMenuProps>> = {
    'OpenCloseTrait': OpenCloseMenu,
    'ColorTrait': ColorMenu
}

export interface DeviceMenuContainerProps extends React.PropsWithChildren {
    traits: DevicePropsSerialized['traits'];
    execute: (command: string, params: any, doVibrate?: boolean) => unknown;
    palette: Palette;
    device: DevicePropsSerialized
}

export interface DeviceMenuProps extends DeviceMenuContainerProps{
    options: any;
}


const DeviceMenuContainer: React.FunctionComponent<DeviceMenuContainerProps> = (props) => {
    const { traits, palette } = props;

    const renderMenu = () => {
        const trait = traits[0];
        if(!trait) return null;

        const MenuComponent = MENU_COMPONENTS[trait.name];
        if(typeof MenuComponent !== 'function') return null;

        return <MenuComponent {...props} options={trait.options} />
    }

    return (
        <Box 
            className="DeviceMenuContainer" 
            direction="column"
            style={{
                '--DeviceMenuContainer-accent-7': palette[7],
                '--DeviceMenuContainer-accent-5': palette[5],
                '--DeviceMenuContainer-accent-1': palette[1]
            } as React.CSSProperties}>
            <div className="DeviceMenuContainer__content">
                {renderMenu()}
            </div>
        </Box>
    )
}

export default DeviceMenuContainer;