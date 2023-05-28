import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export type SocketContextType = Socket | null;

const SocketContext = createContext(null as SocketContextType);
export default SocketContext;
