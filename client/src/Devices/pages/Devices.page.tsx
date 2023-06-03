import { Page, Container } from '@tjallingf/react-utils';
import { useMemo } from 'react';
import Masonry from '@/Masonry';
import Device from '@/Devices/components/Device/Device';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc';
import useSocketEvent from '@/hooks/useSocketEvent';

const Devices: React.FunctionComponent = () => {
    const devicesQuery = trpc.device.list.useQuery();
    const deviceInputMutation = trpc.device.handleInput.useMutation();

    useSocketEvent('devices:change', () => {
        devicesQuery.refetch();
    });

    function handleInput(id: number, name: string, value: any) {
        deviceInputMutation.mutate({ 
            id: id, 
            values: [{ name, value }]
        });
    }

    const devices = useMemo(() => {
        if(devicesQuery.isLoading || !devicesQuery.data) return;

        return (
            <Masonry
                breakpointCols={{ default: 6, 1200: 5, 992: 3, 768: 3, 576: 2, 575.98: 1 }}
                className="flex-row align-items-start">
                {devicesQuery.data.map((data: any) => (
                    <ErrorBoundary key={data.id}>
                        <Device data={data} handleInput={(n, v) => handleInput(data.id, n, v)} />
                    </ErrorBoundary>
                ))}
            </Masonry>
        );
    }, [ devicesQuery.data ]);

    return (
        <Page id="devices">
            <Container>{devices}</Container>
        </Page>
    );
};

export default Devices;
