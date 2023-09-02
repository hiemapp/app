import * as Blockly from 'blockly/core';
import type { FlowBlockCategoryManifest } from 'zylax';
import { parseColor } from '@tjallingf/react-utils';
import Color from 'color';

interface FlowBlockCategory {
    id: string;
    manifest: FlowBlockCategoryManifest;
}

let __isRegistered = false;

function CustomTheme(categories: FlowBlockCategory[]) {
    const blockStyles: Record<string, any> = {};
    
    categories.forEach(c => {
        const primaryColor = Color(parseColor(c.manifest.color || '$blue', true)!);
        
        const styleConfig = {
            colourPrimary: primaryColor.hex(),               // Primary
            colourSecondary: primaryColor.darken(0.2).hex(), // Shadow blocks
            colourTertiary: primaryColor.darken(0.2).hex()   // Border
        };

        blockStyles[`category_${c.id}_style`] = styleConfig;
    })

    const rootComputedStyle = getComputedStyle(document.getElementById('root')!);
    const fontStyle = {
        family: rootComputedStyle.getPropertyValue('font-family')
    };

    console.log(fontStyle);

    return {
        name: 'CustomTheme',
        base: Blockly.Themes.Classic,
        blockStyles: blockStyles,
        fontStyle: fontStyle,
        startHats: true
    }
}

export function registerCustomTheme(categories: FlowBlockCategory[]) {
    if(__isRegistered) return;
    __isRegistered = true;

    Blockly.Theme.defineTheme('custom', CustomTheme(categories));
}