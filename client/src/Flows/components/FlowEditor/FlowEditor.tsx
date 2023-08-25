import React, { memo, useMemo, useEffect, useState, useRef } from 'react';
import { Button, Box } from '@tjallingf/react-utils';
import { Icon } from '@tjallingf/react-utils';
import * as Blockly from 'blockly/core';
import BlocklyWorkspace from '@/Blockly/BlocklyWorkspace';
import FlowEditorBlock from '@/utils/flows/FlowEditorBlock';
import { useIntl } from 'react-intl';
import fieldBlocks from '../../../utils/flows/blockly/fieldBlocks';
import { registerCustomTheme } from '@/Blockly/overrides/themes/CustomTheme';
import './FlowEditor.scss';
import { trpc } from '@/utils/trpc';
import Tooltip from '@/components/Tooltip';
import Modal from '@/components/Modal';
import FlowWorkspace from '@/utils/flows/FlowWorkspace';
import type { FlowBlockManifestSerialized, FlowBlockLayoutSerialized, FlowBlockCategoryManifest } from 'zylax';

export interface IFlowEditorProps {
    flowId: number;
    blocks: Array<{
        type: string;
        manifest: FlowBlockManifestSerialized;
        layout: FlowBlockLayoutSerialized;
    }>;
    blockCategories: Array<{
        extensionId: string;
        id: string;
        manifest: FlowBlockCategoryManifest;
    }>;
}
const FlowEditor: React.FunctionComponent<IFlowEditorProps> = memo(({ flowId, blocks, blockCategories }) => {
    const { formatMessage } = useIntl();
    const [toolboxContents, setToolboxContents] = useState([]);
    const editFlow = trpc.flow.edit.useMutation();
    const flowEditorBlocks = useRef<FlowEditorBlock[]>([]);
    let workspace = useRef<FlowWorkspace>();
    const [ error, setError ] = useState<{title?: any; message?: any; buttons?: any} | null>(null);

    const LOCAL_STORAGE_AUTOSAVE_KEY = `flows-${flowId}-autosaved`;

    function handleInject(editor: Blockly.WorkspaceSvg) {
        workspace.current = new FlowWorkspace(editor, blocks, blockCategories);

        // Add change listener for autosaving
        workspace.current.editor.addChangeListener(handleChange);
        
        loadAutoSavedWorkspace();
    }

    function handleChange(e: any) {
        if (['move', 'delete', 'change'].includes(e.type)) {
            autoSaveWorkspace();
        }
    }

    function selectToolboxItem(index: number) {
        
        return (workspace.current as any).editor.toolbox_.selectItemByPosition(index);
    }

    function doTestRun() {
        // console.log('test', getSerializedWorkspace());
    }

    function pushEditsToServer() {
        if(!workspace.current) return;

        editFlow.mutate({
            id: flowId,
            workspace: workspace.current.save()
        })
    }

    function autoSaveWorkspace() {
        if(!workspace.current) return;

        // Serialize the workspace
        const serializedState = workspace.current.save();

        // Remove from the user's localStorage if the workspace is empty
        if (!serializedState) {
            localStorage.removeItem(LOCAL_STORAGE_AUTOSAVE_KEY);
            return;
        }

        // Store the serialized workspace in the user's localStorage
        localStorage.setItem(LOCAL_STORAGE_AUTOSAVE_KEY, JSON.stringify(serializedState));
    }

    function purgeLocalWorkspace() {
        localStorage.removeItem(LOCAL_STORAGE_AUTOSAVE_KEY);
        setError(null);
    }

    function loadAutoSavedWorkspace() {
        if(!workspace.current) return;

        try {
            const stateString = localStorage.getItem(LOCAL_STORAGE_AUTOSAVE_KEY);
            if(stateString) {
                const state = JSON.parse(stateString);
                workspace.current.load(state);

                if(workspace.current.hasError()) {
                    const error = workspace.current.getError();
                    console.log(error);
                    switch(error.type) {
                        case 'INVALID_BLOCK_DEFINITION':
                            setError({
                                title: 'Invalid block definition',
                                buttons: [
                                    <Button variant="primary" onClick={() => purgeLocalWorkspace()}>
                                        Purge local workspace
                                    </Button>
                                ]
                            })
                    }
                }
            }
        } catch (err: any) {
            console.error('Failed to load workspace from localStorage:', err);
            // setError({
            //     children: (
            //         <>
            //             <span>test</span>
            //         </>
            //     ),
            //     buttons: [
            //         <Button onClick={() => setError(null)}>
            //             Close
            //         </Button>
            //     ]
            // });
        }
    }

    function registerBlocks() {
        // TODO: remove field blocks (see @zylax/core.logic_boolean)
        Blockly.defineBlocksWithJsonArray(fieldBlocks);

        blocks.forEach((block) => {
            if(!block.layout) {
                console.error(`Invalid layout for block '${block.type}': ${block.layout}.`);
            }

            if (!block.manifest) {
                console.error(`Invalid manifest for block '${block.type}': ${block.manifest}.`);
                return true;
            }

            const flowEditorBlock = new FlowEditorBlock(
                block.type,
                block.manifest,
                block.layout,
                {
                    messageFormatter: formatMessage,
                    category: blockCategories.find((c) => c.id === block.manifest.category)?.manifest!,
                },
            );

            Blockly.Blocks[block.type] = flowEditorBlock.getBlocklyBlockDef();
            flowEditorBlocks.current.push(flowEditorBlock);
        });
    }

    function getToolboxContents(): any {
        // Build the toolbox
        const categories: any[] = [];

        // Register the custom theme
        registerCustomTheme(blockCategories);

        blockCategories.forEach(category => {
            const containsBlocks = flowEditorBlocks.current.filter((b) => b.manifest.category === category.id);
            
            const formattedName = formatMessage({
                id: `${category.extensionId}.flows.blockCategories.${category.id}.title`,
                defaultMessage: category.id,
            });

            categories.push({
                kind: 'category',
                manifest: category.manifest,
                name: formattedName,
                contents: containsBlocks.map((b) => b.getBlocklyToolboxDef()),
            });
        });

        categories.sort((a, b) => a.priority > b.priority ? -1 : 1);

        return categories;
    }

    useEffect(() => {
        registerBlocks();
        setToolboxContents(getToolboxContents());
    }, []);

    const renderedToolbox = useMemo(() => {
        if(!toolboxContents.length) return null;
        
        return (
            <Box direction="column" className="FlowEditor__toolbox h-100" gutterY={1}>
                {toolboxContents.map((category: any, index) => {
                    return (
                        <Button 
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
    }, [ toolboxContents ]);

    console.log(renderedToolbox);
    
    if (!renderedToolbox) return null;

    return (
        <>
            <Modal open={error?.title} buttons={error?.buttons}>
                <h1>{error?.title}</h1>
                {error?.message}
            </Modal>
            <Box direction="column" className="FlowEditor h-100 w-100">
                <Box direction="row" className="FlowEditor__toolbar p-2 w-100" gutterX={1}>
                    <Tooltip message="@global.actions.undo">
                        <Button square variant="secondary" onClick={() => workspace.current?.editor.undo(false)}>
                            <Icon id="arrow-rotate-left" />
                        </Button>
                    </Tooltip>
                    <Tooltip message="@global.actions.redo">
                        <Button square variant="secondary" onClick={() => workspace.current?.editor.undo(true)}>
                            <Icon id="arrow-rotate-right" />
                        </Button>
                    </Tooltip>
                    <div className="FlowEditor__toolbar-divider"></div>
                    <Button square variant="secondary" onClick={() => doTestRun()} primary="green">
                        <Icon id="play" />
                    </Button>
                    <Tooltip message="@zylax/core.pages.flows.editor.actions.upload">
                        <Button square variant="secondary" onClick={() => pushEditsToServer()} primary="yellow">
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
                            sounds: false,
                            scrollbars: false,
                            trashcan: false
                        }}
                    />
                </Box>
            </Box>
        </>
    );
});

export default FlowEditor;
