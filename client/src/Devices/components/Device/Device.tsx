import useAuth from '@/hooks/useAuth';
import { memo, useMemo } from 'react';
import { Button, Box, Tile, colors, findColorPalette } from '@tjallingf/react-utils';
import { Icon } from '@tjallingf/react-utils';
import classNames from 'classnames';
import fetchQuery from '@/utils/fetchQuery';
import './Device.scss';
import DeviceDisplayTile from '../DeviceDisplayTile';
import DeviceDisplayButtons from '../DeviceDisplayButtons';
import DeviceStateDisplayRecording from '../DeviceStateDisplayRecording';
import type { DevicePropsSerialized } from 'zylax';
const { textDark } = colors;

export interface DeviceProps {
    data: DevicePropsSerialized;
    dataUpdatedAt: number;
    handleInput: (name: string, value: any) => unknown
}

const Device: React.FunctionComponent<DeviceProps> = memo(({ data, handleInput }) => {
    const { id, state, color, name, icon, connection } = data;
    const { user } = useAuth();
    const isActive = state?.isActive;

    const stateDisplay = useMemo(() => {
        if (!state?.display) return null;

        if (state.display.buttons?.length && user.hasPermissionKey(`device.${id}.input`)) {
            return <DeviceDisplayButtons display={state.display} onChange={handleInput} deviceColor={color} />;
        }

        if (state.display.tile && user.hasPermissionKey(`device.${id}.view`)) {
            return <DeviceDisplayTile display={state.display} onChange={handleInput} deviceColor={color} />;
        }

        if (state.display.recording && user.hasPermissionKey(`device.${id}.records.view`)) {
            return <DeviceStateDisplayRecording display={state.display} deviceColor={color} id={id} />;
        }
    }, [ state.display ]);

    const error: { icon: string; message: string } | null = (() => {
        if (!connection.exists) {
            return { icon: 'bolt-slash', message: 'No connection can be found' };
        }

        if (!connection.isOpen) {
            return { icon: 'bolt', message: 'Connection was found, but is not open.' };
        }

        return null;
    })();

    return (
        <Tile
            size="lg"
            className={classNames('Device', { 'Device--active': isActive })}
            style={
                {
                    '--Device--active-background-start': findColorPalette(color)[2],
                    '--Device--active-background-stop': findColorPalette(color)[3],
                    '--Device--active-color': textDark,
                } as React.CSSProperties
            }
        >
            <Box direction="column" className="overflow-hidden mw-100" gutterY={1}>
                <Tile.Title className="overflow-hidden mw-100 Device__header">
                    <Button to={`/devices/${id}`} variant="unstyled" size="md" className="overflow-hidden mw-100 p-0">
                        <Box gutterX={1} align="center" className="overflow-hidden mw-100">
                            <Icon id={icon} size={20} weight={isActive ? 'solid' : 'light'} />
                            <span className="text-truncate ms-2">{name}</span>
                            {error && (
                                <>
                                    <Icon id={error.icon} size={12} weight="solid" />
                                    <span title={error.message}>info</span>
                                </>
                            )}
                        </Box>
                    </Button>
                </Tile.Title>
                <Box gutterX={1} gutterY={1} wrap="wrap" className="Device__display">
                    {stateDisplay}
                </Box>
            </Box>
        </Tile>
    );
}, (prev, next) => prev.dataUpdatedAt === next.dataUpdatedAt);

export default Device;
