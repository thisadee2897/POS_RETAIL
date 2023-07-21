import { React, useState, useEffect, useContext, memo } from "react";
import axios from 'axios';
import Barcharts from "../../components/Chart/Barcharts";
import AreaChart from "../../components/ChartDashBoard/AreaChart";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import BtnAdd from "../../components/Button/BtnAdd";
import DialogBranch from "../../components/DialogBranch/DialogBranch";
import DateRange from "../../components/DatePicker/DateRange";
import BadgeCompopnents from "../../components/BadgesComponent/Badgeconponents";
import "react-datepicker/dist/react-datepicker.css";
import { Card } from 'react-bootstrap';
import _ from "lodash";
import Moment from 'moment';
import UrlApi from "../../url_api/UrlApi";
import Loading from "../../components/Loading/Loading";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import '../../components/CSS/saledashboard.css'
import Grid from '@mui/material/Grid';
import BtnRefresh from "../../components/Button/BtnRefresh";

const SaleDashboard = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id']);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const numFormat = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 })
    const numFormatMax = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2 })
    const [hoFlag, setHoFlag] = useState(localStorage.getItem('hoFlag'))
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear()), (new Date().getMonth(), 1))
    const [endDate, setEndDate] = useState(new Date())
    const [dataValueDuration, setDataValueDuration] = useState([])
    const [dataSalebill, setDataSaleBill] = useState([])
    const [dataSalehours, setDataSalehours] = useState([])
    const [dataSaleWeek, setDataSaleWeek] = useState([])
    const [dataSaleDays, setDataSaleDays] = useState([])
    const [userId, setUserId] = useState(userData[0].user_login_id)
    const [defaulDate, setDefaulDate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [allBranchID, setAllBranchID] = useState(localStorage.getItem('hoFlag'))
    const [brancID, setBranchID] = useState([])
    const [brancIDs, setBranchIDs] = useState([])
    const [brancIDDefual, setbrancIDDefual] = useState([])


    const dataAPI = {
        "user_id": userLoginID,
        "company_id": userCompanyID,
        "start_date": Moment(startDate).format("YYMMDD"),
        "end_date": Moment(endDate).format("YYMMDD"),
        
    }


    useEffect(() => {
        if (brancID.length > 0) {
            dataAPI.branch_id = brancID
            getDataReport()
        }
    }, [brancID])

    const getDataReport = () => {
        console.log(dataAPI,"dataAPI")
    }


    const getDataValueDurations = () => {
        /*axios.post(UrlApi() + 'dashboard_sales', datas)
            .then(res => {
                if (res.data) {
                    setDataValueDuration(res.data)
                }

            })
        axios.post(UrlApi() + 'dashboard_sales_bill', datas)
            .then(res => {
                if (res.data) {
                    setDataSaleBill(res.data)
                }
            })
        axios.post(UrlApi() + 'dashboard_sales_hours', datas)
            .then(res => {
                if (res.data) {
                    setDataSalehours(res.data)
                }
            })
        axios.post(UrlApi() + 'dashboard_sales_weeks', datas)
            .then(res => {
                if (res.data) {
                    setDataSaleWeek(res.data)
                }
            })
        axios.post(UrlApi() + 'dashboard_sales_Everyday', datas)
            .then(res => {
                if (res.data) {
                    setDataSaleDays(res.data)

                }
                setLoading(false)
            })*/
    }

    const onChangeDialog = (data) => {
        if (data.length > 0) {
            let branch = []
            data.map((item, idx) => {
                branch.push(parseInt(item.master_branch_id))
            })
            setBranchID(branch)
        }
    }

    const getValueDurations = () => {
        let data = dataValueDuration[0]
        return (<div>{dataValueDuration.length > 0 ? < div >
            <Card className="card_dashboard">
                <Card.Body>
                    <div class="row">
                        <div class="col-3">
                            <div className="card_durations_detail">
                                <div className="text-netamnt">
                                    <b style={{ color:"#2F3A9E"}}>ยอดขายสุทธิ</b>
                                    <b style={{ color: "#2F3A9E", textAlign: "center" }}>{numFormat.format(data['salehd_netamnt'])}</b>
                                </div>
                                <div style={{ marginRight: "3%" }}>
                                    <div class="row">
                                        <div class="col-6">
                                            <p className="text_ts_left">เงินสด ({numFormatMax.format(data.percen_cash_full)} %)</p>
                                        </div>
                                        <div class="col-6">
                                            <p className="text_ts_right">อื่น ๆ ({numFormatMax.format(data.percen_other_full)} %)</p>
                                        </div>
                                    </div>
                                    <ProgressBar bgcolor={'#FFD465'} completed={data.percen_cash_full} />
                                    <div class="row" style={{ marginTop: "2%" }}>
                                        <div class="col-6">
                                            <p className="text_ts_left">{numFormat.format(data.salehd_cashamnt)} บาท</p>
                                        </div>
                                        <div class="col-6">
                                            <p className="text_ts_right">{numFormat.format(data.salehd_otheramnt)} บาท</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-3">
                            <div className="card_durations_detail">
                                <div class="row">
                                    <div class="col-5 text-netamnt" >
                                        <b className="text_ts_left">ยอดขายสุทธิ</b>
                                        <b style={{ color: "red" }} className="text_ts_left" >ส่วนลด</b>
                                        <b className="text_ts_left">Voucher</b>
                                        <b className="text_ts_left">ทิป</b>
                                        <b className="text_ts_left">ค่าบริการ</b>
                                        <b className="text_ts_left">ภาษี</b>
                                    </div>
                                    <div class="col-6 text-netamnt">
                                        <b className="text_ts_right" >
                                            {numFormat.format(data['salehd_sumgoodamnt'])} บาท</b>
                                        <b style={{ color: "red" }} className="text_ts_right" >
                                            {numFormat.format(data['salehd_discountamnt'])} บาท</b>
                                        <b className="text_ts_right" >
                                            {numFormat.format(data['salehd_voucheramnt'])} บาท</b>
                                        <b className="text_ts_right" >
                                            {numFormat.format(data['salehd_tipamnt'])} บาท</b>
                                        <b className="text_ts_right" >
                                            {numFormat.format(data['saledt_netamnt_service'])} บาท</b>
                                        <b className="text_ts_right">
                                            {numFormat.format(data['salehd_vatamnt'])} บาท</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {dataSalebill.map((item, idx) => {
                            return (
                                <div class="col" >
                                    <div class="row">
                                        {idx == dataSalebill.length - 1 ?
                                            <div class="col-12" >
                                                <div class="row">
                                                    <div className="card_durations_info" style={{ marginLeft: "6%", }}>
                                                        <div style={{ marginTop: "10%", lineHeight: '2vh' }}>
                                                            <p className="text_ts_w">{item.master_order_location_type_name}</p>
                                                            <p className="text_ts_w"><strong>{numFormat.format(item.c_sale)}</strong></p>
                                                            <p className="text_ts_w"><strong>{numFormat.format(item.netamnt_perbill)}</strong></p>
                                                            <p className="text_ts_w"><strong>{numFormat.format(item.saledt_netamnt)}</strong></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div>
                                                {idx == 0 ?
                                                    <div class="col-12">
                                                        <div class="row">
                                                            < div className="card_durations_detail">
                                                                <div className="row">
                                                                    <div className="col-5" style={{ marginTop: dataSalebill.length > 2 ? "18%" : "14%", lineHeight: '2vh' }}>
                                                                        <p className="text_ts_left">{'  '}</p>
                                                                        <p className="text_ts_left" >Qty: </p>
                                                                        <p className="text_ts_left">Avg: </p>
                                                                        <p className="text_ts_left">Amnt:</p>
                                                                    </div>
                                                                    <div className="col-7" style={{ marginTop: "8%", lineHeight: '2vh' }}>
                                                                        <p className="text_ts_b">{item.master_order_location_type_name}</p>
                                                                        <p className="text_ts_b"><strong>{numFormat.format(item.c_sale)}</strong></p>
                                                                        <p className="text_ts_b"><strong>{numFormat.format(item.netamnt_perbill)}</strong></p>
                                                                        <p className="text_ts_b"><strong>{numFormat.format(item.saledt_netamnt)}</strong></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div> :
                                                    <div class="col-12">
                                                        <div class="row">
                                                            < div className="card_durations_detail">
                                                                <div style={{ marginTop: "8%", lineHeight: '2vh' }}>
                                                                    <p className="text_ts_b">{item.master_order_location_type_name}</p>
                                                                    <p className="text_ts_b"><strong>{numFormat.format(item.c_sale)}</strong></p>
                                                                    <p className="text_ts_b"><strong>{numFormat.format(item.netamnt_perbill)}</strong></p>
                                                                    <p className="text_ts_b"><strong>{numFormat.format(item.saledt_netamnt)}</strong></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }</div>
                                        }
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </Card.Body>
            </Card>
        </div > : null
        }</div>)
    }

    const getBarChartHour = () => {
        return (<Card className="card_dashboard" style={{ width: "90%", height: "50%", marginLeft:"10px" }}>
                <Card.Body >
                    <Barcharts
                         data={dataSalehours}
                         datakeyX='hours'
                         datakey='salehd_netamnt'
                         colorCharts='#FFD465'
                         titles="ยอดขายรายชั่วโมง" />
                </Card.Body>
            </Card>)
    }

    const getBarChartonDay = () => {
        return (<Card className="card_dashboard" style={{ marginTop: "10px", width: "90%", height: "50%", marginLeft: "10px" }}>
                <Card.Body >
                <Barcharts
                    data={dataSaleWeek}
                    datakeyX='dayofweek'
                    datakey='saledt_netamnt'
                    colorCharts={['#6598F6', '#74E0C0', '#FFD465', '#FF9C53']}
                    titles="ยอดขายรายวัน" />
                </Card.Body>
            </Card>)
    }

    const getBarChartDay = () => {
        return ( <Card className="card_dashboard">
                <Card.Body>
                        <AreaChart data={dataSaleDays} />
                </Card.Body>
            </Card>)
    }

    const getDialogBranchs = () => {
        return (<div>
            <DialogBranch onChangeBranchValue={(e) => { onChangeDialog(e) }} branchsDataID={brancID} allBranchID={allBranchID} />
        </div>)
    }

    const getDataRange = () => {
        return (<DateRange style={{ marginTop: "1%", marginLeft: "10%", width: "90%" }}
            handleStart={(d) => { setStartDate(d) }} handleEnd={(d) => { setEndDate(d) }} defauldates={defaulDate} >
        </DateRange>)
    }

    const getDateDefual = () => {

    }

    const getChart = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} >
                    {getValueDurations()}
                </Grid>
                <Grid item xs={8} >
                    {getBarChartDay()}
                </Grid>
                <Grid item xs={4} >
                    {getBarChartHour()}
                    {getBarChartonDay()}
                </Grid>
            </Grid> )
    }

    return (
        <div style={{ background: "#F2F2F2", marginTop: "0px", height: "100%" }}>
            <div style={{ marginTop: "10px", marginLeft: "1%", marginRight: "1%", background: "#F2F2F2", height: "100%" }}>
                <div className="card_head">
                    <p className="textH_Left" style={{ marginLeft: "10px" }}>รายงาน การวิเคราะห์ภาพรวมการขาย</p>
                </div>
                <Grid container spacing={0.1} style={{ marginTop: "1%" }}>
                    <Grid item xs={2} >
                        <p style={{ marginBottom: "0px" }}>เลือกวันที่</p>
                        {getDataRange()}
                        </Grid>
                    <Grid item xs={3} >
                        <p style={{ marginBottom: "0px" }}>เลือกสาขา</p>
                         {getDialogBranchs()}
                     </Grid>
                    <Grid item xs={1} >
                        <BtnRefresh style={{ width: "90%", marginTop: "10%" }} onClick={getDateDefual} />
                     </Grid>
                </Grid>
                <div style={{marginTop:"10px"}}>{getChart()}</div>
                {loading && <Loading style={{ left: '47%', left: '46%' }} />}
            </div>
        </div>
    );
}

export default memo(SaleDashboard);
