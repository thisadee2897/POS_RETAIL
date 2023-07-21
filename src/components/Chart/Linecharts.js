import React, { useEffect, memo, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineCharts = (props) => {
    const [dataKeys, dataDataKeys] = useState(props.datakey)
    const [keyX, setKeysX] = useState(props.datakeyX)
    const [keyY, setKeysY] = useState(props.datakeyY)

    const options = {
        responsive: true,
        parsing: {
            xAxisKey: keyX,
            yAxisKey: keyY
        },

    };

    const data = {
        datasets: [
            {
                label: props.titles,
                data: props.data,
                borderColor: props.borderColor ? props.borderColor : '#3498DB',
                backgroundColor: props.colorCharts ? props.colorCharts : '#3498DB',
            }
        ]
    };

    return <Line options={options} data={data} />;
}

export default memo(LineCharts)