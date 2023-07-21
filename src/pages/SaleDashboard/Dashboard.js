import { React, useState, useEffect, useContext, memo } from "react";
import '../../components/CSS/dashboard.css'
import axios from 'axios';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import DoughnutChart from '../../components/ChartDashBoard/Doughnut';
import ShapPieChart from "../../components/Chart/ShapPieChart"
import HeaderReport from '../../components/HeaderReport/HeaderReport'
import UrlApi from "../../url_api/UrlApi";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import Moment from 'moment';
import DateRange from "../../components/DatePicker/DateRange";
import DialogBranch from "../../components/DialogBranch/DialogBranch";
import BtnAdd from "../../components/Button/BtnAdd";
import BtnRefresh from "../../components/Button/BtnRefresh";
import InputText from "../../components/Input/InputText";
import ColumnChart from '../../components/Chart/ColumnChart';
import Card from 'react-bootstrap/Card';
import Grid from '@mui/material/Grid';

function Dashboard() {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id']);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const [firstDate, setFirstDate] = useState()
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear()), (new Date().getMonth(),1))
    const [endDate, setEndDate] = useState(new Date())
    const [defaulDate, setDefaulDate] = useState([startDate, endDate])
    const [loading, setLoading] = useState(false)
    const [brancID, setBranchID] = useState([BranchData[0].master_branch_id])
    const [userID, setUserID] = useState(userData[0].user_login_id)
    const [allBranchID, setAllBranchID] = useState(false)
    const [hoFlag, setHoFlag] = useState(localStorage.getItem('hoFlag'))
    const [ValueCAtegory, setValueCAtegory] = useState([])
    const [dataCustomerChart, setDataCustomerChart] = useState([])
    const [dataCustomerChartNet, setDataCustomerChartNet] = useState([])
    const [countAr, setCountAr] = useState([])
    const [sumAr, setSumAr] = useState(0)
    const [monthlyData, setMonthlyData] = useState([])
    const [monthlyLabel, setMonthlyLabel] = useState([])
    const [weeklyData, setWeeklyData] = useState([])
    const [weeklyLabel, setWeeklyLabel] = useState([])
    const [cancelData, setCancelData] = useState([])
    const [cancelLabel, setCancelLabel] = useState([])
    const [costAndSpendNow, setCostAndSpendNow] = useState([])
    const [costAndSpendPass, setCostAndSpendPass] = useState([])
    const [areaData, setAreaData] = useState([])
    const [areaLabel, setAreaLabel] = useState([])

    const dataAPI = {
        "user_id": userLoginID,
        "company_id": userCompanyID,
        "start_date": Moment(startDate).format("YYMMDD"),
        "end_date": Moment(endDate).format("YYMMDD"),
    }

    useEffect(() => {
        checkHO()
    }, [])

    const checkHO = () => {
        if (hoFlag == 'true') {
            setAllBranchID(true)
        } else {
            setAllBranchID(false)
        }
    }

    useEffect(() => {
        if (brancID.length > 0) {
            dataAPI.branch_list_id = brancID
            getDataReport()
        }
    }, [brancID])

    useEffect(() => {
        const sum = countAr.reduce((sum, a) => sum + a, 0);
        setSumAr(sum);
    }, [countAr.length])

    useEffect(() => {
        getChart()
    }, [dataCustomerChartNet])

    const formatter = new Intl.NumberFormat('en', {
        style: 'decimal',
        // signDisplay: 'always', //เพิ่มเครื่องหมายหน้าตัวเลข
        useGrouping: true,
        notation: 'compact'
    })

    const getDataReport = () => {
        getValueCategory()
        getCustomerData()
        getMonthlySales()
        getCancleBill()
        getSalesPerDay()
        getCostAndSpend()
        getCostAmntAndSpendAmnt()
    }

    const getValueCategory = () => {
        axios.post(UrlApi() + 'get_value_category', dataAPI)
            .then(res => {
                if (res.data) {
                    setValueCAtegory(res.data);
                }
            })
    }

    const getCustomerData = () => {
        axios.post(UrlApi() + 'get_customer_data2', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.forEach((item, idx) => {
                        let dataCus = {
                            "name": formatter.format(parseInt(item.count_ar)),
                            "value": parseInt(item.count_ar),
                            "color": "#FF9C53",
                            "colorSector": "#74E0C0",
                            "startAngle": 100 + parseInt(item.count_ar),
                            "startAngleSector": parseInt(item.count_ar)
                        }
                        setDataCustomerChart(dataCus)
                        let dataCusNet = {
                            "name": formatter.format(parseInt(item.saledt_netamnt)),
                            "value": parseFloat(item.saledt_netamnt),
                            "color": "#6598F6",
                            "colorSector": "#74E0C0",
                            "startAngle": 50 + parseFloat(item.saledt_netamnt),
                            "startAngleSector": parseFloat(item.saledt_netamnt)/100
                        }
                        setDataCustomerChartNet(dataCusNet)
                    })
                }
            })
    }

    const getMonthlySales = () => {
        let monthlydata = []
        let monthlylabel = []
        axios.post(UrlApi() + 'get_monthly_sales', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.forEach((item, idx) => {
                        monthlydata.push(parseFloat(item.saledt_netamnt_exvat))
                        monthlylabel.push(item.salemonth_name)
                    })
                    let dataChart = {
                        name: "การขายรายเดือน",
                        data: monthlydata
                    }
                    setMonthlyData([dataChart])
                    setMonthlyLabel(monthlylabel)
                }
            })
    }

    const getCancleBill = () => {
        const canceldata = []
        const cancellabel = []
        axios.post(UrlApi() + 'get_cancle_bill', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.forEach((item, idx) => {
                        canceldata.push(parseFloat(item.count_bill))
                        cancellabel.push(item.salemonth_name)
                    })
                    setCancelData([{
                        name: 'ยกเลิกบิล',
                        type: 'line',
                        fill: 'solid',
                        data: canceldata
                    }])
                    setCancelLabel(cancellabel)
                }
            })
    }

    const getSalesPerDay = () => {
        let weeklyData = []
        let weeklyLabel = []
        axios.post(UrlApi() + 'get_sales_per_day', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.forEach((item, idx) => {
                        weeklyData.push(parseFloat(item.saledt_netamnt_exvat))
                        weeklyLabel.push(item.dayofweek)
                    })
                    setWeeklyData([{
                        name: "การขายรายสัปดาห์",
                        data: weeklyData
                    }])
                    setWeeklyLabel(weeklyLabel)
                }
            })
    }

    const getCostAndSpend = () => {
        let dataSpendNowsObj = []
        let dataSepndPassObj = []
        let dataSpendNow = {}
        let dataSpendNows = {}
        let dataSpendPass = {}
        let dataSpendsPass = {}
        axios.post(UrlApi() + 'get_cost_and_spend', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.forEach((item, idx) => {
                        if (item.master_product_configure_type_id == 1) {
                            dataSpendNow = {
                                "name": formatter.format(parseInt(item.gr_receivedt_amnt)),
                                "value": parseInt(item.gr_receivedt_amnt),
                                "color": "#6598F6",
                                "colorSector": "#74E0C0",
                                "path": true,
                                "label": item.master_product_configure_type_name
                            }
                            dataSpendNows = {
                                "name": formatter.format(parseInt(item.gr_receivedt_amnt_pass)),
                                "value": parseInt(item.gr_receivedt_amnt_pass),
                                "color": "#6598F6",
                                "colorSector": "#74E0C0",
                                "path": true,
                                "label": item.master_product_configure_type_name
                            }
                        } else {
                            dataSpendPass = {
                                "name": formatter.format(parseInt(item.gr_receivedt_amnt)),
                                "value": parseInt(item.gr_receivedt_amnt_pass),
                                "color": "#0BC0CF",
                                "colorSector": "#FFBC3F",
                                "path": true,
                                "label": item.master_product_configure_type_name
                            }
                            dataSpendsPass = {
                                "name": formatter.format(parseInt(item.gr_receivedt_amnt_pass)),
                                "value": parseInt(item.gr_receivedt_amnt_pass),
                                "color": "#0BC0CF",
                                "colorSector": "#FFBC3F",
                                "path": true,
                                "label": item.master_product_configure_type_name
                            }

                        }
                    })
                    dataSpendNowsObj.push(dataSpendNow)
                    dataSpendNowsObj.push(dataSpendNows)
                    dataSepndPassObj.push(dataSpendPass)
                    dataSepndPassObj.push(dataSpendsPass)
                    setCostAndSpendNow(dataSpendNowsObj)
                    setCostAndSpendPass(dataSepndPassObj)
                }
            })
    }

    const getCostAmntAndSpendAmnt = () => {
        let saledtData = []
        let receivedtData = []
        let areaLabel = []
        axios.post(UrlApi() + 'get_costAmnt_and_spendAmnt', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.forEach((item, idx) => {
                        saledtData.push(parseFloat(item.saledt_netamnt_exvat))
                        receivedtData.push(parseFloat(item.gr_receivedt_amnt))
                        areaLabel.push(item.master_branch_area_name)
                    })
                }
                setAreaLabel(areaLabel)
                setAreaData([
                    {
                        name: 'ยอดขาย',
                        type: 'column',
                        data: saledtData,
                    },
                    {
                        name: 'ต้นทุน',
                        type: 'column',
                        data: receivedtData,
                    }
                ])
            })
    }

    const getDataRange = () => {
        return (<DateRange
            handleStart={(d) => { setStartDate(d) }}
            handleEnd={(d) => { setEndDate(d) }}
            defauldates={defaulDate} >
        </DateRange>
        )
    }

    const onChangeDialog = (data) => {
        if (data.length > 0) {
            let branch = []
            data.map((item, idx) => {
                branch.push(parseInt(item.master_branch_id))
            })
            setBranchID(branch)
            dataAPI.branch_list_id = branch
            getDataReport()
        }
        
    }

    const getRefreshPage = () => {
        checkHO()
        let strDate = new Date((new Date().getFullYear()), (new Date().getMonth(), 1))
        setDefaulDate([strDate,new Date()])
        setBranchID([BranchData[0].master_branch_id])
    }

    const getChartNetmntProductGruop = () => {
        return (<Card className="card_dashboard">
            <b>มูลค่าการขายตามหมวดหมู่</b>
            <div class="row" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px", marginBottom: "10px" }}>
                {ValueCAtegory.map(({ growth_amount, master_product_group_id, master_product_group_name, saledt_netamnt_exvat, saledt_netamnt_exvat_pass }) => {
                    return (
                        master_product_group_id != "9999999" ?
                            <div className='col valueBox'>
                                <b className='textTitle'>{master_product_group_name}</b>
                                <b className='textValue'>{formatter.format(saledt_netamnt_exvat)}</b>
                                <b className='textGrow'>{growth_amount} %</b>
                            </div>
                            :
                            <div className='col valueBoxSum'>
                                <b className='textTitleSum'>{master_product_group_name}</b>
                                <b className='textValueSum'>{formatter.format(saledt_netamnt_exvat)}</b>
                                <b className='textGrowSum'>{growth_amount} %</b>
                            </div>
                    )
                })}
            </div>
        </Card>)
    }

    const getChartCustomer = () => {
        return (<Card className="card_dashboard" style={{height:"280px"}}>
            <b style={{ marginTop: "10px", marginLeft: "20px" }}>Customer</b>
            <div class="row">
                <div className='col-5'>
                    <ShapPieChart dataChart={[dataCustomerChart]} x={150} y={100} />
                    <b style={{ marginLeft: "140px", marginBottom: "10px" }}>จำนวน</b>
                </div>
                <div className=' col-5'>
                    <ShapPieChart dataChart={[dataCustomerChartNet]} x={150} y={100} />
                    <b style={{ marginLeft: "140px", marginBottom: "10px" }}>ยอดขาย</b>
                </div>
            </div>
        </Card>)
    }

    const getChartCancleBill = () => {
        return (<Card className="card_dashboard" style={{height:"340px"}}>
            <b style={{ marginTop: "10px", marginLeft: "20px" }}>ยกเลิกบิล</b>
            <div style={{marginTop:"30px"}}><ColumnChart
                chartColors={"#FFBC3F"}
                chartLabels={cancelLabel}
                chartData={cancelData}
            /></div>
        </Card>)
    }

    const getChartNetmntForMount = () => {
        return (
            <Card className="card_dashboard" style={{ marginTop: "10px"}}>
                    <b style={{ marginTop: "10px", marginLeft: "20px" }}>มูลค่าการขายรายเดือน</b>
                         <ColumnChart
                                chartColors={['#6598F6', '#74E0C0', '#FFD465', '#FF9C53']}
                                moneyFormat={true}
                                distributed={true}
                                chartData={monthlyData}
                                chartLabels={monthlyLabel}
                    />
          </Card>
         )
    }

    const getChartCostandSpend = () => {
        return (<Card className="card_dashboard" style={{ marginTop: "10px"}}>
            <b style={{ marginTop: "10px", marginLeft: "20px" }}>CostAndSpend</b>
            <div style={{ marginLeft: "10%"}}>
                <Grid container spacing={0.1}>
                    <Grid item xs={6} >
                        <ShapPieChart dataChart={costAndSpendNow} width={600} height={240} x={100} y={100} />
                        <b> ต้นทุน / ค่าใช้จ่าย (No Vat) </b>
                        <p style={{ marginLeft:"10%" }}>(ช่วงวันที่เลือก)</p>
                    </Grid>
                    <Grid item xs={6} >
                        <ShapPieChart dataChart={costAndSpendPass} width={600} height={240} x={100} y={100} />
                        <b> ต้นทุน / ค่าใช้จ่าย (No Vat)</b>
                        <p>(ช่วงก่อนหน้าของช่วงวันที่เลือก)</p>
                    </Grid>
                </Grid>

            </div>
        </Card>)
    }

    const getChartNetmntForWeek = () => {
        return (
            <Card className="card_dashboard" style={{ marginTop: "10px" }}>
                <b style={{ marginTop: "10px", marginLeft: "20px" }}>มูลค่าการขายรายสัปดาห์</b>
                <ColumnChart
                    moneyFormat={true}
                    distributed={true}
                    chartColors={['#6598F6', '#74E0C0', '#FFD465', '#FF9C53']}
                    chartLabels={weeklyLabel}
                    chartData={weeklyData}
                    chartData={weeklyData}
                />
            </Card>
        )
    }

    const getChartCostandSpendArea = () => {
        return(<Card className="card_dashboard" style={{ marginTop: "10px" }}>
            <b style={{ marginTop: "10px", marginLeft: "20px" }}>Cost And Spend Area</b>
            <ColumnChart
                chartColors={['#0BC0CF', "#FFBC3F"]}
                showLegend={true}
                chartLabels={areaLabel}
                chartData={areaData}
            />
        </Card>)
    }

    const getChart = () => {
        return (<>
            <Grid container spacing={2}>
                <Grid item xs={8} >
                    {getChartNetmntProductGruop()}
                    <Grid container spacing={2}>
                        <Grid item xs={4} style={{ marginTop:"10px" }}>
                            {getChartCancleBill()}
                        </Grid>
                        <Grid item xs={8}>
                            {getChartCostandSpend()}
                        </Grid>
                    </Grid>
                    {getChartNetmntForMount()}
                </Grid>
                <Grid item xs={4} >
                    {getChartCustomer()}
                    {getChartNetmntForWeek()}
                    {getChartCostandSpendArea()}
                </Grid>
            </Grid>
        </>)
    }

    return (
        <div style={{ background: "#F2F2F2", marginTop: "0px", height:"100%" }}>
            <div style={{ marginTop: "10px", marginLeft: "1%", marginRight: "1%", background: "#F2F2F2", }}>
                <div className="card_head"><p className="textH_Left" style={{ marginLeft: "10px" }}>Dashboard</p>  </div>
                <Grid container spacing={0.1} style={{ marginTop:"1%" }}>
                    <Grid item xs={2} >
                        <p style={{ marginBottom:"0px" }}>เลือกวันที่</p>
                        {getDataRange()}
                    </Grid>
                    <Grid item xs={3}>
                        <p style={{ marginBottom: "0px" }}>เลือกสาขา</p>
                        <DialogBranch onChangeBranchValue={(e) => { onChangeDialog(e) }} branchsDataID={brancID} allBranchID={allBranchID } />
                    </Grid>
                    <Grid item xs={1} style={{ marginTop:"9px" }}>
                        <BtnRefresh style={{ width: "90%", marginTop:"10%" }} onClick={getRefreshPage} />
                    </Grid>
                </Grid>
                <div style={{ marginTop:"1%" }}>{getChart()}</div>
            </div>
        </div>
    )
}

export default Dashboard