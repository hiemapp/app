import * as Blockly from 'blockly/core';

export interface IFlowWorkspaceError {
    type: 'INVALID_BLOCK_DEFINITION',
    data: Record<string, any>
}

export default class FlowWorkspace {
    protected blocks: any[];
    protected blockCategories: any[];
    protected serializer: Blockly.serialization.blocks.BlockSerializer;
    public editor: Blockly.Workspace;
    protected errors: IFlowWorkspaceError[] = [];
    
    constructor(editor: Blockly.Workspace, blocks: any[], blockCategories: any[]) {
        this.editor = editor;
        this.blocks = blocks;
        this.blockCategories = blockCategories;
        this.serializer = new Blockly.serialization.blocks.BlockSerializer();
    }

    save() {
        return this.serializer.save(this.editor);
    }

    load(state: { languageVersion: number, blocks: any[] }) {
        try {
            this.serializer.load(state, this.editor);
        } catch(err: any) {
            const parts = err.message.split(': ');

            if(parts[0] === 'Invalid block definition for type') {
                const blockType = parts[1];
                this.addError({
                    type: 'INVALID_BLOCK_DEFINITION',
                    data: {
                        blockType: blockType 
                    }
                })
            }
        }
    }

    hasError() {
        return this.errors.length > 0;
    }

    getError() {
        return this.errors[0];
    }

    protected addError(error: IFlowWorkspaceError) {
        this.errors[0] = error;
    }
}