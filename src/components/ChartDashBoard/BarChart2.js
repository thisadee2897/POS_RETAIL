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
function BarChart2({ sales, receive, label }) {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        },
    };

    const data = {
        labels: label,
        datasets: [
            {
                label: 'ยอดขาย',
                data: sales,
                backgroundColor: [
                    '#634c84',
                ],
            },
            {
                label: 'ต้นทุน',
                data: receive,
                backgroundColor: [
                    '#f67280',
                ],
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

export default BarChart2