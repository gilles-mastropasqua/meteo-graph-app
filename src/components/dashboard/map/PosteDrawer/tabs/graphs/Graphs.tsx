import { Poste } from '@/graphql/generated';
import { usePostesStore } from '@/stores/usePostesStore';
import { useObservationFieldsStore } from '@/stores/useObservationFieldsStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getObservationsHoraireAction } from '@/actions/getObservationsHoraire';
import Loading from '@/app/(dashboard)/dashboard/loading';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { useTheme } from 'next-themes';
import type { ECharts } from 'echarts';

const EXCLUDED_FIELDS = ['aaaammjjhh', 'alti', 'lat', 'lon', 'nomUsuel', 'numPoste'];

const DESIRED_FIELDS = {
    Temperature: [
        {
            key: 't',
            description: 'Air temp. (°C)',
            unit: '°C',
            options: {
                type: 'line' as const,
                color: '#FF4500',
                // width: 4,
                opacity: 1,
                yAxisIndex: 0,
                smooth: false,
                showSymbol: false,
                areaStyle: {} as const,
                lineStyle: {
                    width: 2,
                    opacity: 1,
                    color: '#FF4500',
                },
                zlevel: 2,
            },
        },
        {
            key: 'tx',
            description: 'Temp. max (°C)',
            unit: '°C',
            options: {
                type: 'line' as const,
                color: '#FF6347',
                lineStyle: {
                    opacity: 0.5,
                    width: 1,
                },
                yAxisIndex: 0,
                smooth: false,
                showSymbol: false,
                zlevel: 3,
            },
        },
        {
            key: 'tn',
            description: 'Temp. min (°C)',
            unit: '°C',
            options: {
                type: 'line' as const,
                color: '#efc300',
                lineStyle: {
                    opacity: 0.5,
                    width: 1,

                },
                yAxisIndex: 0,
                smooth: false,
                showSymbol: false,
                zlevel: 3,
            },
        },
    ],
    Precipitation: [
        {
            key: 'rr1',
            description: 'Precipitation 1h (mm)',
            unit: 'mm',
            options: {
                type: 'bar' as const,
                color: '#1E90FF',
                opacity: 1,
                yAxisIndex: 2,
                showSymbol: true,
                barStyle: {
                    barWidth: '90%',

                },
                zlevel: 10,
            },
        },
    ],
    Humidity: [
        {
            key: 'u',
            description: 'Humidity (%)',
            unit: '%',
            options: {
                type: 'line' as const,
                color: '#32CD32',
                yAxisIndex: 1,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 1,
                    width: 1,
                },
                zlevel: 4,
            },
        },
        {
            key: 'ux',
            description: 'Humidity max (%)',
            unit: '%',
            options: {
                type: 'line' as const,
                color: '#228B22',
                yAxisIndex: 1,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.5,
                    width: 1,
                },
                zlevel: 4,
            },
        },
        {
            key: 'un',
            description: 'Humidity min (%)',
            unit: '%',
            options: {
                type: 'line' as const,
                color: '#008000',
                yAxisIndex: 1,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.5,
                    width: 1,
                },
                zlevel: 4,
            },
        },
    ],
};

export default function Graphs({ selectedPoste }: { selectedPoste: Poste }) {
    const numPoste = selectedPoste?.numPoste;
    const startDate = usePostesStore((state) => state.startDate);
    const endDate = usePostesStore((state) => state.endDate);
    const { loading, getObservationFields } = useObservationFieldsStore();

    const [observations, setObservations] = useState<{ [key: string]: never }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [availableFields, setAvailableFields] = useState<string[]>([]);

    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const backgroundColor = isDarkMode ? '#0A0A0A' : '#FFFFFF';

    const chartRef = useRef<ReactECharts>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartInstanceRef = useRef<ECharts | null>(null);

    useEffect(() => {
        if (!numPoste || !startDate || !endDate) return;

        setIsLoading(true);

        getObservationFields(numPoste, startDate, endDate)
            .then((allFields) => {
                const filteredFields = allFields
                    .map(f => f.field)
                    .filter(f =>
                        !EXCLUDED_FIELDS.includes(f) &&
                        Object.values(DESIRED_FIELDS).flat().some(({ key }) => key === f),
                    );
                setAvailableFields(filteredFields);
            })
            .catch((err) => console.error('Error fetching fields:', err));
    }, [numPoste, startDate, endDate, getObservationFields]);

    useEffect(() => {
        if (!numPoste || !startDate || !endDate || availableFields.length === 0) return;

        getObservationsHoraireAction({
            numPoste,
            startDate,
            endDate,
            fields: ['dateObservation', ...availableFields],
        })
            .then(setObservations)
            .catch((err) => console.error('Error fetching observations:', err))
            .finally(() => setIsLoading(false));


    }, [numPoste, startDate, endDate, availableFields]);

    useEffect(() => {
        if (!containerRef.current || !chartInstanceRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            setTimeout(() => {
                chartInstanceRef.current?.resize();
            }, 50);
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);


    const chartOptions: EChartsOption = useMemo(() => {
        if (observations.length === 0) return {};


        const series = Object.values(DESIRED_FIELDS).flatMap((fields) =>
            fields
                .filter(({ key }) => availableFields.includes(key))
                .map(({ key, description, options }) => ({
                    name: description,
                    data: observations.map((obs) => ({
                        name: obs.dateObservation,
                        value: [obs.dateObservation, obs[key] ?? null],
                    })),
                    ...options, // 🔹 Injecte directement toutes les options définies dans DESIRED_FIELDS
                })),
        );

        return {
            visualMap: {
                type: 'continuous',
                show: false,
                dimension: 1,
                seriesIndex: 0,
                min: -20,
                max: 40,
                inRange: {
                    color: [
                        '#264CFF',
                        '#3FA0FF',
                        '#72D8FF',
                        '#AAF7FF',
                        '#E0FFFF',
                        '#FFFFBF',
                        '#FFE099',
                        '#FFAD72',
                        '#F76D5E',
                        '#D82632',
                        '#A50021'],
                },
            },
            xAxis: [
                {
                    type: 'time',
                    axisLabel: {
                        formatter: {
                            year: '{boldStyle|{yyyy}}',
                            month: '{boldStyle|{yyyy}/{MM}}',
                            day: '{boldStyle|{yyyy}/{MM}/{dd}}',
                            hour: '{boldStyle|{yyyy}/{MM}/{dd}}\n{boldStyle|{HH}:{mm}}',
                            minute: '{boldStyle|{yyyy}/{MM}/{dd}}\n{boldStyle|{HH}:{mm}}',
                        },
                        rich: {
                            boldStyle: {
                                fontWeight: 'normal',
                                fontSize: 10,
                                align: 'center',
                            },
                        },
                        margin: 10,
                    },
                    minInterval: 3600 * 1000,
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    position: 'left',
                    axisLabel: {
                        formatter: (value: number) => `${value}°C`,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            width: 1,
                            type: 'solid',
                            opacity: 0.1,
                        },
                    },
                    boundaryGap: ['10%', '10%'],
                    min: (value) => Math.floor(value.min / 5) * 5,
                    max: (value) => Math.ceil(value.max / 5) * 5,
                },
                {
                    type: 'value',
                    position: 'right',
                    show: false,
                    axisLine: { lineStyle: { color: '#1E90FF' } },
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        formatter: (value: number) => `${value}%`,
                    },
                    min: (value) => Math.floor(value.min / 10) * 10,
                    max: (value) => Math.ceil(value.max / 10) * 10,
                },
                {
                    type: 'value',
                    position: 'right',
                    show: false,
                    min: 0,
                    max: (value) => Math.ceil(value.max / 20) * 20,
                },
            ],
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: [0],
                    start: 70,
                    end: 100,
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 70,
                    end: 100,
                },
            ],
            grid: {
                left: 40,
                right: 5,
                top: 10,
                bottom: 90,
                containLabel: false,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' },
            },
            legend: {
                show: false,
                bottom: 20,
                selectedMode: 'multiple',
            },
            backgroundColor: backgroundColor,
            series,
        };
    }, [observations, backgroundColor, availableFields]);

    return (
        <div ref={containerRef} className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-150px)]">
            {loading || isLoading ? <Loading text={'Loading observations'} /> : null}
            {observations.length > 0 ? (
                <div className="flex-1">
                    <ReactECharts
                        ref={chartRef}
                        option={chartOptions}
                        theme={isDarkMode ? 'dark' : undefined}
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'block',
                        }}
                        onChartReady={(chart) => (chartInstanceRef.current = chart)}
                    />
                </div>
            ) : (
                <p></p>
            )}
        </div>
    );
}
