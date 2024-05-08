import React, { useRef, useEffect, useState } from 'react';
import Chart from '@/Chart';
import { getColorValue } from '@tjallingf/react-utils';

export interface IRecordsGraphProps {
    dataSets: any[];
    deviceId: number;
    getDataSetLabel: (id: string) => unknown
}

// TODO: convert to tRPC
const RecordsGraph: React.FunctionComponent<IRecordsGraphProps> = ({ deviceId, dataSets, getDataSetLabel }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ data, setData ] = useState({});
    
    dataSets = [ dataSets.find(d => d.id === 'F' ) ];

    useEffect(() => {
        setData({
            datasets: getFormattedDataSets()
        })
    }, []);

    const getFormattedDataSets = () => {
        if(!canvasRef.current) return null;

        const ctx = canvasRef.current.getContext('2d');
        if(!ctx) return null;

        return dataSets.map(dataSet => {
            const label = getDataSetLabel(dataSet.id);
            const data = dataSet.values.map(([ x, y ]: any[]) => {
                return { x, y };
            })

            var gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, getColorValue('blue-3')!);
            gradient.addColorStop(1, getColorValue('blue-0')!);

            return { 
                label, 
                data,
                backgroundColor: gradient,
                borderWidth: 1,
                borderColor: getColorValue('blue-4'),
                fill: true,
                pointRadius: 0
            };
        })
    }

    const options = {
        scales: {
            x: {
                type: 'time',
                display: false,
            },
            y: {
                display: true,
            },
        },
        tension: 0.3
    };

    return (
        <div className="RecordsGraph w-100">
            <Chart type="line" data={data as any} options={options as any} canvasRef={canvasRef}></Chart>
        </div>
    );
};

export default RecordsGraph;
