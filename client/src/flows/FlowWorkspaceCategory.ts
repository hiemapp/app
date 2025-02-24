import _ from 'lodash';
import FlowWorkspaceBlock from './FlowWorkspaceBlock';
import { FlowBlockCategoryManifest } from 'hiem';
import { IntlShape } from 'react-intl';
import { getPaletteColor } from '@tjallingf/react-utils';

export default class FlowWorkspaceCategory {
    id: string;
    manifest: FlowBlockCategoryManifest;
    extensionId: string;
    intl: IntlShape;

    constructor(id: string, manifest: FlowBlockCategoryManifest, extensionId: string, intl: IntlShape) {
        this.id = id;
        this.manifest = manifest;
        this.extensionId = extensionId;
        this.intl = intl;
    }

    getToolboxLayout(wspBlocks: Record<string, FlowWorkspaceBlock>) {
        const categoryBlocks = _.values(wspBlocks).filter(block => this.hasBlock(block));

        return {
            kind: 'category',
            name: this.id,
            toolboxitemid: this.id,
            contents: categoryBlocks
                // .filter(block => !block.getPrimitive())
                .map(block => block.getToolboxLayout())
        }
    }

    getColor(transpose = -2) {
        return getPaletteColor(this.manifest.color || '$blue-4').transpose(transpose);
    }

    getIcon() {
        return this.manifest.icon || 'question-mark';
    }

    hasBlock(block: FlowWorkspaceBlock) {
        return block.manifest.category === this.id;
    }
}