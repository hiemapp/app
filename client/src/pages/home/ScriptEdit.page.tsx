import { Container } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import { useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { trpc } from '@/utils/trpc/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';

const ScriptEditor = lazy(() => import('../../scripts/ScriptEditor'));

const ScriptEdit: React.FunctionComponent = () => {
    const { scriptId } = useParams();
    const id = parseInt(scriptId!);

    const codeMutation = trpc.script.code.useMutation();
    const script = trpc.script.get.useQuery({ id });

    function onEditorSave(code: string) {
        codeMutation.mutate({ id, code });
    }

    if (script.isLoading) return null;

    return (
        <Page id="script_edit">
            <Container className="h-100">
                <Suspense fallback={<LargeLoadingIcon />}>
                    <ScriptEditor 
                        filename={script.data!.name} 
                        isOpen={true} 
                        onSave={onEditorSave} 
                        defaultValue={script.data!.code} />
                </Suspense>
            </Container>
        </Page>
    );
};

export default ScriptEdit;
