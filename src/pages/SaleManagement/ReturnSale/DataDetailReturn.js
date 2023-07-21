import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import InputText from "../../../components/Input/InputText";
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import Card from 'react-bootstrap/Card';
import BtnAdd from "../../../components/Button/BtnAdd";
import _ from "lodash";
import UrlApi from "../../../url_api/UrlApi";
import InputSelect from "../../../components/Input/InputSelect";
import SaveIcon from '@mui/icons-material/Save';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import BtnCancel from "../../../components/Button/BtnCancel";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { addDays } from '@progress/kendo-date-math';
import Moment from 'moment';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const DataDetailReturn = (props) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialogCreditVat, setOpenDialogCreditVat] = useState(false)
    const [dataCategory, setDataCategory] = useState([])
    const [vatCredit, setvatCredit] = useState(0)
    const [amountTotal, setamountTotal] = useState(0)
    const [amountProduct, setAmountProduct] = useState(0)
    const [productDiscount, setProductDiscount] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [discountSer, setDiscountSer] = useState(0)
    const [taxBase, setTaxBase] = useState(0)
    const [taxs, setTaxs] = useState(0)
    const [cates, setCates] = useState(0)
    const [catesRate, setCatesRate] = useState(0)
    const [rateDisvalue, setRateDisvalue] = useState(0)
    const [rateVatvalue, setRateVatvalue] = useState(0)
    const [ratePoint, setRatePoint] = useState(0)
    const [vateName, setVateName] = useState("")
    const [vateID, setVateID] = useState("")
    const [pointDis, setPointDis] = useState(0)
    const [Mathsvalue, setMathsvalue] = useState()
    const [disValue, setDisvalue] = useState(0)
    const [dataDepositSelect, setDataDepositSelect] = useState([])
    const [dataVatselect, setDataVatselect] = useState([])
    const [dataDiscount, setDataDiscount] = useState([])
    const [discountSelect, setDiscountSelect] = useState([])
    const [printsName, setPrintName] = useState("")
    const [pointCus, setPointCus] = useState([])
    const [pointType, setPointType] = useState([])
    const [totalPoint, setTotalPoint] = useState(0)
    const [creditDate, setCreditDate] = useState(new Date())
    const [creditDay, setCreditDay] = useState(0)
    const [actionPrint, setActionPrint] = useState(false)
    const [actionSave, setActionSave] = useState(false)
    const [disibleDis, setDisibleDis] = useState(false)


    useEffect(() => {
        getDataDefault()
        getDataDiscount()
    }, [])

    useEffect(() => {
        setAmountProduct(props.amountProduct)
    }, [props.amountProduct])

    useEffect(() => {
        if (props.dataSleHD && props.dataSleHD.length > 0) {
            getDataCuspoint()
            getdataPointtype()
        }
    }, [props.dataSleHD])

    useEffect(() => {
        getDataDetail()
    }, [amountProduct])

    useEffect(() => {
        getValueAmount()
    }, [amountProduct, vateName, catesRate, amountTotal, props.amountProduct])

    useEffect(() => {
        props.onChangeAmountTotal(amountTotal)
        props.onChangeDataVatSelect(dataVatselect)
        props.onChangeTaxBase(taxBase)
        props.onChangeTaxs(taxs)
        props.onChangeCates(cates)
        props.onChangeCreditDate(creditDate)
        props.onChangeCreditDay(creditDay)
    }, [amountTotal, dataVatselect, taxBase, taxs, cates, creditDate, creditDay])

    useEffect(() => {
        CalPointType()
    }, [amountTotal, pointType])

    useEffect(() => {
        if (props.clearDatavalue == true) {
            setAmountProduct(0)
            setamountTotal(0)
            setCreditDay(0)
            setCreditDate(new Date())
        }
    }, [props.clearDatavalue])

    useEffect(() => {
        setActionPrint(props.actionsPrint)
        setActionSave(props.actionsSave)
    }, [props.actionsPrint, props.actionsSave])

    useEffect(() => {
        if (props.dataCustomer && props.flagPayment == false) {
            getCreditDate()
        }
    }, [props.dataCustomer, creditDay])


    const getDataBranchRounding = () => {
        let datas = {
            "company_id": parseInt(userCompanyID),
            "branch_id": parseInt(BranchData[0].master_branch_id),
        }
        axios.post(UrlApi() + 'getbranch_rounding', datas).then((res) => {
            if (res.data.length > 0) {
                if (res.data[0]['master_rounding_id'] == 1) {
                    setMathsvalue(1)
                } else if (res.data[0]['master_rounding_id'] == 2) {
                    setMathsvalue(2)
                } else if (res.data[0]['master_rounding_id'] == 3) {
                    setMathsvalue(3)
                } else if (res.data[0]['master_rounding_id'] == 4) {
                    setMathsvalue(4)
                }
            }
        })
    }

    const getDataCategory = () => {
        const datas = {
            "company_id": parseInt(userCompanyID),
        }
        axios.post(UrlApi() + 'getdata_wht_category', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.id = item.wht_category_id
                        item.value = item.wht_category_name
                    })
                    setDataCategory(res.data)
                }
            })
    }

    const getDataVat = () => {
        const datas = {
            "company_id": parseInt(userCompanyID),
            "branch_id": parseInt(BranchData[0].master_branch_id),
        }
        axios.post(UrlApi() + 'getdata_vat', datas)
            .then(res => {
                if (res.data.length > 0) {
                    let vatName = res.data[0]['master_vat_group_name']
                    let vatRate = res.data[0]['master_vat_rate']
                    let vatid = res.data[0]['master_vat_group_id']
                    setRateVatvalue(vatRate)
                    setVateName(vatName)
                    setVateID(vatid)
                    setDataVatselect(res.data)
                }
            })
    }

    const getDataCuspoint = () => {
        const dataAPI = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "customer_id": parseInt(props.dataSleHD[0]['salehd_arcustomerid'])
        }
        axios.post(UrlApi() + 'getcustomer_points', dataAPI)
            .then(res => {
                if (res.data) {
                    setPointCus(res.data)
                }
            })
    }

    const getdataPointtype = () => {
        const dataAPI = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "customer_id": parseInt(props.dataSleHD[0]['salehd_arcustomerid'])
        }
        axios.post(UrlApi() + 'getdata_pointtype', dataAPI)
            .then(res => {
                if (res.data) {
                    setPointType(res.data)
                }
            })
    }

    const getDataDiscount = () => {
        const datas = {
            "company_id": parseInt(userCompanyID),
            "branch_id": BranchData[0].master_branch_id,
        }
        axios.post(UrlApi() + 'getsalehd_discount', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        if (item.salehd_discount_type_active == true) {
                            setDiscountSelect([item])
                            if (item.salehd_discount_cal_type_id == 1) {
                                setRateDisvalue(parseFloat(item.salehd_discount_type_rate))
                            } else {
                                setDisvalue(parseFloat(item.salehd_discount_type_rate))
                            }
                            props.onChangeDataDiscountSelect([item])
                        }
                        item.id = item.salehd_discount_type_id
                        item.value = item.salehd_discount_type_name
                    })
                    setDataDiscount(res.data)
                }
            })
    }

    const CalPointType = () => {
        if (pointType.length > 0) {
            let rates = pointType[0]['point_type_rate']
            let points = Math.floor(parseInt(amountTotal) / parseInt(rates))
            setTotalPoint(points)
            let dataPoint = { "pointvalue": points }
            props.onChagePoints(dataPoint)
            props.onChangePointType(pointType)
        }
    }

    const getDataDefault = () => {
        getDataCategory()
        getDataVat()
        getDataBranchRounding()
    }

    const getValueAmount = () => {
        if (amountProduct > 0) {
            let taxValue = 0
            let taxs = 0
            let sum_dis = 0
            let totalProductDiscount = 0
            let catValue = 0
            let amount = 0
            let amountTotals = 0
            //Cal from Discount
            if (rateDisvalue > 0) {
                sum_dis = getValueMath(parseFloat(amountProduct) * (parseInt(rateDisvalue) / 100))

            } else if (parseFloat(disValue) > 0) {
                sum_dis = getValueMath(parseFloat(disValue))
            }
            else if (parseFloat(ratePoint) > 0) {
                sum_dis = getValueMath(parseFloat(amountProduct) * (parseInt(ratePoint) / 100))
            } else if (parseFloat(pointDis) > 0) {
                sum_dis = getValueMath(parseFloat(pointDis))
            } else {
                sum_dis = 0
            }
            totalProductDiscount = (parseFloat(amountProduct) - parseFloat(sum_dis))
            let amount_disCount = ((parseFloat(amountProduct) + parseFloat(discountSer)) - parseFloat(sum_dis))
            amount = ((parseFloat(amountProduct) + parseFloat(vatCredit) + parseFloat(discountSer)) - parseFloat(sum_dis))
            //Cal from Vat
            // console.log(vateID)
            if (vateID == 4) {
                taxValue = ((parseFloat(amount) * (parseFloat(rateVatvalue)) / (100 + parseFloat(rateVatvalue))))
                taxs = ((parseFloat(amount)) - parseFloat(taxValue))
                catValue = (parseFloat(taxs) * (parseFloat(catesRate) / 100))
                amountTotals = (parseFloat(amount) - parseFloat(catValue))
                // console.log(amountTotals)
            } else if (vateID == 5) {
                taxValue = ((parseFloat(amount) * (parseFloat(rateVatvalue)) / 100))
                taxs = (parseFloat(amount))
                catValue = (parseFloat(taxs) * (parseFloat(catesRate) / 100))
                amountTotals = (parseFloat(amount) + parseFloat(taxValue)) - parseFloat(catValue)
            }

            if (parseFloat(vatCredit) > 0) {
                setamountTotal(parseFloat(getValueMath(amountTotals)))
            } else {
                setamountTotal(getValueMath(amountTotals))
            }
            setTaxs(taxValue)
            setTaxBase(taxs)
            setCates(catValue)
            setDiscount(getValueMath(sum_dis))
            setProductDiscount(getValueMath(totalProductDiscount))
        } else {
            setTaxs(0)
            setTaxBase(0)
            setCates(0)
            setDiscount(getValueMath(0))
            setProductDiscount(getValueMath(0))
        }
    }

    const getValueMath = (value) => {
        if (value) {
            if (Mathsvalue == 1) {
                return Math.round(parseFloat(value.toFixed(1)))
            } else if (Mathsvalue == 2) {
                return Math.round(value)
            } else if (Mathsvalue == 3) {
                return Math.floor(value)
            } else if (Mathsvalue == 4) {
                return parseFloat(value.toFixed(2))
            }
        } else {
            return 0.00
        }
    }

    const onChangeDiscount = (e) => {
        if (e.target.value) {
            let findIndex = _.findIndex(dataDiscount, { promotion_discount_id: parseInt(e.target.value) })
            setDiscountSelect([dataDiscount[findIndex]])
            if (dataDiscount[findIndex]['promotion_discount_type_id'] == 1) {
                setRateDisvalue(parseFloat(dataDiscount[findIndex]['promotion_discount_rate']))
                setDisvalue(0)
            } else {
                setDisvalue(parseFloat(dataDiscount[findIndex]['promotion_discount_rate']))
                setRateDisvalue(0)
            }
            getValueAmount()
            props.onChangeDataDiscountSelect([dataDiscount[findIndex]])
        } else {
            setDisvalue(0)
            setRateDisvalue(0)
            getValueAmount()
            setDiscountSelect([])
            props.onChangeDataDiscountSelect([])
        }
    }

    const onChangeCategory = (e) => {
        if (e.target.value) {
            let findIndex = _.findIndex(dataCategory, { id: parseInt(e.target.value) })
            let rate = dataCategory[findIndex]['wht_category_rate']
            if (rate > 0) {
                setOpenDialogCreditVat(true)
            }
            setCatesRate(rate)
            getValueAmount()
            props.onChangeDataCatSelect(dataCategory[findIndex])
        } else {
            setCatesRate(0)
            getValueAmount()
            props.onChangeDataCatSelect('')
        }
    }

    const onChageCreditDay = (e) => {
        if (e.target.value < 0) {
            setAlertMessages("กรุณากรอกจำนวนวันเครดิตให้ถูกต้อง")
        } else {
            setCreditDay(e.target.value)
        }
    }

    const getCreditDate = () => {
        if (creditDay) {
            let Days = parseInt(creditDay)
            let newDate = addDays(new Date(), Days);
            setCreditDate(newDate)
        } else if (props.dataCustomer.length > 0 && props.dataCustomer[0]['arcustomer_creditday']) {
            setCreditDay(props.customerData[0]['arcustomer_creditday'])
        }
    }

    const getDialogCreditvat = () => {
        return (
            <Dialog open={openDialogCreditVat} maxWidth="1000px" >
                <DialogTitle >
                </DialogTitle>
                <DialogContent dividers='paper' style={{ width: "600px" }}>
                    <button type="button" className="cancel" onClick={() => setOpenDialogCreditVat(!openDialogCreditVat)}>x</button>
                    <div>
                        <p>***กรณีเลือกหัก ณ ที่จ่าย จะไม่มีการคิดค่าธรรมเนียมบัตรเครดิต</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <span><BtnAdd onClick={() => setOpenDialogCreditVat(!openDialogCreditVat)} message="ตกลง" /></span>
                    <BtnCancel onClick={() => setOpenDialogCreditVat(!openDialogCreditVat)} message="ปิด" />
                </DialogActions>
            </Dialog>
        )
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const cusInput = () => {
        return (<i style={{ marginTop: "12%", position: "absolute", marginRight: "100%", height: "2vh" }}>
            <DateRangeIcon style={{ fontSize: "19px" }} /></i>
        )
    }

    const getDataDetail = () => {
        let Years = creditDate.getFullYear() + 543
        let creditDates = Moment(creditDate).format('DD/MM/') + Years
        return (<Card className="card_sale" style={{ maxHeight: "24vh", minHeight: "22vh", marginTop: "1%", fontSize: "16px" }}>
            <div className="card_head" ><p className="textH_Left">รายละเอียดการชำระ</p></div>
            <Card.Body className="card_body_doc">
                <div class="row">
                    <div class={props.flagPayment == true ? "col-4" : "col-2"}>
                        <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มส่วนลด</p>
                        <InputSelect style={{ height: "3vh" }} option={dataDiscount} id_key="promotion_discount_id"
                            value_key="promotion_discount_name"
                            onChange={(e) => onChangeDiscount(e)} value={discountSelect.length > 0 ? discountSelect[0]['promotion_discount_id'] : "0"} disabled={disibleDis} />
                    </div>
                    <div class={props.flagPayment == true ? "col-4" : "col-2"}>
                        <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มภาษี</p>
                        <InputText type="text" style={{ height: "3vh" }} value={vateName} disabled />
                        <p className="text_sale" style={{ marginTop: "1%" }}>หัก ณ ที่จ่าย</p>
                        <InputSelect style={{ height: "3vh" }} option={dataCategory}
                            id_key="wht_category_id" value_key="wht_category_name"
                            onChange={(e) => onChangeCategory(e)} />
                    </div>
                    {props.flagPayment == false ?
                        <><div class="col-2">
                            <p className="text_sale" style={{ marginTop: "1%" }}>จำนวนวนวันเครดิต</p>
                            <InputText style={{ height: "3vh" }} type="number" value={creditDay} disabled />
                            <p className="text_sale" style={{ width: "200%" }}>วันครบกำหนดชำระ</p>
                            <InputText style={{ height: "3vh" }} type="text" value={creditDates} disabled />
                        </div>
                        </>
                        : <></>}
                    <div class={props.flagPayment == true ? "col-4" : "col-3"}>
                        <p className="text_sale" style={{ marginTop: "1%" }}>รวมมูลค่าสินค้า</p>
                        <InputText style={{ height: "3vh" }} type="text" value={nf.format(amountProduct)} disabled />
                        <p className="text_sale" style={{ marginTop: "1%" }}>มูลค่าสุทธิ</p>
                        <InputText style={{ fontSize: "1.5vw", height: "4vh" }} type="text" value={amountTotal > 0 ? nf.format(amountTotal) : 0} disabled />
                    </div>
                    {props.flagPayment == false ?
                        <div class="col-3">
                            <BtnAdd style={{ height: "4vh", marginTop: "6%", marginLeft: "2%", width: "90%" }}
                                message={"ออกใบกำกับภาษี" + ' ' + printsName} icons={<LocalPrintshopIcon />} onClick={() => props.onClickPrint(!actionPrint)} />
                            <BtnAdd style={{ marginLeft: "2%", height: "5vh", marginTop: "4%", width: "90%" }} message="บันทึก/ปิด"
                                icons={<SaveIcon />} onClick={() => props.onClickSave(!actionSave)} />
                        </div>
                        : <></>}
                </div>
            </Card.Body>
        </Card>)

    }

    return (<div>
        {getAlert()}
        {getDataDetail()}
        {getDialogCreditvat()}
    </div>)

}

export default memo(DataDetailReturn);
