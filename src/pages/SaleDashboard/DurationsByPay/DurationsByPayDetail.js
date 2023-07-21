import { React, useState, useEffect, useContext, memo } from "react";
import axios from 'axios';
import { IconButton } from '@mui/material';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import DataContext from "../../../DataContext/DataContext";
import Piecharts from "../../../components/Chart/Piechart";
import { Card } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import _ from "lodash";
import Moment from 'moment';
import '../../../components/CSS/durationpay.css'
import '../../../components/CSS/report.css';
import { FaUserAlt, FaFileAlt } from "react-icons/fa";
import UrlApi from "../../../url_api/UrlApi";
import Loading from "../../../components/Loading/Loading";

const DurationByPayDetail = () => {
    const userData = useContext(DataContext);
    const location = useLocation();
    const [dataReport, setDataReport] = useState([])
    const [branchID, setBranchID] = useState([])
    const [branchName, setBranchName] = useState([])
    const [dataPayTypeSit, setDataPayTypeSit] = useState([])
    const [dataPayTypeCol, setDataPayTypeCol] = useState([])
    const [dataPayTypeSum, setDataPayTypeSum] = useState([])
    const [dataVat, setDataVat] = useState([])
    const [dataChart, setDataChart] = useState([])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [userId, setUserId] = useState(userData[0].user_login_id)
    const [loading, setLoading] = useState(false)
    const [dataSum, setDataSum] = useState([])
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))

    useEffect(() => {
        location.state.map((item, idx) => {
            if (item.branchID) {
                setBranchID(item.branchID)
                setStartDate(item.startDate)
                setEndDate(item.endDate)
                setBranchName(item.branchName)
                getData(item.branchID, item.startDate, item.endDate)
            }
        })
    }, [])

    useEffect(() => {
        sumData()
    }, [dataSum])

    const getData = (br, sr, en) => {
        setLoading(true)
        if (sr && en) {
            const brID = Number(br);
            var strDate = Moment(sr).format("YYYY-MM-DD")
            var enDate = Moment(en).format("YYYY-MM-DD")
            const datas = {
                company_id: parseInt(userData[0]['master_company_id']),
                db_name: "erpdb",
                branch_id: brID,
                start_date: strDate,
                end_date: enDate,
                user_id: userId
            }
            axios.post(UrlApi() + 'payment_branch', datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)
                        setDataSum(res.data)
                      
                    }
                })
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
                item.salehd_tipamnt = item.salehd_tipamnt ?  parseInt(item.salehd_tipamnt) : 0;
                item.salehd_netamnt = parseInt(item.salehd_netamnt);
                item.saledt_other_netamnt = parseInt(item.saledt_other_netamnt);
                item.customer_quantity = parseInt(item.customer_quantity);
                item.count_billsale = parseInt(item.count_billsale);
            })
            const api_payment = "payment_detail"
            const api_credit = "payment_sum_creditcard"
            const api_eatType = "eating_type"
            const api_services = "service_charge"

            const Col = [
                { name: 'เงินสด', color: "#DE3163", value: _.sumBy(dataSum, 'salehd_cashamnt'), types: 1, api: api_payment},
                { name: 'เงินโอน', color: "#9B59B6", value: _.sumBy(dataSum, 'salehd_transferamnt'), types: 2, api: api_payment},
                { name: 'บัตรเครดิต', color: "#17A589", value: _.sumBy(dataSum, 'salehd_creditcardamnt'), types: 3, api: api_credit },
                { name: 'Vocher', color: "#58D68D", value: _.sumBy(dataSum, 'salehd_voucheramnt'), types: 4, api: api_payment },
                { name: 'เงินมัดจำ', color: "#F1C40F", value: _.sumBy(dataSum, 'salehd_depositamnt'), types: 5, api: api_payment},
                { name: 'ส่วนลด', color: "#E74C3C", value: _.sumBy(dataSum, 'salehd_discountamnt'), types: 6, api: api_payment},
            ]
            const ColSit = [
                { name: 'ทานที่ร้าน', color: "#DE3163", value: _.sumBy(dataSum, 'saledt_netamnt_type_1'), eating_type: 1, api: api_eatType },
                { name: 'กลับบ้าน', color: "#FF7F50", value: _.sumBy(dataSum, 'saledt_netamnt_type_2'), eating_type: 2, api: api_eatType},
            ]
            const ColVat = [
                { name: 'ภาษีขาย', color: "#3498DB", value: _.sumBy(dataSum, 'salehd_vatamnt'), types: 7, api: api_payment},
                { name: 'ค่าบริการรวม', color: "#8E44AD", value: _.sumBy(dataSum, 'saledt_other_netamnt'), api: api_services },
                { name: 'ทิปพนักงาน', color: "#45B39D ", value: _.sumBy(dataSum, 'salehd_tipamnt'), api: api_services},
            ]
            const ColSum= [
                { name: 'รวม', color: "#27AE60",value: _.sumBy(dataSum, 'salehd_netamnt') },
                { name: 'คน', color: "#8E44AD",  value: dataSum[0].customer_quantity, icons:  <FaUserAlt />},
                { name: 'บิล', color: "#45B39D ", value: dataSum[0].count_billsale, icons: <FaFileAlt /> ,},
            ]
            setDataPayTypeCol(Col)
            setDataPayTypeSit(ColSit)
            setDataVat(ColVat)
            setDataPayTypeSum(ColSum)
            setLoading(false)
        }

    }

    const getPayType = () => {
        return (
            <div>
                <Card className="cardH">
                    <Card.Header ><p className="text"><strong>ประเภทการชำระเงิน</strong></p></Card.Header>
                    <Card.Body>
                        <div class="row">
                            {dataPayTypeCol.map((item, idx) => {
                                return (<div class="col-4" style={{ marginTop: "5%" }}>
                                    <Card className="cardB">
                                        {getLinks(item)}
                                    </Card>
                                </div>)
                            })
                            }
                        </div>
                            < Piecharts data={dataPayTypeCol} cx={'50%'} cy={'50%'} width={200} height={100} />
                    </Card.Body>
                </Card>
            </div>
        )
    }

    const getPayTypeSum = () => {
        return (<div class="row" style={{marginTop:"60%"}}>
            {dataPayTypeSum.map((item, idx) => {
                return (<>
                    {idx == 0 ? 
                        <div class="col-12" style={{ marginTop: "5%" }}>
                            <Card className="cardB">
                                <p className="textH" style={{ color: item.color, marginTop: "5%" }}>
                                    <strong> {numFormat.format(item.value)}</strong>
                                </p>
                                <p className="textH_tc"><strong>{item.name}</strong></p>
                            </Card>
                        </div>
                        : <div class="col-12" style={{ marginTop: "5%" }}>
                            <Card className="cardB" style={{ backgroundColor: "#F2F3F4 " }}>
                                <p classname="textH" style={{ marginLeft: "30%", marginTop: "5%" }}>
                                    { item.icons}
                                    <strong> {item.value} </strong>
                                    {item.name}
                                </p>
                            </Card>
                        </div>
                      } </>)  })  }
                    </div> ) }


    const getPayTypeSit = () => {
        return (
            <div>
                <Card className="cardSit_detail">
                    <Card.Header ><p className="text"><strong>ประเภทการนั่งทาน</strong></p></Card.Header>
                    <Card.Body>
                        <div class="row">
                            {dataPayTypeSit.map((item, idx) => {
                                return (<div class="col-6" style={{ marginTop: "5%" }}>
                                    <Card className="cardB">
                                        {getLinks(item)}
                                    </Card>
                                </div>)
                            })}
                        </div>
                        <div >
                                <Piecharts data={dataPayTypeSit} innerRadius={70} width={100} height={100} cx={'50%'} cy={'40%'} />
                        </div>
                    </Card.Body>
                </Card>
                <Card className="cardSitVat">
                    <Card.Body>
                        <div class="row">
                            {dataVat.map((item, idx) => {
                                var nf = new Intl.NumberFormat();
                                return (
                                    <> {idx < 2 ? <div class="col-6" style={{ marginTop: "5%" }}>
                                        <Card className="cardB">
                                            {getLinks(item)}
                                        </Card>
                                    </div> : 
                                        <div class="col-6" style={{ marginTop: "5%", marginLeft: "25%" }}>
                                            <Card className="cardB">
                                                <p style={{ color: item.color, marginTop: "5%" }} className="text_tc">
                                                    <strong> {nf.format(item.value)}</strong>
                                                </p>
                                                <p  className="text_tc">{item.name}</p>
                                            </Card>
                                        </div>
                                 }</>
                                )
                            })}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    const getLinks = (item) => {
        return (<><div>{item.value == 0 ?
            <span><p style={{ color: item.color, marginTop: "5%" }} className="textH_tc">
                <strong>{numFormat.format(item.value)}</strong>
                         <IconButton><KeyboardArrowRighttIcon /> </IconButton></p>
                    </span> :
            <span><p style={{ color: item.color, marginTop: "5%" }} className="textH_tc">
                      <strong>{numFormat.format(item.value)}</strong>
                <Link to="sub" state={[{
                    company_id: 1,
                    db_name: "erpdb",
                    branch_id: branchID,
                    branch_name: branchName,
                    start_date: startDate,
                    end_date: endDate,
                    user_id: userId,
                    pay_type: item.types,
                    eating_type: item.eating_type,
                    name:item.name,
                    api:item.api

                }]} >
                        <IconButton> <KeyboardArrowRighttIcon style={{ color: item.color }} /> </IconButton>
                        </Link></p>
                   </span>
        } </div>  <p className="text_tc">{item.name}</p></>
        )

    }


    const getDate = () => {
        var strDate = Moment(startDate).format("DD-MM-YYYY")
        var enDate = Moment(endDate).format("DD-MM-YYYY")
        return (<p className="text">
            <strong> {strDate} </strong> ถึง <strong> {enDate} </strong></p>)
    }

    return (
        <div>
            <p  className="textH">ยอดขายตามประเภทการชำระเงิน <strong>{branchName}</strong></p>
            <div class="row" style={{ marginLeft: "20%", marginRight: "20%", marginTop: "1%" }}>
                {getDate()}
            </div>
            <div style={{ marginTop: "2%" }}>
                <div class="row">
                    <div class="col-5">{getPayType()}</div>
                    <div class="col-2">{getPayTypeSum()}</div>
                    <div class="col-4">{getPayTypeSit()} </div>
                </div>
            </div>
            {loading && <Loading style={{ left: '47%', left: '46%' }} />}
        </div>
    );
}

export default memo(DurationByPayDetail);
