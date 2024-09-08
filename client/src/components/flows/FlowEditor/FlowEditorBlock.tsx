import { useIntl } from 'react-intl';
import './FlowEditorBlock.scss';
import List from '@/components/List';
import { ListItemProps } from '@/components/List/ListItem';
import FlowBlockHelper from '@/utils/flows/editor/FlowBlockHelper';
import FlowBlockCategoryHelper from '@/utils/flows/editor/FlowBlockCategoryHelper';

export interface IFlowEditorBlockProps extends Partial<ListItemProps> {
    block?: FlowBlockHelper;
    [key: string]: any;
}

const UNKNOWN_CATEGORY = new FlowBlockCategoryHelper('unknown', { color: 'red' }, '@hiem/core');
const UNKNOWN_BLOCK = new FlowBlockHelper('unknown', { icon: 'error' } as any, { inputs: [] });
UNKNOWN_CATEGORY.addBlock(UNKNOWN_BLOCK);

const FlowEditorBlock: React.FunctionComponent<IFlowEditorBlockProps> = ({
    block: nullableBlock,
    ...rest
}) => {
    const { formatMessage } = useIntl();

    // Show error block for blocks that can't be found
    const block = nullableBlock instanceof FlowBlockHelper ? nullableBlock : UNKNOWN_BLOCK;

    return (
        <List.Item {...rest}
            className="FlowEditorBlock" 
            palette={block.getCategory().getPalette()}
            icon={block.getIcon()}
            title={block.formatTitle(formatMessage)}
            description={block.formatDescription(formatMessage)} />
    )
}

export default FlowEditorBlock;