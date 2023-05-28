import React, { useMemo, lazy, useRef } from 'react';
import { Tile, colorpalettes } from '@tjallingf/react-utils';
import useQuery from '@/hooks/useQuery';
import Chart from '@/Chart';

export interface IRecordGraphProps {
    preview?: boolean;
    deviceId: number;
    from: Date;
    to: Date;
}

// TODO: convert to tRPC
const RecordGraph: React.FunctionComponent<IRecordGraphProps> = ({ deviceId, preview = false, from, to }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const records = useQuery<any>(
        `devices/${deviceId}/records`,
        {},
        {
            params: {
                // from: from,
                // to: to
                top: 25,
            },
        },
    );

    const datasets = useMemo(() => {
        if (!records.result || !canvasRef.current) return [];
        const ctx = canvasRef.current.getContext('2d');

        let datasetsObj = {};
        // records.result.forEach((record, i) => {
        //     Object.entries(record.v).forEach(([fieldAlias, value]) => {
        //         if (typeof datasetsObj[fieldAlias] === 'undefined') {
        //             var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        //             gradient.addColorStop(0, 'rgba(250,174,50,0.2)');
        //             gradient.addColorStop(1, 'rgba(250,174,50,0)');

        //             datasetsObj[fieldAlias] = {
        //                 data: [],
        //                 label: fieldAlias,
        //                 fill: true,
        //                 backgroundColor: gradient,
        //                 borderWidth: 1,
        //                 borderColor: 'red',
        //             };
        //         }

        //         datasetsObj[fieldAlias].data[i] = {
        //             x: record.d,
        //             y: value,
        //         };
        //     });
        // });

        return Object.values(datasetsObj);
    }, [records.result]);

    const data = {
        datasets: datasets,
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                display: false,
            },
            y: {
                display: false,
            },
        },
        tension: 0.3,
        aspectRatio: 4,
    };

    return (
        <Tile className="RecordGraph w-100" background={colorpalettes.gray[2]}>
            <Chart type="line" data={data as any} options={options as any} canvasRef={canvasRef}></Chart>
        </Tile>
    );
};

export default RecordGraph;
