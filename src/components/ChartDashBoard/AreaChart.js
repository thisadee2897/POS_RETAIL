import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

function AreaChart(props) {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Filler,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'ยอดขายรวม',
            },
        },
    };

    const labels = props.data.map(({ selectdate }) => { return selectdate.toString().substring(8) });

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'ยอดขายรวม',
                data: props.data.map(({ salehd_sumgoodamnt }) => { return salehd_sumgoodamnt }),
                borderColor: '#7EA8F6',
                backgroundColor: '#7EA8F6',
            },
        ],
    };
    return (<Line options={options} data={data} />)
}

export default AreaChart