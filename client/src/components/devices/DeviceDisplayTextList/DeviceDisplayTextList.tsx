import './DeviceDisplayTextList.scss';
import { type DeviceDisplay } from 'hiem';
import { FormattedMessage } from 'react-intl';

export interface IDeviceDisplayTextListProps {
    content: DeviceDisplay['content'];
}

const TEXT_LIST_SEPERATOR = <span className="DeviceDisplayTextList__seperator">/</span>;

const DeviceDisplayTextList: React.FunctionComponent<IDeviceDisplayTextListProps> = ({ content: content }) => {
    const renderText = (text: any) => {
        if(!text) return null;

        if(typeof text.message === 'string') {
            return <FormattedMessage id={text.message} defaultMessage={text.text} />
        }

        return text.text;
    }
    
    const renderContent = () => {
        if(!content.textList?.length) return null;

        const items: any[] = [];

        content.textList.forEach((text, i) => {
            items.push(renderText(text));
            if(i < content.textList!.length-1) {
                items.push(TEXT_LIST_SEPERATOR);
            }
        })

        return items;
    }

    return (
        <span className="DeviceDisplayTextList">
            {renderContent()}
        </span>
    )
};

export default DeviceDisplayTextList;
