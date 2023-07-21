import { React, useState, useEffect, useContext, memo } from "react";
import { IconButton } from '@mui/material';
import axios from 'axios';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import DataContext from "../../../DataContext/DataContext";
import BtnAdd from "../../../components/Button/BtnAdd";
import Barcharts from "../../../components/Chart/Barcharts";
import DateRange from "../../../components/DatePicker/DateRange";
import DialogBranch from "../../../components/DialogBranch/DialogBranch";
import BadgeCompopnents from "../../../components/BadgesComponent/Badgeconponents";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import Loading from "../../../components/Loading/Loading";
import { Link } from "react-router-dom";
import DataTable from '../../../components/Datatable/Datatables';
import _ from "lodash";
import Moment from 'moment';
import UrlApi from "../../../url_api/UrlApi";
import '../../../components/CSS/report.css';



const RealTime = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [dataReport, setDataReport] = useState([])
    const [dataChart, setDataChart] = useState([])
    const [dataSum, setDataSum] = useState([])
    const [databranch, setDataBranch] = useState([])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [defaulDate, setDefaulDate] = useState(false)
    const [brancID, setBranchID] = useState([])
    const [brancIDs, setBranchIDs] = useState([])
    const [brancIDDefual, setbrancIDDefual] = useState([])
    const [databadge, setDataBadge] = useState([])
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const [loading, setLoading] = useState(false)
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai',{ style: 'decimal', minimumFractionDigits: 2 }))


    const columnsdata = [
        {
            name:'สาขา' ,
            selector: row => row.master_branch_name,
            sortable: false,
            
        },
        {
            name:'ยอดขาย',
            selector: row => numFormat.format(row.sum_netamnt),
            sortable: false,
            width: "160px",
            right: true
        },
        {
            name:'บิลขาย',
            selector: row => row.count_salebill,
            sortable: false,
            center:true
        },
        {
            name:'ยอด/บิล' ,
            selector: row => numFormat.format( row.sale_amountperbill),
            sortable: false,
            right: true,
        },
        {
            name:'ยังไม่ปิดบิล' ,
            cell: row =>
                <div>{row.orderhd_netamnt == 0 ?
                    <span>{numFormat.format(row.orderhd_netamnt)}
                            <IconButton>
                                <KeyboardArrowRighttIcon/>
                            </IconButton></span> :
                    <span>{numFormat.format(row.orderhd_netamnt)}
                        <Link to="detail" state={[{
                            'branchID': row.master_branch_id,
                            'branchName': row.master_branch_name,
                            'startDate': startDate,
                            'endDate': endDate
                        }]}>
                            <IconButton>
                                <KeyboardArrowRighttIcon color="info" />
                            </IconButton></Link></span>                               
                     }
                    </div>,
            width: "160px",
            right: true,
            sortable: false,

        }, 
    ]

    useEffect(() => {
        getData()
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
        } else {
            getData()
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
        setLoading(true);
        if (startDate && endDate) {
            var strDate = Moment(startDate).format("YYYY-MM-DD")
            var enDate = Moment(endDate).format("YYYY-MM-DD")
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "db_name": "erpdb",
                "start_date": strDate,
                "branch_id": BranchData[0].master_branch_id,
                "end_date": enDate,
                "user_id": userId
            }

            axios.post(UrlApi() + 'realtime', datas)
                .then(res => {
                    if (res.data) {
                        setDataChart(res.data)
                        setDataReport(res.data)
                        setDataSum(res.data)
                        getBarchart()
                    }
                    setLoading(false);
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
            axios.post(UrlApi() + 'realtime', datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)
                        setDataChart(res.data)
                        setDataSum(res.data)
                        sumData()

                    }
                    setLoading(false);
                })
            getDataTable()
        } else {
            getData()
        }

    }

    const sumData = () => {
        dataSum.map((item, idx) => {
            item.sum_netamnt = parseInt(item.sum_netamnt);
            item.count_salebill = parseInt(item.count_salebill);
            item.sale_amountperbill = parseInt(item.sale_amountperbill);
            item.orderhd_netamnt = parseInt(item.orderhd_netamnt);
        })
        var sumNet = _.sumBy(dataSum, 'sum_netamnt');
        var sumBill = _.sumBy(dataSum, 'count_salebill');
        var sumAmt_Bill = _.sumBy(dataSum, 'sale_amountperbill');
        var sumOrder_Net = _.sumBy(dataSum, 'orderhd_netamnt');
        return (<div class="row" style={{ marginLeft: "1%", marginBottom: "5%", marginTop:"1%" }}>
            <div class="col-2" style={{ marginLeft: "5%" }}>
                <p className="text_H"><strong>รวม</strong></p>
            </div>
            <div class="col" style={{ marginLeft: "5%" }}>
                <p className="text_H">{numFormat.format(sumNet)}</p>
            </div>
            <div class="col" style={{ marginLeft: "10%" }}>
                <p className="text_H">{sumBill}</p>
            </div>
            <div class="col" style={{ marginLeft: "18%" }}>
                <p className="text_H">{numFormat.format(sumAmt_Bill)}</p>
            </div>
            <div class="col">
                <p className="text_H">{numFormat.format(sumOrder_Net)}</p>
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
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        return (
            <div style={{ marginLeft: "10%", marginTop: "1%", width: "80%", }}>
                <Barcharts data={[...dataReport]} datakeyX="master_branch_prefix" startDate={startDate} endDate={ endDate}
                    datakey="sum_netamnt" maxS={ 1000} titles="ยอดขาย" />
                <p style={{marginTop: "2%" }} className="text">ยอดขาย จากวันที่
                    <strong> {strDate}</strong> ถึง
                    <strong> {enDate}</strong>
                </p>
               
            </div>)
    }

    const getDate = () => {
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        return (<p  className="text"><strong> {strDate} </strong>ถึง <strong> {enDate}</strong> </p>)
    }

    const getDataTable = () => {
        return (<div style={{ marginLeft: "1%", marginRight: "1%", marginTop: "1%"}}>
            <DataTable
                fixedHeader
                fixedHeaderScrollHeight
                responsive={true}
                columns={columnsdata}
                data={[...dataReport]}
            />
            {sumData()}
        </div>)
    }

    const getDataRange = () => {
        return (<DateRange style={{ marginLeft: "10%", width:"90%" }}
            handleStart={(d) => { setStartDate(d) }} handleEnd={(d) => { setEndDate(d)}} defauldates={defaulDate} >
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

    return (  <div>
        <p className="textH" >รายงานยอดขายรายวัน (Real Time)</p>
        <div class="row" style={{ marginLeft: "30%", marginRight: "20%"}}>
            <div class="col-3">
                {getDate()}
            </div>
            <div class="col-2"  >
                {getDataRange()}
            </div>
            <div class="col-2">
                {getDialogBranchs()}
            </div>
            <div class="col-2" >
                <BtnAdd style={{ width:"90%" }} onClick={getDateDefual} message="รีเฟรช" >รีเฟรช</BtnAdd>
            </div>
        </div>
        <div style={{ marginLeft: "40%" }}>{getBadge()}</div>
        <div style={{ height: '80vh', overflow: 'auto' }}> {getBarchart()}
            {getDataTable()}
        </div>
        {loading && <Loading style={{ left: '47%', left: '46%' }} />}
        </div>
    );
}

export default memo(RealTime);
