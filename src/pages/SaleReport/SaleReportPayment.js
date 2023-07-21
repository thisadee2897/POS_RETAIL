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



const SaleReportPayment = () => {
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
            title: 'วันที่ขาย',
            field: 'salehd_docudates',


        },
        {
            title: 'เลขที่เอกสาร',
            field: 'salehd_docuno',

        },
        {
            title: 'ประเภทลูกค้า',
            field: 'salehd_arcustomer_name',

        },
        {
            title: 'ประเภทเอกสาร',
            field: 'master_docutype_name',

        },
        {
            title: 'ยอดมูลค่าสินค้า',
            field: 'salehd_sumgoodamnt',
            type: 'numeric',

        },
        {
            title: 'ค่าธรรมเนียมบัตรเครดิต',
            field: 'salehd_feeamnt',
            type: 'numeric',

        },
        {
            title: 'ส่วนลด',
            field: 'salehd_discountamnt',
            type: 'numeric',

        },
        {
            title: 'Voucher',
            field: 'salehd_voucheramnt',
            type: 'numeric',

        },
        {
            title: 'เงินเชื่อ',
            field: 'salehd_partneramnt',
            type: 'numeric',

        },
        {
            title: 'เงินสด',
            field: 'salehd_cashamount_all',
            type: 'numeric',

        },
        {
            title: 'เงินทิป',
            field: 'salehd_tipamnt',
            type: 'numeric',

        },
        {
            title: 'เงินโอน',
            field: 'salehd_transferamnt',
            type: 'numeric',
        },
        {
            title: 'บัตรเครดิต',
            field: 'salehd_creditcardamnt',
            type: 'numeric',
        },
        {
            title: 'เช็ค',
            field: 'salehd_chequeamnt',
            type: 'numeric',
        },
        {
            title: 'เงินมัดจำ',
            field: 'salehd_depositamnt',
            type: 'numeric',
        },
        {
            title: 'ยอดสุทธิ',
            field: 'salehd_netamnt',
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
        axios.post(UrlApi() + 'report_sale_sumdaily', dataApi)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.row_num = idx + 1
                        item.salehd_sumgoodamnt = nf.format(item.salehd_sumgoodamnt)
                        item.salehd_feeamnt = nf.format(item.salehd_feeamnt)
                        item.salehd_discountamnt = nf.format(item.salehd_discountamnt)
                        item.salehd_voucheramnt = nf.format(item.salehd_voucheramnt)
                        item.salehd_partneramnt = nf.format(item.salehd_partneramnt)
                        item.salehd_cashamount_all = nf.format(item.salehd_cashamount_all)
                        item.salehd_tipamnt = nf.format(item.salehd_tipamnt)
                        item.salehd_transferamnt = nf.format(item.salehd_transferamnt)
                        item.salehd_creditcardamnt = nf.format(item.salehd_creditcardamnt)
                        item.salehd_chequeamnt = nf.format(item.salehd_chequeamnt)
                        item.salehd_depositamnt = nf.format(item.salehd_depositamnt)
                        item.salehd_netamnt = nf.format(item.salehd_netamnt)
                        item.salehd_docudates = Moment(item.salehd_docudate).format("DD/MM/") +
                            (parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543)
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
        master_docutype_name: "รวม",
        salehd_sumgoodamnt: nf.format(sumValue('salehd_sumgoodamnt')),
        salehd_feeamnt: nf.format(sumValue('salehd_feeamnt')),
        salehd_discountamnt: nf.format(sumValue('salehd_discountamnt')),
        salehd_voucheramnt: nf.format(sumValue('salehd_voucheramnt')),
        salehd_partneramnt: nf.format(sumValue('salehd_partneramnt')),
        salehd_cashamount_all: nf.format(sumValue('salehd_cashamount_all')),
        salehd_tipamnt: nf.format(sumValue('salehd_tipamnt')),
        salehd_transferamnt: nf.format(sumValue('salehd_transferamnt')),
        salehd_creditcardamnt: nf.format(sumValue('salehd_creditcardamnt')),
        salehd_chequeamnt: nf.format(sumValue('salehd_chequeamnt')),
        salehd_depositamnt: nf.format(sumValue('salehd_depositamnt')),
        salehd_netamnt: nf.format(sumValue('salehd_netamnt')),
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
        { "header": "วันที่ขาย", "selector": "salehd_docudate" },
        { "header": "เลขที่เอกสาร", "selector": "salehd_docuno" },
        { "header": "ประเภทลูกค้า", "selector": "salehd_arcustomer_name" },
        { "header": "ประเภทเอกสาร", "selector": "master_docutype_name" },
        { "header": "ยอดมูลค่าสินค้า", "selector": "salehd_sumgoodamnt" },
        { "header": "ค่าธรรมเนียมบัตรเครดิต", "selector": "salehd_feeamnt" },
        { "header": "ส่วนลด", "selector": "salehd_discountamnt" },
        { "header": "Voucher", "selector": "salehd_voucheramnt" },
        { "header": "เงินเชื่อ", "selector": "salehd_partneramnt" },
        { "header": "เงินสด", "selector": "salehd_cashamount_all" },
        { "header": "เงินทิป", "selector": "salehd_tipamnt" },
        { "header": "เงินโอน", "selector": "salehd_transferamnt" },
        { "header": "บัตรเครดิต", "selector": "salehd_creditcardamnt" },
        { "header": "เช็ค", "selector": "salehd_chequeamnt" },
        { "header": "เงินมัดจำ", "selector": "salehd_depositamnt" },
        { "header": "ยอดสุทธิ", "selector": "salehd_netamnt" },

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

export default memo(SaleReportPayment);
