import { React, memo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
    ResponsiveContainer
} from "recharts";
import "./chart.css";


const BarCharts = (props) => {
    return (
        < div className="container">
            <ResponsiveContainer>
                {props.vertical == true ?
                    <BarChart
                        data={props.data}
                        layout="vertical">
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis type="number" domain={[0, dataMax => (dataMax * 4)]} hide />
                        <YAxis type="category" width={props.widthY} dataKey={props.datakeyY} />
                        <Bar dataKey={props.datakey} fill="#3498DB"  >
                            <LabelList dataKey={props.datakey} position="insideStart" fill="white" />
                        </Bar>
                    </BarChart> :
                    <BarChart data={props.data} layout="horizontal" >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={props.datakeyX} type="category" padding={{ left: 2 }} />
                        <YAxis type="number" width={150} height={500} domain={[0, dataMax => (dataMax + 5000)]} >

                        </YAxis>
                        <Bar dataKey={props.datakey} fill="#3498DB">
                            <LabelList dataKey={props.datakey} position="insideTop" fill="white" />
                        </Bar>
                    </BarChart>}
            </ResponsiveContainer >
        </div>

    )
}

export default memo(BarCharts);
