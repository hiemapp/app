import FlowWorkspaceBlock from '@/flows/FlowWorkspaceBlock';
import { trpc } from '@/utils/trpc/trpc';
import { Box } from '@tjallingf/react-utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import BlocklyWorkspace from '@/components/BlocklyWorkspace';
import { useIntl } from 'react-intl';
import { registerFlowWorkspaceTheme } from '@/flows/FlowWorkspaceTheme';
import FlowWorkspaceCategory from '@/flows/FlowWorkspaceCategory';
import _ from 'lodash';
import FlowWorkspaceCategoryToolbox from './FlowWorkspaceCategoryToolbox';
import './FlowWorkspace.scss';
import FlowWorkspaceToolbar from './FlowWorkspaceToolbar';
import type { Flow, InferSchema } from 'hiem';
import { flowWorkspaceStorage } from '@/utils/storage';
import { registerFieldColour } from '@blockly/field-colour';
import { registerFieldFlowWorkspaceMenu } from '@/flows/FlowWorkspaceMenuField';
import FlowWorkspaceMenu, { FlowWorkspaceMenuContent } from './FlowWorkspaceMenu';

export interface FlowWorkspaceProps extends React.PropsWithChildren {
    flow: InferSchema<Flow>
}

const FlowWorkspace: React.FunctionComponent<FlowWorkspaceProps> = ({
    flow
}) => {
    const intl = useIntl(); 
    
    const blocksQuery = trpc.flowWorkspace.listBlocks.useQuery();
    const categoriesQuery = trpc.flowWorkspace.listCategories.useQuery();
    const saveMutation = trpc.flow.save.useMutation({
        onSuccess: () => clearWorkspaceDraft()
    });

    const modalRef = useRef();
    const [ isToolboxOpen, setToolboxOpen ] = useState(false);
    const [ menuContent, setMenuContent ] = useState<FlowWorkspaceMenuContent>({ options: [], show: false });
    const [ workspace, setWorkspace ] = useState<Blockly.WorkspaceSvg>();
    const [ wspBlocks, setWspBlocks] = useState<Record<string, FlowWorkspaceBlock>>();
    const [ wspCategories, setWspCategories ] = useState<Record<string, FlowWorkspaceCategory>>();
    const [ selectedToolboxCategoryId, setSelectedToolboxCategoryId ] = useState<string|null>(null);

    const handleSave = () => {
        saveMutation.mutate({
            id: flow.id,
            state: serializeWorkspace()
        })
    }

    const serializeWorkspace = () => {
        if(!workspace) return;
        return Blockly.serialization.workspaces.save(workspace);
    }
    
    const loadWorkspace = async () => {
        if(!workspace) return;
        const draft = await getWorkspaceDraft();
        Blockly.serialization.workspaces.load(draft ? draft.state : flow.state, workspace);
    }

    const clearWorkspaceDraft = () => {
        return flowWorkspaceStorage.removeItem(`workspaces.${flow.id}`);
    }

    const saveWorkspaceDraft = () => {
        const state = serializeWorkspace();
        return flowWorkspaceStorage.setItem(`workspaces.${flow.id}`, {
            changedAt: Date.now(),
            state: state
        });
    }
    const saveWorkspaceDraftDebounced = useCallback(_.debounce(saveWorkspaceDraft, 1000), [ workspace ]);

    const getWorkspaceDraft = async () => {
        if(!workspace) return;
        try {
            const draft = await flowWorkspaceStorage.getItem(`workspaces.${flow.id}`) as any;
            if(!draft?.state) return;
            return draft;
        } catch(err) {
            console.error(err);
        }
    }

    const handleWorkspaceEvent = (event: any) => {
        switch(event.type) {
            case Blockly.Events.TOOLBOX_ITEM_SELECT:
                setSelectedToolboxCategoryId(event.newItem || null);
                break;
            case Blockly.Events.BLOCK_CHANGE:
            case Blockly.Events.BLOCK_CREATE:
            case Blockly.Events.BLOCK_DELETE:
            case Blockly.Events.BLOCK_MOVE:
                saveWorkspaceDraftDebounced();
                break;
        }
    }

    const selectToolboxCategory = (categoryId: string|null) => {
        if(!workspace) return;
        const toolbox = workspace.getToolbox() as any;
        toolbox.setSelectedItem(toolbox.getToolboxItemById(categoryId));
    }

    useEffect(() => {
        if(!workspace) return;

        workspace.addChangeListener(handleWorkspaceEvent);
        loadWorkspace();
    }, [ workspace ]);

    useEffect(() => {
        if(!wspCategories) return;

        registerFlowWorkspaceTheme(wspCategories);
        registerFieldColour();
        registerFieldFlowWorkspaceMenu(setMenuContent);

        setWspBlocks(_.chain(blocksQuery.data)
            .filter(block => !!wspCategories[block.manifest.category])
            .mapValues(block => 
                new FlowWorkspaceBlock(block.type, block.manifest, block.layout, wspCategories![block.category], intl))
            .keyBy('type')
        .value());
    }, [ wspCategories ]);

    useEffect(() => {
        if (!blocksQuery.data || !categoriesQuery.data) return;

        setWspCategories(_.chain(categoriesQuery.data!)
            .mapValues(category => 
                new FlowWorkspaceCategory(category.id, category.manifest, category.extensionId, intl))
            .keyBy('id')
        .value())
    }, [ blocksQuery.data, categoriesQuery.data ]);

    if(!wspBlocks || !wspCategories) return null;

    const toolbox = {
        kind: 'categoryToolbox',
        contents: _.values(wspCategories).map(category => category.getToolboxLayout(wspBlocks))
    }
    
    return (
        <Box className="FlowWorkspace">
            <FlowWorkspaceMenu 
                content={menuContent}
                onRequestClose={() => setMenuContent(m => ({...m, show: false}))} />
            <FlowWorkspaceCategoryToolbox 
                wspCategories={wspCategories} 
                selectedCategoryId={selectedToolboxCategoryId}
                onSelect={selectToolboxCategory} />
            <Box direction="column" className="w-100 h-100">
                <FlowWorkspaceToolbar
                    flow={flow} 
                    workspace={workspace}
                    onSave={handleSave}
                    onToolboxOpen={() => setToolboxOpen(true)} />
                <BlocklyWorkspace 
                    onInject={setWorkspace}
                    injectOptions={{
                        zoom: {
                            startScale: 0.9
                        },
                        grid: {
                            spacing: 20,
                            snap: true
                        },
                        toolbox,
                        renderer: 'thrasos',
                        theme: 'flow_workspace',
                        sounds: false
                    }} />
            </Box>
        </Box>
    )
}

export default FlowWorkspace;