import User from './models/User';

class AppState {
    currentUser: User|null = null;
    
    getColorScheme(): string {
        return this.currentUser?.getSetting('colorScheme') === 'dark' ? 'dark' : 'light';
    }

    setStorage(key: string, value: any) {
        const json = JSON.stringify(value);
        return localStorage.setItem(`app.json.${key}`, json);
    }

    getStorage(key: string, fallback?: (value: any) => any) {
        const json = localStorage.getItem(`app.json.${key}`);

        let value = null;
        try {
            if (typeof json === 'string') {
                value = JSON.parse(json);
            }
        } catch (err) { }

        return typeof fallback === 'function' ? fallback(value) : value;
    }
}

const appState = new AppState();
export default appState;