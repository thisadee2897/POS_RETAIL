import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

function LineChart({ datas, labels }) {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },

        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'ยกเลิกบิล',
                data: datas,
                borderColor: '#4c847b',
                // backgroundColor: '#634c84',
            }
        ],
    };
    return (
        <Line options={options} data={data} />
    )
}

export default LineChart