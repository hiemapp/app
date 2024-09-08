import Modal, { ModalProps } from '@/components/Modal/Modal';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import FlowEditorBlock from './FlowEditorBlock';
import './FlowEditorToolbox.scss';
import List from '@/components/List';
import useNullableMemo from '@/hooks/useNullableMemo';
import FlowBlockHelper from '@/utils/flows/editor/FlowBlockHelper';
import FlowBlockCategoryHelper from '@/utils/flows/editor/FlowBlockCategoryHelper';

export interface FlowEditorToolboxProps extends React.PropsWithChildren, Omit<ModalProps, 'onSelect'> {
    blocks: FlowBlockHelper[];
    blockCategories: FlowBlockCategoryHelper[];
    field: string | null;
    onSelect?: (block: FlowBlockHelper) => unknown;
}

const FlowEditorToolbox: React.FunctionComponent<FlowEditorToolboxProps> = ({
    blocks, blockCategories, field, onSelect, ...rest
}) => {
    const { formatMessage } = useIntl();

    function handleBlockSelect(block: FlowBlockHelper) {
        if(typeof onSelect !== 'function') return;
        onSelect(block);
    }

    return (
        <Modal {...rest}
            title={formatMessage({ id: '@main.flow_edit.editor.block_picker.title' })}>
            <div className="FlowEditorToolbox w-100">
                {blockCategories.map(category => {
                    const filteredBlocks = category.getBlocks().filter(b => b.manifest.fieldType === field);
                    if(!filteredBlocks.length) return null;

                    return (
                        <div className="FlowEditorToolbox__category mb-3">
                            <h6 className="FlowEditorToolbox__category-title fw-normal mb-3 text-muted">{category.getName(formatMessage)}</h6>
                            <List className="FlowEditorToolbox__category-blocks">
                                {filteredBlocks.map(block => (
                                    <FlowEditorBlock
                                        block={block}
                                        onClick={() => handleBlockSelect(block)} />
                                ))}
                            </List>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}

export default FlowEditorToolbox;