import { React, useState, useEffect, useContext, memo } from "react";
import axios from 'axios';
import { IconButton } from '@mui/material';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import DataTable from '../../../components/Datatable/Datatables';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import BtnAdd from "../../../components/Button/BtnAdd";
import Barcharts from "../../../components/Chart/Barcharts";
import DialogBranch from "../../../components/DialogBranch/DialogBranch";
import BadgeCompopnents from "../../../components/BadgesComponent/Badgeconponents";
import DateRange from "../../../components/DatePicker/DateRange";
import { Link } from "react-router-dom";
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import Moment from 'moment';
import '../../../components/CSS/report.css';

const Duration = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [dataReport, setDataReport] = useState([])
    const [databranch, setDataBranch] = useState([])
    const [dataChart, setDataChart] = useState([])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [userId, setUserId] = useState(userData[0].user_login_id)
    const [defaulDate, setDefaulDate] = useState(false)
    const [brancID, setBranchID] = useState([])
    const [databadge, setDataBadge] = useState([])
    const [brancIDs, setBranchIDs] = useState([])
    const [brancIDDefual, setbrancIDDefual] = useState([])
    const [loading, setLoading] = useState(false)
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const [dataSum, setDataSum] = useState([])

    const columnsdata = [
        {
            name: 'ยอดขาย',
            selector: row => row.master_branch_prefix,
            sortable: false,

        },
        {
            name:'ยอดขายสุทธิ',
            cell: row =>
                <div>{row.sum_netamount == 0 ?
                    <span>{numFormat.format(row.sum_netamount)}
                        <IconButton>
                            <KeyboardArrowRighttIcon />
                        </IconButton></span> :
                    <span>{numFormat.format(row.sum_netamount)}
                        <Link to="detail" state={[{
                            'branchID': row.master_branch_id,
                            'branchName': row.master_branch_prefix,
                            'startDate': startDate,
                            'endDate': endDate
                        }]}>
                            <IconButton>
                                <KeyboardArrowRighttIcon color="info" />
                            </IconButton></Link></span>
                }
                </div>,       
            width: "160px",
            sortable: false,
            right:true
        },
    ]

    useEffect(() => {
        getData()
        getDataChart()
        getDataBranch()
    }, [])

    useEffect(() => {
        getDataTable()
        getBarchart()
    }, [dataReport])

    useEffect(() => {
        getData()
    }, [defaulDate])

    useEffect(() => {
        if (brancIDDefual.length > 0 && defaulDate == false) {
            getDataFromBranch()
            getDataChart()
            getBarchart()
        } else {
            getData()
            getDataChart()
            getBarchart()
        }

    }, [startDate, endDate])

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
        if (startDate && endDate) {
            var strDate = Moment(startDate).format("YYYY-MM-DD")
            var enDate = Moment(endDate).format("YYYY-MM-DD")
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "db_name": "erpdb",
                "branch_id": BranchData[0].master_branch_id,
                "start_date": strDate,
                "end_date": enDate,
                "user_id": userId
            }
            axios.post(UrlApi() +'duration', datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)
                        setDataSum(res.data)
                        sumData()
                    }
           
                })
            getDataTable()
        }
    }

    const getDataChart = () => {
        if (startDate && endDate) {
            var strDate = Moment(startDate).format("YYYY-MM-DD")
            var enDate = Moment(endDate).format("YYYY-MM-DD")
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "db_name": "erpdb",
                "start_date": strDate,
                "end_date": enDate,
                "user_id": userId
            }
            axios.post(UrlApi() + 'duration_all', datas)
                .then(res => {
                    if (res.data) {
                        setDataChart(res.data)

                    }
                })
         
        }
    }

    const getDataFromBranch = () => {
        setLoading(true);
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
            axios.post(UrlApi() + 'duration', datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)
                        setDataSum(res.data)
                        sumData()
                    }
                    getDataTable()
                    setLoading(false);
                })
          
        } else {
            getData()
        }

    }
    const sumData = () => {
        dataSum.map((item, idx) => {
            item.sum_netamount = parseInt(item.sum_netamount);
        })
        var sum_sum_netamounte = _.sumBy(dataSum, 'sum_netamount');
        return (<div class="row" style={{ marginLeft: "1%", marginTop: "1%" }}>
            <div class="col">
                <p className="text_H"><strong>รวม</strong></p>
            </div>
            <div class="col">
                <p style={{ marginLeft: "80%" }} className="text_H">{numFormat.format(sum_sum_netamounte)}</p>
            </div>
        </div>)

    }

    const getDateDefual = () => {
        setDefaulDate(true)
        setStartDate(new Date())
        setEndDate(new Date())
        setBranchID([])
        setbrancIDDefual([])
        setDataReport([])
        getDataBranch()
        getDialogBranchs()
        getDataRange()
    }

    const getBarchart = () => {
        var strDate = startDate.toLocaleDateString("th-TH", { timeZone: "UTC" })
        var enDate = endDate.toLocaleDateString("th-TH", { timeZone: "UTC" })
        return (<div style={{ marginLeft: "8%", marginTop: "3%", width:"80%" }}>
            <Barcharts  data={dataChart} datakeyY="time_range" datakey="sum_netamount"
                vertical={true} titles="ยอดขายสุทธิ">
            </Barcharts>
            <p style={{ marginTop: "3%" }} className="text">ยอดขายจากวันที่
                <strong> {strDate} </strong> ถึง <strong> {enDate} </strong> </p>
        </div>)
    }

    const getDate = () => {
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        return (<p  className="text">
              <strong> {strDate} </strong> ถึง <strong> {enDate} </strong></p>)
    }

    const getDataTable = () => {
        return (<div style={{ overflow: 'auto', marginLeft: "2%", marginRight: "2%", marginTop: "1%" }}>
            <DataTable
                responsive
                fixedHeader
                columns={columnsdata}
                data={dataReport}
            />
            {sumData()}
        </div>)
    }

    const getDataRange = () => {
        return (<DateRange style={{ width: "100%" }}
            handleStart={(d) => { setStartDate(d) }} handleEnd={(d) => { setEndDate(d) }} defauldates={defaulDate} >
        </DateRange>)
    }

    const getDialogBranchs = () => {
        return (<div>
            < DialogBranch onChangeBranchValue={(e) => { onChangeDialog(e) }} branchsDataID={brancID} />
        </div>)
    }

    const onChangeDialog = (datas) => {
        if (datas) {
            datas.map((item, idx) => {
                if (item.checks == true) {
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
            setBranchIDs([])
            setBranchID([])
            setbrancIDDefual([])
            getData()
        }
    }

    const getBadge = () => {
        let datasbadge = []
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
        return (<div>
            <BadgeCompopnents databadge={datasbadge} />
        </div>)
    }

    return (
        <div>
            <p  className="textH">รายงานยอดขายตามช่วงเวลา</p>
            <div class="row" style={{ marginLeft: "30%", marginRight: "20%" }}>
                <div class="col-3" style={{ marginTop: "10px" }}>
                    {getDate()}
                </div>
                <div class="col-2"  >
                    {getDataRange()}
                </div>
                <div class="col-2">
                    {getDialogBranchs()}
                </div>
                <div class="col-2" >
                    <BtnAdd style={{ width: "90%" }} onClick={getDateDefual} message="รีเฟรช" >รีเฟรช</BtnAdd>
                </div>
            </div>
            <div style={{ marginLeft: "40%" }}>{getBadge()}</div>
            <div style={{ height: '80vh', overflow: 'auto' }}> {getBarchart()}
                {getDataTable()}
            </div>
        </div>
    );
}

export default memo(Duration);
