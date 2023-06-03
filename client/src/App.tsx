// TODO: Add translations for aria-label (see Topbar Button[to="/login"])
// TODO: Hide animated form labels when a value is present
import { Navbar, Topbar, Box, Button, Container } from '@tjallingf/react-utils';
import { Icon } from '@tjallingf/react-utils';
import { Routes, Route } from 'react-router-dom';
import useTrimmedLocation from '@/hooks/useTrimmedLocation';
import { FormattedMessage } from 'react-intl';
import ErrorBoundary from './ErrorBoundary';
import FlowEdit from './Flows/pages/FlowEdit.page';
import Recordings from '@/Recordings/pages/Recordings.page';
import Devices from '@/Devices/pages/Devices.page';
import Login from '@/Login/pages/Login.page';
import RouteError from './Errors/pages/RouteError.page';
import MessageContainer from './messages/MessageContainer';
import { trim } from 'lodash';
import Dashboard from './Dashboard/pages/Dashboard.page';

const App: React.FunctionComponent = () => {
    const { pathname } = useTrimmedLocation();
    const currentPageId = pathname.split('/')[1]

    const wrapRouteElement = (element: React.ReactNode) => {
        return <ErrorBoundary fallback={<RouteError />}>{element}</ErrorBoundary>;
    };

    function renderNavbarButton(path: string, icon: string) {
        return (
            <Navbar.Button
                icon={<Icon 
                    id={icon} 
                    weight={currentPageId === trim(path, '/') ? 'solid' : 'light'} />} 
                to={path}
             />
        )
    }

    return (
        <>
            <MessageContainer />
            <Topbar>
                <Container>
                    <Box direction="row" align="center">
                        <h1 className="Topbar__title">
                            {<FormattedMessage id={`@zylax/core.pages.${currentPageId}.title`} />}
                        </h1>
                        <div className="ms-auto">
                            <Button
                                variant="secondary"
                                to="/login"
                                shape="square"
                                size="lg"
                                aria-label="Visit the login page"
                            >
                                <Icon id="user" size={20} />
                            </Button>
                        </div>
                    </Box>
                </Container>
            </Topbar>
            <Navbar show={true}>
                {renderNavbarButton('/dashboard', 'house')}
                {renderNavbarButton('/devices', 'plug')}
                {renderNavbarButton('/recordings', 'chart-simple')}
                {renderNavbarButton('/flows', 'clock')}
                {renderNavbarButton('/admin', 'wrench')}
            </Navbar>
            <Routes>
                <Route path="/dashboard" element={wrapRouteElement(<Dashboard />)} />
                <Route path="/devices" element={wrapRouteElement(<Devices />)} />
                <Route path="/login" element={wrapRouteElement(<Login />)} />
                <Route path="/recordings" element={wrapRouteElement(<Recordings />)} />
                <Route path="/flows/:id/edit" element={wrapRouteElement(<FlowEdit />)} />
            </Routes>
        </>
    );
};

export default App;
