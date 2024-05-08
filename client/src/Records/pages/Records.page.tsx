import { Page, Tile, Container, Box, Icon, LoadingIcon } from '@tjallingf/react-utils';
import { trpc } from '@/utils/trpc';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import ErrorBoundary from '@/ErrorBoundary';
import Record from '../components/Record';

const start = dayjs().subtract(7, 'd').toDate();
const end = dayjs().add(7, 'd').toDate();

// TODO: convert to tRPC
const Records: React.FunctionComponent = () => {
    console.log('render!');
    const recordingIndexQuery = trpc.recording.index.useQuery();
    console.log(recordingIndexQuery.data);
    const recordingQueries = trpc.useQueries(t => (
        recordingIndexQuery.isSuccess
            ? recordingIndexQuery.data.map(({ id }) => t.recording.getPeriod({
                id: id, 
                start: start,
                end: end
            }))
            : []
    ))

    const records = useMemo(() => recordingQueries.map(query => {  
        if(query.isLoading) {
            return null;
        }

        if(query.isError || typeof query.data.id !== 'number') {
            console.error('Failed to load records for device:', query.error);
            return null;
        }

        console.log(query.data);

        return (
            <ErrorBoundary key={query.data.id}>
                <Record />
            </ErrorBoundary>
        )
    }), [ recordingQueries ]);

    return (
        <Page id="Records">
            <Container>
                <Box direction="column" gutterY={2}>
                    {records}
                </Box>
            </Container>
        </Page>
    );
};

export default Records;
