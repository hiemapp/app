import type { NextFunction, Request, Response } from 'express';
import { getUserFromToken } from '@/auth';

// The auth middleware adds the req.user property
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.user = getUserFromToken(req.headers['x-auth-token']);
    
    next();
}

export default authMiddleware;