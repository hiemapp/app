import { LoadingIcon } from '@tjallingf/react-utils';
import useQuery from '@/hooks/useQuery';
import './DeviceDisplayRecording.scss';
import { DeviceStateDisplay } from 'zylax';

export interface IDeviceDisplayRecordingProps {
    id: number;
    display: DeviceStateDisplay;
    deviceColor: string;
}

const DeviceDisplayRecording: React.FunctionComponent<IDeviceDisplayRecordingProps> = ({ id }) => {
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
        <div className="DeviceDisplayRecording px-2 py-1">
            <div className="DeviceDisplayRecording__field">
                <span className="DeviceDisplayRecording__field__value">{getLatestValues()}</span>
            </div>
        </div>
    );
};

export default DeviceDisplayRecording;
