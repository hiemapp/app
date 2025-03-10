import FlowWorkspaceMenu, { FlowWorkspaceMenuContent } from '@/components/flows/FlowWorkspace/FlowWorkspaceMenu';
import * as Blockly from 'blockly';
import React from 'react';

export class FlowWorkspaceMenuField extends Blockly.FieldDropdown {
    static setMenuContent: React.Dispatch<React.SetStateAction<FlowWorkspaceMenuContent>>;

    constructor(value: any, validator: any, config: any) {
        super(value, validator, config);
    }

    showEditor_(...args: any[]): void {
        FlowWorkspaceMenuField.setMenuContent({ options: this.getOptions(), show: true });
        // super.showEditor_(...args);
    }
}

export function registerFieldFlowWorkspaceMenu(setMenuContent: React.Dispatch<React.SetStateAction<FlowWorkspaceMenuContent>>) {
    FlowWorkspaceMenuField.setMenuContent = setMenuContent;
    Blockly.fieldRegistry.register('field_menu', FlowWorkspaceMenuField);
}