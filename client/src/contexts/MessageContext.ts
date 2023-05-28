import { createContext } from 'react';
import User from '@/utils/models/User';
import { MessageProps } from '@/messages/Message';

export type MessagePropsWithoutId = Omit<MessageProps, 'id'>;

export interface IMessageContext {
    messages: MessageProps[],
    addMessage: (props: MessagePropsWithoutId) => void,
    updateMessage:(id: string, props: MessagePropsWithoutId) => void
}

const MessageContext = createContext({} as IMessageContext);
export default MessageContext;
