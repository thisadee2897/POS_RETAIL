import BtnAdd from "../Button/BtnAdd";
import BtnRefresh from "../Button/BtnRefresh";
import Exportexcel from "../ExportExcel/Exportexcel";
import Card from 'react-bootstrap/Card';
import FilterDataTable from "../SearchDataTable/FilterDataTable";
import {
    React,
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
    memo,
} from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Search from "@mui/icons-material/Search";
import DialogReport from "../../components/DialogReport/DialogReport";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import FilterListIcon from "@mui/icons-material/FilterList";
import Grid from "@mui/material/Grid";

function HeaderReport(props) {
    const actions = useContext(DataContextMenuActions);
    const [reportName, setReportName] = useState("");
    const [dataDialogReport, setDataDialogReport] = useState({});
    const [clearData, setClearData] = useState(false);
    const [valuesOnchange, setValuesOnchange] = useState();

    useEffect(() => {
        if (actions) {
            getReportName();
            getDialogReport();
        }
    }, [actions, window.location]);

    useEffect(() => {
        getDialogReport();
    }, [clearData, props.customDialog, props.customOncClose, props.customAlert]);

    useEffect(() => {
        getExportExcell();
    }, [
        reportName,
        actions,
        props.data,
        props.columns,
        clearData,
        dataDialogReport,
    ]);

    useState(() => {
        if (dataDialogReport) {
            props.onClickSearch(dataDialogReport);
        }
    }, [dataDialogReport]);

    const getReportName = () => {
        let name = actions.length > 0 ? actions[0]["menuName"] : "";
        setReportName(name);
    };

    const onClickRefresh = () => {
        setClearData(true);
        if (props.onClickRefresh) {
            props.onClickRefresh();
        }
    };

    const onChangeDialogReport = (data) => {
        if (data) {
            props.onClickSearch(data);
            setDataDialogReport(data);
            setClearData(false);
        }
    };

    const searchComponent = useMemo(() => {
        return (
            <FilterDataTable
                value={props.value}
                onChange={(e) => props.onChange(e)}
                placeholder="กรอกข้อความ"
            />
        );
    }, [props.value]);

    const getDialogReport = () => {
        return (
            <DialogReport
                getData="1"
                years={props.years ? props.years : false}
                months={props.months ? props.months : false}
                onChange={(e) => {
                    onChangeDialogReport(e);
                }}
                clearData={clearData}
                customDialog={props.customDialog}
                customOncClose={props.customOncClose}
                customAlert={props.customAlert}
            />
        );
    };

    const getExportExcell = () => {
        return (
            <Exportexcel
                data={props.data}
                header={reportName}
                filename={reportName + ".csv"}
                cloumns={props.columns}
                dataDialogReport={dataDialogReport}
            />
        );
    };

    const getRefresh = () => {
        return <BtnRefresh onClick={() => onClickRefresh()} />;
    };

    const getFilterColumn = () => {
        return (
            <BtnAdd
                message="ค้นหาตามคอลัมน์"
                style={{ whiteSpace: "nowrap" }}
                onClick={() => props.onClickFilter()}
                icons={<FilterListIcon />}
            />
        );
    };

    return (
        <>
            <Card style={{
                height: "70px", backgroundColor: "#F2F2F2", borderRadius: "10px", borderColor: "white",
                marginBottom: "0px", marginLeft: "1%", marginRight: "1%", marginTop: "10px"
            }}> <Grid container spacing={0.1}>
                    <Grid item xs={3}>
                        <p style={{ color: "#0D47A1", marginLeft: "10px", marginTop: "10px", fontSize: "20px" }}>
                            {reportName.length > 1 ? reportName : "รอเพิ่มสิทธิ์" }</p>
                    </Grid>
                    <Grid item xs={1}>
                        <div style={{ marginTop: "8px" }}> {getDialogReport()}</div>
                    </Grid>
                    {props.searchBar == false ? (
                        <></>
                    ) : (
                        <Grid item xs={2.5}>
                            <div style={{ marginTop: "8px", marginLeft: "10px" }}>
                                {searchComponent}
                            </div>
                        </Grid>
                    )}
                    <Grid item xs={0.8}>
                        <div style={{ marginTop: "8px", marginLeft: "10px" }}>
                            {getRefresh()}
                        </div>
                    </Grid>
                    {props.filterColumn == false ? (
                        <></>
                    ) : (
                        <Grid item xs={1.5}>
                            <div style={{ marginTop: "8px", marginLeft: "10px" }}>
                                {getFilterColumn()}
                            </div>
                        </Grid>
                    )}
                    {props.exportFile == false ? (
                        <></>
                    ) : (
                        <Grid item xs={2}>
                            <div >
                                {getExportExcell()}
                            </div>
                        </Grid>
                    )}
                </Grid>
            </Card>
        </>
    );
}

export default HeaderReport;
