import { lazy, Suspense, useRef } from 'react';
import { Page } from '@tjallingf/react-utils';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import { useParams } from 'react-router';
import './ScriptEdit.page.scss';
import ScriptTopbar from '../components/ScriptTopbar';
import type { editor } from 'monaco-editor';

const ScriptEditor = lazy(() => import('../components/ScriptEditor'));

const ScriptEdit: React.FunctionComponent = () => {
    const scriptId = parseInt(useParams().id!);
    const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

    return (
        <Page id="ScriptEdit">
            <Suspense fallback={<LargeLoadingIcon key="ScriptEdit__loading" />}>
                <ScriptTopbar scriptId={scriptId} editorRef={editorRef} />
                <ScriptEditor scriptId={scriptId} editorRef={editorRef} />
            </Suspense>
        </Page>
    )
}

export default ScriptEdit;