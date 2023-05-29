import type { DashboardWidgetManifest, SerializedNode } from 'zylax';
import { Fragment } from 'react';
import Icon from '@/components/Icon/Icon';
import { Button, Tile, Box } from '@tjallingf/react-utils';

export interface DashboardWidgetProps {
    manifest: DashboardWidgetManifest;
    content: SerializedNode;
    handleWidgetNodeEvent: (e: React.SyntheticEvent, node: SerializedNode) => unknown
}

const ALLOWED_TAGS = [
    'p', 'span', 'a',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'div'
];

const ALLOWED_COMPONENTS: Record<string, React.ComponentType> = {
    Fragment, Icon, Button
}

function resolveWidgetElement(tag: string): string | React.ComponentType | undefined {
    const firstLetter = tag.substring(0, 1);
    const isComponent = (firstLetter === firstLetter.toUpperCase());

    if (isComponent) {
        return ALLOWED_COMPONENTS[tag];
    } else {
        return tag.toLowerCase();
    }
}

const DashboardWidget: React.FunctionComponent<DashboardWidgetProps> = ({
    content,
    manifest,
    handleWidgetNodeEvent
}) => {
    function renderNode(node: SerializedNode): string | null | React.ReactNode {
        if (node.text) {
            return node.text;
        } else if (node.tag) {
            const Element = resolveWidgetElement(node.tag);
            if (!Element) {
                console.warn(`Can not find widget element '${node.tag}'.`);
                return null;
            }

            if (typeof Element === 'string' && !ALLOWED_TAGS.includes(node.tag)) {
                console.warn(`Illegal widget element: '${node.tag}'.`);
                return null;
            }

            const props = node.attributes ?? {};
            if (node.events) {
                node.events.forEach(event => {
                    props[event] = (e: React.SyntheticEvent) => {
                        handleWidgetNodeEvent(e, node);
                    };
                })
            }

            return (
                // @ts-ignore
                <Element {...props}>
                    {node.children && node.children.map(renderNode)}
                </Element>
            )
        }

        return null;

    }

    return (
        <Tile className="DashboardWidget">
            <Box direction="column">
                <Tile.Title className="DashboardWidget__title">
                    <Box className="p-1" align="center" gutterX={1}>
                        <Icon id={manifest.icon} size={20} weight="solid" color={manifest.color} />
                        <span className="text-truncate ms-2">{manifest.title}</span>
                    </Box>
                </Tile.Title>
                <div className="DashboardWidget__content">
                    {renderNode(content)}
                </div>
            </Box>
        </Tile>
    )
};

export default DashboardWidget;
