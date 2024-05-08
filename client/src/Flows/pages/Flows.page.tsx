import { Page, Container, Tile, Box, Icon, colors, Button } from '@tjallingf/react-utils';
import Masonry from '@/Masonry';
import Device from '@/Devices/components/Device/Device';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc';

const Flows: React.FunctionComponent = () => {
    const flowIndexQuery = trpc.flow.index.useQuery();
    
    const flows = flowIndexQuery.data && flowIndexQuery.data.map(flow => (
        <ErrorBoundary key={flow.id}>
            <Button href={`/flows/${flow.id}/edit`} variant="unstyled" size="xs" stretch>
                <Tile size="lg" className="w-100">
                    <Tile.Title>
                        <Box gutterX={1} align="center">
                            <Icon id={flow.icon} size={20} />
                            <span className="text-truncate ms-2">{flow.name}</span>
                        </Box>
                    </Tile.Title>
                </Tile>
            </Button>
        </ErrorBoundary>
    ))

    return (
        <Page id="Flows">
            <Container>
                {flows}
            </Container>
        </Page>
    );
};

export default Flows;
