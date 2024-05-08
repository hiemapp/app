import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export type SocketContextType = Socket;

const SocketContext = createContext(null as any);
export default SocketContext;
