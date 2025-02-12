import './DeviceDisplayTextList.scss';
import { type DeviceDisplay } from 'hiem';
import { FormattedMessage } from 'react-intl';
import striptags from 'striptags';

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

        if(typeof text.html === 'string') {
            const safeHtml = striptags(text.html, ['b', 'i', 'u', 'em', 'strong', 'span', 'sup', 'sub'])
            return <span dangerouslySetInnerHTML={{__html: safeHtml}}></span>
        }

        if(typeof text.text === 'string') {
            return text.text;
        }

        return null;
    }
    
    const renderContent = () => {
        if(!Array.isArray(content.textList)) return null;

        return content.textList
            // render items
            .map(t => renderText(t))
             // remove items that are null
            .filter(t => t !== null)
            // add seperators in between items
            .flatMap((t, i, arr) => i < arr.length-1 ? [t, TEXT_LIST_SEPERATOR] : [t])
    }

    return (
        <span className="DeviceDisplayTextList">
            {renderContent()}
        </span>
    )
};

export default DeviceDisplayTextList;
