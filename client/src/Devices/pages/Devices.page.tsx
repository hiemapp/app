import { Page, Container } from '@tjallingf/react-utils';
import Masonry from '@/Masonry';
import Device from '@/Devices/components/Device/Device';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc';
import useSocketEvent from '@/hooks/useSocketEvent';

const Devices: React.FunctionComponent = () => {
    const deviceIndexQuery = trpc.device.index.useQuery();
    const deviceQueries = trpc.useQueries(t => (
        deviceIndexQuery.isSuccess
            ? deviceIndexQuery.data.map(({ id }) => t.device.get({ id }))
            : []
    ))
    const deviceInputMutation = trpc.device.handleInput.useMutation();

    useSocketEvent('devices:change', ({ device }) => {
        deviceQueries.find(q => q.data?.id === device.id)?.refetch?.();
    });

    function handleInput(id: number, name: string, value: any) {
        deviceInputMutation.mutate({ 
            id: id, 
            values: [{ name, value }]
        });
    }

    const devices = deviceQueries.map(query => {  
        if(query.isLoading) {
            return null;
        }

        if(query.isError || typeof query.data.id !== 'number') {
            console.error('Failed to load device:', query.error);
            return null;
        }

        return (
            <ErrorBoundary key={query.data.id}>
                <Device 
                    data={query.data} 
                    dataUpdatedAt={query.dataUpdatedAt}
                    handleInput={(n, v) => handleInput(query.data.id, n, v)} />
            </ErrorBoundary>
        )
    })

    return (
        <Page id="devices">
            <Container>
                <Masonry
                    breakpointCols={{ default: 6, 1200: 5, 992: 3, 768: 3, 576: 2, 575.98: 1 }}
                    className="flex-row align-items-start">
                    {devices}
                </Masonry>
            </Container>
        </Page>
    );
};

export default Devices;
