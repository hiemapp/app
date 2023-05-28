import useMessages from '@/hooks/useMessages';
import { useEffect } from 'react';
import Message from './Message';
import './MessageContainer.scss';

const MessageContainer: React.FunctionComponent = () => {
    const { messages, addMessage } = useMessages();
    
    return (
        <div className="MessageContainer">
            {messages.map(props => <Message {...props} />)}
        </div>
    )
}

export default MessageContainer;