import FlowWorkspaceContext from '@/contexts/FlowWorkspaceContext';
import { useContext } from 'react';
import { IFlowWorkspaceContext } from '@/contexts/FlowWorkspaceContext';

export default function useFlowWorkspace(): IFlowWorkspaceContext {
    return useContext(FlowWorkspaceContext);
}
