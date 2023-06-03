import type { DashboardWidgetManifest, SerializedElement } from 'zylax';
import { memo } from 'react';
import Icon from '@/components/Icon/Icon';
import { Tile, Box } from '@tjallingf/react-utils';
import { renderElement, type EventHandler } from '@/utils/dynamicUi';
import './DashboardWidget.scss';

export interface DashboardWidgetProps {
    manifest: DashboardWidgetManifest;
    content?: SerializedElement;
    eventHandler: EventHandler
}

const DashboardWidget: React.FunctionComponent<DashboardWidgetProps> = memo(({
    content,
    manifest,
    eventHandler
}) => {
    return (
        <Tile className="DashboardWidget">
            <Box direction="column">
                <Tile.Title className="DashboardWidget__title">
                    <Box className="p-1" align="center" gutterX={1}>
                        <Icon id={manifest.icon} size={20} weight="solid" color={manifest.color} />
                        <span className="text-truncate ms-2">{manifest.title}</span>
                    </Box>
                </Tile.Title>
                <div className="DashboardWidget__content w-100 px-1">
                    {content ? renderElement(content, eventHandler) : null}
                </div>
            </Box>
        </Tile>
    )
}, (prev, next) => prev.content === next.content);

export default DashboardWidget;
