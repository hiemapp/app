import React, { MouseEvent, useRef } from 'react';
import { Box, Button, Tile, getPalette } from '@tjallingf/react-utils';
import { Icon } from '@tjallingf/react-utils';
import { type DeviceStateDisplay } from 'zylax';
import './DeviceDisplayButtons.scss';

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
        Object.fromEntries(display.buttons.map(button => [button.inputName, !!button.isActive])),
    );

    const handleClick = (e: MouseEvent, inputName: string) => {
        values.current[inputName] = !values.current[inputName];

        if(typeof onChange === 'function') {
            onChange.apply(null, [inputName, values.current[inputName]]);
        }
    };

    const renderButtons = () => {
        if (!display.buttons?.length) return null;
        
        return display.buttons.map(button => {
            let { icon, color, isActive, inputName } = button;
            const palette = getPalette(color, deviceColor);

            return (
                <Button
                    key={inputName}
                    variant="secondary"
                    square
                    size="sm"
                    active={isActive}
                    accent={palette[4]}
                    onClick={(e: MouseEvent) => handleClick(e, inputName)}
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
