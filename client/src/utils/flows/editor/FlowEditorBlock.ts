import { FieldDropdown, type BlockSvg } from 'blockly';
import { IntlShape } from 'react-intl';
import type { IFlowBlockManifest, IFlowBlockLayout_parameter, IFlowBlockLayoutSerialized, IFlowBlockLayout_statement, IFlowBlockLayoutSerialized_parameter } from 'hiem';
import { getShadowBlock } from './helpers';
import { trpcProxyClient } from '@/utils/trpc/trpc';
import { FieldDropdownAsync } from '@/blockly/overrides/fields/field_dropdown_async';

export interface FlowEditorBlockOptions {
    formatMessage: IntlShape['formatMessage'];
    flowId: number;
}

export default class FlowEditorBlock {
    type: string;
    extensionId: string;
    blockName: string;
    options: FlowEditorBlockOptions;
    manifest: IFlowBlockManifest;
    layout: IFlowBlockLayoutSerialized;
    def: any;

    /** For caching dynamic parameter layouts. */
    dynamicParamLayoutQueries: Record<string, {
        layout?: IFlowBlockLayoutSerialized_parameter;
        isFetching?: boolean;
        callbacks: Array<() => unknown>;
    }> = {};

    constructor(type: string, manifest: IFlowBlockManifest, layout: IFlowBlockLayoutSerialized, options: FlowEditorBlockOptions) {
        this.type = type;
        this.manifest = manifest;
        this.layout = layout;
        this.options = options;
        [this.extensionId, this.blockName] = type.split('.');
    }

    getBlocklyToolboxDefinition() {
        let inputs: {[key: string]: any} = {};
        
        if(this.layout.parameters?.length) {
            this.layout.parameters.forEach(param => {
                // Dropdown fields can't have a shadow block
                if (param.options) return true;

                const shadow = this.getBlocklyShadow(param);

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

    remapParam(param: IFlowBlockLayoutSerialized_parameter) {
        if (param.options || param.provider) {
            param.options = Array.isArray(param.options) ? param.options : [];
            const options = param.options.map(option => this.remapOption(option, param));

            return {
                name: param.id,
                type: param.provider ? 'field_dropdown_async' : 'field_dropdown_no_trim',
                options: options,
                ...(param.blockly || {}),
            };
        }

        return {
            name: param.id,
            type: 'input_value',
            check: this.remapParamType(param.type),
            ...(param.blockly || {}),
        };
    }

    protected remapStatement(statement: IFlowBlockLayout_statement): [any, any] {
        const arg = [
            {
                name: statement.id,
                type: 'input_statement',
            },
        ];

        let label = '';
        // Statement labels are disabled by default, but they can be enabled.
        if(statement.showLabel === true) {
            label = this.options.formatMessage({
                id: `${this.extensionId}.flows.blocks.${statement.inheritLocale ?? this.blockName}.statements.${statement.id}.label`,
                defaultMessage: ' ',
            });
        }

        // Trim any spaces from the label and append the placeholder.
        // When no label is found, the message will be only the placeholder.
        const message = label.trim() + '%1';

        return [ arg, message ];
    }

    getBlocklyShadow(param: IFlowBlockLayout_parameter) {
        const shadowType = param.shadow?.type ?? param?.type;
        if(typeof shadowType !== 'string') return undefined;

        return getShadowBlock(shadowType, param.shadow?.value) ?? {
            type: shadowType
        }
    }

    getBlocklyDefinition() {
        const jsonDef = this.getBlocklyJSONDefinition();
        const originalThis = this;

        return {
            init: function (this: BlockSvg) {
                this.jsonInit(jsonDef);
            },
            onchange: function(this: BlockSvg, e: any) {
                originalThis.handleBlockEvent(this, e);
            }
        };
    }

    handleBlockEvent(blockSvg: BlockSvg, e: any) {   
        switch(e.type) {
            case 'change':
                return this.handleBlockChange(blockSvg, e);
            case 'create':
                return this.handleBlockCreate(blockSvg, e);
        }
    }

    /**
     * Fetches the dynamic parameter layout for the given parameter, or
     * reads it from cache.
     * @param values The values of the block.
     * @param paramId The parameter id to get the options for.
     */
    async getDynamicParamLayout(blockSvg: BlockSvg, paramId: string) {
        return new Promise<any>(async (resolve, reject) => {
            // Create a record of the field values that the parameter depends on
            const values: Record<string, string> = {};
            if(Array.isArray(this.layout.parameters)) {
                // Find the param with the dynamic layout
                const param = this.layout.parameters.find(p => p.id === paramId);

                // Return if the param does not have any dependencies
                if(!Array.isArray(param?.provider?.dependencies)) return;

                // Get and store the value of every dependency
                param.provider.dependencies.forEach(dependencyParamId => {
                    values[dependencyParamId] = blockSvg.getFieldValue(dependencyParamId);
                })
            }

            // The query key to uniquely identify this query
            const queryKey = paramId+';'+JSON.stringify(values);
            this.dynamicParamLayoutQueries[queryKey] ??= { callbacks: [] };
            const query = this.dynamicParamLayoutQueries[queryKey];

            // Return if the layout has already been fetched
            if(query.layout) {
                resolve(query.layout);
                return;
            }

            // If the layout has not yet been received, add an 'onSuccess' callback
            query.callbacks.push(() => {
                resolve(query.layout);
            })
            
            // If the layout is not being fetched yet, fetch it now.
            if(!query.isFetching) {
                query.isFetching = true;
                    
                // Fetch the dynamic param layout from the server
                query.layout = await trpcProxyClient.flowEditor.getDynamicParamLayout.query({
                    flowId: this.options.flowId,
                    blockId: blockSvg.id,
                    blockType: blockSvg.type,
                    paramId: paramId,
                    values: values
                }) as IFlowBlockLayoutSerialized_parameter;

                // Call all callbacks
                query.callbacks.forEach(cb => cb());
                query.callbacks = [];
            }
        })
    }

    async updateDynamicParam(blockSvg: BlockSvg, paramId: string) {
        const field = blockSvg.getField(paramId);
        if(!field) return;

        const dynamicLayout = await this.getDynamicParamLayout(blockSvg, paramId);
        if(!dynamicLayout) return;
        
        const { options } = this.remapParam(dynamicLayout);
        if(field instanceof FieldDropdownAsync && options.length > 0) {
            field.setOptions(options);
        }
        
        // // Unrender all fields and inputs, and store the current field values.
        // const fieldValues: Record<string, any> = {};
        // block.inputList.forEach(input => {
        //     input.fieldRow.forEach(field => {
        //         fieldValues[field.name!] = field.getValue();
        //         input.removeField(field.name!);
        //         field.dispose();
        //     })

        //     block.removeInput(input.name);
        //     input.dispose();
        // })
        // block.inputList = [];
        // block.inputList.length = 0;

        // // Update layout parameters
        // this.layout.parameters = this.layout.parameters.map(param => {
        //     if(param.id !== dynamicLayout.id) return param;
        //     return {...param, ...omit(dynamicLayout, 'provider')};
        // })

        // // Reinitialize the block
        // const jsonDef = this.getBlocklyJSONDefinition();
        // block.jsonInit(jsonDef);

        // const toolboxDef = this.getBlocklyToolboxDefinition();
        // block.inputList.forEach(input => {
        //     const shadow = toolboxDef.inputs[input.name]?.shadow;
        //     console.log(input.name, { input, shadow });
        //     if(!shadow) return;

        //     const dom = Blockly.utils.xml.textToDom(
        //         `<xml><shadow type="${shadow.type}"></shadow></xml>`
        //     );
        //     input.setShadowDom(dom.children[0]);
        // })

        // // Update the field values
        // forOwn(fieldValues, (oldValue, name) => {
        //     const field = block.getField(name);
        //     if(!field) return;
        //     field.setValue(oldValue, false);
        // })
    }

    handleBlockCreate(block: BlockSvg, e: any) {
        if(!Array.isArray(this.layout.parameters)) return;     

        // Update all dynamic params
        this.layout.parameters.forEach(param => {
            if(!param.provider) return;
            this.updateDynamicParam(block, param.id);
        })
    }

    handleBlockChange(block: BlockSvg, e: any) {
        if(!Array.isArray(this.layout.parameters)) return;

        const paramId = e.name;

        // Update all dynamic params that depend on the changed param
        this.layout.parameters.forEach(param => {
            if(!param.provider) return;
            if(!param.provider.dependencies?.includes?.(paramId)) return;

            this.updateDynamicParam(block, param.id);
        })
    }

    getBlocklyJSONDefinition() {
        // If the block has an output type, connections are disabled by default.
        const connectionsDefault = (typeof this.layout.output?.type === 'undefined');

        const def: Record<string, any> = {
            type: this.type,

            previousStatement: (this.layout.connections?.top ?? connectionsDefault) === false ? undefined : null,
            nextStatement: (this.layout.connections?.bottom ?? connectionsDefault) === false ? undefined : null,

            helpUrl: this.layout.helpUrl,

            inputsInline: true,
            output: this.remapParamType(this.layout.output?.type),

            style: `category_${this.manifest.category}_style`
        };

        if(this.layout.parameters?.length) {
            def['args0'] = this.layout.parameters.map((p) => this.remapParam(p));
        }

        def['message0'] = this.formatMessage(this.layout.parameters || []);

        if(this.layout.statements?.length) {
            this.layout.statements.forEach((statement, i) => {
                const [ args, message ] = this.remapStatement(statement);
                def[`args${i+1}`] = args;
                def[`message${i+1}`] = message;
            });
        }

        return def;
    }

    protected remapParamType(type: any) {
        return type === 'any' ? null : type;
    }

    protected remapOption(option: any, param: IFlowBlockLayout_parameter): [string, any] {
        // Force label and value to be a string
        let label = option.label ?? option.value;
        let value = option.value;
        let id = option.id ?? option.value;

        // If no label is specified, try to find a translated label
        if(typeof option.label !== 'string') {
            const messageId = `${this.extensionId}.flows.blocks.${param.inheritLocale ?? this.blockName}.parameters.${param.id}.options.${id}.label`;
            label = this.options.formatMessage({
                id: messageId,
                defaultMessage: id,
            });
        }

        return [label+'', value+''];
    }

    protected formatMessage(params: IFlowBlockLayout_parameter[]) {
        let defaultMessage = params.map((_, i) => `%${i + 1}`).join(' ');

        let values: Record<string, string> = {};
        params.forEach((param, i) => (values[param.id] = `%${i + 1}`));

        const formattedMessage = this.options.formatMessage(
            {
                id: `${this.extensionId}.flows.blocks.${this.blockName}.label`,
                defaultMessage: defaultMessage,
            },
            values,
        );

        return formattedMessage;
    }
}
