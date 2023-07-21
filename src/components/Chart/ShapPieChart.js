import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { PieChart, Pie, Sector } from "recharts";


const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        colorFill,
        colorSector,
        percent,
        value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    return (
        <g>
            <text x={cx} y={cy} dy={6} textAnchor="middle" fill={fill}
                style={{ fontWeight: "bold", fontSize:"28px" }}>
              {payload.name}
            </text>

            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={payload.startAngle ? payload.startAngle : startAngle}
                endAngle={endAngle}
                fill={payload.color}
            />

            <Sector
                cx={cx}
                cy={cy}
                startAngle={payload.startAngleSector ? payload.startAngleSector : startAngle }
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={payload.colorSector}
            />
            {payload.path == true ? <>
            <path
                    d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                    stroke={payload.colorSector}
                    fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={payload.color} stroke="none" />
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                textAnchor={payload.label}
                fill="#999"
                >
                   {payload.label}
                </text>
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey+20}
                    dy={20}
                    textAnchor={payload.label}
                    fill="#999"
                >
                    {`${(percent * 100).toFixed(2)}%`}
                </text>
            </> : <></>}
        </g>
    );
};
const ShapPieChart = ({ dataChart, colorFill, colorSector, width, height,x,y}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        getPie()
    }, [dataChart])

    const onPieEnter = useCallback(
        (_, index) => {
            setActiveIndex(index);
        },
        [setActiveIndex]
    );

    const getPie = () => {
        return (
            <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={dataChart}
                cx={x ? x :100}
                cy={y ? y :100}
                innerRadius={50}
                outerRadius={60}
                colorFill={colorFill}
                colorSector={colorSector}
                dataKey="value"
                onMouseEnter={onPieEnter}
        />)
    }

    return (
        <PieChart width={width ? width : 250} height={height ? height :200}>
            { getPie()}
        </PieChart>
    );
}
export default ShapPieChart
