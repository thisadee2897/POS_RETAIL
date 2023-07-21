/* eslint-disable no-dupe-keys */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useEffect } from "react";
import './DateRange.css';
import DatePicker, { registerLocale }  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';
import InputText from "../../components/Input/InputText";
import { IconButton } from '@mui/material';
import th from 'date-fns/locale/th';
import Icon from '@mdi/react';
import { mdiCalendarRange } from '@mdi/js';
registerLocale("th", th);


const DateRange = (props) => {
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;
    const [dates, setDates] = useState(new Date())

    const cusInput = () => {
        return (<IconButton
                 style={{ marginTop: "0px", background: "#74E0C0", borderRadius: "12px",
                height: "40px", marginTop: "1%", width: "50px" }}>
            <Icon path={mdiCalendarRange} size={1} style={{ color: "white" }} />
        </IconButton >
        )
    }

    
    useEffect(() => {
        if (props.defauldates) {
            setDateRange(props.defauldates)
        }
    }, [props.defauldates])

    useEffect(() => {
        if (props.handleEnd ) {
            if (dateRange[0]) {
                props.handleStart(startDate)
            }
            if (dateRange[1]) {
                props.handleEnd(endDate)
            }
        } 
    }, [dateRange])

    useEffect(() => {
        if (props.handleDate) {
            props.handleDate(dates)
        }
    }, [dates])

    const getDate = () => {
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        return (<InputText style={{ width: "120%", height: "40px", background: "#E6E6E6",   borderColor: "#E6E6E6" }}
            type="text" value={strDate + " ถึง " + enDate} disabled />)
    }

    return (<>
        <div class="row">
            <div class="col-8">
                {getDate()}
            </div>
            <div class="col-1">
                {!props.handleDate ?
                    <DatePicker
                        style={props.style}
                        className="dateranges"
                        customInput={cusInput()}
                        selectsRange={true}
                        locale="th"
                        dateFormat="dd/MM/yyyy"
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(date) => {
                            setDateRange(date);
                        }}
                        withPortal
                    ></DatePicker > :
                    <DatePicker
                        style={props.style}
                        customInput={cusInput()}
                        selectsRange={false}
                        locale="th"
                        dateFormat="dd/MM/yyyy"
                        date={dates}
                        onChange={(date) => {
                            setDates(date);
                        }}
                        withPortal
                    ></DatePicker >}
            </div>
        </div>
       
    </>);
};

export default DateRange;