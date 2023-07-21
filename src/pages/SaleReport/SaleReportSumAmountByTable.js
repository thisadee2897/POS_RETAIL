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
import { Box, Stack } from "@mui/material";


const SaleReportSumAmountByTable = () => {
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
            width: "100px",
            sortable: true,
        },
        {
            name: 'รหัสสาขา',
            selector: row => row.master_branch_code,
            sortable: true,
        },
        {
            name: 'ชื่อสาขา',
            selector: row => row.master_branch_name,
            //width: "250px",
            sortable: true,
        },
        {
            name: 'วันที่ขาย',
            selector: row => row.salehd_docudate,
            sortable: true,
            //width: "200px",
            //footer: '120',
            //right: true,
        },
        {
            name: 'จำนวนบิล',
            selector: row => row.c_billsale,
            //width: "180px",
            sortable: true,
        },
        {
            name: 'ยอดสุทธิ',
            selector: row => row.salehd_netamnt,
            //width: "180px",
            sortable: true,
        },
        {
            name: 'อัตราเฉลี่ย/บิล',
            selector: row => row.avg_amnt_bill,
            //width: "180px",
            sortable: true,
        },
    ];

    function sumValue(target) {
        let value = 0;
        dataReport.map((item) => {
            value += parseFloat(item[target]);
            return value;
        });
        return value;
    }

    const footer = {
        salehd_docudate: 'รวม',
        c_billsale: numFormat.format(sumValue('c_billsale')),
        salehd_netamnt: numFormat.format(sumValue('salehd_netamnt')),
        avg_amnt_bill: numFormat.format(sumValue('avg_amnt_bill')),
    };

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
                    c_billsale: '0'
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
        axios.post(UrlApi() + 'report_SumAmountByTablePerBill', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        // let y = parseInt(Moment(item.vat_postt_sale_invoicedate).format("YYYY")) + 543
                        item.no = idx + 1
                        // item.vat_postt_sale_invoicedate = Moment(item.vat_postt_sale_invoicedate).format("DD/MM/") + y
                        // item.vat_postt_sale_baseamnt = item.vat_postt_sale_baseamnt ? item.vat_postt_sale_baseamnt : 0
                        // item.vat_postt_sale_vatamnt = item.vat_postt_sale_vatamnt ? item.vat_postt_sale_vatamnt : 0
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
                    footer={footer}
                    dense
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
        if (dataSum.length > 0) {
            dataSum.map((item, idx) => {
                item.salehd_netamnt = (item.salehd_netamnt);

            })
            var salehd_netamnt = _.sumBy(dataSum, 'salehd_netamnt');
            return (<div class="row" style={{ marginLeft: "45%" }} >
                <div class="col-1" >
                    <p className="text_ts"><strong>รวม</strong></p>
                </div>
                <div class="col-1" >
                    <p className="text_ts_right">{numFormat.format(salehd_netamnt)}</p>
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
            axios.post(UrlApi() + 'report_SumAmountByTablePerBill', datas)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            // let y = parseInt(Moment(item.vat_postt_sale_invoicedate).format("YYYY")) + 543
                            item.no = idx + 1
                            // item.vat_postt_sale_invoicedate = Moment(item.vat_postt_sale_invoicedate).format("DD/MM/") + y
                            // item.vat_postt_sale_baseamnt = item.vat_postt_sale_baseamnt ? item.vat_postt_sale_baseamnt : 0
                            // item.vat_postt_sale_vatamnt = item.vat_postt_sale_vatamnt ? item.vat_postt_sale_vatamnt : 0
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
            ["", "", "", "รายงานยอดขายเฉลี่ย/บิล"],
            ["", "", , "จากวันที่ " + strDate + " ถึง " + enDate],
            ["", "พิมพ์วันที่ " + dNow + " เวลา " + TNow,],
            ["รหัสสาขา", "ชื่อสาขา", "วันที่ขาย", "จำนวนบิล", "ยอดสุทธิ", "อัตราเฉลี่ย/บิล"],
        ];
        dataReport.map((item, idx) => {
            datas = [
                item.master_branch_code,
                item.master_branch_name,
                item.salehd_docudate,
                numFormat.format(item.c_billsale),
                numFormat.format(item.salehd_netamnt),
                numFormat.format(item.avg_amnt_bill)
            ]
            csvData.push(datas)
        })
        dataSum.map((item, idx) => {
            item.c_billsale = item.c_billsale ? (item.c_billsale) : 0;
            item.salehd_netamnt = item.salehd_netamnt ? (item.salehd_netamnt) : 0;
        })
        var c_billsale = _.sumBy(dataSum, 'c_billsale');
        var salehd_netamnt = _.sumBy(dataSum, 'salehd_netamnt');
        let sumTB =
            [
                "",
                "",
                "รวม",
                numFormat.format(c_billsale),
                numFormat.format(salehd_netamnt),
            ]
        csvData.push(sumTB)
        setDataExport(csvData)
    }

    const getDialogBranchs = () => {
        return (<div>
            < DialogBranch onChangeBranchValue={(e) => { onChangeDialog(e) }} branchsDataID={brancID} />
        </div>)
    }

    const getDateRange = () => {
        return (
            <DateRange style={{ width: "90px" }}
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
            <p className="textH" >รายงานยอดขายเฉลี่ย/บิล</p>
            <Box>
                <Stack direction='row' spacing={2} justifyContent="right" alignItems="center">
                    {getDate()}
                    {getDateRange()}
                    <BtnAdd style={{ fontsize: "0.875" }} onClick={getDateDefual} message="รีเฟรช" >รีเฟรช</BtnAdd>
                    {getDialogBranchs()}
                    <div style={{ width: "10%" }}></div>
                    <CSVLink
                        style={{ width: "100px", backgroundColor: "#1E8449", color: "white", marginTop: "0" }}
                        data={dataExport}
                        filename={"รายงานยอดขายเฉลี่ย/บิล.csv"}
                        className="btn"
                        target="_blank"
                    ><FileCopy />Export
                    </CSVLink>
                    <div style={{ width: "15%" }}></div>
                    {getBadge()}
                </Stack>
            </Box>
            <div style={{ marginTop: "10px" }}>
                {getSearchInput()}
            </div>
            {getDataTable()}
        </div>
    );
}

export default SaleReportSumAmountByTable