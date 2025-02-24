import FlowWorkspaceBlock from '@/flows/FlowWorkspaceBlock';
import { trpc } from '@/utils/trpc/trpc';
import { Box, getColorValue } from '@tjallingf/react-utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Blockly from 'blockly';
import BlocklyWorkspace from '@/components/BlocklyWorkspace';
import { useIntl } from 'react-intl';
import FlowWorkspaceTheme from '@/flows/FlowWorkspaceTheme';
import FlowWorkspaceCategory from '@/flows/FlowWorkspaceCategory';
import _ from 'lodash';
import FlowWorkspaceCategoryToolbox from './FlowWorkspaceCategoryToolbox';
import './FlowWorkspace.scss';

export interface FlowWorkspaceProps extends React.PropsWithChildren {

}

const FlowWorkspace: React.FunctionComponent<FlowWorkspaceProps> = ({

}) => {
    const intl = useIntl(); 
    const workspaceRef = useRef<Blockly.WorkspaceSvg>();
    
    const blocksQuery = trpc.flowWorkspace.listBlocks.useQuery();
    const categoriesQuery = trpc.flowWorkspace.listCategories.useQuery();

    const [ wspBlocks, setWspBlocks] = useState<Record<string, FlowWorkspaceBlock>>();
    const [ wspCategories, setWspCategories ] = useState<Record<string, FlowWorkspaceCategory>>();
    const [ selectedToolboxCategoryId, setSelectedToolboxCategoryId ] = useState<string|null>(null);

    const handleWorkspaceEvent = (event: any) => {
        switch(event.type) {
            case Blockly.Events.TOOLBOX_ITEM_SELECT:
                setSelectedToolboxCategoryId(event.newItem || null);
                break;
        }
    }

    const handleInject = (workspace: Blockly.WorkspaceSvg) => {
        workspaceRef.current = workspace;
        workspaceRef.current?.addChangeListener(handleWorkspaceEvent)
    }

    const selectToolboxCategory = (categoryId: string|null) => {
        if(!workspaceRef.current) return;

        const toolbox = workspaceRef.current.getToolbox() as any;
        toolbox.setSelectedItem(toolbox.getToolboxItemById(categoryId));
    }

    useEffect(() => {
        if(!wspCategories) return;

        FlowWorkspaceTheme.register(wspCategories);

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
            <FlowWorkspaceCategoryToolbox 
                wspCategories={wspCategories} 
                selectedCategoryId={selectedToolboxCategoryId}
                onSelect={selectToolboxCategory} />
            <BlocklyWorkspace 
                onInject={handleInject}
                injectOptions={{
                    zoom: {
                        startScale: 0.8
                    },
                    grid: {
                        spacing: 20,
                        snap: true
                    },
                    toolbox,
                    renderer: 'zelos',
                    theme: 'flow_workspace',
                    sounds: false
                }} />
        </Box>
    )
}

export default FlowWorkspace;