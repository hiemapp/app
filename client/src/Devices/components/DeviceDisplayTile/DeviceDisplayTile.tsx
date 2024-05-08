import { Tile, Box } from '@tjallingf/react-utils';
import { Icon } from '@tjallingf/react-utils';
import './DeviceDisplayTile.scss';
import { type DeviceStateDisplay } from 'zylax';

export interface IDeviceDisplayTileProps {
    display: DeviceStateDisplay;
    deviceColor: string;
}

const DeviceDisplayTile: React.FunctionComponent<IDeviceDisplayTileProps> = ({ display }) => {
    if(!display.tile) return null;
    
    let thumbnail;
    if(display.tile.img?.url) {
        thumbnail = <img 
            src={display.tile.img.url} 
            style={{ 
                transform: display.tile.img.transform
            }} />;
    } else if(display.tile.icon?.id) {
        thumbnail = <Icon id={display.tile.icon.id} color={display.tile.icon.color} />;
    }

    return (
        <Tile className="DeviceDisplayTile">
            <Box direction="row" gutterX={2} align="center">
                {thumbnail && <div className="DeviceDisplayTile__thumbnail">{thumbnail}</div>}
                <div className="DeviceDisplayTile__content">
                    {display.tile.title && <h4 className="DeviceDisplayTile__title">{display.tile.title}</h4> }
                    {display.tile.description && 
                        <div className="DeviceDisplayTile__description">
                            {display.tile.description}
                        </div>
                    }
                </div>
            </Box>
        </Tile>
    );
};

export default DeviceDisplayTile;
