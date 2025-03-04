import * as Blockly from 'blockly';
import type { FlowBlockCategoryManifest } from 'hiem';
import { getColorValue, parseColor } from '@tjallingf/react-utils';
import Color from 'color';
import FlowWorkspaceCategory from './FlowWorkspaceCategory';
import _ from 'lodash';

export default class FlowWorkspaceTheme {
    static def(wspCategories: Record<string, FlowWorkspaceCategory>): Blockly.Theme {
        const blockStyles: Record<string, any> = {};

        _.values(wspCategories).forEach(category => {
            const color = new Color(parseColor(category.getColor(), true));

            const styleConfig = {
                colourPrimary:   color.hex(),               // Primary
                colourSecondary: color.darken(0.2).hex(),  // Shadow blocks
                colourTertiary:  color.darken(0.3).hex()   // Border
            };

            blockStyles[`category_${category.id}`] = styleConfig;
        })

        const rootComputedStyle = getComputedStyle(document.getElementById('root')!);

        return {
            name: 'FlowWorkspaceTheme',
            base: Blockly.Themes.Classic,
            blockStyles: blockStyles,
            fontStyle: {
                family: rootComputedStyle.getPropertyValue('font-family'),
                weight: '600'
            },
            startHats: true,
            componentStyles: {
                workspaceBackgroundColour: 'var(--FlowWorkspace-background)',
                flyoutBackgroundColour: 'var(--FlowWorkspace__flyout-background)'
            }
        } as any;
    }

    static register(wspCategories: Record<string, FlowWorkspaceCategory>) {
        Blockly.Theme.defineTheme('flow_workspace', this.def(wspCategories));
    }
}