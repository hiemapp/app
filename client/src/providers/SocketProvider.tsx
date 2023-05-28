import { useState, useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import SocketContext, { SocketContextType } from '@/contexts/SocketContext';
import { io } from 'socket.io-client';
import UserModel from '@/utils/models/User';

export interface ISocketProviderProps {
    children?: React.ReactNode;
}

const SocketProvider: React.FunctionComponent<ISocketProviderProps> = ({ children }) => {
    const [value, setValue] = useState<SocketContextType>(null);

    useEffect(() => {
        const socket = io();
        setValue(socket);
    }, []);

    if (!value) return null;

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
