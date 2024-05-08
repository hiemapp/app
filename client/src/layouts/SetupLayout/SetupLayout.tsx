import { Outlet } from 'react-router-dom';
import LanguageProvider from '@/providers/LanguageProvider';
import './SetupLayout.scss';
import AuthProvider from '@/providers/AuthProvider';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const SetupLayout: React.FunctionComponent = () => {
    return (
        <div className="SetupLayout">
            <Outlet />
            <NotificationCenter />
        </div>
    )
}

export default SetupLayout;