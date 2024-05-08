import { Socket } from 'socket.io';
import { getUserFromToken } from '@/auth';

const userMiddleware = (socket: Socket, next: () => void) => {
    socket.data.user = getUserFromToken(socket.request.headers['x-auth-token']);
    
    next();
}

export default userMiddleware;