import FlowWorkspaceCategory from '@/flows/FlowWorkspaceCategory';
import { Box, Button, getColorValue, getPaletteColor, Icon, parseColor } from '@tjallingf/react-utils';
import { values, orderBy } from 'lodash';
import './FlowWorkspaceCategoryToolbox.scss';
import Tooltip from '@/components/Tooltip';
import { FormattedMessage } from 'react-intl';
import { useEffect, useState } from 'react';

export interface FlowWorkspaceCategoryToolboxProps extends React.PropsWithChildren {
    wspCategories: Record<string, FlowWorkspaceCategory>;
    selectedCategoryId: string|null;
    onSelect: (categoryId: string|null) => unknown;
}

const FlowWorkspaceCategoryToolbox: React.FunctionComponent<FlowWorkspaceCategoryToolboxProps> = ({
    wspCategories,
    selectedCategoryId,
    onSelect
}) => {
    console.log(selectedCategoryId);
    const categories = orderBy(values(wspCategories), 'manifest.order', 'asc');

    return (
        <div className="FlowWorkspaceCategoryToolbox">
            {categories.map(category => {
                const color = category.getColor();

                return (
                    <div 
                        className="FlowWorkspaceCategoryToolbox-item"
                        style={{
                            '--FlowWorkspaceCategoryToolbox-item-color': color
                        } as React.CSSProperties}>
                        <Tooltip message="hoi!">
                            <Button 
                                className="w-100"
                                variant="unstyled" 
                                active={selectedCategoryId === category.id}
                                onClick={() => onSelect(selectedCategoryId == category.id ? null : category.id)}
                                square>
                                <Box direction="row" gutterX={2} align="center">
                                    <div className="FlowWorkspaceCategoryToolbox-item__icon">
                                        <Icon id={category.getIcon()} size={16} weight="solid" />
                                    </div>
                                    <FormattedMessage id={`${category.extensionId}.flows.block_categories.${category.id}.title`} defaultMessage={category.id} />
                                </Box>
                            </Button> 
                        </Tooltip> 
                    </div>
                )
            })}
        </div>
    )
}

export default FlowWorkspaceCategoryToolbox;