import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import DataContext from "../../DataContext/DataContext";
import Moment from 'moment';
import DataTables from 'react-data-table-component';
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css'
import HeaderReport from "../../components/HeaderReport/HeaderReport";

const customStyles = {
    headCells: {
        style: {
            paddingTop: '8px',
            background: '#0064B0',
            color: "white",
            fontSize: "16px",
        },
    },
};

const CustomerPoint = () => {
    const userData = useContext(DataContext);
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [dataReport, setDataReport] = useState([])
    const [defaultDate, setDefaultDate] = useState(false)
    const [dataConditions, setDataConditions] = useState([])
    const [valueInput, setValueInput] = useState("")
    const [dataReportSearch, setDataReportSearch] = useState([])
    const columnsdataDisType = [
        { name: 'ประเภทส่วนลด', selector: row => row.salediscounttype_name, sortable: true, },
    ]
    const columnsdataDis = [
        { name: 'ชื่อส่วนลด', selector: row => row.salehd_discount_type_name, sortable: true, },
    ]
    const columnsdataSub = [
        { name: 'ลำดับ', selector: (row, index) => index + 1, sortable: true, align: 'right' },
        {
            name: 'ประเภทส่วนลด', selector: row => row.salediscounttype_name, sortable: true, align: 'left',
            fixed: false,
            autoWidth: true,
            allowOverflow: true,
            width: "150px"
        },
        {
            name: 'ชื่อส่วนลด',
            selector: row => row.salehd_discount_type_name,
            sortable: true,
            allowOverflow: true,
            fixed: false,
            autoWidth: true
        },
        {
            name: 'รหัสสาขา',
            selector: row => row.master_branch_code,
            sortable: true,
            allowOverflow: true,
            fixed: false,
            autoWidth: true
        },
        {
            name: 'ชื่อสาขา',
            selector: row => row.master_branch_name,
            sortable: true,
            fixed: false,
            autoWidth: true,
            allowOverflow: true,
            width: "180px"
        },
        {
            name: 'วันที่ขาย',
            selector: row => row.salehd_docudates,
            sortable: true,
            allowOverflow: true,
            width: "180px"

        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => row.salehd_docuno,
            sortable: true,
            align: 'left',
            allowOverflow: true,
            width: "180px"
        },
        {
            name: 'ลูกค้า',
            selector: row => row.salehd_arcustomer_name,
            sortable: true,
        },
        {
            name: 'มูลค่าสินค้า',
            selector: row => nf.format(row.salehd_sumgoodamnt,),
            sortable: true,
            right: true
        },
        {
            name: 'ส่วนลด',
            selector: row => nf.format(row.salehd_discountamnt),
            sortable: true,
            right: true
        },
        {
            name: 'ค่าบริการ',
            selector: row => nf.format(row.salehd_service_chargeamnt),
            sortable: true,
            right: true
        },
        {
            name: 'ฐานภาษี',
            selector: row => nf.format(row.salehd_baseamnt),
            sortable: true,
            right: true
        },
        {
            name: 'ภาษี',
            selector: row => nf.format(row.salehd_vatamnt),
            sortable: true,
            right: true
        },
        {
            name: 'มูลค่าสุทธิ',
            selector: row => nf.format(row.salehd_netamnt),
            sortable: true,
            right: true
        },
        {
            name: 'ผู้บันทึก',
            selector: row => row.salehd_employee_save,
            sortable: true,
            allowOverflow: true,
            width: "180px"
        },
        {
            name: 'ผู้บันทึก/วันที่',
            selector: row => row.salehd_savetime,
            sortable: true,
            allowOverflow: true,
            width: "180px"
        },
    ]

    useEffect(() => {
        if (dataConditions.discountType) {
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
                "discount_id": dataConditions.discount,
                "discounttype_id": dataConditions.discountType,
                "branch_id": dataConditions.branch
            }
            axios.post(UrlApi() + 'get_report_discount', dataApi)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            item.row_num = idx + 1
                            item.salehd_docudates = Moment(item.salehd_docudate).format("DD/MM/") + (parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543)
                            item.defaultExpanded = true
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

    const getDataTable = () => {
        if (dataReport.length > 0) {
            let dataHead = []
            dataReport.map((item, idx) => {
                let find = _.findIndex(dataHead, { salediscounttype_id: item.salediscounttype_id })
                if (find < 0) {
                    dataHead.push(item)
                }
            })
            return (<div style={{ height: '80vh', overflow: 'auto', marginTop: "1%", marginRight: "1%" }}>
                <DataTables
                    fixedHeader
                    customStyles={customStyles}
                    columns={columnsdataDisType}
                    data={dataHead}
                    paginationPerPage="50"
                    paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100, 150, 200,]}
                    pagination
                    expandableRows
                    dense
                    expandableRowExpanded={row => row.defaultExpanded}
                    striped
                    expandableRowsComponent={row => ExpandTableSub(row.data.salediscounttype_id)}
                /></div>
            )
        }
    }

    const ExpandTableSub = (id) => {
        let dataReportGroupType = _.groupBy(dataReport, 'salediscounttype_id')
        let dataHead = []
        dataReportGroupType[id].map((item, idx) => {
            let find = _.findIndex(dataHead, { salehd_discount_type_id: item.salehd_discount_type_id })
            if (find < 0) {
                dataHead.push(item)
            }
        })
        return (<div style={{ marginLeft: "4%" }}>
            <DataTables
                fixedHeader
                columns={columnsdataDis}
                data={dataHead}
                defaultSortAsc={false}
                expandableRows
                expandableRowExpanded={row => row.defaultExpanded}
                striped
                dense
                expandableRowsComponent={row => ExpandTable(row.data.salehd_discount_type_id)}
            /></div>

        )
    }

    const ExpandTable = (id) => {
        let dataReportGroups = _.groupBy(dataReport, 'salehd_discount_type_id')
        return (<DataTables
            fixedHeader
            columns={columnsdataSub}
            data={dataReportGroups[id]}
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
        { "header": "ชื่อส่วนลด", "selector": "salehd_discount_type_name" },
        { "header": "รหัสสาขา", "selector": "master_branch_code" },
        { "header": "ชื่อสาขา", "selector": "master_branch_name" },
        { "header": "วันที่ขาย", "selector": "salehd_docudates" },
        { "header": "เลขที่เอกสาร", "selector": "salehd_docuno" },
        { "header": "ลูกค้า", "selector": "salehd_arcustomer_name" },
        { "header": "มูลค่าสินค้า", "selector": "salehd_sumgoodamnt" },
        { "header": "ส่วนลด", "selector": "salehd_discountamnt" },
        { "header": "ค่าบริการ", "selector": "salehd_service_chargeamnt" },
        { "header": "ฐานภาษี", "selector": "salehd_baseamnt" },
        { "header": "ภาษี", "selector": "salehd_vatamnt" },
        { "header": "มูลค่าสุทธิ", "selector": "salehd_netamnt" },
        { "header": "ผู้บันทึก", "selector": "salehd_employee_save" },
        { "header": "ผู้บันทึก/วันที่'", "selector": "salehd_savetime" },
    ]

    const getDialogReport = () => {
        return (
            <HeaderReport
                onClickSearch={(e) => onChangeDialog(e)} //ข้อมูลจาก Dialog
                data={dataReport}
                columns={columnExport}
                onChange={(e) => OnchangeSearch(e)}
                value={valueInput}
                filterColumn={false}
            />)

    }

    return (
        <div>
            {getDialogReport()}
            {getDataTable()}
        </div>
    );
}

export default memo(CustomerPoint);
