import User from './models/User';

class AppState {
    currentUser: User;
    
    currentColorScheme(): string {
        return this.currentUser.getSetting('colorScheme') === 'dark' ? 'dark' : 'light';
    }
}

const appState = new AppState();
export default function app() {
    return appState;
}