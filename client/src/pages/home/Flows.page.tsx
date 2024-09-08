import { Container, Tile, Box, Icon, Button } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc/trpc';
import HomeController from '@/utils/homes/HomeController';

const Flows: React.FunctionComponent = () => {
    const flowIndexQuery = trpc.flow.index.useQuery();
    const home = HomeController.findCurrent();

    if (!flowIndexQuery.data) return null;

    return (
        <Page id="flows">
            <Container>
                <Box direction="column" gutterY={2}>
                    {flowIndexQuery.data && flowIndexQuery.data.map(flow => (
                        <ErrorBoundary key={flow.id}>
                            <Button href={home.scopePath(`/flows/${flow.id}/edit`)} variant="unstyled" size="xs" stretch>
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
                    ))}
                </Box>
            </Container>
        </Page>
    );
};

export default Flows;
