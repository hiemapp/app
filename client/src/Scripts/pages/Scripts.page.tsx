import { Page, Container, Tile, Button, Box, Icon } from '@tjallingf/react-utils';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc';

const Scripts: React.FunctionComponent = () => {
    const scriptIndexQuery = trpc.script.index.useQuery();
    
    const scripts = scriptIndexQuery.data && scriptIndexQuery.data.map(script => (
        <ErrorBoundary key={script.id}>
            <Button href={`/scripts/${script.id}/edit`} variant="unstyled" size="xs" stretch>
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
    ))

    return (
        <Page id="Scripts">
            <Container>
                {scripts}
            </Container>
        </Page>
    )
}

export default Scripts;