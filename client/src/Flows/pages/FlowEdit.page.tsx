import { LoadingIcon, Page, Box, Container } from '@tjallingf/react-utils';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { lazy, Suspense } from 'react';
import { trpc } from '@/utils/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import './FlowEdit.page.scss';


const FlowEditor = lazy(() => import('../components/FlowEditor'));

const FlowEdit: React.FunctionComponent = () => {
    const { id } = useParams();
    const [LoadingIconElement] = useState(<LargeLoadingIcon label="Loading editor..." />);

    const blocks = trpc.flowEditor.listBlocks.useQuery();
    const blockCategories = trpc.flowEditor.listBlockCategories.useQuery();

    const renderEditor = () => {
        if (blocks.isLoading || blockCategories.isLoading) 
            return LoadingIconElement;

        return (
            <Suspense fallback={LoadingIconElement}>
                <FlowEditor flowId={parseInt(id!)} blocks={blocks.data!} blockCategories={blockCategories.data!} />
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
