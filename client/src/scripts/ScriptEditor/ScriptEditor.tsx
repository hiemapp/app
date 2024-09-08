import LargeLoadingIcon from '@/LargeLoadingIcon';
import { trpc } from '@/utils/trpc/trpc';
import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import { Button, getColorValue, Icon, Tile } from '@tjallingf/react-utils';
import { editor } from 'monaco-editor';
import './ScriptEditor.scss';
import Modal from '@/components/Modal';
import { ModalProps } from '@/components/Modal/Modal';
import { useIntl } from 'react-intl';
import Tooltip from '@/components/Tooltip';
import { useRef } from 'react';

export interface ScriptEditorProps extends React.PropsWithChildren, ModalProps {
    filename: string;
    defaultValue?: string;
    onSave?: (value: string) => unknown
}

const ScriptEditor: React.FunctionComponent<ScriptEditorProps> = ({
    defaultValue,
    filename,
    onSave,
    ...rest
}) => {
    const libs = trpc.scriptEditor.libs.useQuery(); 
    const { formatMessage } = useIntl();
    const editorRef = useRef<editor.IStandaloneCodeEditor>();

    function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editor;

        // // Set compiler options
        // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        //     module: monaco.languages.typescript.ModuleKind.System,
        //     target: monaco.languages.typescript.ScriptTarget.ES2020
        // })

        // Add the libraries that were fetched from the server
        monaco.languages.typescript.typescriptDefaults.setExtraLibs(libs.data!) 
    }

    function handleUndo() {
        editorRef.current!.trigger(null, 'undo', null)
    }

    function handleRedo() {
        editorRef.current!.trigger(null, 'redo', null)
    }

    function handleSave() {
        const value = editorRef.current!.getValue();
        
        if(typeof onSave === 'function') {
            onSave(value);
        }
    }

    if(libs.isLoading) return <LargeLoadingIcon />;

    return (
        <Modal 
            title={formatMessage({ id: '@main.textEditor.title' }, { filename })} 
            {...rest}>
            <div className="ScriptEditor overflow-hidden rounded-1">
                <div className="ScriptEditor__toolbar d-flex flex-row align-items-center p-2">
                    <Tooltip message="@main.actions.undo.label">
                        <Button variant="link" accent="$blue-4" square onClick={handleUndo}>
                            <Icon id="undo" />
                        </Button>
                    </Tooltip>
                    <Tooltip message="@main.actions.redo.label">
                        <Button variant="link" accent="$blue-4" square onClick={handleRedo}>
                            <Icon id="redo" />
                        </Button>
                    </Tooltip>
                    <div className="ScriptEditor__toolbar-divider"></div>
                    <Tooltip message="@main.actions.upload.label">
                        <Button variant="link" accent="$green-4" square onClick={handleSave}>
                            <Icon id="cloud-arrow-up" />
                        </Button>
                    </Tooltip>
                </div>
                <Editor 
                    className="ScriptEditor__editor"
                    defaultLanguage="typescript" 
                    defaultValue={defaultValue}
                    height="100%"
                    theme="vs-dark"
                    options={{
                        formatOnPaste: true,
                        value: '',
                        minimap: {
                            enabled: false
                        },
                        renderLineHighlight: 'none'
                    }}
                    onMount={handleEditorDidMount} />
            </div>
        </Modal>
    )
}

export default ScriptEditor;