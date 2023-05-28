import { Page, Container } from '@tjallingf/react-utils';
import Masonry from '@/Masonry';
import Device from '@/Devices/components/Device/Device';
import ErrorBoundary from '@/ErrorBoundary';
import { trpc } from '@/utils/trpc';

const Devices: React.FunctionComponent = () => {
    const devices = trpc.device.list.useQuery();
    // let { data: rooms } = useQuery<IRoomProps[]>(['rooms']);

    const renderDevices = () => {
        if(devices.isLoading || !devices.data) return;
        console.log({ devices: devices.data });
        // if(typeof rooms == 'undefined' || !activeRoom) return null;

        // const filteredDevices = devices!.filter(props =>
        //     rooms[3].devices.includes(props.id));

        return (
            <Masonry
                breakpointCols={{ default: 6, 1200: 5, 992: 3, 768: 3, 576: 2, 575.98: 1 }}
                className="flex-row align-items-start"
            >
                {devices.data.map((props: any) => (
                    <ErrorBoundary>
                        <Device {...props} key={props.id} />
                    </ErrorBoundary>
                ))}
            </Masonry>
        );
    };

    return (
        <Page id="devices">
            <Container>{renderDevices()}</Container>
        </Page>
    );
};

export default Devices;
