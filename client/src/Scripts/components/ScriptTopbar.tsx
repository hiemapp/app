import { Box, Button, Icon, palettes } from '@tjallingf/react-utils';
import Tooltip from '@/components/Tooltip/Tooltip';
import type { editor } from 'monaco-editor';
import { trpc } from '@/utils/trpc';
import './ScriptTopbar.scss';

export interface ScriptTopbarProps extends React.PropsWithChildren {
    scriptId: number,
    editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

const ScriptTopbar: React.FunctionComponent<ScriptTopbarProps> = ({
    scriptId,
    editorRef
}) => {
    const uploadMutation = trpc.scriptEditor.update.useMutation();

    function handleUpload() {
        if(!editorRef.current) {
            throw new Error('editorRef.current is not set.');
        }

        uploadMutation.mutate({
            id: scriptId,
            code: editorRef.current.getValue()
        })
    }

    return (
        <Box className="ScriptTopbar" direction="column">
            <Box className="ScriptTopbar__toolbar p-2">
                <Tooltip message="UPLOAD">
                    <Button square variant="secondary" accent={palettes.GREEN[4]} onClick={handleUpload}>
                        <Icon id="arrow-up-from-bracket"></Icon>
                    </Button>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default ScriptTopbar;