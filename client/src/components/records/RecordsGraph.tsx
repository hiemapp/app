import React, { useRef, useEffect, useState, useMemo } from 'react';
import { getColorValue } from '@tjallingf/react-utils';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, CartesianGrid, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import { trpc } from '@/utils/trpc/trpc';
import LargeLoadingIcon from '@/LargeLoadingIcon';
import { DeviceDriverManifestRecordingField } from 'hiem';
import { chain, keyBy, mapValues } from 'lodash';
import RecordsGraphTooltip from './RecordsGraphTooltip';

export interface IRecordsGraphProps {
    records: Record<string, number>[];
    fields: DeviceDriverManifestRecordingField[];
    getFieldLabel: (name: string) => string|undefined;
}

const RecordsGraph: React.FunctionComponent<IRecordsGraphProps> = ({ fields, records, getFieldLabel }) => {
    const [showFields, setShowFields] = useState<Record<string, boolean>>({});
    const fieldsObj = useMemo(() => keyBy(fields, 'name'), [fields]);

    useEffect(() => {
        // only show primary fields by default
        setShowFields(mapValues(fieldsObj, f => f.hiddenByDefault ? false : true));
    }, []);

    const modifiedRecords = useMemo(() => {
        return chain(records)
            .map(record => {
                return mapValues(record, (value, fieldId) => {
                    const field = fieldsObj[fieldId];
                    if (!field) return value;

                    // invert record value 
                    if (field.invert) value = value * -1

                    return value;
                })
            })
            .orderBy('$time', 'asc')
            .value()
    }, [records]);

    return (
        <ResponsiveContainer className="RecordsGraph" width="100%" height="100%">
            <AreaChart
                width={500}
                height={400}
                data={modifiedRecords}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}>
                <CartesianGrid strokeDasharray="5" />
                <XAxis
                    dataKey="$time"
                    tickFormatter={timeStr => dayjs(timeStr).format('DD-MM')}
                    domain={['dataMin', 'dataMax']}
                    type="number" />
                <YAxis />
                <Tooltip content={<RecordsGraphTooltip />} />
                {fields.map(field => {
                    if (!showFields[field.name]) return null;

                    const colorValue = getColorValue(field.color ?? '$blue-5');
                    const label = getFieldLabel(field.name);

                    return <Area type="monotone" dataKey={field.name} stroke={colorValue} fill={colorValue} name={label} />
                })}
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default RecordsGraph;
