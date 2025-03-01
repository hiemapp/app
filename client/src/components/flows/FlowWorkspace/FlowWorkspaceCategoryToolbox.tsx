import FlowWorkspaceCategory from '@/flows/FlowWorkspaceCategory';
import { Box, Button, Icon } from '@tjallingf/react-utils';
import { values, orderBy } from 'lodash';
import './FlowWorkspaceCategoryToolbox.scss';
import { FormattedMessage } from 'react-intl';

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
                    </div>
                )
            })}
        </div>
    )
}

export default FlowWorkspaceCategoryToolbox;