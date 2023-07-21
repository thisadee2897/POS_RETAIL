import React, { useEffect, memo, useState} from 'react';
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


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const BarChart = (props) => {
    const [labels, setLabels] = useState([])
    const [dataChart, setDataChart] = useState([])
    const [dataKeys, dataDataKeys] = useState(props.datakey)
    const [keyX, setKeysX] = useState(props.datakeyX)
    const [keyY, setKeysY] = useState(props.datakeyY)


    const options = {
        responsive: true,
        parsing: {
            xAxisKey: keyX,
            yAxisKey: dataKeys
        }
    };

    const optionsY = {
        indexAxis: 'y',
        responsive: true,
        parsing: {
            xAxisKey: dataKeys,
            yAxisKey: keyY
        }
    };

    const data = {
        datasets: [
            {
                label: props.titles,
                data: props.data,
                backgroundColor: props.colorCharts ? props.colorCharts : '#3498DB',
            },
   
        ],


    };

    return (<>{props.vertical ?
        <div> <Bar options={optionsY} data={data} /></div>

        : <div>{<Bar options={options} data={data} />}</div>
    }
    </>
    )
}

export default (BarChart);