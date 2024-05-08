import Home, { IHomeConfig } from './Home';
import appState from '../appState';
import { Capacitor } from '@capacitor/core';

export default class HomeController {
    protected static homes: Record<string, Home> = {};

    static init() {
        this.homes = {};

        const homes = this.readHomesFromStorage();
        homes.forEach((config: IHomeConfig) => {
            this.store(new Home(config));
        })
        
        // Make sure that the controller has a 'local' home
        this.store(new Home({ id: 'local', baseUrl: '' }));
    }

    static store(home: Home) {
        if(this.homes[home.id]) return;

        this.homes[home.id] = home;
        this.writeHomesToStorage();
    }

    static index() {
        return Object.values(this.homes);
    }

    static find(id: string) {
        return this.homes[id];
    }
    
    static isNativeApp() {
        return Capacitor.getPlatform() !== 'web';
    }
    
    static findCurrent() {
        // Only native apps support multiple homes, web apps should only
        // provide access to the 'local' home.
        if(!this.isNativeApp()) return this.find('local');

        const homeId = window.__homeId;  
        return this.homes[homeId];
    }

    static writeHomesToStorage() {
        return appState.setStorage('user.homes', this.index().map(home => home.toJSON()));
    }

    static readHomesFromStorage() {
        return appState.getStorage('user.homes', v => Array.isArray(v) ? v : []);
    }
}