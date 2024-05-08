import useAuth from '@/hooks/useAuth';
import { trpc } from '@/utils/trpc';
import { IntlProvider } from 'react-intl';

export interface ILanguageProviderProps {
    children?: React.ReactNode;
}

const LanguageProvider: React.FunctionComponent<ILanguageProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const languageId = user.getSetting('language').toLowerCase().replace('-', '_');
    const language = trpc.language.get.useQuery({ id: languageId });

    if (language.isLoading) return <span>Loading language...</span>;

    return (
        <IntlProvider 
            locale={languageId.replace('_', '-')} 
            messages={(language.data as any).messages}>
            {children}
        </IntlProvider>
    );
};

export default LanguageProvider;
