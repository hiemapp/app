import { useState, useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import AuthContext, { IAuthContext } from '@/contexts/AuthContext';
import User from '@/utils/models/User';
import { trpc } from '@/utils/trpc';
import app from '@/utils/app';

export interface IAuthProviderProps {
    children?: React.ReactNode;
}

const AuthProvider: React.FunctionComponent<IAuthProviderProps> = ({ children }) => {
    const [ value, setValue ] = useState({} as IAuthContext);
    const userQuery = trpc.user.get.useQuery({ id: 'me' });

    useEffect(() => {
        if(!userQuery.data) return;

        setValue({
            user: new User(userQuery.data),
            refresh: userQuery.refetch
        })
    }, [ userQuery.data ]);

    useEffect(() => {
        if(!value.user) return;
        
        app().currentUser = value.user;

        document.body.dataset.colorScheme = app().currentColorScheme();
    }, [ value.user ]);
    
    if (!value.user) return null;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
