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
            field: '',
            filtering: false,
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
            title: 'รหัสสินค้า',
            field: 'barcode',

        },
        {
            title: 'ชื่อสินค้า',
            field: 'master_product_barcode_billname',

        },
        {
            title: 'หน่วยนับ',
            field: 'master_product_unit_name',
        },
        {
            title: 'จำนวน',
            field: 'saledt_qty',
        },
        {
            title: 'ส่วนลด',
            field: 'saledt_discount_amnt',
            type: 'numeric'


        },
        {
            title: 'ราคา',
            field: 'saledt_saleprice',
            type: 'numeric'

        },
        {
            title: 'ฐานภาษี',
            field: 'saledt_baseamount',
            type: 'numeric'


        },
        {
            title: 'ภาษี',
            field: 'saledt_vat',
            type: 'numeric'


        },
        {
            title: 'จำนวนเงิน',
            field: 'saledt_netamnt',
            type: 'numeric'


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
        axios.post(UrlApi() + 'report_sale_product_explain_summarize', dataApi)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.row_num = idx + 1
                        item.saledt_qty = nf.format(item.saledt_qty)
                        item.saledt_discount_amnt = nf.format(item.saledt_discount_amnt)
                        item.saledt_saleprice = nf.format(item.saledt_saleprice)
                        item.saledt_baseamount = nf.format(item.saledt_baseamount)
                        item.saledt_vat = nf.format(item.saledt_vat)
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
        master_product_unit_name: "รวม",
        saledt_qty: nf.format(sumValue('saledt_qty')),
        saledt_discount_amnt: nf.format(sumValue('saledt_discount_amnt')),
        saledt_saleprice: nf.format(sumValue('saledt_saleprice')),
        saledt_baseamount: nf.format(sumValue('saledt_baseamount')),
        saledt_vat: nf.format(sumValue('saledt_vat')),
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
        { "header": "รหัสสาขา", "selector": "master_branch_code" },
        { "header": "ชื่อสาขา", "selector": "master_branch_name" },
        { "header": "รหัสสินค้า", "selector": "barcode" },
        { "header": "ชื่อสินค้า", "selector": "master_product_barcode_billname" },
        { "header": "หน่วยนับ", "selector": "master_product_unit_name" },
        { "header": "จำนวน", "selector": "saledt_qty" },
        { "header": "ส่วนลด", "selector": "saledt_discount_amnt" },
        { "header": "ราคา", "selector": "saledt_saleprice" },
        { "header": "ฐานภาษี", "selector": "saledt_baseamount" },
        { "header": "ภาษี", "selector": "saledt_vat" },
        { "header": "จำนวนเงิน", "selector": "saledt_netamnt" },


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
