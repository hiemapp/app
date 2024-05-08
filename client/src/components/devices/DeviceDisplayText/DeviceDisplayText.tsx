import './DeviceDisplayText.scss';
import { type DeviceDisplay } from 'hiem';
import { FormattedMessage } from 'react-intl';

export interface IDeviceDisplayTextProps {
    content: DeviceDisplay['content'];
}

const DeviceDisplayText: React.FunctionComponent<IDeviceDisplayTextProps> = ({ content: content }) => {
    const renderContent = () => {
        if(typeof content.text?.message === 'string') {
            return <FormattedMessage id={content?.text?.message} defaultMessage={content.text?.text} />
        }

        return content.text?.text;
    }

    return (
        <span className="DeviceDisplayText">
            {renderContent()}
        </span>
    )
};

export default DeviceDisplayText;
