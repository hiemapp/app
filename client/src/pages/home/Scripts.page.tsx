import { Container, Tile, Box, Icon, Button } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc/trpc';
import { useEffect, useState } from 'react';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import ScriptEditor from '@/scripts/ScriptEditor/ScriptEditor';

const Scripts: React.FunctionComponent = () => {
    const [ scriptId, setScriptId ] = useState<number|null>(null);
    const [ editorValue, setEditorValue ] = useState('');
    
    const scriptIndexQuery = trpc.script.index.useQuery();
    const scriptQuery = trpc.script.get.useQuery({ id: scriptId! }, { enabled: false });

    useEffect(() => {
        if(!scriptQuery.data) return;

        setEditorValue(scriptQuery.data.code);
    }, [ scriptQuery.data ]);

    function openEditor(scriptId: number) {
        setScriptId(scriptId);
    }

    if (!scriptIndexQuery.data) return <LargeLoadingIcon />;

    return (
        <Page id="scripts">
            <Container>
                <Box direction="column" gutterY={2}>
                    {scriptIndexQuery.data && scriptIndexQuery.data.map(script => (
                        <ErrorBoundary key={script.id}>
                            <Button onClick={() => openEditor(script.id)} variant="unstyled" size="xs" stretch>
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
                    <ScriptEditor 
                        defaultValue={editorValue} 
                        isOpen={typeof scriptId === 'string'}
                        filename={scriptQuery.data?.name!}
                        onRequestClose={() => setScriptId(null)} />
                </Box>
            </Container>
        </Page>
    );
};

export default Scripts;
