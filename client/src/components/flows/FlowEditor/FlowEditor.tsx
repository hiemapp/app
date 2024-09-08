import React, { memo, useMemo, useEffect, useState, useRef } from 'react';
import { Button, Box, palettes, Tile, colors } from '@tjallingf/react-utils';
import { Icon } from '@tjallingf/react-utils';
import './FlowEditor.scss';
import { trpc } from '@/utils/trpc/trpc';
import { FlowBlockCategoryManifest, FlowProps, IFlowBlockLayoutSerialized, IFlowBlockManifest } from 'hiem';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import { FormattedMessage, useIntl } from 'react-intl';
import Modal from '@/components/Modal';
import FlowEditorToolbox from './FlowEditorToolbox';
import List from '@/components/List';
import FlowBlockHelper from '@/utils/flows/editor/FlowBlockHelper';
import FlowEditorBlock from './FlowEditorBlock';
import FlowBlockCategoryHelper from '@/utils/flows/editor/FlowBlockCategoryHelper';
import ListItem from '@/components/List/ListItem';
import FlowEditorModal from './FlowEditorModal';

export interface FlowEditorProps {
    flowData: any;
    blockData: any[],
    blockCategoryData: any[]
}

const FlowEditor: React.FunctionComponent<FlowEditorProps> = ({ 
    flowData,
    blockData,
    blockCategoryData
}) => {
    const FIELDS: Array<keyof FlowProps['workspace']['json']['fields']> = ['trigger', 'condition', 'action'];

    const [ toolboxField, setToolboxField] = useState<keyof FlowProps['workspace']['json']['fields']|null>(null);
    const [ toolboxOpen, setToolboxOpen ] = useState(false);
    const [ workspace, setWorkspace ] = useState<FlowProps['workspace']>(flowData.workspace);
    const [ editorOpen, setEditorOpen ] = useState(false);
    const [ targetBlock, setTargetBlock ] = useState<FlowBlockHelper>();

    // Create FlowBlockHelpers from blockData
    const blocks: FlowBlockHelper[] = useMemo(() => 
        blockData.map(i => new FlowBlockHelper(i.type, i.manifest, i.format)), 
    [ blockData ]);

    // Create FlowBlockCategoryHelpers from blockCategoryData
    const blockCategories = useMemo(() => 
        blockCategoryData.map(i => {
            const category = new FlowBlockCategoryHelper(i.id, i.manifest, i.extensionId)
            
            blocks.forEach(block => {
                if(block.manifest.category === category.id) {
                    category.addBlock(block);
                }
            })
            
            return category;
        }), 
    [ blockCategoryData ]);

    function handleBlockEdit(block: FlowBlockHelper) {       
        setTargetBlock(block);
        setEditorOpen(true);
    }

    function handleToolboxBlockSelect(block: FlowBlockHelper) {
        setWorkspace(workspace => {
            workspace.json.fields[toolboxField!].blocks ??= [];
            workspace.json.fields[toolboxField!].blocks.push(block.getDefaultDef());

            return {...workspace};
        })

        setToolboxOpen(false);
    }

    function renderBlocks(field: keyof FlowProps['workspace']['json']['fields']) {
        const fieldBlocks = workspace.json.fields[field].blocks;
        
        return fieldBlocks.map((def: any) => {
            const block = blocks.find(block => block.type === def.type)!;

            let onClick: any = undefined;
            if(block.format?.inputs.length) {
                onClick = () => handleBlockEdit(block);
            }

            return (
                <FlowEditorBlock 
                    block={block}
                    onClick={onClick} />
            )
        })
    }

    return (
        <>
            <div className="FlowEditor">
                <div className="d-flex flex-column">
                    {FIELDS.map(field => (
                        <div className="FlowEditor-field mb-4">
                            <h2 className="mb-3">
                                <FormattedMessage id={`@main.flow_edit.editor.fields.${field}.title`} />
                            </h2>
                            <div className="FlowEditor-field__blocks">
                                <List>
                                    {renderBlocks(field)}
                                </List>
                            </div>
                            <div className="FlowEditor-field__footer">
                                <List>
                                    <ListItem 
                                        onClick={() => { setToolboxField(field); setToolboxOpen(true) }} 
                                        title="Add a block" 
                                        description="to this field" />
                                </List>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <FlowEditorToolbox 
                blocks={blocks}
                blockCategories={blockCategories}
                field={toolboxField} 
                isOpen={toolboxOpen}
                onRequestClose={() => setToolboxOpen(false)}
                onSelect={handleToolboxBlockSelect} />
            <FlowEditorModal 
                block={targetBlock}
                isOpen={editorOpen}
                onRequestClose={() => setEditorOpen(false)} />
        </>
    )
};

export default FlowEditor;
