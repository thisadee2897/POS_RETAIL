import React, { useCallback, useState,memo } from "react";
import { useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./chart.css";


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
const Piechart = (props) => {
    const [data, setData] = useState([])

    useEffect(() => {
        if (props.data.length >  0) {
            setData(props.data)
        } 
    }, [props])

    return (
        < div className="containerPie">
        <ResponsiveContainer>
        <PieChart width={props.width ? props.width : 200} height={props.height ? props.height : 200}>
            <Pie
                data={props.data}
                cx={props.cx ? props.cx : 170}
                cy={props.cy ? props.cy : 150}
                labelLine={false}
                label={renderCustomizedLabel}
                innerRadius={props.innerRadius}
                outerRadius={props.outerRadius}
                fill="#8884d8"
                dataKey={props.value ? props.value  : "value"} >
                {props.data.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={item.color } />
                ))}
            </Pie>
                </PieChart>
            </ResponsiveContainer >
        </div>
    );
}

export default memo(Piechart);