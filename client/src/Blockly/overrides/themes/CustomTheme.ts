import * as Blockly from 'blockly/core';
import { FlowBlockCategoryManifest } from 'zylax/types/flows/FlowBlockCategory';
import { findColorPalette, getColorValue } from '@tjallingf/react-utils';
import app from '@/utils/app';

interface FlowBlockCategory {
    id: string;
    manifest: FlowBlockCategoryManifest;
}

let __isRegistered = false;

function CustomTheme(categories: FlowBlockCategory[]) {
    const blockStyles: Record<string, any> = {};
    
    categories.forEach(c => {
        let styleConfig;

        if(typeof c.manifest.customColors?.main === 'string') {
            styleConfig = {
                colourPrimary: c.manifest.customColors.main,
                colourSecondary: c.manifest.customColors.shadow,
                colourTertiary: c.manifest.customColors.border
            };
        } else {
            const colorpalette = findColorPalette(c.manifest.color, 'blue');
            const isDarkScheme = (app().currentColorScheme() === 'dark');

            styleConfig = {
                colourPrimary: getColorValue(colorpalette[5]),
                colourSecondary: getColorValue(colorpalette[3]),
                colourTertiary: getColorValue(colorpalette[isDarkScheme ? 3 : 6])
            };
        }

        blockStyles[`category_${c.id}_style`] = styleConfig;
    })
    console.log({ blockStyles });

    return {
        name: 'CustomTheme',
        base: Blockly.Themes.Classic,
        blockStyles: blockStyles,
        startHats: true
    }
}

export default CustomTheme;
export function register(categories: FlowBlockCategory[]) {
    if(__isRegistered) return;
    __isRegistered = true;

    Blockly.Theme.defineTheme('custom', CustomTheme(categories));
}