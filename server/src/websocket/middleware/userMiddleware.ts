import { Socket } from 'socket.io';
import { getUserFromCookies } from '@/auth';
import { parse as parseCookies } from 'cookie';

const userMiddleware = (socket: Socket, next: () => void) => {
    const cookies = parseCookies(socket.request.headers.cookie!);
    socket.data.user = getUserFromCookies(cookies);
    
    next();
}

export default userMiddleware;