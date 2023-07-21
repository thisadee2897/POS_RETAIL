import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import BtnAdd from "../../components/Button/BtnAdd";
import DataContext from "../../DataContext/DataContext";
import FileCopy from '@mui/icons-material/FileCopy';
import DateRange from "../../components/DatePicker/DateRange";
import BadgeCompopnents from "../../components/BadgesComponent/Badgeconponents";
import DialogBranch from "../../components/DialogBranch/DialogBranch";
import DataTable from '../../components/Datatable/Datatables';
import Moment from 'moment';
import { CSVLink, CSVDownload } from "react-csv";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css';
import FilterDataTable from "../../components/SearchDataTable/FilterDataTable";
import DataContextBranchData from "../../DataContext/DataContextBranchData";



const SaleReportCancelBill = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const [dataReport, setDataReport] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const [databranch, setDataBranch] = useState([])
    const [databadge, setDataBadge] = useState([])
    const [dataExport, setDataExport] = useState([])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dateNow, setDateNow] = useState(new Date())
    const [branchName, setBranchName] = useState()
    const [brancID, setBranchID] = useState([])
    const [brancIDs, setBranchIDs] = useState([])
    const [brancIDDefual, setbrancIDDefual] = useState([])
    const [branchCode, setBranchCode] = useState()
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const [defaulDate, setDefaulDate] = useState(false)
    const [userBranchID, setUserBranchID] = useState(userData[0]['master_branch_id'])
    const [dataSum, setDataSum] = useState([])
    const [valueInput, setValueInput] = useState()

    const columnsdata = [
        {
            name:'ลำดับ' ,
            selector: row => row.no,
            width: "100px",
            sortable: true,
        },
        {
            name:'รหัสสาขา' ,
            selector: row => row.master_branch_code,
            width: "200px",
            sortable: true,
        },
        {
            name:'ชื่อสาขา',
            selector: row => row.master_branch_name,
            width: "200px",
            sortable: true,
        },
        {
            name:'วัน/เดือน/ปี' ,
            selector: row => row.salehd_docudate,
            width: "200px",
            sortable: true,
        },
        {
            name:'เลขที่เอกสาร' ,
            selector: row => row.salehd_docuno,
            width: "200px",
            sortable: true
        },
        {
            name:'ลูกค้า',
            selector: row => row.salehd_arcustomer_name,
            sortable: true,
            width: "200px",
            //footer: '120',
            //right: true,
        },
        {
            name:'มูลค่า' ,
            selector: row => numFormat.format(row.salehd_sumgoodamnt),
            width: "200px",
            sortable: true,
        },
        {
            name:'ส่วนลด' ,
            selector: row => numFormat.format(row.salehd_discountamnt),
            width: "200px",
            sortable: true,
        },
        {
            name:'ฐานภาษี' ,
            selector: row => numFormat.format(row.salehd_baseamnt),
            width: "200px",
            sortable: true,
        },
        {
            name:'ภาษี' ,
            selector: row => numFormat.format(row.salehd_vatamnt),
            width: "200px",
            sortable: true,
        },
        {
            name:'ยอดสุทธิ' ,
            selector: row => numFormat.format(row.salehd_netamnt),
            width: "200px",
            sortable: true,
        },
        {
            name:'พนักงานบันทึก' ,
            selector: row => row.salehd_employee_save,
            width: "200px",
            sortable: true
        },
        {
            name:'วันที่พนักงานบันทึก' ,
            selector: row => row.salehd_savetime,
            width: "200px",
            sortable: true
        },
        {
            name:'เหตุผลในการยกเลิก' ,
            selector: row => row.salehd_cancel_reason_name,
            width: "200px",
            sortable: true
        },
        {
            name:'พนักงานยกเลิก' ,
            selector: row => row.salehd_employee_cancel,
            width: "200px",
            sortable: true
        },
        {
            name:'วันที่พนักงานยกเลิก' ,
            selector: row => row.salehd_employee_cancel_time,
            width: "200px",
            sortable: true
        },
    ];

    useEffect(() => {
        getData()
        getDataBranch()
    }, [])

    useEffect(() => {
        if (brancIDDefual.length > 0 && defaulDate == false) {
            getDataFromBranch()
        } else {
            getData()
            getDataTable()
        }
    }, [startDate, endDate])

    useEffect(() => {
        exportExcells()
    }, [dataReport])

    const OnchangeSearch = (e) => {
        if (e.target.value) {
            setValueInput(e.target.value)
            let filterText = (e.target.value).trim()
            const filteredItems = dataSearch.filter((item) =>
                JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                let redatas = []
                let datas = {
                    master_branch_code: 'ไม่พบข้อมูล',
                    master_branch_name: 'ไม่พบข้อมูล',
                    salehd_sumgoodamnt: '0'
                }
                redatas.push(datas)
                redatas.map((item, idx) => { item.no = idx + 1 })
                setDataReport(redatas)
                getDataTable()
                setDataSum([])
                sumData()
            } else {
                filteredItems.map((item, idx) => { item.row_num = idx + 1 })
                setDataReport(filteredItems)
                getDataTable()
                setDataSum(filteredItems)
                sumData()
            }
        } else {
            getData()
        }

    }

    const getDataBranch = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "user_id": userId
        }
        axios.post(UrlApi() + 'get_branch_data', datas)
            .then(res => {
                if (res.data) {

                    setDataBranch(res.data)
                }
            })
    }

    const getData = () => {
        setValueInput('')
        var strDate = Moment(startDate).format("YYYY-MM-DD")
        var enDate = Moment(endDate).format("YYYY-MM-DD")
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "db_name": "erpdb",
            "start_date": strDate,
            "end_date": enDate,
            "branch_id": brancIDDefual.length > 0 ? brancIDDefual : [parseInt(BranchData.branch_id)],
            "user_id": userId
        }
        axios.post(UrlApi() + 'report_CancelBill', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let YearSaleDocudate = parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543
                        let YearSaleSavetime = parseInt(Moment(item.salehd_savetime).format("YYYY")) + 543
                        let YearSaleCanceltime = parseInt(Moment(item.salehd_employee_cancel_time).format("YYYY")) + 543
                        item.no = idx + 1
                        item.salehd_docudate = Moment(item.salehd_docudate).format("DD/MM/") + YearSaleDocudate
                        item.salehd_savetime = Moment(item.salehd_savetime).format("DD/MM/") + YearSaleSavetime + Moment(item.salehd_savetime).format(" HH:mm:ss")
                        item.salehd_employee_cancel_time = Moment(item.salehd_employee_cancel_time).format("DD/MM/") + YearSaleCanceltime + Moment(item.salehd_employee_cancel_time).format(" HH:mm:ss")
                    })
                    setDefaulDate(false)
                    setDataSum(res.data)
                    setDataSearch(res.data)
                    setDataReport(res.data)
                    sumData()
                }
            })
        getDataTable()

    }

    const getDateDefual = () => {
        setDefaulDate(true)
        setBranchName()
        setStartDate(new Date())
        setEndDate(new Date())
        setBranchID([])
        setbrancIDDefual([])
        setDataReport([])
        getDataBranch()
        getDialogBranchs()
        //getSearchInput()
        getDateRange()
        setValueInput('')
    }

    const getDate = () => {
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        return (<p className="text">
            <strong> {strDate} </strong> ถึง <strong> {enDate} </strong> </p>)
    }

    const getDataTable = () => {
        return (
        <div style={{ height: '80vh', overflow: 'auto', marginTop: "1%", marginRight: "1%" }}>
            <DataTable
                fixedHeader
                columns={columnsdata}
                data={dataReport}
                //paginationPerPage="50"
                //paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100, 150, 200,]}
                //pagination
                striped
                defaultSortAsc={false}
            />
            {/* {dataReport.length > 0 ?
                <div>{sumData()}</div> : null
            } */}
        </div>
        )
    }

    const sumData = () => {
        console.log(dataSum)
        if (dataSum.length > 0) {
            dataSum.map((item, idx) => {
                item.salehd_sumgoodamnt = (item.salehd_sumgoodamnt);

            })
            var salehd_sumgoodamnt = _.sumBy(dataSum, 'salehd_sumgoodamnt');
            return (<div class="row" style={{ marginLeft: "45%" }} >
                <div class="col-1" >
                    <p className="text_ts"><strong>รวม</strong></p>
                </div>
                <div class="col-1" >
                    <p className="text_ts_right">{numFormat.format(salehd_sumgoodamnt)}</p>
                </div>
            </div>)
        }
    }

    const onChangeDialog = (datas) => {
        if (datas) {
            datas.map((item, idx) => {
                if (item.checks == true) {
                    setbrancIDDefual(false)
                    setBranchIDs([])
                    brancIDs.push(item.value)
                }
                getDataFromBranch()

            })
            if (brancIDs.length == 0) {
                setDataBadge([])
                getData()
            }
        } else {
            getData()
            setBranchIDs([])
            setBranchID([])
            setbrancIDDefual([])
            setDataBadge([])
        }
    }
    const getDataFromBranch = () => {
        if (brancIDs.length > 0 || brancIDDefual.length > 0) {
            var strDate = Moment(startDate).format("YYYY-MM-DD")
            var enDate = Moment(endDate).format("YYYY-MM-DD")
            if (brancIDs.length > 0) {
                setbrancIDDefual(brancIDs)
                setDataBadge(brancIDs)
            } else {
                setDataBadge(brancIDDefual)
            }
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "db_name": "erpdb",
                "branch_id": brancIDs.length > 0 ? brancIDs : brancIDDefual,
                "start_date": strDate,
                "end_date": enDate,
                "user_id": userId
            }
            axios.post(UrlApi() + 'report_CancelBill', datas)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            let YearSaleDocudate = parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543
                            let YearSaleSavetime = parseInt(Moment(item.salehd_savetime).format("YYYY")) + 543
                            let YearSaleCanceltime = parseInt(Moment(item.salehd_employee_cancel_time).format("YYYY")) + 543
                            item.no = idx + 1
                            item.salehd_docudate = Moment(item.salehd_docudate).format("DD/MM/") + YearSaleDocudate
                            item.salehd_savetime = Moment(item.salehd_savetime).format("DD/MM/") + YearSaleSavetime + Moment(item.salehd_savetime).format(" HH:mm:ss")
                            item.salehd_employee_cancel_time = Moment(item.salehd_employee_cancel_time).format("DD/MM/") + YearSaleCanceltime + Moment(item.salehd_employee_cancel_time).format(" HH:mm:ss")
                        })
                        setDataReport(res.data)
                        setDataSearch(res.data)
                        setValueInput('')
                        setDataSum(res.data)
                        //sumData()
                    }

                })
        } else {
            //getData()
        }
    }

    const exportExcells = () => {
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        let Now_y = parseInt(Moment(dateNow).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        var dNow = Moment(dateNow).format("DD/MM/") + Now_y
        var TNow = Moment(dateNow).format("h:mm")
        let datas = []
        var branchs = branchCode ? branchCode : ""
        const csvData = [
            ["", "", , ""],
            ["", "", "", "รายงานยกเลิกบิลขาย"],
            ["", "", , "จากวันที่ " + strDate + " ถึง " + enDate],
            ["", "พิมพ์วันที่ " + dNow + " เวลา " + TNow,],
            ["รหัสสาขา", "ชื่อสาขา", "วันทีเอกสาร", "เลขที่เอกสาร", "ลูกค้า", "มูลค่า", "ส่วนลด", "ฐานภาษี", "ภาษี", "ยอดสุทธิ", "พนักงานบันทึก", "วันที่พนักงานบันทึก", "เหตุผลในการยกเลิก", "วันที่พนักงานยกเลิก", "พนักงานบันทึก"],
        ];
        dataReport.map((item, idx) => {
            datas = 
            [
                item.master_branch_code,
                item.master_branch_name,
                item.salehd_docudate,
                item.salehd_docuno,
                item.salehd_arcustomer_name,
                numFormat.format(item.salehd_sumgoodamnt),
                numFormat.format(item.salehd_discountamnt),
                numFormat.format(item.salehd_baseamnt),
                numFormat.format(item.salehd_vatamnt),
                numFormat.format(item.salehd_netamnt),
                item.salehd_employee_save,
                item.salehd_savetime,
                item.salehd_cancel_reason_name,
                item.salehd_employee_cancel_time,
                item.salehd_docuno,
            ]
            csvData.push(datas)
        })
        dataSum.map((item, idx) => {
            item.salehd_sumgoodamnt = item.salehd_sumgoodamnt ? (item.salehd_sumgoodamnt) : 0;
            item.salehd_discountamnt = item.salehd_discountamnt ? (item.salehd_discountamnt) : 0;
            item.salehd_baseamnt = item.salehd_baseamnt ? (item.salehd_baseamnt) : 0;
            item.salehd_vatamnt = item.salehd_vatamnt ? (item.salehd_vatamnt) : 0;
            item.salehd_netamnt = item.salehd_netamnt ? (item.salehd_netamnt) : 0;
        })
        var salehd_sumgoodamnt = _.sumBy(dataSum, 'salehd_sumgoodamnt');
        var salehd_discountamnt = _.sumBy(dataSum, 'salehd_discountamnt');
        var salehd_baseamnt = _.sumBy(dataSum, 'salehd_baseamnt');
        var salehd_vatamnt = _.sumBy(dataSum, 'salehd_vatamnt');
        var salehd_netamnt = _.sumBy(dataSum, 'salehd_netamnt');
        let sumTB = 
        [
            "", 
            "", 
            "",
            "", 
            "รวม", 
            numFormat.format(salehd_sumgoodamnt),
            numFormat.format(salehd_discountamnt),
            numFormat.format(salehd_baseamnt),
            numFormat.format(salehd_vatamnt),
            numFormat.format(salehd_netamnt),
            "",
            "",
            "",
            ""
        ]
        csvData.push(sumTB)
        setDataExport(csvData)
    }

    const getDialogBranchs = () => {
        return (<div style={{ width: "120%", fontsize: "0.875" }}>
            < DialogBranch onChangeBranchValue={(e) => { onChangeDialog(e) }} branchsDataID={brancID} />
        </div>)
    }

    const getDateRange = () => {
        return (
            <DateRange style={{ fontsize: "0.875", width: "120%" }}
                handleStart={(d) => { setStartDate(d) }} handleEnd={(d) => { setEndDate(d) }} defauldates={defaulDate}></DateRange>
        )
    }

    const getBadge = () => {
        let datasbadge = []
        if (databranch.length > 0) {
            databranch.map((item, idx) => {
                databadge.map((its, ids) => {
                    if (its == item.id) {
                        let datas = {
                            "label": item.value,
                            "value": item.id
                        }
                        datasbadge.push(datas)
                    }
                })
            })
        }
        return (<div>
            <BadgeCompopnents databadge={datasbadge} />
        </div>)
    }

    const getSearchInput = () => {
        return (< >
            <FilterDataTable value={valueInput} onChange={(e) => { OnchangeSearch(e) }} placeholder="ค้นหา" />
        </>
        )
    }

    return (
        <div >
            <p className="textH" >รายงานยกเลิกบิลขาย</p>
            <div class="row" style={{ marginLeft: "22%" }}>
                <div class="col-3" style={{ marginLeft: "12%", marginTop: "8px" }} > {getDate()}</div>
                <div class="col-1" >
                    {getDateRange()}
                </div>
                <div class="col-1" >
                    <BtnAdd style={{ width: "120%", fontsize: "0.8" }} onClick={getDateDefual} message="รีเฟรช" >รีเฟรช</BtnAdd>
                </div>
                <div class="col-1" style={{ marginBottom: "1%", marginLeft: "20%" }}>
                    {getDialogBranchs()}
                </div>
                <div class="col-2">
                    <CSVLink
                        style={{ backgroundColor: "#1E8449", color: "white", marginTop: "1%", width: "55%" }}
                        data={dataExport}
                        filename={"รายงานยกเลิกบิลขาย.csv"}
                        className="btn"
                        target="_blank"
                    ><FileCopy />Export
                    </CSVLink>
                </div>
            </div>
            <div style={{ marginLeft: "80%" }}>{getBadge()}</div>
            {getSearchInput()}
            {getDataTable()}
        </div>
    );
}

export default SaleReportCancelBill