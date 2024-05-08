import trim from 'lodash/trim';
import HomeController from './HomeController';

export interface IHomeConfig {
    id: string;
    baseUrl: string;
    metadata: IHomeMetadata;
    userdata: IHomeUserdata;
}

export interface IHomeMetadata {
    location: {
        latitude: number;
        longitude: number;
    }
    displayName: string;
}

export interface IHomeUserdata {
    token?: string;
}

export default class Home {
    public readonly id: string;
    public readonly baseUrl: string;
    public metadata: IHomeMetadata;
    public userdata: IHomeUserdata;

    constructor(config: Partial<IHomeConfig>) {
        this.id = config.id!;
        this.baseUrl = Home.formatBaseUrl(config.baseUrl);
        this.userdata = config.userdata ?? {};
        this.metadata = Home.formatMetadata(config.metadata);
    }

    async fetchMetadata() {
        const res = await fetch(this.baseUrl+'/api/metadata');
        this.metadata = (await res.json()).home;
        HomeController.writeHomesToStorage();
        return this.metadata;
    }

    scopePath(href: string) {
        return `/homes/${this.id}/${trim(href, '/')}`;
    }

    static formatBaseUrl(baseUrl: any) {
        if(typeof baseUrl !== 'string' || !baseUrl.length) {
            baseUrl = window.location.host;
        }

        baseUrl = baseUrl.replace(/(^\w+:|^)\/\//, '');
        baseUrl = 'http://'+trim(baseUrl, '/');
        return baseUrl;
    }

    static formatMetadata(metadata: any): IHomeMetadata {
        if(typeof metadata?.displayName === 'string') {
            return metadata;
        }

        return {
            displayName: 'Unknown home',
            location: { latitude: 0, longitude: 0 }
        }
    }

    toJSON() {
        return {
            id: this.id,
            baseUrl: this.baseUrl,
            metadata: this.metadata,
            userdata: this.userdata
        }
    }
}