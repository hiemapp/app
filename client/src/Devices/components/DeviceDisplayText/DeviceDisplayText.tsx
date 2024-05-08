import { Tile, colors } from '@tjallingf/react-utils';
import './DeviceDisplayText.scss';
import { type DeviceStateDisplay } from 'zylax';

export interface IDeviceDisplayTextProps {
    id: number;
    display: DeviceStateDisplay;
    deviceColor: string;
}

const DeviceDisplayText: React.FunctionComponent<IDeviceDisplayTextProps> = ({ id, display }) => {
    if(!display.text?.content) return null;

    return (
        <Tile className="DeviceDisplayText">
            {display.text.content}
        </Tile>
    )
};

export default DeviceDisplayText;
