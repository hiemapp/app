import { Tile, Box } from '@tjallingf/react-utils';
import Icon from '@/components/Icon/Icon';
import './DeviceDisplayTile.scss';
import { type DeviceStateDisplay } from 'zylax/types/devices/DeviceState';

export interface IDeviceDisplayTileProps {
    onChange?(name: string, value: any): void;
    display: DeviceStateDisplay;
    deviceColor: string;
}

const DeviceDisplayTile: React.FunctionComponent<IDeviceDisplayTileProps> = ({ display }) => {
    let thumbnail;
    if(display.tile?.thumbnailSrc) {
        thumbnail = <img src={display.tile.thumbnailSrc} />;
    } else if(display.tile?.icon) {
        thumbnail = <Icon id={display.tile.icon} />;
    }

    console.log({ display });

    return (
        <Tile className="DeviceDisplayTile">
            <Box direction="row" gutterX={2}>
                <div className="DeviceDisplayTile__thumbnail">{thumbnail}</div>
                <div className="DeviceDisplayTile__content">
                    {display.tile?.title && <Tile.Title>{display.tile.title}</Tile.Title>}
                    {display.tile?.description}
                </div>
            </Box>
        </Tile>
    );
};

export default DeviceDisplayTile;
