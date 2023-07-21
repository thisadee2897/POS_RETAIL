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

const SaleReportSumProductDetail = () => {
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
            title: 'วันที่ใบสั่งขาย',
            field: 'orderdt_bill_docudates',
        },
        {
            title: 'เลขที่ใบสั่งขาย',
            field: 'orderhd_docuno',

        },
        {
            title: 'วันที่บิลขาย',
            field: 'salehd_docudates',

        },
        {
            title: 'เลขที่บิลขาย',
            field: 'salehd_docuno',

        },
        {
            title: 'รหัสสินค้า',
            field: 'master_product_code',

        },
        {
            title: 'ชื่อสินค้า',
            field: 'orderdt_master_product_billname',

        },
        {
            title: 'หน่วยนับ',
            field: 'master_product_unit_name',

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
        if (dataConditions.discountType.length > 0) {
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
                            item.orderdt_bill_docudates = Moment(item.orderdt_bill_docudate).format("DD/MM/") +
                                (parseInt(Moment(item.orderdt_bill_docudate).format("YYYY")) + 543)
                            item.salehd_docudates = Moment(item.salehd_docudate).format("DD/MM/") +
                                (parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543)
                            item.orderdt_saleprice = nf.format(item.orderdt_saleprice)
                            item.orderdt_discount_amnt = nf.format(item.orderdt_discount_amnt)
                            item.orderdt_netamnt = nf.format(item.orderdt_netamnt)
                        })
                        setDataReport(res.data)
                        setDataReportSearch(res.data)
                    }
                })
        }
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
        orderdt_saleprice: nf.format(sumValue('orderdt_saleprice')),
        orderdt_discount_amnt: nf.format(sumValue('orderdt_discount_amnt')),
        orderdt_netamnt: nf.format(sumValue('orderdt_netamnt')),
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
        { "header": "สาขา", "selector": "master_branch_code" },
        { "header": "ชื่อสาขา", "selector": "master_branch_name" },
        { "header": "วันที่ใบสั่งขาย", "selector": "orderdt_bill_docudates" },
        { "header": "เลขที่ใบสั่งขาย", "selector": "orderhd_docuno" },
        { "header": "วันที่บิลขาย", "selector": "salehd_docudate" },
        { "header": "เลขที่บิลขาย", "selector": "salehd_docuno" },
        { "header": "รหัสสินค้า", "selector": "master_product_code" },
        { "header": "ชื่อสินค้า", "selector": "orderdt_master_product_billname" },
        { "header": "จำนวน", "selector": "orderdt_qty" },
        { "header": "หน่วยนับ", "selector": "master_product_unit_name" },
        { "header": "ราคา/หน่วย", "selector": "orderdt_saleprice" },
        { "header": "ส่วนลด", "selector": "orderdt_discount_amnt" },
        { "header": "ราคารวม", "selector": "orderdt_netamnt" },

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

export default memo(SaleReportSumProductDetail);
