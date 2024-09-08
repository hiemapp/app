import { FlowBlockCategoryManifest, IFlowBlockManifest } from 'hiem';
import FlowBlockHelper from './FlowBlockHelper';
import { IntlFormatters } from 'react-intl';
import { getPaletteColor } from '@tjallingf/react-utils';

export default class FlowBlockCategoryHelper {
    id;
    extensionId;
    manifest;

    protected blocks: FlowBlockHelper[];

    constructor(id: string, manifest: FlowBlockCategoryManifest, extensionId: string) {
        this.manifest = manifest;
        this.blocks = [];
        this.extensionId = extensionId;
        this.id = id;
    }

    addBlock(block: FlowBlockHelper) {
        this.blocks.push(block);
        block.setCategory(this);
    }

    getBlocks() {
        return this.blocks;
    }

    getName(formatMessage: IntlFormatters['formatMessage']) {
        return formatMessage({ id: this.getMessageId('title'), defaultMessage: this.id });
    }

    getPalette() {
        return getPaletteColor(this.manifest.color).palette;
    }

    getMessageId(key: string) {
        return `${this.extensionId}.flows.block_categories.${this.id}.${key}`;
    }
}