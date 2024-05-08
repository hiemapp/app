import React, { memo, useMemo, useEffect, useState, useRef } from 'react';
import { Button, Box, palettes } from '@tjallingf/react-utils';
import { Icon } from '@tjallingf/react-utils';
import BlocklyWorkspace from '@/components/BlocklyWorkspace';
import FlowEditorBlock from '@/utils/flows/editor/FlowEditorBlock';
import { useIntl } from 'react-intl';
import { registerCustomTheme } from '@/blockly/overrides/themes/CustomTheme';
import './FlowEditor.scss';
import { trpc } from '@/utils/trpc/trpc';
import Tooltip from '@/components/Tooltip';
import Modal from '@/components/Modal';
import type { IFlowBlockManifest, IFlowBlockLayoutSerialized, FlowBlockCategoryManifest } from 'hiem';
import * as Blockly from 'blockly';

// Register custom fields
import '@/blockly/overrides/fields/field_dropdown_async';
import '@/blockly/overrides/fields/field_dropdown_no_trim';

export interface IFlowEditorData {
    initialized: boolean;
    serializer: Blockly.serialization.blocks.BlockSerializer;
    workspace: Blockly.WorkspaceSvg;
    blocks: any[];
}

export interface IFlowEditorProps {
    flowId: number;
    blocks: Array<{
        type: string;
        manifest: IFlowBlockManifest;
        layout: IFlowBlockLayoutSerialized;
    }>;
    blockCategories: Array<{
        extensionId: string;
        id: string;
        manifest: FlowBlockCategoryManifest;
    }>;
}

const editor: IFlowEditorData = {
    initialized: false,
    serializer: new Blockly.serialization.blocks.BlockSerializer(),
    blocks: []
} as any;

const FlowEditor: React.FunctionComponent<IFlowEditorProps> = memo(({ 
    flowId, 
    blocks, 
    blockCategories
}) => {
    const { formatMessage } = useIntl();
    const [toolboxContents, setToolboxContents] = useState<any[]>([]);
    const [renderedToolbox, setRenderedToolbox] = useState<any>();
    const editFlow = trpc.flow.edit.useMutation();
    const flow = trpc.flow.get.useQuery({ id: flowId });
    const [ error, setError ] = useState<{title?: any; message?: any; buttons?: any} | null>(null);

    useEffect(() => {
        if(!editor.initialized) {
            editor.initialized = true;
            registerBlocks();
        }

        const toolboxContents = getToolboxContents();
        const renderedToolbox = renderToolbox(toolboxContents);
        
        setToolboxContents(toolboxContents);
        setRenderedToolbox(renderedToolbox);
    }, []);

    function loadState(state: any) {
        if(!editor.workspace || !state?.blocks?.length) return;
        try {
            editor.serializer.load(state, editor.workspace);
        } catch(err) {
            console.error(err);
            editor.serializer.load({ languageVersion: 0, blocks: [] }, editor.workspace);
        }
    }

    function handleInject(workspaceSvg: Blockly.WorkspaceSvg) {
        editor.workspace = workspaceSvg;
        editor.workspace.addChangeListener(handleChange);
        loadState(flow.data!.state);
    }

    function handleChange(e: any) {
        if (['move', 'delete', 'change'].includes(e.type)) {
            // autoSaveWorkspace();
        }
    }

    function selectToolboxItem(index: number) {
        return (editor.workspace as any).toolbox_.selectItemByPosition(index);
    }

    function pushEditsToServer() {
        if(!editor.workspace) return;
        const state = editor.serializer.save(editor.workspace);

        editFlow.mutate({
            id: flowId,
            state: state
        })
    }

    function registerBlocks() {
        blocks.forEach(block => {
            const editorBlock: FlowEditorBlock = new FlowEditorBlock(
                block.type,
                block.manifest,
                block.layout,
                { formatMessage, flowId },
            );

            Blockly.Blocks[block.type] = editorBlock.getBlocklyDefinition();
            editor.blocks.push(editorBlock);
        });
    }

    function getToolboxContents(): any {
        // Build the toolbox
        const categories: any[] = [];

        // Register the custom theme
        registerCustomTheme(blockCategories);

        blockCategories.forEach(category => {
            const containsBlocks = editor.blocks.filter((b) => b.manifest.category === category.id);
            
            const formattedName = formatMessage({
                id: `${category.extensionId}.flows.block_categories.${category.id}.title`,
                defaultMessage: category.id,
            });

            categories.push({
                kind: 'category',
                manifest: category.manifest,
                name: formattedName,
                contents: containsBlocks.map((b) => b.getBlocklyToolboxDefinition()),
            });
        });

        const sortedCategories = categories.sort((a, b) => a.manifest.priority > b.manifest.priority ? -1 : 1);
        return sortedCategories;
    }

    function renderToolbox(toolboxContents: any[]) {       
        return (
            <Box direction="column" className="FlowEditor__toolbox h-100" gutterY={1}>
                {toolboxContents.map((category: any, index) => {
                    return (
                        <Button key={category.name}
                            square
                            variant="secondary"
                            className="w-100" 
                            onClick={() => selectToolboxItem(index)}>
                            <Icon color={category.manifest.color} id={category.manifest.icon} />
                            <span>{category.name}</span>
                        </Button>
                    )
                })}
            </Box>
        )
    }
    
    if (!toolboxContents.length) return null;
    if(!flow.data) return null;

    return (
        <>
            <Modal isOpen={!!error}>
                <h1>{error?.title}</h1>
                <div className="mb-3">
                    {error?.message}
                </div>
                {error?.buttons}
            </Modal>
            <Box direction="column" className="FlowEditor h-100 w-100">
                <Box direction="row" className="FlowEditor__toolbar px-2 w-100" gutterX={1}>
                    <Tooltip message="@main.actions.undo.label">
                        <Button square variant="secondary" onClick={() => editor.workspace.undo(false)}>
                            <Icon id="arrow-rotate-left" />
                        </Button>
                    </Tooltip>
                    <Tooltip message="@main.actions.redo.label">
                        <Button square variant="secondary" onClick={() => editor.workspace.undo(true)}>
                            <Icon id="arrow-rotate-right" />
                        </Button>
                    </Tooltip>
                    <div className="FlowEditor__toolbar-divider"></div>
                    <Button square variant="secondary" accent={palettes.GREEN[4]}>
                        <Icon id="play" />
                    </Button>
                    <Tooltip message="@main.actions.upload.label">
                        <Button square variant="secondary" onClick={() => pushEditsToServer()} accent={palettes.GREEN[4]}>
                            <Icon id="arrow-up-from-bracket" />
                        </Button>
                    </Tooltip>
                </Box>
                <Box direction="row" wrap={false} className="h-100 w-100">
                    {renderedToolbox}
                    <BlocklyWorkspace
                        onInject={handleInject}
                        injectOptions={{
                            toolbox: { kind: 'categoryToolbox', contents: toolboxContents },
                            theme: 'custom',
                            renderer: 'thrasos',
                            sounds: false
                        }}
                    />
                </Box>
            </Box>
        </>
    );
});

export default FlowEditor;
