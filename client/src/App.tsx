// TODO: Add translations for aria-label (see Topbar Button[href="/login"])
// TODO: Hide animated form labels when a value is present
import { Navbar, Topbar, Box, Button, Container, Icon } from '@tjallingf/react-utils';
import { Navigate, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import useTrimmedLocation from '@/hooks/useTrimmedLocation';
import { FormattedMessage } from 'react-intl';
import ErrorBoundary from './ErrorBoundary';
import FlowEdit from './Flows/pages/FlowEdit.page';
import Flows from './Flows/pages/Flows.page';
import Records from '@/Records/pages/Records.page';
import Devices from '@/Devices/pages/Devices.page';
import Login from '@/Login/pages/Login.page';
import RouteError from './Errors/pages/RouteError.page';
import Dashboard from './Dashboard/pages/Dashboard.page';
import '@/styles/components/App.scss';
// import Scripts from './Scripts/pages/Scripts.page';
import NotificationCenter from './notifications/NotificationCenter';

const App: React.FunctionComponent = () => {
    const { pathname } = useTrimmedLocation();
    const currentPageId = pathname.split('/')[1]

    const wrapRouteElement = (element: React.ReactNode) => {
        return <ErrorBoundary fallback={<RouteError />}>{element}</ErrorBoundary>;
    };

    function renderNavbarButton(path: string, icon: string) {
        return (
            <Navbar.Button
                active={pathname.startsWith(path)}
                icon={<>
                    <span className="NavbarButton__icon NavbarButton--active__icon">
                        <Icon id={icon} weight="solid" />
                    </span>
                    <span className="NavbarButton__icon NavbarButton--inactive__icon">
                        <Icon id={icon} weight="light" />
                    </span>
                </>} 
                href={path}
             />
        )
    }

    return (
        <>
            <Topbar>
                <Container>
                    <Box direction="row" align="center">
                        <h1 className="Topbar__title">
                            <FormattedMessage id={`@zylax/core.${currentPageId || 'unknown'}.page.title`} />
                        </h1>
                        <div className="ms-auto">
                            <Button
                                variant="secondary"
                                href="/login"
                                square
                                size="lg"
                                aria-label="Visit the login page"
                            >
                                <Icon id="user" size={20} />
                            </Button>
                        </div>
                    </Box>
                </Container>
            </Topbar>
            <Routes>
                { /* REDIRECTS */ }
                <Route path="/" element={ <Navigate to="/devices" /> }/>

                <Route path="/dashboard" element={wrapRouteElement(<Dashboard />)} />
                <Route path="/devices" element={wrapRouteElement(<Devices />)} />
                <Route path="/login" element={wrapRouteElement(<Login />)} />
                <Route path="/records" element={wrapRouteElement(<Records />)} />
                <Route path="/flows" element={wrapRouteElement(<Flows />)} />
                <Route path="/flows/:id/edit" element={wrapRouteElement(<FlowEdit />)} />
                {/* <Route path="/scripts" element={wrapRouteElement(<Scripts />)} />
                <Route path="/scripts/:id/edit" element={wrapRouteElement(<ScriptEdit />)} /> */}
            </Routes>
            <NotificationCenter />
            <Navbar show={true}>
                {renderNavbarButton('/dashboard', 'house')}
                {renderNavbarButton('/devices', 'plug')}
                {renderNavbarButton('/records', 'chart-simple')}
                {renderNavbarButton('/flows', 'clock')}
                {/* {renderNavbarButton('/scripts', 'shuffle')} */}
                {renderNavbarButton('/admin', 'shield')}
            </Navbar>
        </>
    );
};

export default App;
