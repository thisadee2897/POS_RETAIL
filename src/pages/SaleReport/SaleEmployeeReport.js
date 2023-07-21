import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import DataContext from "../../DataContext/DataContext";
import Moment from 'moment';
import DataTable from "../../components/Datatable/DatatableReport";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import { Box, Stack } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import HeaderReport from "../../components/HeaderReport/HeaderReport";

const SaleEmployeeReport = () => {
    const userData = useContext(DataContext);
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [dataReport, setDataReport] = useState([])
    const [defaultDate, setDefaultDate] = useState(false)
    const [dataConditions, setDataConditions] = useState([])
    const [valueInput, setValueInput] = useState("")
    const [dataReportSearch, setDataReportSearch] = useState([])
    const [showFilterColumn, setShowFilterColumn] = useState(false);


    const columnsdata = [
        {
            title: 'ลำดับ',
            field: 'row_num',
        },
        {
            title: 'รหัสสาขา',
            field: 'master_branch_code',
        },
        {
            title: 'ชื่อสาขา',
            field: 'master_branch_name',
        },
        {
            title: 'ชื่อพนักงาน',
            field: 'fullname',
        },
        {
            title: 'รหัสสินค้า',
            field: 'saledt_master_product_barcode_code',
        },
        {
            title: 'ชื่อสินค้า',
            field: 'saledt_master_product_billname',
        },
        {
            title: 'จำนวนที่ขายได้',
            field: 'saledt_qty',
            type: 'numeric',
        },
        {
            title: 'ยอดขาย',
            field: 'saledt_netamnt',
            type: 'numeric',
        },
       
    ]

    useEffect(() => {
        if (dataConditions.branch && dataConditions.branch.length > 0) {
            getData()
        }
    }, [dataConditions])

    useEffect(() => {
        getDataTable()
    }, [dataReport])

    useEffect(() => {
        if (defaultDate) {
            getDialogReport()
        }
    }, [defaultDate])

    const getData = () => {
            let dataApi = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "start_date": Moment(dataConditions.startDate).format("YYYYMMDD"),
                "end_date": Moment(dataConditions.endDate).format("YYYYMMDD"),
                "branch_id": dataConditions.branch
            }
        axios.post(UrlApi() + 'report_saleamount_byemployee', dataApi)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            item.row_num = idx + 1
                            item.saledt_qty = nf.format(item.saledt_qty)
                            item.saledt_netamnt = nf.format(item.saledt_netamnt)
                        })
                        setDataReport(res.data)
                        setDataReportSearch(res.data)
                    }
                })
        
    }

    const OnchangeSearch = (e) => {
        if (e.target.value) {
            setValueInput(e.target.value)
            let filterText = (e.target.value).trim()
            const filteredItems = dataReportSearch.filter((item) =>
                JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length == 0) {
                setDataReport([])
            } else {
                filteredItems.map((item, idx) => { item.row_num = idx + 1 })
                setDataReport(filteredItems)
            }
        } else {
            setValueInput()
        }
    }

    const footer = {
        saledt_master_product_billname: "รวม",
        saledt_qty: nf.format(sumValue('saledt_qty')),
        saledt_netamnt: nf.format(sumValue('saledt_netamnt')),
    };

    function sumValue(target) {
        let value = 0;
        dataReport.map((item) => {
            value += parseFloat(item[target]);
            return value;
        });
        return value;
    }


    const getDataTable = () => {
        return (
            <DataTable
                fixedHeader
                columns={columnsdata}
                data={dataReport}
                filtering={showFilterColumn}
                footerData={[footer]}
                striped
                dense
            />)
    }

    const onChangeDialog = (data) => {
        setDefaultDate(false)
        setDataConditions(data)
    }

    const columnExport = [
        { "header": "ลำดับ", "selector": "row_num" },
        { "header": "รหัสสินค้า", "selector": "master_branch_code" },
        { "header": "ชื่อสินค้า", "selector": "saledt_master_product_billname" },
        { "header": "จำนวนที่ขายได้", "selector": "saledt_qty" },
        { "header": "ยอดขาย", "selector": "saledt_netamnt" },
    ]

    const getDialogReport = () => {
        return (
            <HeaderReport
                onClickSearch={(e) => onChangeDialog(e)} //ข้อมูลจาก Dialog
                data={dataReport}
                columns={columnExport}
                onChange={(e) => OnchangeSearch(e)}
                value={valueInput}
                onClickFilter={() => setShowFilterColumn(!showFilterColumn)}
            />)

    }

    return (
        <div>
            {getDialogReport()}
            <div style={{ marginTop: "10px", marginLeft: "1%", marginRight: "1%" }}>
                {getDataTable()}
            </div>
        </div>
    );
}

export default memo(SaleEmployeeReport);
