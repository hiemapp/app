import { type Socket } from 'socket.io';
import { type User } from 'hiem';

declare module 'express-serve-static-core' {
    interface Request {
        user: User;
        socket: Socket<any, any, any, SocketData>
    }
    interface Response {
        myField?: string
    }
}