import MessageContext from '@/contexts/MessageContext'
import { useContext } from 'react';
import { IMessageContext } from '@/contexts/MessageContext';

export default function useMessages(): IMessageContext {
    return useContext(MessageContext);
}