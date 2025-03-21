import { Poste } from '@/graphql/generated';
import { usePostesStore } from '@/stores/usePostesStore';
import { useObservationFieldsStore } from '@/stores/useObservationFieldsStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getObservationsHoraireAction } from '@/actions/getObservationsHoraire';
import Loading from '@/app/(dashboard)/dashboard/loading';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { useTheme } from 'next-themes';
import { CustomSeriesOption, ECharts } from 'echarts';
import { CallbackDataParams, TooltipFormatterCallback, TopLevelFormatterParams } from 'echarts/types/dist/shared';


type Observation = {
    dateObservation: string;
    [key: string]: number | string | null | undefined;
};


const renderArrow: CustomSeriesOption['renderItem'] = function(_, api) {
    const point = api.coord([
        api.value(0), // dateObservation
        api.value(2), // ff
    ]);

    const windDirectionDeg = Number(api.value(1)) || 0;
    const windDirectionRad = ((-windDirectionDeg - 90) * Math.PI) / 180;

    const arrowSize = 16;

    return {
        type: 'path',
        shape: {
            pathData: 'M31 16l-15-15v9h-26v12h26v9z',
            x: -arrowSize / 2,
            y: -arrowSize / 2,
            width: arrowSize,
            height: arrowSize - 4,
        },
        position: point,
        rotation: windDirectionRad,
        style: api.style({
            stroke: '#555',
            lineWidth: 1,
        }),
    };
};


const EXCLUDED_FIELDS = ['aaaammjjhh', 'alti', 'lat', 'lon', 'nomUsuel', 'numPoste'];

// const DESIRED_FIELDS1 = {
//     Temperature: [
//         {
//             key: 't',
//             description: 'Air temp. (°C)',
//             // unit: '°C',
//             // options: {
//             //     type: 'line' as const,
//             //     color: '#FF4500',
//             //     // width: 4,
//             //     opacity: 1,
//             //     yAxisIndex: 0,
//             //     smooth: false,
//             //     showSymbol: false,
//             //     areaStyle: {} as const,
//             //     lineStyle: {
//             //         width: 2,
//             //         opacity: 1,
//             //         color: '#FF4500',
//             //     },
//             //     zlevel: 2,
//             // },
//         },
//         {
//             key: 'tx',
//             description: 'Temp. max (°C)',
//             unit: '°C',
//             options: {
//                 type: 'line' as const,
//                 color: '#FF6347',
//                 lineStyle: {
//                     opacity: 0.5,
//                     width: 1,
//                 },
//                 yAxisIndex: 0,
//                 smooth: false,
//                 showSymbol: false,
//                 zlevel: 3,
//             },
//         },
//         {
//             key: 'tn',
//             description: 'Temp. min (°C)',
//             unit: '°C',
//             options: {
//                 type: 'line' as const,
//                 color: '#efc300',
//                 lineStyle: {
//                     opacity: 0.5,
//                     width: 1,
//
//                 },
//                 yAxisIndex: 0,
//                 smooth: false,
//                 showSymbol: false,
//                 zlevel: 3,
//             },
//         },
//         {
//             key: 'td',
//             description: 'Dew point (°C)',
//             unit: '°C',
//             options: {
//                 type: 'line' as const,
//                 color: '#aa00ff',
//                 lineStyle: {
//                     opacity: 0.5,
//                     width: 1,
//
//                 },
//                 yAxisIndex: 0,
//                 smooth: false,
//                 showSymbol: false,
//                 zlevel: 3,
//             },
//         },
//         {
//             key: 'dg',
//             description: 'Duration of frost (min.)',
//             unit: '°C',
//             options: {
//                 show: false,
//                 type: 'bar' as const,
//                 color: 'rgba(255,0,0,0.5)',
//                 barWidth: '1px',
//                 yAxisIndex: 3,
//                 smooth: false,
//                 showSymbol: false,
//                 zlevel: 3,
//             },
//         },
//     ],
//     Precipitation: [
//         {
//             key: 'rr1',
//             description: 'Precipitation 1h (mm)',
//             unit: 'mm',
//             options: {
//                 type: 'bar' as const,
//                 color: '#1E90FF',
//                 opacity: 1,
//                 yAxisIndex: 2,
//                 showSymbol: true,
//                 barStyle: {
//                     barWidth: '90%',
//
//                 },
//                 zlevel: 10,
//             },
//         },
//     ],
//     Humidity: [
//         {
//             key: 'u',
//             description: 'Humidity (%)',
//             unit: '%',
//             options: {
//                 type: 'line' as const,
//                 color: '#32CD32',
//                 yAxisIndex: 1,
//                 smooth: true,
//                 showSymbol: false,
//                 lineStyle: {
//                     opacity: 0.5,
//                     width: 1,
//                 },
//                 zlevel: 4,
//             },
//         },
//         {
//             key: 'ux',
//             description: 'Humidity max (%)',
//             unit: '%',
//             options: {
//                 type: 'line' as const,
//                 color: '#228B22',
//                 yAxisIndex: 1,
//                 smooth: true,
//                 showSymbol: false,
//                 lineStyle: {
//                     opacity: 0.2,
//                     width: 1,
//                 },
//                 zlevel: 4,
//             },
//         },
//         {
//             key: 'un',
//             description: 'Humidity min (%)',
//             unit: '%',
//             options: {
//                 type: 'line' as const,
//                 color: '#008000',
//                 yAxisIndex: 1,
//                 smooth: true,
//                 showSymbol: false,
//                 lineStyle: {
//                     opacity: 0.2,
//                     width: 1,
//                 },
//                 zlevel: 4,
//             },
//         },
//     ],
//     Wind: [
//         // {
//         //     key: 'dd',
//         //     description: 'Wind direction (in °)',
//         //     unit: 'deg',
//         //     options: {
//         //         type: 'custom' as const,
//         //         renderItem: renderArrow,
//         //         encode: {
//         //             x: 0,
//         //             y: 1,
//         //         },
//         //         yAxisIndex: 4,
//         //         zlevel: 10,
//         //     },
//         // },
//         {
//             key: 'ff',
//             description: 'Wind speed (m/s)',
//             unit: 'm/s',
//             options: {
//                 type: 'line' as const,
//                 // encode: {
//                 //     x: dims.dateObservation,
//                 //     y: dims.ff,
//                 // },
//                 lineStyle: {
//                     color: '#aaa',
//                     type: 'dotted',
//                 },
//                 opacity: 1,
//                 yAxisIndex: 4,
//                 showSymbol: false,
//                 zlevel: 11,
//             },
//         },
//     ],
// };

const DESIRED_FIELDS = ['t', 'tx', 'tn', 'td', 'dg', 'rr1', 'u', 'ux', 'un', 'ff', 'dd'];


export default function Graphs({ selectedPoste }: { selectedPoste: Poste }) {
    const numPoste = selectedPoste?.numPoste;
    const startDate = usePostesStore((state) => state.startDate);
    const endDate = usePostesStore((state) => state.endDate);
    const { loading, getObservationFields } = useObservationFieldsStore();

    const [observations, setObservations] = useState<Observation[]>([]);

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
                        DESIRED_FIELDS.includes(f), // ✅ nouveau filtre direct
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


    const buildSeriesMap = (
        fields: string[],
        availableFields: string[],
        observations: Observation[],
    ): Record<string, { data: { name: string; value: [string, number | null] }[] }> => {
        const map: Record<string, { data: { name: string; value: [string, number | null] }[] }> = {};

        for (const key of fields) {
            if (availableFields.includes(key)) {
                map[key] = {
                    data: observations.map((obs) => ({
                        name: obs.dateObservation,
                        value: [obs.dateObservation, obs[key] != null ? Number(obs[key]) : null],
                    })),
                };
            } else {
                map[key] = { data: [] };
            }
        }
        return map;
    };

    const chartOptions: EChartsOption = useMemo(() => {
        if (observations.length === 0) return {};

        const seriesMap = buildSeriesMap(DESIRED_FIELDS, availableFields, observations);

        const series = [
            {
                key: 't',
                unit: '°C',
                name: 'Air temp.',
                type: 'line' as const,
                color: '#FF4500',
                opacity: 1,
                yAxisIndex: 0,
                smooth: false,
                showSymbol: false,
                areaStyle: {} as const,
                lineStyle: {
                    width: 2,
                    opacity: 1,
                    color: '#FF4500',
                } as const,
                zlevel: 2,
                data: seriesMap.t.data,
            },
            {
                key: 'tx',
                name: 'Temp. max',
                unit: '°C',
                type: 'line' as const,
                color: '#FF6347',
                lineStyle: {
                    opacity: 0.5,
                    width: 1,
                } as const,
                yAxisIndex: 0,
                smooth: false,
                showSymbol: false,
                zlevel: 3,
                data: seriesMap.tx.data,
            },
            {
                key: 'tn',
                name: 'Temp. min',
                unit: '°C',
                type: 'line' as const,
                color: '#efc300',
                lineStyle: {
                    opacity: 0.5,
                    width: 1,
                } as const,
                yAxisIndex: 0,
                smooth: false,
                showSymbol: false,
                zlevel: 3,
                data: seriesMap.tn.data,
            },
            {
                key: 'td',
                name: 'Dew point',
                unit: '°C',
                type: 'line' as const,
                color: '#aa00ff',
                lineStyle: {
                    opacity: 0.5,
                    width: 1,
                } as const,
                yAxisIndex: 0,
                smooth: false,
                showSymbol: false,
                zlevel: 3,
                data: seriesMap.td.data,
            },
            {
                key: 'dg',
                name: 'Duration of frost',
                unit: 'min.',
                type: 'bar' as const,
                color: 'rgba(255,0,0,0.5)',
                barWidth: '1px',
                yAxisIndex: 3,
                smooth: false,
                showSymbol: false,
                zlevel: 3,
                data: seriesMap.dg.data,
            },
            {
                key: 'rr1',
                name: 'Precipitation 1h',
                unit: 'mm',
                type: 'bar' as const,
                color: '#1E90FF',
                opacity: 1,
                yAxisIndex: 2,
                showSymbol: true,
                barStyle: {
                    barWidth: '90%',
                } as const,
                zlevel: 10,
                data: seriesMap.rr1.data,
            },
            {
                key: 'u',
                unit: '%',
                name: 'Humidity',
                type: 'line' as const,
                color: '#32CD32',
                yAxisIndex: 1,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.5,
                    width: 1,
                } as const,
                zlevel: 4,
                data: seriesMap.u.data,
            },
            {
                key: 'ux',
                name: 'Humidity max',
                unit: '%',
                type: 'line' as const,
                color: '#228B22',
                yAxisIndex: 1,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.2,
                    width: 1,
                } as const,
                zlevel: 4,
                data: seriesMap.ux.data,
            },
            {
                key: 'un',
                name: 'Humidity min',
                unit: '%',
                type: 'line' as const,
                color: '#008000',
                yAxisIndex: 1,
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    opacity: 0.2,
                    width: 1,
                } as const,
                zlevel: 4,
                data: seriesMap.un.data,
            },
            {
                key: 'ff',
                name: 'Wind speed',
                unit: '',
                type: 'line' as const,
                lineStyle: {
                    color: '#aaa',
                    type: 'dotted',
                } as const,
                opacity: 1,
                yAxisIndex: 4,
                xAxisIndex: 1,
                showSymbol: false,
                zlevel: 11,
                data: seriesMap.ff.data,
            },
            {
                key: 'dd',
                name: 'Wind direction',
                unit: 'deg',
                type: 'custom' as const,
                renderItem: renderArrow,
                encode: {
                    x: 0,
                    y: 1,
                },
                yAxisIndex: 4,
                xAxisIndex: 1,
                zlevel: 10,
                data: observations.map((obs) => ({
                    name: obs.dateObservation,
                    value: [obs.dateObservation, obs.dd ?? null, obs.ff ?? null],
                })),
            },

        ];

        const filteredSeries = series.filter(
            (serie) =>
                availableFields.includes(serie.key) &&
                Array.isArray(serie.data) &&
                serie.data.some((point) => {
                    const value = point?.value?.[1];
                    return value !== null && value !== undefined && !Number.isNaN(value);
                }),
        );

        const tooltipFormatter: TooltipFormatterCallback<TopLevelFormatterParams> = (params) => {
            if (!Array.isArray(params)) return '';

            const lines: string[] = [];

            params.forEach((item: CallbackDataParams) => {
                const { seriesName, value, marker, seriesIndex } = item;
                const val = Array.isArray(value) ? value[1] : value;
                const unit = filteredSeries[seriesIndex as number]?.unit || '';

                if (filteredSeries[seriesIndex as number]?.key === 'ff') {
                    const speedMs = val ?? null;
                    if (typeof speedMs === 'number') {
                        const speedKmh = `${Math.round(Math.ceil(speedMs) * 3.6)} km/h`;
                        lines.push(`${marker} ${seriesName}: ${speedMs} m/s - ${speedKmh}`);
                    }
                } else {
                    lines.push(`${marker} ${seriesName}: ${val}${unit ? ' ' + unit : ''}`);
                }
            });

            return lines.join('<br/>');
        };

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
                {
                    type: 'time',
                    show: false,
                    position: 'bottom',
                    minInterval: 3600 * 1000,
                    axisIndex: 10,
                    gridIndex: 1,
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
                {
                    type: 'value',
                    position: 'right',
                    show: false,
                    min: 0,
                    max: 300,
                },
                {
                    type: 'value',
                    position: 'right',
                    show: false,
                    min: 0,
                    max: 35,
                    gridIndex: 1,
                },
            ],
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: [0, 1],
                    start: 70,
                    end: 100,
                },
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 70,
                    end: 100,
                },
            ],
            grid: [
                {
                    left: 40,
                    right: 5,
                    top: 10,
                    bottom: 90,
                    containLabel: false,
                }, {
                    left: 40,
                    right: 5,
                    top: 0,
                    bottom: '70%',
                    containLabel: false,
                },
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' },
                formatter: tooltipFormatter,
            },
            legend: {
                show: false,
                bottom: 20,
                selectedMode: 'multiple',
            },
            backgroundColor: backgroundColor,
            series: filteredSeries,
        };
    }, [observations, backgroundColor, availableFields]);

    return (
        <div ref={containerRef} className="flex flex-col h-[calc(100vh-190px)] md:h-[calc(100vh-150px)]">
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
