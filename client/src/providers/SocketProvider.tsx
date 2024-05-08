import { useState, useEffect } from 'react';
import SocketContext, { SocketContextType } from '@/contexts/SocketContext';
import { io } from 'socket.io-client';
import HomeController from '@/utils/homes/HomeController';

export interface ISocketProviderProps {
    children?: React.ReactNode;
}

const SocketProvider: React.FunctionComponent<ISocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<SocketContextType>(null as any);

    const home = HomeController.findCurrent();

    useEffect(() => {
        const token = home.userdata.token!;

        window.__socket = io(home.baseUrl, {
            extraHeaders: {
                'x-auth-token': token
            }
        });
        setSocket(window.__socket);

        return () => {
            if(!window.__socket) return;
            window.__socket.disconnect();
        }
    }, [ home.baseUrl ]);

    if (!socket) return null;

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
