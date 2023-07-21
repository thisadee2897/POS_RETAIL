import Chart from "react-apexcharts";
import { XAxis } from "recharts";
import { fNumber, floatNumber, compactNumber } from './formatNumber';

export default function ColumnChart({ title, chartColors, distributed, chartLabels, chartData, horizontal, showLegend }) {

    const chartOptions = {
        plotOptions: {
            bar: {
                distributed: distributed,
                horizontal: horizontal,
                borderRadius: 3,
                columnWidth: '80%',
                dataLabels: {
                    position: "top",
                    orientation: 'horizontal'
                }
            }
        },
        colors: chartColors,
        fill: {
            type: chartData.map((i) => i.fill),
        },
        labels: chartLabels,
        legend: {
            show: showLegend
        },
        dataLabels: {
            enabled: true,
            offsetY: horizontal ? 0 : -20,
            offsetX: horizontal ? 40 : 0,
            textAnchor: 'middle',
            style: {
                colors: ['#000']
            },
            background: {
                enabled: false,
            },
            formatter: (val) => compactNumber(val),
        },
        stroke: {
            show: true,
            width: 3,
            curve: 'smooth',
            lineCap: 'round',
        },
        grid: {
            strokeDashArray: 3,
        },
        fill: {
            opacity: 1,
            gradient: {
                type: 'vertical',
                shadeIntensity: 0,
                opacityFrom: 1,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => {
                    return floatNumber(y.toFixed(2));
                }
            }
        },
        yaxis: {
            show: true,
            labels: {
                show: true,
                formatter: (val) => horizontal == true ? (val) : compactNumber(val)
            }
        }
    };

    return (<>
        <center>{title}</center>
        < Chart series={chartData} options={chartOptions} height={horizontal == true ? 350 : 200} type={'bar'} /></>
    );
}

