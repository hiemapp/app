import { LoadingIcon } from '@tjallingf/react-utils';
import useQuery from '@/hooks/useQuery';
import './DeviceStateDisplayRecording.scss';
import { type DeviceStateDisplay } from 'zylax/types/devices/DeviceState';

export interface IDeviceStateDisplayRecordingProps {
    id: number;
    display: DeviceStateDisplay;
    deviceColor: string;
}

const DeviceStateDisplayRecording: React.FunctionComponent<IDeviceStateDisplayRecordingProps> = ({ id }) => {
    return null;
    const { result, aggregation, isLoading } = useQuery<any[]>(`devices/${id}/records?top=1`);

    const getLatestValues = () => {
        if (isLoading) return <LoadingIcon />;

        const { config } = aggregation;

        const record = result[0];
        if (!record) return null;

        // Resolve the aliases

        return <span>{record.v[config.fields['b'].alias]}</span>;
    };

    return (
        <div className="DeviceStateDisplayRecording px-2 py-1">
            <div className="DeviceStateDisplayRecording__field">
                <span className="DeviceStateDisplayRecording__field__value">{getLatestValues()}</span>
            </div>
        </div>
    );
};

export default DeviceStateDisplayRecording;
