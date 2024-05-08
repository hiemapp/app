import type { NextFunction, Request, Response } from 'express';
import { parse as parseCookie } from 'cookie';
import { AUTH_COOKIE_NAME } from '@/auth';
import Webserver from '@/Webserver';

// The socket middleware adds the req.socket property
const socketMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const socketId = req.header('x-socket-id')
    const requestToken = req.cookies[AUTH_COOKIE_NAME];

    if(typeof socketId === 'string') {
        Webserver.io.sockets.sockets.forEach(socket => {
            const cookies = parseCookie(socket.handshake.headers.cookie!);
            const socketToken = cookies[AUTH_COOKIE_NAME];

            if(typeof socketToken === 'string' && socketToken === requestToken) {
                req.socket = socket;
            }
        })
    }

    next();
}

export default socketMiddleware;