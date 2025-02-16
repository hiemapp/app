import './DeviceDisplayTextList.scss';
import { type DeviceDisplay } from 'hiem';
import { FormattedMessage } from 'react-intl';
import striptags from 'striptags';

export interface IDeviceDisplayTextListProps {
    content: DeviceDisplay['content'];
}

const DeviceDisplayTextList: React.FunctionComponent<IDeviceDisplayTextListProps> = ({ content: content }) => {
    const renderText = (text: any, index: number) => {
        if(!text) return null;

        if(typeof text.message === 'string') {
            return <FormattedMessage key={index} id={text.message} defaultMessage={text.text} />
        }

        if(typeof text.html === 'string') {
            const safeHtml = striptags(text.html, ['b', 'i', 'u', 'em', 'strong', 'span', 'sup', 'sub'])
            return <span key={index} dangerouslySetInnerHTML={{__html: safeHtml}}></span>
        }

        if(typeof text.text === 'string') {
            return <span key={index}>{text.text}</span>;
        }

        return null;
    }
    
    const renderContent = () => {
        if(!Array.isArray(content.textList)) return null;

        return content.textList
            // render items
            .map((t, i) => renderText(t, i))
             // remove items that are null
            .filter(t => t !== null)
            // add seperators in between items
            .flatMap((t, i, arr) => i < arr.length-1 ? [t, <span className="DeviceDisplayTextList__seperator" key={`sep_${i}`}>/</span>] : [t])
    }

    return (
        <span className="DeviceDisplayTextList">
            {renderContent()}
        </span>
    )
};

export default DeviceDisplayTextList;
