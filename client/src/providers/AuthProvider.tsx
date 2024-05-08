import { useState, useEffect } from 'react';
import AuthContext, { IAuthContext } from '@/contexts/AuthContext';
import User from '@/utils/models/User';
import { trpc } from '@/utils/trpc/trpc';
import appState from '@/utils/appState';
import { StatusBar, Style } from '@capacitor/status-bar';
import { getColorValue } from '@tjallingf/react-utils';

export interface IAuthProviderProps {
    children?: React.ReactNode;
}

const AuthProvider: React.FunctionComponent<IAuthProviderProps> = ({ children }) => {
    const userQuery = trpc.user.get.useQuery({ id: 'me' });
    const [ user, setUser ] = useState<User|null>(null);

    useEffect(() => {
        if(!userQuery.data) return;

        setUser(new User(userQuery.data));
    }, [ userQuery.data ]);

    useEffect(() => {
        appState.currentUser = user;

        // Get app color scheme
        const colorScheme = appState.getColorScheme();

        // Update body attribute
        document.body.dataset.colorScheme = colorScheme;

        // Update localStorage
        localStorage.setItem('user.settings.colorScheme', colorScheme);

        // Update status bar color
        StatusBar.setStyle({ style: colorScheme === 'dark' ? Style.Dark : Style.Light }).catch(() => {});
        StatusBar.setBackgroundColor({ color: getColorValue('gray-0')! }).catch(() => {});
    }, [ user ]);

    return <AuthContext.Provider 
        value={{ 
            user: user!, 
            refetch: userQuery.refetch
        }}>
        {children}</AuthContext.Provider>;
};

export default AuthProvider;
