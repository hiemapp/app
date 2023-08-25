import { IntlShape } from 'react-intl';
import type { FlowBlockManifestSerialized, FlowBlockLayoutParameter, FlowBlockLayoutParameterOption, FlowBlockLayoutParameterShadowType, FlowBlockLayoutSerialized } from 'zylax';
import type { FlowBlockCategoryManifest } from 'zylax';

export interface FlowEditorBlockOptions {
    messageFormatter: IntlShape['formatMessage'];
    onChange?: (event: string, data: any) => void;
    category: FlowBlockCategoryManifest;
}

export default class FlowEditorBlock {
    type: string;
    extensionId: string;
    blockName: string;
    options: FlowEditorBlockOptions;
    manifest: FlowBlockManifestSerialized;
    layout: FlowBlockLayoutSerialized;

    constructor(type: string, manifest: FlowBlockManifestSerialized, layout: FlowBlockLayoutSerialized, options: FlowEditorBlockOptions) {
        this.type = type;
        this.manifest = manifest;
        this.layout = layout;
        this.options = options;

        [this.extensionId, this.blockName] = type.split('.');
    }

    getBlocklyToolboxDef() {
        let inputs: {[key: string]: any} = {};
        
        if(this.layout.parameters?.length) {
            this.layout.parameters.forEach((param: FlowBlockLayoutParameter) => {
                // Dropdown fields can't have a shadow block
                if (param.options) return true;

                const shadow = this.getShadow(param);

                // Prevent a block from having itself as a shadow (this is the case with math_number etc.)
                if (shadow?.type === this.type) return;

                if (!shadow) {
                    console.error(
                        `No field block exists for parameter type '${param.type}', used in parameter '${param.id}'.`,
                    );
                    return true;
                }

                inputs[param.id] = {
                    shadow: shadow,
                };
            });
        }

        return {
            kind: 'block',
            type: this.type,
            inputs: inputs,
        };
    }

    getBlocklyParameterDefJSON(param: FlowBlockLayoutParameter): Object | false {
        if (param.options) {
            const options = param.options.map((option: FlowBlockLayoutParameterOption) => 
                this.#formatOptionLabel(option, param));

            return {
                name: param.id,
                type: 'field_dropdown',
                options: options.length ? options : [[ 'NULL', 'NULL' ]],
                ...(param.blockly || {}),
            };
        }

        return {
            name: param.id,
            type: 'input_value',
            check: param.type === 'any' ? null : param.type,
            ...(param.blockly || {}),
        };
    }

    getShadow(param: FlowBlockLayoutParameter) {
        let shadowType: FlowBlockLayoutParameterShadowType = param.type;

        if (typeof param.shadow?.type === 'string') {
            shadowType = param.shadow.type;
        }

        switch (shadowType) {
            case 'boolean':
                return {
                    type: '@zylax/core.logic_boolean',
                    fields: {
                        BOOLEAN: param.shadow?.value ?? true,
                    },
                };
            case 'string':
                return {
                    type: '__type_string__',
                    fields: {
                        VALUE: param.shadow?.value ?? '',
                    },
                };
            case 'number':
                return {
                    type: '@zylax/core.math_number',
                    fields: {
                        NUMBER: param.shadow?.value ?? 3,
                    },
                };
            case 'date.now':
                return {
                    type: '@zylax/core.datetime_now'
                };
            case 'date.time':
                return {
                    type: '@zylax/core.datetime_time'
                };
            case 'date':
                return {
                    type: '@zylax/core.datetime_date'
                };
            default:
                return null;
        }
    }

    getBlocklyBlockDef() {
        const jsonDef = this.getBlocklyBlockDefJSON();
        const originalThis = this;

        return {
            init: function (this: any) {
                this.jsonInit(jsonDef);
            },

            onchange: function (this:any, e: any) {
                if (this.isInFlyout) return;
                if (this.id !== e.blockId) return;

                originalThis.options.onChange?.(e.type, e);

                // switch (e.type) {
                //     case 'move':
                //         originalThis.emit('move');
                //         break;
                //     case 'change':
                //         const param = originalthis.layout.parameters.find((p) => p.name === e.name);
                //         if (!param) return;

                //         originalThis.#emitEvent('change', {
                //             name: e.name,
                //             oldValue: parseFieldValue(e.oldValue, param.type),
                //             newValue: parseFieldValue(e.newValue, param.type),
                //         });
                //         break;
                //     default:
                //         return;
                // }
            },
        };
    }

    getBlocklyBlockDefJSON() {
        // Connections enabled if the block has an output type, disabled otherwise.
        const connectionsDefault = (typeof this.layout.output?.type === 'undefined');

        const def: Record<string, any> = {
            type: this.type,

            previousStatement: (this.layout.connections?.top ?? connectionsDefault) === false ? undefined : null,
            nextStatement: (this.layout.connections?.bottom ?? connectionsDefault) === false ? undefined : null,

            helpUrl: this.layout.helpUrl,

            inputsInline: true,
            output: this.layout.output?.type,

            style: `category_${this.manifest.category}_style`
        };

        if(this.layout.parameters?.length) {
            def['args0'] = this.layout.parameters.map((p) => this.getBlocklyParameterDefJSON(p));
        }

        def['message0'] = this.#formatMessage(this.layout.parameters || []);

        if(this.layout.statements?.length) {
            this.layout.statements.forEach((statement, i) => {
                def[`args${i + 1}`] = [
                    {
                        name: statement.id,
                        type: 'input_statement',
                    },
                ];

                
                let label = '';
                // Statement labels are disabled by default, but they can be enabled.
                if(statement.showLabel === true) {
                    label = this.options.messageFormatter({
                        id: `${this.extensionId}.flows.blocks.${this.blockName}.statements.${statement.id}.label`,
                        defaultMessage: ' ',
                    });
                }

                // Trim any spaces from the label and append the placeholder.
                // When no label is found, the message will be only the placeholder.
                const message = label.trim() + '%1';
                def[`message${i + 1}`] = message;
            });
        }

        return def;
    }

    #formatOptionLabel(option: FlowBlockLayoutParameterOption, param: FlowBlockLayoutParameter): [string, any] {
        let { value, label, key } = option;

        // Force label and value to be a string
        label = (label || value) + '';
        value = value + '';

        // If a key is defined, get the translated label
        if (key) {
            label = this.options.messageFormatter({
                id: `${this.extensionId}.flows.blocks.${this.blockName}.parameters.${param.id}.options.${key}.label`,
                defaultMessage: key || label || value,
            });
        }

        return [label, value];
    }

    #formatMessage(params: FlowBlockLayoutParameter[]) {
        let defaultMessage = params.map((_, i) => `%${i + 1}`).join(' ');

        let values: Record<string, string> = {};
        params.forEach((param, i) => (values[param.id] = `%${i + 1}`));

        const formattedMessage = this.options.messageFormatter(
            {
                id: `${this.extensionId}.flows.blocks.${this.blockName}.label`,
                defaultMessage: defaultMessage,
            },
            values,
        );

        return formattedMessage;
    }
}
