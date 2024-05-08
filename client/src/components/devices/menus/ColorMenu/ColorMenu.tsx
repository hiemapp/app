import { Box, Button, Icon } from '@tjallingf/react-utils';
import { DeviceMenuProps } from '../../DeviceMenuContainer/DeviceMenuContainer';
import './ColorMenu.scss';
import ButtonGroup from '@/components/ButtonGroup';
import { hasTrait } from '@/utils/traits';
import { FormattedMessage, useIntl } from 'react-intl';
import Modal from '@/components/Modal';
import { useCallback, useEffect, useRef, useState } from 'react';
import ColorWheel from '@uiw/react-color-wheel';
import { ColorResult, HsvaColor, hexToHsva } from '@uiw/color-convert';
import throttle from 'lodash/throttle';

const ColorMenu: React.FunctionComponent<DeviceMenuProps> = ({
    execute, options, traits, device
}) => {
    const [ showPicker, setShowPicker] = useState(false);
    const [ pickerColor, setPickerColor ] = useState<HsvaColor>(hexToHsva(device.state.color ?? '#000000'));
    const hasSwitchTrait = hasTrait(traits, t => t.name === 'SwitchTrait');
    const { formatMessage } = useIntl();

    useEffect(() => {
        setPickerColor(hexToHsva(device.state.color ?? '#000000'));
    }, [ device.state.color ]);

    // Throttled function to update the picker preview
    const executePickerPreviewThrottled = useCallback(throttle((color: ColorResult) => {
        execute('setColor', { color: color.hex }, false);
    }, Math.max(options.preview.throttle, 100)), []);

    const handleStatusChange = (statusStr: string) => {
        const status = (statusStr === 'on');
        execute('toggleStatus', { status });
    }

    const renderToggle = () => (
        <div className="ColorMenu__toggle ColorMenu__section">
            <ButtonGroup
                select="single"
                size="lg"
                seperated
                onChange={handleStatusChange}
                value={device.state.status ? 'on' : 'off'}>
                <Button value="on" variant="secondary">
                    <FormattedMessage id="@global.generic.status.on.label" />
                </Button>
                <Button value="off" variant="secondary">
                    <FormattedMessage id="@client.generic.status.off.label" />
                </Button>
            </ButtonGroup>
        </div>
    )

    const renderSwatches = () => (
        <div className="ColorMenu__swatches ColorMenu__section">
            {/* <h5>Colors</h5> */}
            <Box className="ColorMenu__button-list" direction="row" gutterX={2} gutterY={2} wrap>
                {options.colors.map((hex: string) => {
                    if (typeof hex !== 'string' || !/#[0-9A-Fa-f]{6}/g.test(hex)) return;

                    hex = hex.toLowerCase().trim();

                    return (
                        <Button key={hex}
                            className="ColorMenu__swatch"
                            active={device.state.status && device.state.color === hex}
                            onClick={() => execute('setColor', { color: hex })}
                            style={{
                                '--_hex': hex
                            } as any}>
                            <span className="ColorMenu__swatch-indicator"></span>
                        </Button>
                    )
                })}
                <Button className="ColorMenu__picker-trigger" variant="secondary" onClick={() => setShowPicker(true)}>
                    <Icon id="eye-dropper" />
                </Button>
            </Box>
        </div>
    )

    const renderPrograms = () => (
        <div className="ColorMenu__programs ColorMenu__section">
            {/* <h5>Programs</h5> */}
            <Box className="ColorMenu__button-list" direction="row" gutterX={2} gutterY={2} wrap>
                {options.programs.map((program: any) => (
                    <Button key={program.id}
                        onClick={() => execute('setProgram', { program: program.id })}
                        variant="secondary">
                        <Icon id={program.icon} />
                    </Button>
                ))}
            </Box>
        </div>
    )

    const handleColorPickerChange = (color: ColorResult) => {
        setPickerColor(color.hsva);

        if(options.preview.enabled) {
            executePickerPreviewThrottled(color);
        }
    }

    return (
        <>
            <Box className="ColorMenu" direction="column" gutterY={3}>
                {options.programs.length && renderPrograms()}
                {options.colors.length && renderSwatches()}
                {hasSwitchTrait && renderToggle()}
            </Box>
            <Modal 
                title={formatMessage({ id: '@hiem/core.devices.traits.colorTrait.pickerModal.title' })}
                isOpen={showPicker} 
                onRequestClose={() => setShowPicker(false)}>
                <ColorWheel 
                    className="ColorMenu__picker"
                    color={{...pickerColor, v: 100, a: 1}}
                    width={275}
                    height={275}
                    onChange={handleColorPickerChange} />
            </Modal>
        </>
    )
}

export default ColorMenu;