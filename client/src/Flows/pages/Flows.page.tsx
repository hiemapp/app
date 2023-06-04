import { Page, Container, Tile, Box, Icon, colors, Button } from '@tjallingf/react-utils';
import Masonry from '@/Masonry';
import Device from '@/Devices/components/Device/Device';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc';
import useSocketEvent from '@/hooks/useSocketEvent';
const { textMuted } = colors;

const Flows: React.FunctionComponent = () => {
    const flowIndexQuery = trpc.flow.index.useQuery();
    
    const flows = flowIndexQuery.data && flowIndexQuery.data.map(flow => (
        <Button to={`/flows/${flow.id}/edit`} variant="unstyled" size="xs" stretch>
            <Tile size="lg" className="w-100">
                <Tile.Title>
                    <Box gutterX={1}>
                        <Icon id={flow.icon} size={20} />
                        <span className="text-truncate ms-2">{flow.name}</span>
                    </Box>
                </Tile.Title>
            </Tile>
        </Button>
    ))

    return (
        <Page id="flows">
            <Container>
                {flows}
            </Container>
        </Page>
    );
};

export default Flows;
