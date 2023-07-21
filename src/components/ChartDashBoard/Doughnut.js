import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

function DoughnutChart({ datas, labels, position, colors }) {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: position,
            },
            tooltip: {
                enabled: true,
                usePointStyle: true,
            },
        },
    };
    const data = {
        labels: labels,
        datasets: [
            {
                label: '# of Votes',
                data: datas,
                backgroundColor: colors,
                borderWidth: 1,
                cutout: 25,
                radius: 50,
            },
        ],
    };
    return (
        <Doughnut
            options={options}
            data={data}
        />
    )
}

export default DoughnutChart