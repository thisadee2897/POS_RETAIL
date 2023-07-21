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

const SaleReportSumdaily = () => {
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
            title: 'วันที่',
            field: 'product_docudates',
        },
        {
            title: 'ขายสดสุทธิ',
            field: 'product_netamnt_sale',
            type: 'numeric',
        },
        {
            title: 'ขายเชื่อ',
            field: 'product_netamnt_credit',
            type: 'numeric',
        },
        {
            title: 'ลดหนี้',
            field: 'product_netamnt_received',
            type: 'numeric',

        },
        {
            title: 'ขายเชื่อสุทธิ',
            field: 'product_netamnt_credit_total',
            type: 'numeric',

        },
        {
            title: 'รวมทั้งสิ้น',
            field: 'product_netamnt_total',
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
            axios.post(UrlApi() + 'report_sale_sumdaily', dataApi)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            item.row_num = idx + 1
                            item.product_netamnt_sale = nf.format(item.product_netamnt_sale)
                            item.product_netamnt_credit = nf.format(item.product_netamnt_credit)
                            item.product_netamnt_received = nf.format(item.product_netamnt_received)
                            item.product_netamnt_received = nf.format(item.product_netamnt_received)
                            item.product_netamnt_total = nf.format(item.product_netamnt_total)
                            item.product_docudates = Moment(item.product_docudates).format("DD/MM/") +
                                (parseInt(Moment(item.product_docudates).format("YYYY")) + 543)
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
        product_docudates: "รวม",
        product_netamnt_sale: nf.format(sumValue('product_docudate')),
        product_netamnt_credit: nf.format(sumValue('product_netamnt_credit')),
        product_netamnt_received: nf.format(sumValue('product_netamnt_received')),
        product_netamnt_credit_total: nf.format(sumValue('product_netamnt_credit_total')),
        product_netamnt_total: nf.format(sumValue('product_netamnt_total')),
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
        { "header": "รหัสสาขา", "selector": "master_branch_code" },
        { "header": "ชื่อสาขา", "selector": "master_branch_name" },
        { "header": "วันที่", "selector": "product_docudates" },
        { "header": "ขายสดสุทธิ", "selector": "product_netamnt_sale" },
        { "header": "ขายเชื่อ", "selector": "product_netamnt_credit" },
        { "header": "ลดหนี้", "selector": "product_netamnt_received" },
        { "header": "ขายเชื่อสุทธิ", "selector": "product_netamnt_credit_total" },
        { "header": "รวมทั้งสิ้น", "selector": "product_netamnt_total" },
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

export default memo(SaleReportSumdaily);
