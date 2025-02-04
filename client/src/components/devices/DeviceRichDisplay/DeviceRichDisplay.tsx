import { type DeviceDisplay } from 'hiem';
import './DeviceRichDisplay.scss';

export interface DeviceRichDisplayProps extends React.PropsWithChildren {
    content: DeviceDisplay['richContent']
}

const DeviceRichDisplay: React.FunctionComponent<DeviceRichDisplayProps> = ({
    content
}) => {
    return (
        <div className="DeviceRichDisplay">
            <div className="DeviceRichDisplay-inner">
                
            </div>
        </div>
    )
}

export default DeviceRichDisplay;