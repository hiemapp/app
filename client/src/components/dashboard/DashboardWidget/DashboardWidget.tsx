// @ts-ignore
import type { DashboardWidgetManifest } from 'hiem';
import { memo } from 'react';
import { Icon } from '@tjallingf/react-utils';
import { Tile, Box } from '@tjallingf/react-utils';

export interface DashboardWidgetProps {
    data: {
        manifest: DashboardWidgetManifest;
        content?: any;
    }
}

const DashboardWidget: React.FunctionComponent<DashboardWidgetProps> = memo(({
    data
}) => {
    const { manifest, content } = data;

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
                    
                </div>
            </Box>
        </Tile>
    )
});

export default DashboardWidget;
