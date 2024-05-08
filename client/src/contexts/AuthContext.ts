import { createContext } from 'react';
import User from '@/utils/models/User';

export interface IAuthContext {
    user: User;
    refetch(): Promise<object>;
}

const AuthContext = createContext({} as IAuthContext);
export default AuthContext;
