import { Container } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import { useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { trpc } from '@/utils/trpc/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import Modal from '@/components/Modal';

const FlowWorkspace = lazy(() => import('../../components/flows/FlowWorkspace'));

const FlowEdit: React.FunctionComponent = () => {
    const { flowId } = useParams();

    const flow = trpc.flow.get.useQuery({ id: flowId! });
    const blocks = trpc.flowEditor.listBlocks.useQuery();
    const blockCategories = trpc.flowEditor.listBlockCategories.useQuery();

    if(flow.isLoading) return null;

    const renderEditor = () => {
        if (blocks.isLoading || blockCategories.isLoading) 
            return <LargeLoadingIcon />;

        return (
            <Suspense fallback={<LargeLoadingIcon />}>
                <FlowWorkspace flow={flow.data!} />
            </Suspense>
        )
    }

    return (
        <Page id="flow_edit" titleValues={{ flowName: flow.data!.name }} plain>
            {renderEditor()}
        </Page>
    );
};

export default FlowEdit;
