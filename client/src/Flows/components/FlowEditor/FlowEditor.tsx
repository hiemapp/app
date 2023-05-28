import React, { memo, useEffect, useState, useRef } from 'react';
import { Button, Icon, Box, colorpalettes } from '@tjallingf/react-utils';
import * as Blockly from 'blockly/core';
import '@blockly/field-date';
import '@blockly/block-plus-minus';
import BlocklyWorkspace from '@/Blockly/BlocklyWorkspace';
import FlowEditorBlock from '@/utils/flows/FlowEditorBlock';
import { useIntl } from 'react-intl';
import fieldBlocks from '../../../utils/flows/blockly/fieldBlocks';
import { register as registerCustomToolboxCategory } from '@/Blockly/overrides/toolbox/CustomToolboxCategory';
import { register as registerCustomTheme } from '@/Blockly/overrides/themes/CustomTheme';
import './FlowEditor.scss';
import { trpc } from '@/utils/trpc';

export interface IFlowEditorProps {
    flowId: number;
    blocks: Array<{
        type: string;
        manifest: any;
    }>;
    blockCategories: Array<{
        extensionId: string;
        id: string;
        manifest: any;
    }>;
}
const FlowEditor: React.FunctionComponent<IFlowEditorProps> = memo(({ flowId, blocks, blockCategories }) => {
    const { formatMessage } = useIntl();
    const blocklyWorkspaceRef = useRef<Blockly.Workspace | null>(null);
    const blocklySerializerRef = useRef(new Blockly.serialization.blocks.BlockSerializer());
    const [toolbox, setToolbox] = useState(null);
    const editFlow = trpc.flow.edit.useMutation();
    const flowEditorBlocks = useRef<FlowEditorBlock[]>([]);

    const LOCAL_STORAGE_AUTOSAVE_KEY = `flows-${flowId}-autosaved`;

    function handleInject(workspace: Blockly.WorkspaceSvg) {
        blocklyWorkspaceRef.current = workspace;

        // Add change listener for autosaving
        blocklyWorkspaceRef.current.addChangeListener(handleChange);

        // Load the autosaved workspace
        loadAutoSavedWorkspace();
    }

    function handleChange(e: any) {
        if (['move', 'delete', 'change'].includes(e.type)) {
            autoSaveWorkspace();
        }
    }

    function doTestRun() {
        console.log('test', getSerializedWorkspace());
    }

    function pushEditsToServer() {
        editFlow.mutate({
            id: flowId,
            workspace: getSerializedWorkspace()
        })
    }

    function getSerializedWorkspace() {
        return blocklySerializerRef.current.save(blocklyWorkspaceRef.current!) ?? {};
    }

    function autoSaveWorkspace() {
        if (!blocklyWorkspaceRef.current) return;

        // Serialize the workspace
        const serializedState = getSerializedWorkspace();

        // Remove from the user's localStorage if the workspace is empty
        if (!serializedState) {
            localStorage.removeItem(LOCAL_STORAGE_AUTOSAVE_KEY);
            return;
        }

        // Store the serialized workspace in the user's localStorage
        localStorage.setItem(LOCAL_STORAGE_AUTOSAVE_KEY, JSON.stringify(serializedState));
    }

    function loadAutoSavedWorkspace() {
        if(!blocklyWorkspaceRef.current) return;

        try {
            const serializedState = localStorage.getItem(LOCAL_STORAGE_AUTOSAVE_KEY);
            if (serializedState?.length) {
                blocklySerializerRef.current.load(JSON.parse(serializedState), blocklyWorkspaceRef.current);
            }
        } catch (err) {
            console.error('Failed to load workspace from localStorage:', err);
        }
    }

    function registerBlocks() {
        // TODO: remove field blocks (see @zylax/core.logic_boolean)
        Blockly.defineBlocksWithJsonArray(fieldBlocks);

        blocks.forEach((block) => {
            if (!block.manifest) {
                console.error(`Invalid manifest for block '${block.type}': ${block.manifest}.`);
                return true;
            }

            const flowEditorBlock = new FlowEditorBlock(block.type, block.manifest, {
                messageFormatter: formatMessage,
                category: blockCategories.find((c) => c.id === block.manifest.category)?.manifest,
            });

            Blockly.Blocks[block.type] = flowEditorBlock.getBlocklyBlockDef();
            flowEditorBlocks.current.push(flowEditorBlock);
        });
    }

    function createToolbox(): any {
        // Enable modified toolbox categories
        registerCustomToolboxCategory();

        // Build the toolbox
        const toolboxCategories: any[] = [];

        // Register the custom theme
        registerCustomTheme(blockCategories);

        blockCategories.forEach((category) => {
            const containsBlocks = flowEditorBlocks.current.filter((b) => b.manifest.category === category.id);
            const formattedName = formatMessage({
                id: `${category.extensionId}.flows.blockCategories.${category.id}.title`,
                defaultMessage: category.id,
            });

            toolboxCategories.push({
                kind: 'category',
                manifest: category.manifest,
                name: formattedName,
                contents: containsBlocks.map((b) => b.getBlocklyToolboxDef()),
            });
        });

        toolboxCategories.sort((a, b) => {
            return a.priority > b.priority ? -1 : 1;
        })

        return {
            kind: 'categoryToolbox',
            contents: toolboxCategories,
        };
    }

    useEffect(() => {
        registerBlocks();
        setToolbox(createToolbox());
    }, []);

    if (!toolbox) return null;

    return (
        <Box direction="column" className="FlowEditor h-100 w-100">
            <Box direction="row" className="FlowEditor__toolbar p-2 w-100" gutterX={1}>
                <Button square variant="secondary" onClick={() => blocklyWorkspaceRef.current?.undo(false)}>
                    <Icon id="undo" />
                </Button>
                <Button square variant="secondary" onClick={() => blocklyWorkspaceRef.current?.undo(true)}>
                    <Icon id="redo" />
                </Button>
                <div className="FlowEditor__toolbar-divider"></div>
                <Button square variant="secondary" onClick={() => doTestRun()} primary={colorpalettes.green}>
                    <Icon id="play" />
                </Button>
                <Button square variant="secondary" onClick={() => pushEditsToServer()} primary={colorpalettes.yellow}>
                    <Icon id="sync" />
                </Button>
            </Box>
            <BlocklyWorkspace
                onInject={handleInject}
                injectOptions={{
                    toolbox: toolbox,
                    theme: 'custom',
                    renderer: 'thrasos',
                    sounds: false,
                    scrollbars: true,
                    trashcan: false
                }}
            />
        </Box>
    );
});

export default FlowEditor;
