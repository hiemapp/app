// TODO: Add translations for aria-label (see Topbar Button[href="/login"])
// TODO: Hide animated form labels when a value is present
import { Navbar, Topbar, Box, Button, Container, Icon, ViewGrid } from '@tjallingf/react-utils';
import { Navigate, Outlet, matchPath, useLocation, useParams } from 'react-router-dom';
import '@/styles/components/App.scss';
import SocketProvider from '@/providers/SocketProvider';
import HomeController from '@/utils/homes/HomeController';
import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import LanguageProvider from '@/providers/LanguageProvider';
import AuthProvider from '@/providers/AuthProvider';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { FormattedMessage } from 'react-intl';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import Home from '@/utils/homes/Home';

const MainLayout: React.FunctionComponent = () => {
    const [ _, rerender ] = useState({});
    const auth = useAuth();

    // Get pageId from url
    const location = useLocation();
    const match = matchPath('/homes/:homeId/:pageId?/*', location.pathname);
    const pageId = match?.params?.pageId ?? 'unknown';

    const currentHome = HomeController.findCurrent();

    useEffect(() => {
        if(!currentHome) return;
        refetchMetadata(currentHome);
    }, [ currentHome ]);

    if(!currentHome) {
        return <Navigate to="/setup/homes" replace={true} />
    }

    if(!auth.user) {
        return <LargeLoadingIcon />
    }

    async function refetchMetadata(home: Home) {
        await home.fetchMetadata();
        rerender({});
    }

    function renderNavbarButton(path: string, icon: string) {
        return (
            <Navbar.Button
                icon={<>
                    <span className="NavbarButton__icon NavbarButton__icon--active">
                        <Icon id={icon} weight="solid" />
                    </span>
                    <span className="NavbarButton__icon NavbarButton__icon--inactive">
                        <Icon id={icon} weight="light" />
                    </span>
                </>}
                href={path}
            />
        )
    }

    return (
        <div className="MainLayout">
            <SocketProvider>
                <ViewGrid>
                    <Outlet />
                    <NotificationCenter />
                    <Navbar show={true}>
                        {renderNavbarButton(currentHome.scopePath('/dashboard'), 'house')}
                        {renderNavbarButton(currentHome.scopePath('/devices'), 'plug')}
                        {renderNavbarButton(currentHome.scopePath('/records'), 'chart-simple')}
                        {/* {renderNavbarButton(currentHome.scopePath('/flows'), 'clock')} */}
                        {renderNavbarButton(currentHome.scopePath('/scripts/1/edit'), 'shuffle')}
                        {renderNavbarButton(currentHome.scopePath('/admin'), 'shield')}
                        <Navbar.Divider align="end" visible={false} />
                        {renderNavbarButton(currentHome.scopePath('/login'), 'user')}
                    </Navbar>
                </ViewGrid>
            </SocketProvider>
        </div>
    );
};

export default MainLayout;
