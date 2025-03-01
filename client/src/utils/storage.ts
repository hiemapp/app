import localforage from 'localforage';

export const flowWorkspaceStorage = localforage.createInstance({
    name: 'flowWorkspace'
})