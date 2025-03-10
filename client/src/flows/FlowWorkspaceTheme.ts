import * as Blockly from 'blockly';
import { parseColor } from '@tjallingf/react-utils';
import Color from 'color';
import FlowWorkspaceCategory from './FlowWorkspaceCategory';
import _ from 'lodash';

export function registerFlowWorkspaceTheme(wspCategories: Record<string, FlowWorkspaceCategory>) {
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

    Blockly.Theme.defineTheme('flow_workspace', {
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
    } as any);
}