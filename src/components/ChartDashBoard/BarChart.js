import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
function BarChart({ labels, datas, bgColor, title }) {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        },
    };

    const data = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: datas,
                backgroundColor: bgColor,
            },
        ],
    };
    return (
        <Bar
            options={options}
            data={data}
        />
    )
}

export default BarChart