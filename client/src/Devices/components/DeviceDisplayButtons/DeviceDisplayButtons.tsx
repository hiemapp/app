import React, { MouseEvent, useRef } from 'react';
import { Box, Button, Tile } from '@tjallingf/react-utils';
import { Icon } from '@tjallingf/react-utils';
import { type DeviceStateDisplay } from 'zylax/types/devices/DeviceState';

export interface IDeviceDisplayButtonsProps {
    onChange?(name: string, value: any): void;
    display: DeviceStateDisplay;
    deviceColor: string;
}

const DeviceDisplayButtons: React.FunctionComponent<IDeviceDisplayButtonsProps> = ({
    onChange,
    display,
    deviceColor,
}) => {
    if (!display.buttons?.length) return null;

    const values = useRef<{ [key: string]: boolean }>(
        Object.fromEntries(display.buttons.map((button) => [button.input, !!button.isActive])),
    );

    const handleClick = (e: MouseEvent, input: string) => {
        values.current[input] = !values.current[input];
        onChange?.apply(null, [input, values.current[input]]);
    };

    const renderButtons = () => {
        if(!display.buttons?.length) return [];
        return display.buttons.map((button) => {
            let { icon, color, isActive, input } = button;

            if(typeof color !== 'string' || color === 'auto') {
                color = deviceColor;
            }

            return (
                <Button
                    key={input}
                    variant="secondary"
                    square
                    size="sm"
                    active={isActive}
                    primary={color}
                    onClick={(e: MouseEvent) => handleClick(e, input)}
                >
                    {icon && <Icon id={icon} weight={isActive ? 'solid' : 'light'} />}
                </Button>
            );
        });
    };

    return (
        <Tile className="DeviceDisplayButtons" size="sm">
            <Box gutterX={2} gutterY={2} wrap="wrap">
                {renderButtons()}
            </Box>
        </Tile>
    );
};

export default DeviceDisplayButtons;
