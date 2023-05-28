import AuthContext from '@/contexts/AuthContext'
import { useContext } from 'react';
import { IAuthContext } from '@/contexts/AuthContext';

export default function useAuth(): IAuthContext {
    return useContext(AuthContext);
}