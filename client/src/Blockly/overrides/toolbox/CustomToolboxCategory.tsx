import { Button, colorpalettes } from '@tjallingf/react-utils';
import Icon from '@/components/Icon/Icon';
import * as Blockly from 'blockly/core';
import { RefObject, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { FlowBlockCategoryManifest } from 'zylax/types/flows/FlowBlockCategory';

interface ToolboxItemDef {
    kind: string;
    name: string;
    manifest: FlowBlockCategoryManifest;
    contents: any[]
}

let __isRegistered = false;

export default class CustomToolboxCategory extends Blockly.ToolboxCategory {
    clickTargetRef: RefObject<HTMLDivElement>

    createRowContentsContainer_() {
        const div = document.createElement('div');
        const itemDef = this.toolboxItemDef_ as any as ToolboxItemDef;

        // Determine the category accent color
        let colorValue: string;
        if(itemDef.manifest.customColors?.main) {
            colorValue = itemDef.manifest.customColors.main;
        } else {
            colorValue = (colorpalettes[itemDef.manifest.color!] || colorpalettes['blue'])[4].toString()
        }
        
        div.style.setProperty('--BlocklyWorkspace-toolbox__item-accent', colorValue);
        
        // if(itemDef.manifest.icon) {            
        //     const iconContainer = document.createElement('div');
        //     iconContainer.classList.add('blocklyTreeIconContainer');
            
        //     const iconRoot = createRoot(iconContainer);
        //     iconRoot.render(<Icon id={itemDef.manifest.icon} font="solid" />)

        //     div.querySelector('.blocklyTreeIcon')?.replaceWith(iconContainer);
        // }

        const root = createRoot(div);
        this.clickTargetRef = createRef<HTMLDivElement>();
        
        root.render(
            <div ref={this.clickTargetRef} style={{pointerEvents: 'none'}}>
                <Button variant="secondary" className="w-100" square>
                    <Icon id={itemDef.manifest.icon ?? 'question-circle'} weight="light" className="me-2" />
                    <span>{itemDef.name}</span>
                </Button>
            </div>
        )

        return div;
    }
}

export function register() {
    if(__isRegistered) return;
    __isRegistered = true;

    Blockly.registry.register(Blockly.registry.Type.TOOLBOX_ITEM, 'category', CustomToolboxCategory, true);
}