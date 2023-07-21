import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import { Dropdown } from 'react-bootstrap';
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



const CloseshiftReport = () => {
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
            name: 'ลำดับ',
            selector: row => row.no,
            sortable: true,
        },
        {
            name: 'รหัสสาขา',
            selector: row => row.master_branch_code,
            sortable: true,
        },
        {
            name: 'สาขา',
            selector: row => row.master_branch_name,
            sortable: true,
        },
        {
            name: 'วันที่เอกสาร',
            selector: row => row.shift_transaction_docudates,
            sortable: true,
        },
        {
            name:'เวลาเปิดเอกสาร',
            selector: row => row.shift_transaction_open_savetimes,
            sortable: true,
        },
        {
            name: 'เวลาปิดเอกสาร',
            selector: row => row.shift_transaction_close_savetimes ,
            sortable: true,
        },
        {
            name:'เลขที่ที่เอกสาร',
            selector: row => row.shift_transaction_docuno,
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => numFormat.format(row.shift_transaction_open_cash_amount),
            width: "180px",
            sortable: true
        },
        {
            name:'เปิดโดย' ,
            selector: row => row.open_fullname ? row.open_fullname : '',
            width: "180px",
            sortable: true,
        },
        {
            name:'ปิดโดย' ,
            selector: row => row.close_fullname ? row.close_fullname :'',
            width: "180px",
            sortable: true,
        },
        {
            name:'สถานะ',
            selector: row => row.shift_transaction_status_name,
            sortable: true,
            footer: '120',
            right: true,
        } ]

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
                    salehd_docuno: 'ไม่พบข้อมูล',
                    salehd_arcustomer_name: 'ไม่พบข้อมูล',
                    shift_transaction_open_cash_amount: '0',
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
            "start_date": strDate,
            "end_date": enDate,
            "branch_id": brancIDDefual.length > 0 ? brancIDDefual : [parseInt(BranchData.branch_id)],
        }
        axios.post(UrlApi() + 'shift_transaction', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let y = parseInt(Moment(item.shift_transaction_docudate).format("YYYY")) + 543
                        let ySave = parseInt(Moment(item.shift_transaction_open_savetime).format("YYYY")) + 543
                        let yClose = parseInt(Moment(item.shift_transaction_close_savetime).format("YYYY")) + 543
                        item.no = idx + 1
                        item.shift_transaction_docudates = Moment(item.shift_transaction_docudate).format("DD/MM/") + y
                        item.shift_transaction_open_savetimes = item.shift_transaction_open_savetime ?
                            Moment(item.shift_transaction_open_savetime).format("DD/MM/") + ySave + ' '
                            + Moment(item.shift_transaction_open_savetime).format("hh:mm:ss") : ''
                        item.shift_transaction_close_savetimes = item.shift_transaction_close_savetime ?
                            Moment(item.shift_transaction_close_savetime).format("DD/MM/") + yClose + ' ' +
                            Moment(item.shift_transaction_close_savetime).format("hh:mm:ss"): ''
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
        return (<>
            <DataTable
                fixedHeader
                columns={columnsdata}
                data={dataReport}
                paginationPerPage="50"
                paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100, 150, 200,]}
                pagination
                striped
                defaultSortAsc={false}
            />
            {dataReport.length > 0 ?
                <div>{sumData()}</div> : null
            }</>
        )
    }

    const sumData = () => {
        if (dataSum.length > 0) {
            dataSum.map((item, idx) => {
                item.shift_transaction_open_cash_amount = parseInt(item.shift_transaction_open_cash_amount);
            })
            var shift_transaction_open_cash_amount = _.sumBy(dataSum, 'shift_transaction_open_cash_amount');

            return (<div class="row" style={{ marginLeft:"50%" }}>
                <div class="col-2" >
                    <p className="text_ts"><strong>รวม</strong></p>
                </div>
                <div class="col-1" >
                    <p className="text_ts_right">{numFormat.format(shift_transaction_open_cash_amount)}</p>
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
            axios.post(UrlApi() + 'shift_transaction', datas)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            let y = parseInt(Moment(item.shift_transaction_docudate).format("YYYY")) + 543
                            let ySave = parseInt(Moment(item.shift_transaction_open_savetime).format("YYYY")) + 543
                            let yClose = parseInt(Moment(item.shift_transaction_close_savetime).format("YYYY")) + 543
                            item.no = idx + 1
                            item.shift_transaction_docudates = Moment(item.shift_transaction_docudate).format("DD/MM/") + y
                            item.shift_transaction_open_savetimes = item.shift_transaction_open_savetime ?
                                Moment(item.shift_transaction_open_savetime).format("DD/MM/") + ySave + ' '
                                + Moment(item.shift_transaction_open_savetime).format("hh:mm:ss") : ''
                            item.shift_transaction_close_savetimes = item.shift_transaction_close_savetime ?
                                Moment(item.shift_transaction_close_savetime).format("DD/MM/") + yClose + ' ' +
                                Moment(item.shift_transaction_close_savetime).format("hh:mm:ss") : ''
                        })
                        setDataReport(res.data)
                        setDataSearch(res.data)
                        setValueInput('')
                        setDataSum(res.data)
                        sumData()

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
            ["", "", "", "", "", "บริษัท ตำกระเทย เรสเทอรองต์ พลัส จำกัด (สำนักงานใหญ่)"],
            ["", "", "", "", "", "รายงานยอดขายสรุปรายวันแยกตามประเภทการรับเงิน"],
            ["", "", "", "", "", "จากวันที่ " + strDate + " ถึง " + enDate],
            ["", "", "", "พิมพ์วันที่ " + dNow + " เวลา " + TNow],
            ["รหัสสาขา", "สาขา", "วันที่เอกสาร", "เวลาเปิดเอกสาร", "เวลาปิดเอกสาร", "เลขที่ที่เอกสาร", "มูลค่า", "เปิดโดย", "ปิดโดย", "สถานะ"],
        ];
        dataReport.map((item, idx) => {
            datas = [
                item.master_branch_code,
                item.master_branch_name,
                item.shift_transaction_docudates,
                item.shift_transaction_open_savetimes,
                item.shift_transaction_close_savetimes,
                item.shift_transaction_docuno,
                numFormat.format(item.shift_transaction_open_cash_amount),
                item.open_fullname,
                item.close_fullname,
                item.shift_transaction_status_name
            ]
            csvData.push(datas)
        })

        dataSum.map((item, idx) => {
            item.shift_transaction_open_cash_amount = parseInt(item.shift_transaction_open_cash_amount);

        })

        var shift_transaction_open_cash_amount = _.sumBy(dataSum, 'shift_transaction_open_cash_amount');
        let sumTB = ["", "", "", "", "รวม", "",
            numFormat.format(shift_transaction_open_cash_amount),
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
            <p className="textH" >รายงานสรุปปิดShift</p>
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
                        filename={"รายงานสรุปปิดShift.csv"}
                        className="btn"
                        target="_blank"
                    ><FileCopy />Export
                    </CSVLink>
                </div>
            </div>
            <div style={{ marginLeft: "80%" }}>{getBadge()}</div>
         {getSearchInput()}
            <div style={{ height: '80vh', overflow: 'auto' }}> {getDataTable()}</div>
        </div>
    );
}

export default memo(CloseshiftReport);
