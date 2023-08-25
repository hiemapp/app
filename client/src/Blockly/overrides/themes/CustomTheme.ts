import * as Blockly from 'blockly/core';
import type { FlowBlockCategoryManifest } from 'zylax';
import { findColorPalette, getColorValue, parseColor } from '@tjallingf/react-utils';
import app from '@/utils/app';

interface FlowBlockCategory {
    id: string;
    manifest: FlowBlockCategoryManifest;
}

let __isRegistered = false;

function CustomTheme(categories: FlowBlockCategory[]) {
    const blockStyles: Record<string, any> = {};
    
    categories.forEach(c => {
        const primaryColor = parseColor(c.manifest.color || '$blue', true);
        
        const styleConfig = {
            colourPrimary: primaryColor
        };

        blockStyles[`category_${c.id}_style`] = styleConfig;
    })

    return {
        name: 'CustomTheme',
        base: Blockly.Themes.Classic,
        blockStyles: blockStyles,
        startHats: true
    }
}

export function registerCustomTheme(categories: FlowBlockCategory[]) {
    if(__isRegistered) return;
    __isRegistered = true;

    Blockly.Theme.defineTheme('custom', CustomTheme(categories));
}