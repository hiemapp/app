import { IFlowBlockLayout, IFlowBlockLayout_parameter, IFlowBlockLayout_parameter_type, IFlowBlockLayout_statement, IFlowBlockLayoutSerialized, IFlowBlockLayoutSerialized_parameter, IFlowBlockManifest } from 'hiem';
import Blockly from 'blockly';
import _ from 'lodash';
import { IntlShape } from 'react-intl';
import { getColorValue } from '@tjallingf/react-utils';
import FlowWorkspaceCategory from './FlowWorkspaceCategory';
import dayjs from 'dayjs';

export default class FlowWorkspaceBlock {
    static primitives: Record<string, string> = {} as any;

    type: string;
    manifest: IFlowBlockManifest;
    layout: IFlowBlockLayoutSerialized;
    category: FlowWorkspaceCategory;
    intl: IntlShape;

    extensionId: string;
    moduleId: string;

    constructor(type: string, manifest: IFlowBlockManifest, layout: IFlowBlockLayoutSerialized, category: FlowWorkspaceCategory, intl: IntlShape) {
        this.type = type;
        this.manifest = manifest;
        this.layout = layout;
        this.category = category;
        this.intl = intl;

        [this.extensionId, this.moduleId] = this.type.split('.');

        this.init();
    }

    /**
     * Get the primitive that this block is used for.
     * @returns The primitive.
     */
    getPrimitive(): string|null {
        if(typeof this.manifest.primitive !== 'string') return null;
        return this.manifest.primitive;
    }

    getToolboxLayout() {
        const shadowInputs: Record<string, any> = {};
        if(!this.getPrimitive()) {
            this.layout.parameters.forEach(param => {
                const shadow = this.toShadowInput(param);
                if(shadow) shadowInputs[param.id] = { shadow };
            })
        }

        return {
            kind: 'block',
            type: this.type,
            inputs: shadowInputs
        }
    }

    protected toShadowInput(param: IFlowBlockLayoutSerialized_parameter) {
        if(param.options) return;

        const shadow = param.shadow;
        const shadowType = (typeof shadow?.type === 'string' ? shadow.type : _.castArray(param.type)[0]);
        const type = FlowWorkspaceBlock.primitives[shadowType] || shadowType;

        if(!Blockly.Blocks[type]) return;
        
        return {
            ...shadow,
            type: type
        }
    }

    protected serializeDropdownValue(value: any) {
        return JSON.stringify(value);
    }

    protected unserializeDropdownValue(value: string) {
        return JSON.parse(value);
    }

    protected toBlocklyCheck(type: IFlowBlockLayout_parameter['type']) {
        const types = _.castArray(type);
        if(types.includes('any')) return null;
        
        return types.map(type => this.toBlocklyType(type));
    }

    protected toBlocklyType(type: string) {
        if (type === 'string') return 'String';
        if (type === 'boolean') return 'Boolean';
        if (type === 'number') return 'Number';
        if (type === 'any') return null;
        return type;
    }

    protected toDropdownInput(param: IFlowBlockLayoutSerialized_parameter) {
        if (!Array.isArray(param.options)) return null;

        const options: Blockly.MenuOption[] = param.options.map(opt => {
            let label = (opt.label ?? opt.value);
            if(typeof opt.id === 'string') {
                label = this.intl.formatMessage({
                    id: `${this.extensionId}.flows.blocks.${param.inheritLocale ?? this.moduleId}.parameters.${param.id}.options.${opt.id}.label`,
                    defaultMessage: opt.id
                })
            }

            // Replace spaces to surpress Blockly's prefix/suffix matcher.
            // See https://developers.google.com/blockly/guides/create-custom-blocks/fields/built-in-fields/dropdown#prefixsuffix_matching)
            const labelStr = (label+'').replaceAll(' ', '\u00A0');

            return [ labelStr, this.serializeDropdownValue(opt.value) ];
        });
        if (options.length === 0) options.push([param.id, '']);

        return {
            name: param.id,
            type: 'field_dropdown',
            options: options
        }
    }

    protected getOutputType() {
        const outputTypes = _.castArray(this.layout.output?.type).filter(t => typeof t === 'string');
        if(outputTypes.length === 0) return undefined;
        return outputTypes.map(type => this.toBlocklyType(type));
    }

    protected toBlocklyStatement(statement: IFlowBlockLayout_statement) {
        return {
            name: statement.id,
            type: 'input_statement'
        }
    }

    protected toBlocklyInput(param: IFlowBlockLayoutSerialized_parameter) {
        if (Array.isArray(param.options)) {
            return this.toDropdownInput(param);
        }
        
        if(param.blockly) {
            return {
                ...param.blockly,
                name: param.id,
            }
        }

        return {
            name: param.id,
            type: 'input_value',
            check: this.toBlocklyCheck(param.type)
        }
    }

    protected getStatementLabel(statement: IFlowBlockLayout_statement) {
        let label = '';

        if(statement.showLabel) {
            label = this.intl.formatMessage({ 
                id: `${this.extensionId}.flows.blocks.${this.moduleId}.statements.${statement.id}.label`,
                defaultMessage: ''
            });
        }

        return label + '%1';
    }

    /**
     * Get the message for the block.
     * @param block The block.
     * @returns The message.
     */
    protected getMessage() {
        const values: Record<string, string> = {};
        this.layout.parameters.forEach((param, i) => {
            values[param?.id] = `%${i+1}`;
        })

        return this.intl.formatMessage({ 
            id: `${this.extensionId}.flows.blocks.${this.moduleId}.label`,
            defaultMessage: this.getPrimitive()
                ? _.values(values).join(' ')
                : `${this.moduleId} ${_.values(values).join(' ')}`
        }, values);
    }

    def() {
        const def: Record<string, any> = {
            type: this.type,
            inputsInline: true,
            args0: [],
            message0: this.getMessage(),
            style: `category_${this.manifest.category}`,
            previousStatement: this.layout.connections.top ? null : undefined,
            nextStatement: this.layout.connections.bottom ? null : undefined
        };

        this.layout.parameters.forEach(param => {
            const input = this.toBlocklyInput(param);
            if(!input) return;
            def.args0.push(input);
        })

        this.layout.statements.forEach((statement, i) => {
            const blocklyStatement = this.toBlocklyStatement(statement);
            if(!blocklyStatement) return;

            def[`args${i+1}`] = [blocklyStatement];
            def[`message${i+1}`] = this.getStatementLabel(statement);
        })

        def.output = this.getOutputType();

        return def;
    }

    init() {
        const primitive = this.getPrimitive()
        if(primitive) FlowWorkspaceBlock.primitives[primitive] = this.type;

        const that = this;
        Blockly.Blocks[this.type] = {
            init: function () {
                try {
                    this.jsonInit(that.def());
                } catch(err) {
                    console.error(err);
                }
            }
        }

    }
}