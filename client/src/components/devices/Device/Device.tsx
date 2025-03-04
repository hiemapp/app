import useAuth from '@/hooks/useAuth';
import { useRef, useState } from 'react';
import { Icon, Box, getPalette, Button } from '@tjallingf/react-utils';
import classNames from 'classnames';
import './Device.scss';
import DeviceDisplayRecord from '../DeviceDisplayRecord';
import DeviceDisplayTextList from '../DeviceDisplayTextList';
import type { Device as DeviceModel, InferSchema } from 'hiem';
import Modal from '@/components/Modal';
import { trpc } from '@/utils/trpc/trpc';
import { findTraitOption, hasTrait } from '@/utils/traits';
import DeviceMenuContainer from '../DeviceMenuContainer';
import { useNavigate } from 'react-router';
import DeviceRichDisplay from '@/components/devices/DeviceRichDisplay';
import HomeController from '@/utils/homes/HomeController';
import useNotifications from '@/hooks/useNotifications';

export interface DeviceProps {
    data: InferSchema<DeviceModel>;
    dataUpdatedAt: number;
}

const Device: React.FunctionComponent<DeviceProps> = ({ data }) => {
    const { id, display, color, name, icon, isConnected, traits, options } = data;
    const palette = getPalette(color);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const home = HomeController.findCurrent();
    const notifications = useNotifications();
    
    const hasMenu = hasTrait(traits, trait => trait.config.menu && !trait.options.sensor);
    const hasRecords = (options?.recording?.enabled === true);
    const primaryAction = findTraitOption(traits, 'primaryAction');
    const sensor = findTraitOption(traits, 'sensor');

    const { user } = useAuth();
    const [ menuVisible, setMenuVisible ] = useState(false);
    const executeMutation = trpc.device.execute.useMutation();
    const navigate = useNavigate();
    
    const error = (() => {
        if(!isConnected) {
            return { icon: 'wifi-slash' };
        }
    })()

    const execute = (command: string, params: any, doVibrate: boolean = true) => {
        if(doVibrate) {
            navigator.vibrate(100);
        }

        executeMutation.mutate({
            id: id,
            commands: [
                {
                    name: command,
                    params: params
                }
            ]
        })
    }

    const handleClick = () => {
        if(hasMenu) {
            setMenuVisible(true);
            return;
        }
        
        if(typeof primaryAction?.command === 'string' && sensor !== true) {
            execute(primaryAction.command, primaryAction.params);
            return;
        }
    }

    const renderStateDisplay = () => {
        if (!display?.content) return null;

        if (display.content.record && user.hasPermission(`device.${id}.records.view`)) {
            return <DeviceDisplayRecord content={display.content} deviceColor={color} id={id} />;
        }

        return <DeviceDisplayTextList content={display.content} />;
    };

    const renderRichDisplay = () => {
        if(!display?.richContent?.title) return null;

        return <DeviceRichDisplay content={display.richContent} />
    }

    // const renderMenu = () => {
    //     let menuContent: any = { t: 'span', p: { children: ['hoi!'] }};
    //     if(!menuContent) return null;
    //     const content = renderElement(menuContent, (callbackId, childIndex, args) => {
    //         // Replace any args that are not primitive
    //         args = args.map(a => {
    //             if(a && typeof a === 'object') {
    //                 if(a.nativeEvent instanceof Event) {
    //                     return _.pick(a.nativeEvent, DOM_EVENT_INCLUDE_KEYS);
    //                 }

    //                 return null;
    //             }

    //             return a;
    //         });

    //         socket.emit('device:menuevent', {
    //             deviceId: data.id,
    //             callbackId: callbackId,
    //             childIndex: childIndex,
    //             args: args
    //         })
    //     });

    //     return (
    //         <Modal 
    //             isOpen={menuVisible}
    //             shouldCloseOnOverlayClick={true} 
    //             onRequestClose={() => setMenuVisible(false)}>
    //             {content}
    //         </Modal>
    //     )
    // }

    const richDisplay = renderRichDisplay();
    const hasClickHandler = hasMenu || (typeof primaryAction?.command === 'string' && sensor !== true);

    return (
        <>
            <Button 
                onClick={hasClickHandler ? handleClick : undefined}
                href={!hasClickHandler && hasRecords ? home.scopePath(`/devices/${id}/records`) : undefined}
                variant="secondary" 
                active={display.isActive}
                disabled={sensor && !hasRecords}
                ref={buttonRef}
                className={classNames('Device', { 
                        'Device--with-menu': hasMenu,
                        'Device--with-records': hasRecords,
                        'Device--sensor': sensor,
                        'Device--error': !!error,
                        'Device--with-rich-display': !!richDisplay
                    })}
                style={{
                    '--Device--active-background': palette[1],
                    '--Device--active-color': palette[7],
                } as React.CSSProperties}>
                <Box direction="column" className="h-100 w-100">
                    <Box direction="row" className="Device__body w-100" align="stretch" gutterX={3}>
                        <Box direction="row" align="stretch" gutterX={3} className="overflow-hidden Device__main w-100">
                            <Box direction="column" justify="center">
                                <div className="Device__icon-wrapper">
                                    <Icon id={icon} size={20} weight="light" className="Device__icon-spacer" />
                                    <Icon id={icon} size={20} weight="light" className="Device__icon Device__inactive-icon" />
                                    <Icon id={icon} size={20} weight="solid" className="Device__icon Device__active-icon" />
                                </div>
                            </Box>
                            <Box direction="column" className="overflow-hidden my-auto">
                                <Box direction="row" align="center" gutterX={1} className="mw-100">
                                    <h3 className="Device__name text-truncate w-100 d-inline-block">{name}</h3>
                                    {error && (
                                        <Icon id={error.icon} size={10} weight="solid" className="Device__error-icon" />
                                    )}
                                </Box>
                                <span className="Device__display text-truncate w-100">{renderStateDisplay()}</span>
                            </Box>
                        </Box>
                        <Box direction="column" className="ms-auto Device__menu-indicator" justify="center">
                            <Icon id="chevron-right" size={12} weight="solid" />
                        </Box>
                    </Box>
                    <div className="Device__rich-display h-100 w-100">
                        {richDisplay}
                    </div>
                </Box>
            </Button>
            {hasMenu && (
                <Modal 
                    title={name}
                    isOpen={menuVisible} 
                    onRequestClose={() => setMenuVisible(false)}>
                    <DeviceMenuContainer execute={execute} traits={traits} palette={palette} device={data} />
                </Modal>
            )}
        </>
    );
};

export default Device;
