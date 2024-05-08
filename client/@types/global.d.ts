import type { Socket } from 'socket.io-client';

declare global {
    interface Window {
        __socket: Socket;
        __homeId: string;
    }
}

export { };