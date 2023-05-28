import { createContext } from 'react';

export interface IFlowWorkspaceContext extends Object {
    program: any;
    getBlockConfig: (id: string) => any;
    getBlockManifest: (type: string) => any;
    refreshDynamicBlockManifest: (type: string, args: { [key: string]: any }) => Promise<any>;
}

const FlowWorkspaceContext = createContext({} as IFlowWorkspaceContext);
export default FlowWorkspaceContext;
