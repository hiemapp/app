import appState from '@/utils/appState';
import HomeController from '@/utils/homes/HomeController';
import { Navigate } from 'react-router';

const MainRedirect: React.FunctionComponent = () => {
    // Redirect to the local home when using the web app
    if(!HomeController.isNativeApp()) {
        return <Navigate to="/homes/local" replace={true} /> 
    }
    
    // Redirect to the current home from the previous session if possible
    const currentHomeId = appState.getStorage('user.currentHome');
    const home = HomeController.find(currentHomeId);
    if(home) {
        return <Navigate to={home.scopePath('/')} replace={true} />;
    }

    // Redirect to the homes setup page
    return <Navigate to="/setup/homes" />;
}

export default MainRedirect;