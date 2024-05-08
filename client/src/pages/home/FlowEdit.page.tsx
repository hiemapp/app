import { Page } from '@tjallingf/react-utils';
import { useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { trpc } from '@/utils/trpc/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';

const FlowEditor = lazy(() => import('../../components/flows/FlowEditor'));

const FlowEdit: React.FunctionComponent = () => {
    const { flowId } = useParams();
    console.log(flowId);

    const blocks = trpc.flowEditor.listBlocks.useQuery();
    const blockCategories = trpc.flowEditor.listBlockCategories.useQuery();

    const renderEditor = () => {
        if (blocks.isLoading || blockCategories.isLoading) 
            return <LargeLoadingIcon />;

        return (
            <Suspense fallback={<LargeLoadingIcon />}>
                <FlowEditor 
                    flowId={parseInt(flowId!)} 
                    blocks={blocks.data!} 
                    blockCategories={blockCategories.data!} />
            </Suspense>
        )
    }


    return (
        <Page id="FlowEdit">
            {renderEditor()}
        </Page>
    );
};

export default FlowEdit;
