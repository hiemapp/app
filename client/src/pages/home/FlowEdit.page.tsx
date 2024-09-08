import { Container } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import { useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { trpc } from '@/utils/trpc/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';

const FlowEditor = lazy(() => import('../../components/flows/FlowEditor'));

const FlowEdit: React.FunctionComponent = () => {
    const { flowId } = useParams();

    const flow = trpc.flow.get.useQuery({ id: parseInt(flowId!) });
    const blocks = trpc.flowEditor.listBlocks.useQuery();
    const blockCategories = trpc.flowEditor.listBlockCategories.useQuery();

    if(flow.isLoading) return null;

    const renderEditor = () => {
        if (blocks.isLoading || blockCategories.isLoading) 
            return <LargeLoadingIcon />;

        return (
            <Suspense fallback={<LargeLoadingIcon />}>
                <FlowEditor 
                    flowData={flow.data!} 
                    blockData={blocks.data!} 
                    blockCategoryData={blockCategories.data!} />
            </Suspense>
        )
    }

    return (
        <Page id="flow_edit" titleValues={{ flowName: flow.data!.name }}>
            <Container>
                {renderEditor()}
            </Container>
        </Page>
    );
};

export default FlowEdit;
