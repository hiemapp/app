import * as Blockly from 'blockly/core';
const UNKNOWN_OPTION_TEXT = '...';

export class FieldDropdownAsync extends Blockly.FieldDropdown {
    constructor() {
        super(Blockly.Field.SKIP_SETUP);
    }

    getOptions(useCache?: boolean) {
        if(!this.menuGenerator_) return [];
        return super.getOptions(useCache);
    }

    getText_() {
        if(!(this as any).selectedOption) return UNKNOWN_OPTION_TEXT;
        return super.getText_();
    }

    setOptions(options: Blockly.MenuOption[]) {
        this.menuGenerator_ = options;

        const isValueValid = options.some(opt => opt[1] === this.value_);
        
        if(!isValueValid) {
            this.setValue(options[0][1]);
        } else {
            this.setValue(this.value_!, false);
        }

        this.forceRerender();
    } 

    setValue(newValue: string, fireChangeEvent?: boolean) {
        super.setValue(newValue, fireChangeEvent);
        super.doValueUpdate_(newValue);
    }
}

Blockly.fieldRegistry.register('field_dropdown_async', FieldDropdownAsync);