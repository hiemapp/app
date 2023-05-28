import ExtensionApi from '../zylax/extensions/api/ExtensionApi';

declare global {
    const ZYLAX: {
        api: () => typeof ExtensionApi
    }
}