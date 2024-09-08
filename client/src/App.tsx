import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/queryClient';
import { trpc, trpcClient } from '@/utils/trpc/trpc';
import { Navigate, Route, Routes, matchPath, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Devices from './pages/home/Devices.page';
import SetupLayout from './layouts/SetupLayout';
import ErrorBoundary from './ErrorBoundary';
import RouteError from './pages/home/RouteError.page';
import Dashboard from './pages/home/Dashboard.page';
import Records from './pages/home/Records.page';
import Login from './pages/home/Login.page';
import Flows from './pages/home/Flows.page';
import FlowEdit from './pages/home/FlowEdit.page';
import Homes from './pages/setup/Homes.page';
import HomeController from './utils/homes/HomeController';
import MainRedirect from './pages/setup/MainRedirect.page';
import NotificationsProvider from './providers/NotificationsProvider';
import LanguageProvider from './providers/LanguageProvider';
import AuthProvider from './providers/AuthProvider';
import ScriptEdit from './pages/home/ScriptEdit.page';

export interface IProvidersProps {
    children?: React.ReactNode;
}

const App: React.FunctionComponent<IProvidersProps> = ({ children }) => {
    const location = useLocation();
    const addErrorBoundary = (element: React.ReactNode) => {
        return <ErrorBoundary fallback={<RouteError />}>{element}</ErrorBoundary>;
    };
    
    // Get homeId from url
    const match = matchPath('/homes/:homeId/*', location.pathname);

    // Used by HomeController to detect the selected home
    if(typeof match?.params?.homeId === 'string') {
        window.__homeId = match.params.homeId;
    }

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <NotificationsProvider>
                    <AuthProvider>
                        <LanguageProvider>
                            <Routes>
                                <Route element={<MainLayout />}> 
                                    <Route path="/homes/:homeId/dashboard" element={addErrorBoundary(<Dashboard />)} />
                                    <Route path="/homes/:homeId/devices" element={addErrorBoundary(<Devices />)} />
                                    <Route path="/homes/:homeId/devices/:id/records" element={addErrorBoundary(<Records />)} />
                                    <Route path="/homes/:homeId/login" element={addErrorBoundary(<Login />)} />
                                    <Route path="/homes/:homeId/records" element={addErrorBoundary(<Records />)} />
                                    <Route path="/homes/:homeId/flows" element={addErrorBoundary(<Flows />)} />
                                    <Route path="/homes/:homeId/flows/:flowId/edit" element={addErrorBoundary(<FlowEdit />)} />
                                    {/* <Route path="/homes/:homeId/scripts" element={addErrorBoundary(<Scripts />)} /> */}
                                    <Route path="/homes/:homeId/scripts/:scriptId/edit" element={addErrorBoundary(<ScriptEdit />)} />
                                    
                                    {/* FALLBACK REDIRECT */}
                                    <Route path="/homes/:homeId/*" element={<Navigate to="./devices" replace={true} />} />
                                </Route>

                                {/* NATIVE APP ROUTES */}
                                {HomeController.isNativeApp() && (
                                    <Route element={<SetupLayout />}>
                                        <Route path="/setup/homes" element={<Homes />} />
                                    </Route>
                                )}

                                {/* FALLBACK REDIRECT */}
                                <Route path="*" element={<MainRedirect />} />
                            </Routes>
                        </LanguageProvider>
                    </AuthProvider>
                </NotificationsProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export default App;
