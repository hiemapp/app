import { Container } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import Masonry from '@/Views';
import Device from '@/components/devices/Device';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc/trpc';
import useSocketEvent from '@/hooks/useSocketEvent';
import { useMemo } from 'react';

const Devices: React.FunctionComponent = () => {
    const deviceIndexQuery = trpc.device.index.useQuery();
    const utils = trpc.useUtils();
    const deviceQueries = trpc.useQueries(t => (
        deviceIndexQuery.isSuccess
            ? deviceIndexQuery.data.map(({ id }) => t.device.get({ id }))
            : []
    ))

    useSocketEvent('device:update', data => {
        utils.device.get.setData({ id: data.device.id }, oldData => {
            if(!oldData) return;

            return {...oldData, ...data.device};
        })

        // deviceQueries.find(q => q.data?.id === data.device.id)?.refetch?.();
    });

    const devices = useMemo(() => deviceQueries.map(query => {  
        if(query.isLoading) {
            return null;
        }

        if(query.isError || typeof query.data.id !== 'number') {
            console.error('Failed to load device:', query.error);
            return null;
        }

        // Don't show dummy devices
        if(query.data.options.dummy === true) {
            return null;
        }

        return (
            <ErrorBoundary key={query.data.id}>
                <Device 
                    data={query.data} 
                    dataUpdatedAt={query.dataUpdatedAt} />
            </ErrorBoundary>
        )
    }), [ deviceQueries ]);

    return (
        <Page id="devices">
            <Container>
                <Masonry
                    breakpointCols={{ default: 5, 1200: 4, 900: 3, 550: 2 }}
                    className="flex-row align-items-start">
                    {devices}
                </Masonry>
            </Container>
        </Page>
    );
};

export default Devices;
