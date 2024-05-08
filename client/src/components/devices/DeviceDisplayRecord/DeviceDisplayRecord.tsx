import './DeviceDisplayRecord.scss';
import { DeviceDisplay } from 'hiem';

export interface IDeviceDisplayRecordProps {
    id: number;
    content: DeviceDisplay['content'];
    deviceColor: string;
}

const DeviceDisplayRecord: React.FunctionComponent<IDeviceDisplayRecordProps> = ({ id }) => {
    return null;
    // const recordingQuery = trpc.record

    // const getLatestValues = () => {
    //     if (isLoading) return <LoadingIcon animated />;

    //     const { config } = aggregation;

    //     const record = result[0];
    //     if (!record) return null;

    //     // Resolve the aliases

    //     return <span>{record.v[config.fields['b'].alias]}</span>;
    // };

    // return (
    //     <div className="DeviceDisplayRecord px-2 py-1">
    //         <div className="DeviceDisplayRecord__field">
    //             <span className="DeviceDisplayRecord__field__value">{getLatestValues()}</span>
    //         </div>
    //     </div>
    // );
};

export default DeviceDisplayRecord;
