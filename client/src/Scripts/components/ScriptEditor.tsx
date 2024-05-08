import { Editor as MonacoEditor } from '@monaco-editor/react';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { parseColor } from '@tjallingf/react-utils';
import * as monaco from 'monaco-editor';
import { useRef, useEffect } from 'react';
import { trpc } from '@/utils/trpc';

export interface ScriptEditorProps extends React.PropsWithChildren {
    scriptId: number;
    editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>
}

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: 'default',
    language: 'typescript',
    minimap: {
        enabled: false
    },
    renderLineHighlight: "none"
}

const themeData: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        {
            token: 'comment',
            foreground: parseColor('$gray-6', true),
            fontStyle: 'italic'
        }
    ],
    colors: {
        'editor.background': parseColor('$gray-0', true)!
    }
}

// compiler options
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    strict: true,
    lib: ["es2021"] // 'lib' must be lowercase.
});

// Define web workers
(window as any).MonacoEnvironment = {
    getWorker(_: string, label: string) {
        if (label === 'javascript' || label === 'typescript') {
            return new tsWorker();
        }

        return new editorWorker();
    },
};

const ScriptEditor: React.FunctionComponent<ScriptEditorProps> = ({
    scriptId,
    editorRef
}) => {
    const libQuery = trpc.scriptEditor.apiTypes.useQuery();
    const scriptQuery = trpc.script.get.useQuery({ id: scriptId });
    const editorElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!libQuery.isSuccess) return;

        const source = libQuery.data.types;
        const url = 'js:zylax.d.ts';
        monaco.languages.typescript.typescriptDefaults.addExtraLib(source, url);
        const model = monaco.editor.createModel(source, "javascript", monaco.Uri.parse(url));

        return () => {
            model.dispose();
        }
    }, [ libQuery.isSuccess ])

    useEffect(() => {
        monaco.editor.defineTheme('default', themeData); 
    }, []);

    useEffect(() => {
        if(!scriptQuery.isSuccess || !scriptQuery.data) return;

        // Ignore if the editor is already mounted
        if(editorRef.current) return;

        if(editorElementRef.current) {
            editorRef.current = monaco.editor.create(
                editorElementRef.current, 
                { ...editorOptions, value: scriptQuery.data.code }
            );
        }
    }, [ scriptQuery.isSuccess ]);

    return (
        <div ref={editorElementRef} className="h-100 w-100"></div>
    )
}

export default ScriptEditor;