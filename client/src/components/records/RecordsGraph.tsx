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
    isAnimationActive?: boolean;
    period: Date[];
}

const FIELD_GRADIENT_START_OPACITY = 0.6;
const FIELD_GRADIENT_STOP_OPACITY = 0.3;

const RecordsGraph: React.FunctionComponent<IRecordsGraphProps> = ({ 
    fields, 
    records, 
    getFieldLabel, 
    isAnimationActive,
    period
}) => {
    const [showFields, setShowFields] = useState<Record<string, boolean>>({});
    const fieldsObj = useMemo(() => keyBy(fields, 'name'), [fields]);
    const hasInvertedField = useMemo(() => fields.some(f => f.invert), [fields])

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
                <YAxis tickFormatter={t => hasInvertedField ? Math.abs(t) : t}/>
                <Tooltip content={<RecordsGraphTooltip fieldsObj={fieldsObj} />} />
                {fields.map(field => {
                    if (!showFields[field.name]) return null;

                    const colorValue = getColorValue(field.color ?? '$blue-5');
                    const label = getFieldLabel(field.name);
                    const gradientId = `RecordsGraph-field-gradient-${field.name}`;

                    return (<>
                        {showFields[field.name] && (
                            <Area 
                                isAnimationActive={isAnimationActive}
                                type="monotone" 
                                dataKey={field.name} 
                                stroke={colorValue} 
                                strokeWidth={2}
                                fill={`url(#${gradientId})`} 
                                name={label} />
                        )}

                        {/* fill gradient */}
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="20%" stopColor={colorValue} stopOpacity={field.invert ? FIELD_GRADIENT_STOP_OPACITY : FIELD_GRADIENT_START_OPACITY} />
                                <stop offset="80%" stopColor={colorValue} stopOpacity={field.invert ? FIELD_GRADIENT_START_OPACITY : FIELD_GRADIENT_STOP_OPACITY} />
                            </linearGradient>
                        </defs>
                    </>)
                })}
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default RecordsGraph;
