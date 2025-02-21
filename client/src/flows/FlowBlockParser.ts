import { IFlowBlockLayout, IFlowBlockLayout_parameter, IFlowBlockManifest } from 'hiem';
import Blockly from 'blockly';
import _ from 'lodash';
import { IntlShape } from 'react-intl';

export default class FlowBlockParser {
    type: string;
    manifest: IFlowBlockManifest;
    layout: IFlowBlockLayout;
    intl: IntlShape;

    constructor(type: string, manifest: IFlowBlockManifest, layout: IFlowBlockLayout, intl: IntlShape) {
        this.type = type;
        this.manifest = manifest;
        this.layout = layout;
        this.intl = intl;

        this.init();
    }

    getToolboxLayout() {
        return {
            kind: 'block',
            type: this.type,
        }
    }

    protected toBlocklyType(type: string) {
        if (type === 'string') return 'String';
        if (type === 'boolean') return 'Boolean';
        if (type === 'number') return 'Number';
        return type;
    }

    protected toDropdownInput(param: IFlowBlockLayout_parameter) {
        if (!Array.isArray(param.options)) return null;

        const options: Blockly.MenuOption[] = param.options.map((o: any) => [JSON.stringify(o.value), o.id]);
        if (options.length === 0) options.push([param.id, '']);

        return {
            name: param.id,
            type: 'field_dropdown',
            options: options
        }
    }

    protected toBooleanInput(param: IFlowBlockLayout_parameter) {
        return {
            name: param.id,
            type: 'input_value',
            check: this.toBlocklyType('boolean')
        }
    }

    protected toStringInput(param: IFlowBlockLayout_parameter) {
        return {
            name: param.id,
            type: 'input_value',
            check: this.toBlocklyType('string')
        }
    }

    protected toNumberInput(param: IFlowBlockLayout_parameter) {
        return {
            name: param.id,
            type: 'input_value',
            check: this.toBlocklyType('number')
        }
    }

    protected getOutputType() {
        const outputTypes = _.castArray(this.layout.output?.type).filter(t => typeof t === 'string');
        return outputTypes.map(type => this.toBlocklyType(type));
    }

    protected toInput(param: IFlowBlockLayout_parameter) {
        let def: Record<string, any> | null = null;

        if (Array.isArray(param.options)) {
            def = this.toDropdownInput(param);
        } else {
            switch (param.type) {
                case 'boolean':
                    def = this.toBooleanInput(param);
                    break;
                case 'string':
                    def = this.toStringInput(param);
                    break;
                case 'number':
                    def = this.toNumberInput(param);
                    break;
            }
        }

        return def;
    }

    /**
     * Get the message for the block.
     * @param block The block.
     * @returns The message.
     */
    protected getMessage() {
        const [extensionId, moduleId] = this.type.split('.');

        const values: Record<string, string> = {};
        _.castArray(this.layout.parameters).forEach((param, i) => {
            values[param.id] = `%${i+1}`;
        })

        return this.intl.formatMessage({ 
            id: `${extensionId}.flows.blocks.${moduleId}.label`,
            defaultMessage: _.values(values).join(' ') 
        }, values);
    }

    def() {
        const def: Record<string, any> = {
            type: this.type,
            args0: [],
            message0: '',
            colour: '#ff0000',
            previousStatement: this.layout.connections?.top === false ? undefined : null,
            nextStatement: this.layout.connections?.bottom === false ? undefined : null
        };

        def.message0 = this.getMessage();

        _.castArray(this.layout.parameters).forEach(param => {
            def.args0.push(this.toInput(param));
        })

        def.output = this.getOutputType();

        return def;
    }

    init() {
        const def = this.def();
        Blockly.Blocks[this.type] = {
            init: function () {
                this.jsonInit(def);
            }
        }
    }
}