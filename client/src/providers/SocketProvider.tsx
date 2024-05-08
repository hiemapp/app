import { useState, useEffect } from 'react';
import SocketContext, { SocketContextType } from '@/contexts/SocketContext';
import { io } from 'socket.io-client';

export interface ISocketProviderProps {
    children?: React.ReactNode;
}

const SocketProvider: React.FunctionComponent<ISocketProviderProps> = ({ children }) => {
    const [value, setValue] = useState<SocketContextType>(null as any);

    useEffect(() => {
        window.__socket = io();
        setValue(window.__socket);
    }, []);

    if (!value) return null;

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
