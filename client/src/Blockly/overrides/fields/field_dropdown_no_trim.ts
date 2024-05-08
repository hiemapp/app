import * as Blockly from 'blockly/core';

export class FieldDropdownNoTrim extends Blockly.FieldDropdown {
    constructor(
        menuGenerator: Blockly.MenuGenerator | typeof Blockly.Field.SKIP_SETUP,
        validator?: Blockly.FieldDropdownValidator,
        config?: Blockly.FieldDropdownConfig,
    ) {
        if(menuGenerator === Blockly.Field.SKIP_SETUP) {
            super(Blockly.Field.SKIP_SETUP);
            return;
        }

        // Make sure that menuGenerator is a function, because dynamic
        // option lists don't get trimmed.
        const menuGeneratorFunc = typeof menuGenerator === 'function'
            ? menuGenerator
            : () => menuGenerator;

        super(menuGeneratorFunc, validator, config);
    }
}

Blockly.fieldRegistry.register('field_dropdown_no_trim', FieldDropdownNoTrim);