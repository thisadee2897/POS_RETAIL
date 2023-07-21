import { React, useState, useEffect, useContext, memo } from "react";
import axios from 'axios';
import { IconButton } from '@mui/material';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import DataTable from 'react-data-table-component';
import DataContext from "../../../DataContext/DataContext";
import DialogBranch from "../../../components/DialogBranch/DialogBranch";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import BadgeCompopnents from "../../../components/BadgesComponent/Badgeconponents";
import BtnAdd from "../../../components/Button/BtnAdd";
import Piecharts from "../../../components/Chart/Piechart";
import DateRange from "../../../components/DatePicker/DateRange";
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";
import _ from "lodash";
import Moment from 'moment';
import UrlApi from "../../../url_api/UrlApi";
import Loading from "../../../components/Loading/Loading";
import '../../../components/CSS/durationpay.css'
import '../../../components/CSS/report.css';


const DurationByPay = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [dataReport, setDataReport] = useState([])
    const [dataPayTypeSit, setDataPayTypeSit] = useState([])
    const [dataPayTypeCol, setDataPayTypeCol] = useState([])
    const [dataVat, setDataVat] = useState([])
    const [dataChart, setDataChart] = useState([])
    const [databranch, setDataBranch] = useState([])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [userId, setUserId] = useState(userData[0].user_login_id)
    const [brancID, setBranchID] = useState([])
    const [databadge, setDataBadge] = useState([])
    const [brancIDs, setBranchIDs] = useState([])
    const [brancIDDefual, setbrancIDDefual] = useState([])
    const [defaulDate, setDefaulDate] = useState(false)
    const [dataSum, setDataSum] = useState([])
    const [loading, setLoading] = useState(false)
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const columnsdata = [
        {
            selector: row => <p className="text_tb">{row.master_branch_name}</p>,
            sortable: false,
        },
        {
            cell: row =>
                <div>{row.salehd_netamnt == 0 ?
                    <span><p className="text_tb">{numFormat.format(row.salehd_netamnt)}
                        <IconButton>
                            <KeyboardArrowRighttIcon />
                        </IconButton></p></span> :
                    <span><p className="text_tb">{numFormat.format(row.salehd_netamnt)}
                        <Link to="detail" state={[{
                            'branchID': row.master_branch_id,
                            'branchName': row.master_branch_name,
                            'startDate': startDate,
                            'endDate': endDate
                        }]}>
                            <IconButton>
                                <KeyboardArrowRighttIcon color="info" />
                            </IconButton></Link></p></span>
                }
                </div>,
            width: "220px",
            
            sortable: false,
        },
    ]
    useEffect(() => {
        getData()
        getDataBranch()
        sumData()
    }, [])

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

    useEffect(() => {
        sumData()
    }, [dataSum])

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
                company_id: parseInt(userData[0]['master_company_id']),
                db_name: "erpdb",
                start_date: strDate,
                branch_id: BranchData[0].master_branch_id,
                end_date: enDate,
                user_id: userId
            }
            axios.post(UrlApi() + 'payment_method', datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)
                        setDataSum(res.data)                 
                    }
                    setLoading(false)
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
            axios.post(UrlApi() + 'payment_method', datas)
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
        if (dataSum.length > 0) {
            dataSum.map((item, idx) => {
                item.salehd_creditcardamnt = parseInt(item.salehd_creditcardamnt);
                item.salehd_voucheramnt = parseInt(item.salehd_voucheramnt);
                item.salehd_depositamnt = parseInt(item.salehd_depositamnt);
                item.salehd_discountamnt = parseInt(item.salehd_discountamnt);
                item.saledt_other_netamnt = parseInt(item.saledt_other_netamnt);
                item.salehd_transferamnt = parseInt(item.salehd_transferamnt);
                item.salehd_cashamnt = parseInt(item.salehd_cashamnt);
                item.saledt_netamnt_type_1 = parseInt(item.saledt_netamnt_type_1);
                item.saledt_netamnt_type_2 = parseInt(item.saledt_netamnt_type_2);
                item.salehd_vatamnt = parseInt(item.salehd_vatamnt);
                item.salehd_tipamnt = item.salehd_tipamnt ? parseInt(item.salehd_tipamnt) : 0;
                item.salehd_netamnt = parseInt(item.salehd_netamnt);
                item.saledt_other_netamnt = parseInt(item.saledt_other_netamnt);

            })
            const Col = [
                { name: 'เงินสด', color: "#DE3163", header: "salehd_cashamnt", value: _.sumBy(dataSum, 'salehd_cashamnt') },
                { name: 'เงินโอน', color: "#9B59B6", header: "salehd_transferamnt", value: _.sumBy(dataSum, 'salehd_transferamnt')},
                { name: 'บัตรเครดิต', color: "#17A589", header: "salehd_creditcardamnt", value: _.sumBy(dataSum, 'salehd_creditcardamnt')},
                { name: 'Vocher', color: "#58D68D", header: "salehd_voucheramnt", value: _.sumBy(dataSum, 'salehd_voucheramnt')},
                { name: 'เงินมัดจำ', color: "#F1C40F", header: "salehd_depositamnt", value: _.sumBy(dataSum, 'salehd_depositamnt') },
                { name: 'ส่วนลด', color: "#E74C3C", header: "salehd_discountamnt", value: _.sumBy(dataSum, 'salehd_discountamnt')},
            ]
            const ColSit = [
                { name: 'ทานที่ร้าน', color: "#DE3163", header: "saledt_netamnt_type_1", value: _.sumBy(dataSum, 'saledt_netamnt_type_1') },
                { name: 'กลับบ้าน', color: "#FF7F50", header: "saledt_netamnt_type_2", value: _.sumBy(dataSum, 'saledt_netamnt_type_2') },
            ]
            const ColVat = [
                { name: 'ภาษีขาย', color: "#3498DB", header: "salehd_vatamnt", value: _.sumBy(dataSum, 'salehd_vatamnt') },
                { name: 'ค่าบริการรวม', color: "#8E44AD", header: "saledt_other_netamnt", value: _.sumBy(dataSum, 'saledt_other_netamnt') },
                { name: 'ทิปพนักงาน', color: "#45B39D ", header: "salehd_tipamnt", value: _.sumBy(dataSum, 'salehd_tipamnt') },
                { name: 'รวม', color: "#27AE60", header: "salehd_netamnt", value: _.sumBy(dataSum, 'salehd_netamnt') },
            ]
            setDataPayTypeCol(Col)
            setDataPayTypeSit(ColSit)
            setDataVat(ColVat)
        }
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
        getDateRange()
    }

    const getPayType = () => {
        return (
            <div>
                <Card className="cardH">
                    <Card.Header ><p className="text"><strong>ประเภทการชำระเงิน</strong></p></Card.Header>
                    <Card.Body>
                        <div class="row">
                            {dataPayTypeCol.map((item, idx) => {
                                return (<div class="col-4" style={{marginTop: "5%" }}>
                                    <Card className="cardB">
                                        <p style={{ color: item.color, marginTop: "10%" }} className="textH_tc">
                                            <strong> {numFormat.format(item.value)}</strong>
                                        </p>
                                        <p  className="text_tc">{item.name}</p>
                                    </Card>
                                </div>)
                                }) 
                            }
                        </div>
                        < Piecharts data={dataPayTypeCol} cx={'50%'} cy={'50%'} width={100} height={100} />
                    </Card.Body>
                </Card>
            </div>
            )
    }

    const  getPayTypeSit = () => {
        return (
            <div>
                <Card className="cardSit">
                    <Card.Header ><p className="text"><strong>ประเภทการนั่งทาน</strong></p></Card.Header>
                    <Card.Body>
                        <div class="row">
                            {dataPayTypeSit.map((item, idx) => {
                                return (<div class="col-6" style={{ marginTop: "5%" }}>
                                    <Card className="cardB">
                                        <p style={{ color: item.color, marginTop: "5%" }} className="textH_tc">
                                            <strong> {numFormat.format(item.value)}</strong>
                                        </p>
                                        <p className="text_tc">{item.name}</p>
                                    </Card>
                                </div>)
                            })}
                        </div>
                        <div >
                            <Piecharts data={dataPayTypeSit} innerRadius={60} width={160} cx={'50%'} cy={'35%'} />
                         </div>
                    </Card.Body>
                </Card>
                <Card className="cardSitVat">
                    <Card.Body>
                     <div class="row">
                            {dataVat.map((item, idx) => {
                                return (
                                    <> {idx < 2 ? <div class="col-6" style={{ marginTop: "5%" }}>
                                        <Card className="cardB">
                                            <p style={{ color: item.color,  marginTop: "5%" }} className="textH_tc">
                                                <strong> {numFormat.format(item.value)}</strong>
                                            </p>
                                            <p className="text_tc">{item.name}</p>
                                        </Card>
                                    </div> : idx == 2 ?
                                            <div class="col-6" style={{ marginTop: "5%", marginLeft: "25%" }}>
                                            <Card className="cardB">
                                                    <p style={{ color: item.color, marginTop: "5%" }} className="textH_tc">
                                                        <strong> {numFormat.format(item.value)}</strong>
                                                </p>
                                                <p style={{ marginLeft: "25%" }}>{item.name}</p>
                                            </Card>
                                        </div> 
                                        :
                                        <div class="col-12" style={{ marginTop: "5%" }}>
                                            <Card className="cardB">
                                                    <p style={{ color: item.color, marginTop: "5%" }} className="textH_tc">
                                                        <strong> {numFormat.format(item.value)}</strong>
                                                </p>
                                                    <p  className="text_tc">{item.name}</p>
                                            </Card>
                                        </div>}</>
                                         )
                                    })}
                      </div>
                     </Card.Body>
                </Card>
            </div>
        )
    }

    const getDate = () => {
        var strDate = startDate.toLocaleDateString("th-TH", { timeZone: "UTC" })
        var enDate = endDate.toLocaleDateString("th-TH", { timeZone: "UTC" })
        return (<p  className="text">
            <strong> {strDate} </strong> ถึง <strong> {enDate} </strong></p>)
    }

    const getDataTable = () => {
        return (
            <Card className="cardH">
                <Card.Header ><p className="text"><strong>ยอดขายแยกตามสาขา</strong></p></Card.Header>
                <Card.Body>
                 <DataTable
                  columns={columnsdata}
                   data={dataReport}
                    />
                </Card.Body>
            </Card>
        )
    }

    const getDateRange = () => {
        return (<DateRange style={{ width: "100%" }}
            handleStart={(d) => { setStartDate(d) }} handleEnd={(d) => { setEndDate(d) }}></DateRange>)
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

    return ( <div>
            <p  className="textH">รายงานยอดขายตามประเภทการชำระเงิน</p>
            <div class="row" style={{ marginLeft: "30%", marginRight: "20%" }}>
                <div class="col-3">
                    {getDate()}
                </div>
                <div class="col-2"  >
                    {getDateRange()}
                </div>
                <div class="col-2">
                    {getDialogBranchs()}
                </div>
                <div class="col-2" >
                    <BtnAdd style={{ width: "90%" }} onClick={getDateDefual} message="รีเฟรช" >รีเฟรช</BtnAdd>
                </div>
            </div>
            <div style={{ marginLeft: "40%" }}>{getBadge()}</div>
            <div style={{ height: '80vh', overflow: 'auto' }}><div style={{ marginTop: "2%", marginLeft: "3%" }}>
                <div class="row">
                    <div class="col-5">{getPayType()}</div>
                    <div class="col-3">{getPayTypeSit()}</div>
                       <div class="col-3">{getDataTable()} </div>
                </div>
            </div></div>
            {loading && <Loading style={{ left: '47%', left: '46%' }} />}
        </div>
    );
}

export default memo(DurationByPay);
