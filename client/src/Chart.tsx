import React, { useRef, useEffect } from 'react';
import ChartJS from 'chart.js/auto';
import { ChartData, ChartOptions, ChartTypeRegistry, registerables } from 'chart.js';
import 'chartjs-adapter-dayjs-4';

export interface IChartProps {
    type: keyof ChartTypeRegistry;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    data: ChartData;
    options: ChartOptions;
}

const Chart: React.FunctionComponent<IChartProps> = ({ type, data, options, canvasRef, ...rest }) => {
    const chartRef = useRef<ChartJS | null>(null);

    function renderChart() {
        if (!canvasRef.current) return;
        chartRef.current = new ChartJS(canvasRef.current, {
            type,
            data,
            options,
        });
    }

    function destroyChart() {
        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }
    }

    useEffect(() => {
        renderChart();

        return () => {
            destroyChart();
        };
    }, [data, options, type]);

    return (
        <canvas ref={canvasRef} role="img" {...rest}>
            <span>Loading chart...</span>
        </canvas>
    );
};

export default Chart;
