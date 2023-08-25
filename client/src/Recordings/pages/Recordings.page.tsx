import { Page, Tile, Container, Box, Icon } from '@tjallingf/react-utils';
import useQuery from '@/hooks/useQuery';
import type { DeviceProps } from 'zylax';
import RecordGraph from '../components/RecordGraph';

// TODO: convert to tRPC
const Recordings: React.FunctionComponent = () => {
    const { result: devices } = useQuery<DeviceProps[]>('devices');

    const previewSpan = 24 * 60 * 60 * 1000;
    const previewTo = new Date();
    const previewFrom = new Date(previewTo.getTime() - previewSpan);

    return (
        <Page id="recordings">
            <Container>
                <Box direction="column" gutterY={2}>
                    {devices &&
                        devices.map(({ id, icon, name, options }) => {
                            if (options?.recording?.enabled !== true) return null;
                            return (
                                <Tile className="w-100">
                                    <Tile.Title>
                                        <Box gutterX={1} className="p-1" align="center">
                                            <Icon id={icon} size={20} />
                                            <span className="text-truncate ms-2">{name}</span>
                                        </Box>
                                    </Tile.Title>
                                    <Box gutterX={1} gutterY={1} wrap="wrap" className="Device__display">
                                        <RecordGraph deviceId={id} preview from={previewFrom} to={previewTo} />
                                    </Box>
                                </Tile>
                            );
                        })}
                </Box>
            </Container>
        </Page>
    );
};

export default Recordings;
