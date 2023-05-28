import { createContext } from 'react';
import User from '@/utils/models/User';

export interface IAuthContext {
    user: User;
    refresh(): Promise<object>;
}

const AuthContext = createContext({} as IAuthContext);
export default AuthContext;
