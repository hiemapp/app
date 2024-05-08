import type { NextFunction, Request, Response } from 'express';
import { getUserFromCookies } from '@/auth';

// The auth middleware adds the req.user property
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.user = getUserFromCookies(req.cookies);
    
    next();
}

export default authMiddleware;