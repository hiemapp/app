import useAuth from '@/hooks/useAuth';
import { useState, useMemo } from 'react';
import { Button, Box, Tile, colors, colorpalettes } from '@tjallingf/react-utils';
import Icon from '@/components/Icon/Icon';
import classNames from 'classnames';
import fetchQuery from '@/utils/fetchQuery';
import './Device.scss';
import DeviceDisplayTile from '../DeviceDisplayTile';
import DeviceDisplayButtons from '../DeviceDisplayButtons';
import DeviceStateDisplayRecording from '../DeviceStateDisplayRecording';
import useSocketEvent from '@/hooks/useSocketEvent';
import { trpc } from '@/utils/trpc';
import { type DevicePropsSerialized } from 'zylax/types/devices/Device';

const { textDark } = colors;

const Device: React.FunctionComponent<DevicePropsSerialized> = (props) => {
    const [updatedProps, setUpdatedProps] = useState<DevicePropsSerialized>(props);
    const { id, state, color, name, icon, connection } = updatedProps;
    const { user } = useAuth();
    const isActive = state?.isActive;
    const input = trpc.device.handleInput.useMutation();

    useSocketEvent('devices:change', (e) => {
        if (e.device.id !== props.id) return;
        setUpdatedProps(e.device);
    });

    function handleInput(name: string, value: any) {
        input.mutate({ 
            id: props.id, 
            values: [{ name, value }]
        });
    }

    const stateDisplay = useMemo(() => {
        if (!state?.display) return null;

        if (state.display.buttons?.length && user.hasPermission(`devices.${id}.input`)) {
            return <DeviceDisplayButtons display={state.display} onChange={handleInput} deviceColor={color} />;
        }

        if (state.display.tile && user.hasPermission(`devices.${id}.view`)) {
            return <DeviceDisplayTile display={state.display} onChange={handleInput} deviceColor={color} />;
        }

        if (state.display.recording && user.hasPermission(`devices.${id}.records.view`)) {
            return <DeviceStateDisplayRecording display={state.display} deviceColor={color} id={id} />;
        }
    }, []);

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
            className={classNames('Device', { 'Device--active': isActive })}
            style={
                {
                    '--Device--active-background-start': colorpalettes[color][2],
                    '--Device--active-background-stop': colorpalettes[color][3],
                    '--Device--active-color': textDark,
                } as React.CSSProperties
            }
        >
            <Box direction="column" className="overflow-hidden mw-100">
                <Tile.Title className="overflow-hidden mw-100 Device__header">
                    <Button to={`/devices/${id}`} variant="unstyled" size="md" className="overflow-hidden mw-100 p-1">
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
};

export default Device;
