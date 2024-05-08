import useAuth from '@/hooks/useAuth';
import { memo, useEffect, useMemo, useState } from 'react';
import { Icon, Button, Box, Tile, colors, getPalette } from '@tjallingf/react-utils';
import classNames from 'classnames';
import './Device.scss';
import DeviceDisplayTile from '../DeviceDisplayTile';
import DeviceDisplayButtons from '../DeviceDisplayButtons';
import DeviceDisplayRecording from '../DeviceDisplayRecording';
import DeviceDisplayText from '../DeviceDisplayText/DeviceDisplayText';
import type { DeviceType } from 'zylax';
import { renderElement } from '@/utils/uilib/renderElement';
import Modal from '@/components/Modal';
import useSocket from '@/hooks/useSocket';
import useSocketEvent from '@/hooks/useSocketEvent';
import _ from 'lodash';

const DOM_EVENT_INCLUDE_KEYS = [
    'altKey',
    'ctrlKey',
    'metaKey',
    'button',
    'buttons',
    'keyCode',
    'key'
];

export interface DeviceProps {
    data: DeviceType['serializedProps'];
    dataUpdatedAt: number;
    handleInput: (name: string, value: any) => unknown
}

const Device: React.FunctionComponent<DeviceProps> = memo(({ data, handleInput }) => {
    const { id, state, color, name, icon, connection } = data;
    const { user } = useAuth();
    const [ menuContent, setMenuContent ] = useState(state.menu);
    const [ menuVisible, setMenuVisible ] = useState(false);
    const socket = useSocket();

    useEffect(() => {
        setMenuContent(state.menu);
    }, [ state.menu ]);
    
    useSocketEvent('device:update:menu', e => {
        if(e.deviceId !== id) return;
        setMenuContent(e.menu);
    })

    const stateDisplay = useMemo(() => {
        if (!state?.display) return null;

        if (state.display.buttons?.length && user.hasPermission(`device.${id}.input`)) {
            return <DeviceDisplayButtons display={state.display} onChange={handleInput} deviceColor={color} />;
        }

        if (state.display.tile && user.hasPermission(`device.${id}.view`)) {
            return <DeviceDisplayTile display={state.display} deviceColor={color} />;
        }

        if (state.display.recording && user.hasPermission(`device.${id}.records.view`)) {
            return <DeviceDisplayRecording display={state.display} deviceColor={color} id={id} />;
        }

        if (state.display.text) {
            return <DeviceDisplayText display={state.display} deviceColor={color} id={id} />;
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

    const renderMenu = () => {
        if(!menuContent) return null;
        const content = renderElement(menuContent, (callbackId, childIndex, args) => {
            // Replace any args that are not primitive
            args = args.map(a => {
                if(a && typeof a === 'object') {
                    if(a.nativeEvent instanceof Event) {
                        return _.pick(a.nativeEvent, DOM_EVENT_INCLUDE_KEYS);
                    }

                    return null;
                }

                return a;
            });

            socket.emit('device:menuevent', {
                deviceId: data.id,
                callbackId: callbackId,
                childIndex: childIndex,
                args: args
            })
        });

        return (
            <Modal 
                isOpen={menuVisible}
                shouldCloseOnOverlayClick={true} 
                onRequestClose={() => setMenuVisible(false)}>
                {content}
            </Modal>
        )
    }

    return (
        <>
            <Tile
                size="lg"
                onClick={() => setMenuVisible(true)}
                className={classNames('Device', { 
                    'Device--active': state?.isActive, 
                    'Device--with-menu': menuContent
                })}
                tabIndex={menuContent ? 0 : undefined}
                role={menuContent ? 'button' : undefined}
                style={
                    {
                        '--Device--active-background-start': getPalette(color)[2],
                        '--Device--active-background-stop': getPalette(color)[3],
                        '--Device--active-color': colors.TEXT_DARK,
                    } as React.CSSProperties
                }
            >
                <Box direction="column" className="overflow-hidden mw-100" gutterY={1}>
                    <Tile.Title className="overflow-hidden mw-100 Device__header">
                        <Box gutterX={1} align="center" className="overflow-hidden mw-100">
                            <div className="Device__icon-wrapper">
                                <Icon id={icon} size={20} weight="light" className="Device__icon-spacer" />
                                <Icon id={icon} size={20} weight="light" className="Device__icon Device--inactive__icon" />
                                <Icon id={icon} size={20} weight="solid" className="Device__icon Device--active__icon" />
                            </div>
                            <span className="text-truncate ms-2">{name}</span>
                            {error && (
                                <>
                                    <Icon id={error.icon} size={12} weight="solid" />
                                    <span title={error.message}>info</span>
                                </>
                            )}
                        </Box>
                    </Tile.Title>
                    <Box gutterX={1} gutterY={1} wrap="wrap" className="Device__display">
                        {stateDisplay}
                    </Box>
                </Box>
            </Tile>
            {renderMenu()}
        </>
    );
}, (prev, next) => prev.dataUpdatedAt === next.dataUpdatedAt);

export default Device;
