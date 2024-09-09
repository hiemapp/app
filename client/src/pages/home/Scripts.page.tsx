import { Container, Tile, Box, Icon, Button } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc/trpc';
import HomeController from '@/utils/homes/HomeController';

const Scripts: React.FunctionComponent = () => {
    const scriptIndexQuery = trpc.script.index.useQuery();
    const home = HomeController.findCurrent();

    if (!scriptIndexQuery.data) return null;

    return (
        <Page id="scripts">
            <Container>
                <Box direction="column" gutterY={2}>
                    {scriptIndexQuery.data && scriptIndexQuery.data.map(script => (
                        <ErrorBoundary key={script.id}>
                            <Button href={home.scopePath(`/scripts/${script.id}/edit`)} variant="unstyled" size="xs" stretch>
                                <Tile size="lg" className="w-100">
                                    <Tile.Title>
                                        <Box gutterX={1} align="center">
                                            <Icon id={script.icon} size={20} />
                                            <span className="text-truncate ms-2">{script.name}</span>
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

export default Scripts;
