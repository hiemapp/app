import { IFlowBlockManifest } from 'hiem';
import { IntlFormatters } from 'react-intl';
import FlowBlockCategoryHelper from './FlowBlockCategoryHelper';
import { IFlowBlockFormat } from 'hiem';

export default class FlowBlockHelper {
    type;
    manifest;
    format;
    extensionId;
    moduleId;

    protected category: FlowBlockCategoryHelper;

    constructor(type: string, manifest: IFlowBlockManifest, format: IFlowBlockFormat) {
        this.type = type;
        this.manifest = manifest;
        this.format = format;
        [this.extensionId, this.moduleId] = type.split('.');
    }

    getIcon() {
        return this.manifest.icon ?? this.getCategory().manifest.icon ?? 'bolt';
    }

    formatInputName(id: string, formatMessage: IntlFormatters['formatMessage']) {
        return formatMessage({
            id: this.getMessageId(`inputs.${id}.name`),
            defaultMessage: id
        })
    }

    formatTitle(formatMessage: IntlFormatters['formatMessage']) {
        return formatMessage({ 
            id: this.getMessageId('title') 
        });
    }

    formatDescription(formatMessage: IntlFormatters['formatMessage']) {
        return formatMessage({ 
            id: this.getMessageId('description'),
            defaultMessage: this.getCategory().getName(formatMessage)
        });
    }

    setCategory(category: FlowBlockCategoryHelper) {
        this.category = category;
    }

    getCategory() {
        return this.category;
    }

    getMessageId(key: string) {
        return `${this.extensionId}.flows.blocks.${this.moduleId}.${key}`;
    }

    getDefaultDef() {
        return {
            type: this.type,
            params: {}
        }
    }
}