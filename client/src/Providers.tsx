import AuthProvider from '@/providers/AuthProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/queryClient';
import LanguageProvider from '@/providers/LanguageProvider';
import SocketProvider from '@/providers/SocketProvider';
import { trpc, trpcClient } from '@/utils/trpc';

export interface IProvidersProps {
    children?: React.ReactNode;
}

const Providers: React.FunctionComponent<IProvidersProps> = ({ children }) => {
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <LanguageProvider>
                        <SocketProvider>
                            {children}
                        </SocketProvider>
                    </LanguageProvider>
                </AuthProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export default Providers;
