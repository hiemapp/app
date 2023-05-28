import SocketContext, { SocketContextType } from '@/contexts/SocketContext';
import { useContext } from 'react';

export default function useSocket(): SocketContextType {
    return useContext(SocketContext);
}
