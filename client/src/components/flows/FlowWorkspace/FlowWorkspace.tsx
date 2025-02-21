import FlowBlockParser from '@/flows/FlowBlockParser';
import { trpc } from '@/utils/trpc/trpc';
import { getColorValue } from '@tjallingf/react-utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Blockly from 'blockly';
import BlocklyWorkspace from '@/components/BlocklyWorkspace';
import { useIntl } from 'react-intl';

export interface FlowWorkspaceProps extends React.PropsWithChildren {

}

const FlowWorkspace: React.FunctionComponent<FlowWorkspaceProps> = ({

}) => {
    const intl = useIntl(); 
    const workspaceRef = useRef(null);
    const blocksQuery = trpc.flowWorkspace.listBlocks.useQuery();

    const parsers = useMemo(() => {
        if (!Array.isArray(blocksQuery.data)) return null;

        return blocksQuery.data.map(block => {
            return new FlowBlockParser(block.type, block.manifest, block.layout, intl);
        });
    }, [blocksQuery.data]);


    if(!parsers) return null;

    const toolbox = {
                "kind": "flyoutToolbox",
        "contents": parsers.map(p => p.getToolboxLayout())
    }
    
    return (
        <BlocklyWorkspace injectOptions={{
            grid: {
                spacing: 20
            },
            toolbox,
            renderer: 'zelos'
        }}/>
    )
}

export default FlowWorkspace;