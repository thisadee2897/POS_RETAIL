import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import Moment from 'moment';
import { CSVLink, CSVDownload } from "react-csv";
import { FaFileExcel } from 'react-icons/fa';
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import Icon from '@mdi/react';
import { mdiExportVariant } from '@mdi/js';

const ExportExcel = (props) => {
    const actions = useContext(DataContextMenuActions);
    const [header, setHeader] = useState(props.header ? props.header : "")
    const [data, setData] = useState(props.data)
    const [dateNow, setDateNow] = useState(new Date())
    const [dataExport, setDataExport] = useState([])
    const [colHeader, setColHeader] = useState([])
    const [colvalues, setColValues] = useState([])

    useEffect(() => {
        getBtn()
    }, [actions])

    useEffect(() => {
        getColumnData()
    }, [])

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    useEffect(() => {
        exportExcells()
    }, [data])

    useEffect(() => {
        setHeader(props.header)
    }, [props.header])

    const getColumnData = () => {
        if (props.cloumns && props.data) {
            props.cloumns.map((item, idx) => {
                colHeader.push(item.header)
            })
            setColHeader(colHeader)
            //exportExcells()
        }
    }

    const exportExcells = () => {
        let Now_y = parseInt(Moment(dateNow).format("YYYY")) + 543
        var dNow = Moment(dateNow).format("DD/MM/") + Now_y
        var TNow = Moment(dateNow).format("HH:mm:ss")
        let datas = []
        const csvData = [
            ["", "", "", ""],
            ["", "", "", header],
            ["", "พิมพ์วันที่ " + dNow + " เวลา " + TNow,],
            colHeader

        ];
        if (data && props.cloumns) {
            data.map((item, idx) => {
                let datas = []
                props.cloumns.map((its, idxs) => {
                    datas.push(item[its.selector])
                })
                csvData.push(datas)
            })
            setDataExport(csvData)
        }
    }

    const getBtn = () => {
        return (<>
            {
                actions != undefined && actions.length > 0 ?
                    actions[0][5] == true ?
                        <CSVLink
                            style={{ backgroundColor: "#1E8449", color: "white", marginTop: "5px", width: "110%", height: "40px" }}
                            data={dataExport}
                            filename={props.filename}
                            className="btn"
                            target="_blank"
                        ><FaFileExcel fontSize="16px" />Export
                        </CSVLink>
                        : <></>
                    : <></>
            }</>)

    }

    return (
        <div >
            <CSVLink
                data={dataExport}
                filename={props.filename}
                className="btn"
                target="_blank" >
                <div style={{
                    backgroundColor: "white",
                    color: "#333333",
                    borderRadius: "10px",
                    width: "125px",
                    height: "40px",
                    display: "flex",
                    alignItems: "right",
                    justifyContent: "right",
                }}>
                    <span style={{
                        textAlign: "left",
                        marginTop:"9px",
                        position: "absolute",
                        marginRight: "53px",
                        fontSize:"14px"
                    }}>EXPORT</span>
                    <i style={{
                        background: "#74E0C0",
                        color: "white",
                        textAlign: "center",
                        position: "absolute",
                        height: "40px",
                        width: "40px",
                        borderRadius: "10px",
                        marginLeft: "20px"
                    }}>
                        <Icon path={mdiExportVariant} size={1} style={{ marginTop: "5px" }} />
                    </i>
                </div>
            </CSVLink>
        </div>
    )
}

export default memo(ExportExcel);
