import LargeLoadingIcon from '@/LargeLoadingIcon';
import useAuth from '@/hooks/useAuth';
import { trpc } from '@/utils/trpc/trpc';
import { FormattedMessage, IntlProvider } from 'react-intl';
import * as languages from '@/languages';
import { useMemo } from 'react';
import { flattenKeys } from '@/utils/object';
import appState from '@/utils/appState';

export interface ILanguageProviderProps {
    children?: React.ReactNode;
}

const LanguageProvider: React.FunctionComponent<ILanguageProviderProps> = ({ children }) => {
    const { user } = useAuth();
    
    // Determine the language that should be loaded
    const language = useMemo(() => {
        let languageId = 'en_us';
        const languageSetting = user
            ? user.getSetting('language')
            : appState.getStorage('user.data')?.settings?.language;

        if(languageSetting) {
            languageId = languageSetting.toLowerCase().replace('-', '_')
        } else {
            const navLang = navigator.language || (navigator as any).userLanguage;
            languageId = navLang.toLowerCase().replace('-', '_');
        }

        if(languageId in languages) return languageId;
        return 'en_us';
    }, [ user ]);

    // Read client messages
    let clientMessages = {};
    if(language in languages) {
        clientMessages = languages[language as keyof typeof languages];
    }

    // Fetch remaining messages from the server when possible
    const serverMessages: any = trpc.language.get.useQuery({ id: language }, { enabled: !!user });

    // Combine both message objects
    const messages = useMemo(() => {
        return flattenKeys({...serverMessages?.data?.messages, ...clientMessages})
    }, [ serverMessages, clientMessages ]);

    return (
        <IntlProvider 
            locale={language.replace('_', '-')} 
            messages={messages}>
            {children}
        </IntlProvider>
    );
};

export default LanguageProvider;
