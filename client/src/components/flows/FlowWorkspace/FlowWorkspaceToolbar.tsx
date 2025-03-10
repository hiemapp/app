import { Box, Button, Icon } from '@tjallingf/react-utils';
import './FlowWorkspaceToolbar.scss';
import { Flow, InferSchema } from 'hiem';
import * as Blockly from 'blockly';
import { useEffect, useReducer } from 'react';

export interface FlowWorkspaceToolbarProps extends React.PropsWithChildren {
    flow: InferSchema<Flow>;
    workspace: Blockly.WorkspaceSvg | undefined;
    onSave: () => unknown;
    onToolboxOpen: () => unknown
}

const FlowWorkspaceToolbar: React.FunctionComponent<FlowWorkspaceToolbarProps> = ({
    flow,
    workspace,
    onSave,
    onToolboxOpen
}) => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        if (!workspace) return;

        workspace.addChangeListener(handleWorkspaceEvent);
    }, [workspace]);

    const handleWorkspaceEvent = (event: any) => {
        switch (event.type) {
            case Blockly.Events.BLOCK_CHANGE:
            case Blockly.Events.BLOCK_CREATE:
            case Blockly.Events.BLOCK_DELETE:
            case Blockly.Events.BLOCK_MOVE:
                forceUpdate();
                break;
        }
    }

    const handleUndo = () => {
        if (!workspace) return;
        workspace.undo(false);
    }

    const handleRedo = () => {
        if (!workspace) return;
        workspace.undo(true);
    }

    return (
        <div className="FlowWorkspaceToolbar">
            <Box gutterX={2}>
                <Button variant="primary" accent="$green-4"
                    onClick={onSave}>
                    <Icon id="play" weight="solid" size={16} className="me-1" />
                    Run
                </Button>
                <Button variant="link" square accent="$blue-4"
                    onClick={handleUndo}
                    disabled={!workspace || !workspace.getUndoStack().length}>
                    <Icon id="undo" />
                </Button>
                <Button variant="link" square accent="$blue-4"
                    onClick={handleRedo}
                    disabled={!workspace || !workspace.getRedoStack().length}>
                    <Icon id="redo" />
                </Button>
            </Box>
        </div>
    )
}

export default FlowWorkspaceToolbar;