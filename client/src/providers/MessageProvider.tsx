import MessageContext from '@/contexts/MessageContext';
import { MessageProps } from '@/messages/Message';
import { uniqueId, defaults } from 'lodash';
import { useState } from 'react';

export interface IMessageProviderProps extends React.PropsWithChildren {
    
}

const MessageProvider: React.FunctionComponent<IMessageProviderProps> = ({ children }) => {
    const [ messages, setMessages ] = useState<MessageProps[]>([]);

    function addMessage(message: MessageProps) {
        const id = uniqueId();
        
        setMessages(cur => {
            cur.push({ ...message, id });
            return [...cur];
        })

        return id;
    }

    function updateMessage(id: string, message: MessageProps) {
        setMessages(cur => cur.map(m => m.id === id 
            ? defaults(m, message)
            : m
        ));
    }

    return (
        <MessageContext.Provider value={{ messages, addMessage, updateMessage }}>
            {children}
        </MessageContext.Provider>
    )
};

export default MessageProvider;
