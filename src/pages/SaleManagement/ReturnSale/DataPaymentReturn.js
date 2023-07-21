import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import UrlApi from "../../../url_api/UrlApi";
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import BtnAdd from "../../../components/Button/BtnAdd";
import Card from 'react-bootstrap/Card';
import InputText from "../../../components/Input/InputText";
import _, { parseInt } from "lodash";
import BtnDelete from "../../../components/Button/BtnDelete";
import DataTable from 'react-data-table-component';
import Btnsubmit from "../../../components/Button/BtnSubmit";
import BtnCancel from "../../../components/Button/BtnCancel";
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import SaveIcon from '@mui/icons-material/Save';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Moment from 'moment';
import '../../../components/CSS/sale.css'
import Icon from '@mdi/react';
import {
    mdiTicketPercentOutline, mdiCellphoneSound, mdiCreditCardOutline,
    mdiTrayFull, mdiPrinterOutline, mdiContentSaveCheckOutline
} from '@mdi/js';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const customStyles = {
    headCells: {
        style: {
            paddingTop: '8px',
            background: '#0064B0',
            color: "white",
            fontSize: "16px",
        },
    },
};

const DataPaymentReturn = (props) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialogTranfer, setOpenDialogTranfer] = useState(false)
    const [openDialogCredit, setOpenDialogCredit] = useState(false)
    const [openDialogPrint, setOpenDialogPrint] = useState(false)
    const [printsName, setPrintName] = useState("")
    const [dataTranfer, setDataTranfer] = useState([])
    const [dataCredit, setDataCredit] = useState([])
    const [dataCustomer, setDataCustomer] = useState([])
    const [valuedelete, setValuedatlete] = useState()
    const [checkCredit, setCheckCredit] = useState(false)
    const [totalOrder, setTotalOrder] = useState(0.00)
    const [valueSumCurr, setValueSumCurr] = useState()
    const [valueSumTranfer, setValueSumTranfer] = useState(0)
    const [valueSumCredit, setValueSumCredit] = useState(0)
    const [valueSumCreditNoVat, setValueSumCreditNoVat] = useState(0)
    const [cashBack, setCashBack] = useState(0)
    const [vouchers, setVouchers] = useState(0)
    const [paymentValues, setPaymentValues] = useState(0.00)
    const [printsLange, setPrintLange] = useState(0)
    const [disabledCredit, setDisabledCredit] = useState(false)
    const [partnerValue, setPartnerValue] = useState(0)
    const [disibleBtnAdd, setDisibleBtnAdd] = useState(false)
    const [flagAdd, setflagAdd] = useState(false)
    const [disibleTranfer, setDisibleTranfer] = useState(false)
    const ObjTranfer =  {
        "cq_bankbook_no": "",
        "cq_bank_name": "",
        "cq_bankbook_name": "",
        "amount":0,
    }
    const ObjCredit= {
        "cq_bankbook_no": "",
        "cq_bank_name": "",
        "cq_bankbook_name": "",
        "number_credit": "",
        "amount": 0,
        "remark" :""
    }
    const ObjPartner = {
        "master_partner_name": "",
        "amount": 0,
        "remark": ""
    }
    const columnbankTranfer = [
        {
            name: 'ลำดับ',
            selector: (row,idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'บัญชีธนาคาร',
            selector: (row, idx) => <InputText type="number" defaultValue={row.cq_bankbook_no} onChange={(e) => onChangeInputTranfer(e,idx,'cq_bankbook_no')} />,
            sortable: true,
        },
        {
            name: 'ธนาคาร',
            selector: (row, idx) => <InputText type="text" defaultValue={row.cq_bank_name} onChange={(e) => onChangeInputTranfer(e, idx, 'cq_bank_name')} />,
            sortable: true,
        },
        {
            name: 'ชื่อบัญชี',
            selector: (row, idx) => <InputText type="text" defaultValue={row.cq_bankbook_name} onChange={(e) => onChangeInputTranfer(e, idx, 'cq_bankbook_name')} />,
            sortable: true,
        },
        {
            name: 'มูลค่าเงินโอนที่ได้รับ',
            selector: (row, idx) => <InputText type="number"  style={{ width: "50%" }} defaultValue={row.amount} onChange={(e) => onChangeInputTranfer(e, idx, 'amount')}  />,
            sortable: true, 
            width: '200px',
        },
        {
            name: 'หมายเหตุ',
            selector: (row, idx) => <InputText type="text" defaultValue={row.remark} onChange={(e) => onChangeInputTranfer(e, idx, 'remark')} />,
            sortable: true,
        },
        {
            selector: (row,idx) => <BtnDelete   onClick={() => { OnchangeDeleteBookbank(row,idx) }} />,
            sortable: true,
            width: '130px'
        },
    ]

    const columnbankCredit = [
        {
            name: 'ลำดับ',
            selector: (row,idx)=>idx +1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'บัญชีธนาคาร',
            selector: (row, idx) => <InputText type="number" defaultValue={row.cq_bankbook_no} onChange={(e) => onChangeNumberCredit(e, idx, 'cq_bankbook_no')} />,
            sortable: true,
        },
        {
            name: 'ธนาคาร',
            selector: (row, idx) => <InputText type="text" defaultValue={row.cq_bank_name} onChange={(e) => onChangeNumberCredit(e, idx, 'cq_bank_name')} />,
            sortable: true,
        },
        {
            name: 'ชื่อบัญชี',
            selector: (row, idx) => <InputText type="text" defaultValue={row.cq_bankbook_name} onChange={(e) => onChangeNumberCredit(e, idx, 'cq_bankbook_name')} />,
            sortable: true,
            width: "200px",
        },
        {
            name: 'เลขบัตร',
            selector: (row, idx) => <InputText type="number" defaultValue={row.number_credit}  onChange={(e) => onChangeNumberCredit(e, idx, 'number_credit')} />,
            width: "300px",
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: (row, idx) => <InputText type="number" defaultValue={row.amount}  onChange={(e) => onChangeNumberCredit(e, idx, 'amount')} />,
            sortable: true,
        },
        {
            name: 'หมายเหตุ',
            selector: (row, idx) => <InputText type="text" defaultValue={row.remark} onChange={(e) => onChangeNumberCredit(e, idx, 'remark')} />,
            sortable: true,
        },
        {
            selector: (row, idx) => <BtnDelete onClick={() => { OnchangeDeleteBookbank(row, idx) }} />,
            sortable: true,
            width: '130px'
        },
    ]

    useEffect(() => {
        if (props.clearDatavalue == true) {
            setTotalOrder(0)
            setPaymentValues(0)
            setDataTranfer([])
            setDataCredit([])
            setValueSumCredit(0)
            setValueSumTranfer(0)
            setValueSumCurr(0)
        }
    }, [props.clearDatavalue])

    useEffect(() => {
        if (props.dataSaleHD && props.dataSaleHD.length > 0) {
            getDataCustomer()
        }
    }, [props.dataSaleHD])

    useEffect(() => {
        setTotalOrder(parseFloat(props.amountTotal))
        setPaymentValues(props.amountTotal)
    }, [props.amountTotal])

    useEffect(() => {
        getDataDefault()
    }, [paymentValues])

    useEffect(() => {
        getCashback()
    }, [paymentValues, valueSumTranfer, valueSumCredit, valueSumCurr, totalOrder])

    useEffect(() => {
        if (props.actionsSave == true) {
            onClickSaveDocuments()
        }
    }, [props.actionsSave])

    useEffect(() => {
        if (dataCustomer.length > 0) {
            props.onChangeCustomerData(dataCustomer)
        }
    },[dataCustomer])

    const ClearDataAll = () => {
        setflagAdd(false)
        setTotalOrder(parseFloat(props.amountTotals))
        setPaymentValues(parseFloat(props.amountTotals))
        setDisabledCredit(true)
        setDisibleBtnAdd(true)
        setValueSumCredit(0)
        setValueSumTranfer(0)
        setValueSumCurr()
        setPartnerValue(0)
        setDataCredit([])
        setDataTranfer([])
        setVouchers(0)
        setValueSumCreditNoVat(0)
        setPartnerValue(0)
        setCashBack(0)
        setPrintLange(0)
        setPrintName("")
        getPaymentBody()
    }

    const getDataCustomer = () => {
        let dataAPI = {
            "company_id": parseInt(userCompanyID),
            "customer_id": parseInt(props.dataSaleHD[0].salehd_arcustomerid)
        }
        axios.post(UrlApi() + 'get_customer_data_for_edit', dataAPI)
            .then(res => {
                res.data.map((item, idx) => {
                    item.name = item.arcustomer_name
                    item.row_num = idx + 1
                    item.arcustomer_addrs = item.arcustomer_addr ? item.arcustomer_addr : ''
                    item.master_addr_district_names = item.master_addr_district_name ? item.master_addr_district_name : ''
                    item.master_addr_prefecture_names = item.master_addr_prefecture_name ? item.master_addr_prefecture_name : ''
                    item.master_addr_province_names = item.master_addr_province_name ? item.master_addr_province_name : ''
                    item.master_addr_postcode_codes = item.master_addr_postcode_code ? item.master_addr_postcode_code : ''
                    item.address_name = item.arcustomer_addrs + ' ' + item.master_addr_district_names + ' ' +
                        item.master_addr_prefecture_names + ' ' + item.master_addr_province_names + '' +
                        item.master_addr_postcode_codes
                })
                setDataCustomer(res.data)
            })
    }

    const getDataDefault = () => {
        if (valueSumTranfer == 0) {
            ObjTranfer.amount = paymentValues
            setDataTranfer([ObjTranfer])
        }
        if (valueSumCredit == 0) {
            ObjCredit.amount = paymentValues
            setDataCredit([ObjCredit])
        }
    }

    const onCLickAddbookbankTranfer = (e) => {
        dataTranfer.push(ObjTranfer)
        dataTranfer.map((item, idx) => { setValuedatlete(idx) })
    }

    const onClickAddBookbankCredit = (e) => {
        dataCredit.push(ObjCredit)
        dataCredit.map((item, idx) => { setValuedatlete(idx) })
    }

    const onChangeInputTranfer = (e, idx, type) => {
        if (e.target.value) {
            dataTranfer[idx][type] = e.target.value
        }
    }

    const onChangeNumberCredit = (e, idx, type) => {
        if (e.target.value) {
            dataCredit[idx][type] = e.target.value
        }
    }

    const onClickCredit = () => {
        setCheckCredit(true)
        setOpenDialogCredit(true)
    }

    const onClickTranfer = () => {
        setCheckCredit(false)
        setOpenDialogTranfer(true)
    }

    const onClickAddDataBank = () => {
        let dataCheck = checkCredit == false ? dataTranfer : dataCredit
        let findAmt = _.findIndex(dataCheck, { amount: "0" })
        let findBankNo = _.findIndex(dataCheck, {cq_bankbook_no: "" })
        let findBankName = _.findIndex(dataCheck, { cq_bank_name: ""  })
        let findBookbane = _.findIndex(dataCheck, {  cq_bankbook_name: "" })
        if (findAmt >= 0 || findBankNo >= 0 || findBankName >= 0 || findBookbane >= 0) {
            setAlertMessages("กรุณากรอกข้อมูลให้ถูกต้อง")
            setAlerttWarning(true)
        } else {
            let sumTranfer = _.sumBy(dataCheck, 'amount');
            if (checkCredit == false) {
                setValueSumTranfer(parseFloat(sumTranfer))
                setOpenDialogTranfer(false)
            } else {
                setValueSumCredit(parseFloat(sumTranfer))
                setOpenDialogCredit(false)
            }
        }
    }

    const OnchangeDeleteBookbank = (row,idx) => {
        if (checkCredit == false) {
            dataTranfer.splice(idx, 1)
            setValuedatlete(row)
            let sumTranfer = _.sumBy(dataTranfer, 'amount');
            setValueSumTranfer(parseFloat(sumTranfer))
        } else if (checkCredit == true) {
            dataCredit.splice(idx, 1)
            setValuedatlete(row)
        }
    }

    const onChangeCurrency = (e) => {
        if (e.target.value < 0) {
            setAlertMessages("กรุณากรอก มูลค่าให้ถูกต้อง")
            setAlerttWarning(true)
            setDisibleBtnAdd(true)
        } else {
            if (e.target.value > 0) {
                setValueSumCurr(e.target.value)
            } else {
                setValueSumCurr(0)
            }
        }
    }

    const getCashback = () => {
        let totalSum = 0
        let valueSumCurrs = valueSumCurr ? valueSumCurr : 0
        if (props.dataCatSelect.wht_category_rate) {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCreditNoVat) + parseFloat(vouchers) + parseFloat(partnerValue)
        } else {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCredit) + parseFloat(vouchers) + parseFloat(partnerValue)
        }
        let difftotal;
        if (totalSum == 0 || totalOrder == totalSum) {
            setPaymentValues(0)
            setCashBack(0)
        }
        if (parseFloat(props.amountTotals) < parseFloat(totalSum)) {
            difftotal = (parseFloat(totalSum) - parseFloat(totalOrder))
            if (difftotal > 0) {
                setPaymentValues(0)
                setCashBack(difftotal)
            } else {
                let diffpay = parseFloat(totalOrder) - parseFloat(totalSum)
                setPaymentValues((diffpay))
                setCashBack(0)
            }
        } else if (parseFloat(totalOrder) > parseFloat(totalSum)) {
            difftotal = parseFloat(totalOrder) - parseFloat(totalSum)
            setCashBack(0)
            setPaymentValues((difftotal))
        } else if (parseFloat(totalOrder) == parseFloat(totalSum)) {
            setPaymentValues(0)
        }
    }

    const onClicDialogCus = () => {
        setOpenDialogPrint(true)
    }

    const onClickPrints = (e) => {
        setPrintName(e)
        setflagAdd(false)
        if (e == "พิมพ์ไทย") {
            setPrintLange(1)
        } else {
            setPrintLange(2)
        }
        setOpenDialogPrint(false)
    }

    const onClickSaveDocuments = () => {
        console.log(props)
        if (props.amountTotal <= 0) {
            setAlertMessages("มูลค่าบิลต้องมากกว่า 0")
            setAlerttWarning(true)
            return false
        }
        if (props.dataReasonSelect.length == 0) {
            setAlertMessages("กรุณาเลือกเหตุผลการคืนสินค้า")
            setAlerttWarning(true)
            return false
        }

        let dataCustomers = dataCustomer[0]
        let dataDocHD = props.dataSaleHD[0]
        let dataHD = {
            "returnproducthd_docudate": Moment(new Date()).format("YYYYMMDD"),
            "returnproducthd_docuno": props.docCode,
            "returnproducthd_empemployeemasterid": parseInt(userData[0]['emp_employeemasterid']),
            "returnproducthd_arcustomerid": dataCustomers.arcustomer_id ? parseInt(dataCustomers.arcustomer_id) : null,
            "returnproducthd_arcustomer_name": dataCustomers.arcustomer_name ? dataCustomers.arcustomer_name : null,
            "returnproducthd_arcustomer_taxid": dataCustomers.arcustomer_taxid ? dataCustomers.arcustomer_taxid : null,
            "returnproducthd_arcustomer_addr": dataCustomers.arcustomer_addr ? dataCustomers.arcustomer_addr : null,
            "returnproducthd_arcustomer_addr_district_id": dataCustomers.arcustomer_addr_district_id ? parseInt(dataCustomers.arcustomer_addr_district_id) : null,
            "returnproducthd_arcustomer_addr_prefecture_id": dataCustomers.arcustomer_addr_prefecture_id ? parseInt(dataCustomers.arcustomer_addr_prefecture_id) : null,
            "returnproducthd_arcustomer_addr_province_id": dataCustomers.arcustomer_addr_province_id ? parseInt(dataCustomers.arcustomer_addr_province_id) : null,
            "returnproducthd_arcustomer_addr_postcode_id": dataCustomers.arcustomer_addr_postcode_id ? parseInt(dataCustomers.arcustomer_addr_postcode_id) : null,
            "returnproducthd_remark": props.remarkDocument.length > 1 ? props.remarkDocument :null ,
            "returnproducthd_vatgroup_id": props.dataVatSelect.length > 0 ? props.dataVatSelect[0]['master_vat_group_id'] : null,
            "returnproducthd_vatrate": props.dataVatSelect.length > 0 ? parseInt(props.dataVatSelect[0]['master_vat_rate']) : 0,
            "returnproducthd_totalexcludeamnt": 0,
            "returnproducthd_totalincludeamnt": 0,
            "returnproducthd_baseamnt": props.taxBase ? parseFloat((props.taxBase.toFixed(2))) : 0,
            "returnproducthd_vatamnt": props.taxs ? parseFloat((props.taxs.toFixed(2))) : 0,
            "returnproducthd_sumgoodamnt": props.amountTotal ? parseFloat((props.amountTotal.toFixed(2))) : 0,
            "returnproducthd_discountamnt": 0,
            "returnproducthd_netamnt": props.amountTotal ? parseFloat((props.amountTotal.toFixed(2))) : 0,
            "returnproducthd_cashamnt": valueSumCurr > 0 ? parseFloat((parseFloat(valueSumCurr).toFixed(2))) : 0,
            "returnproducthd_transferamnt": valueSumTranfer > 0 ? parseFloat((valueSumTranfer.toFixed(2))) : 0,
            "returnproducthd_creditcardamnt": valueSumCredit > 0 ? parseFloat((valueSumCredit.toFixed(2))) : 0,
            "master_branch_id": parseInt(BranchData[0].master_branch_id),
            "master_company_id": parseInt(userData[0]['master_company_id']),
            "returnproducthd_docutype_id": props.flagPayment == true ? 11 : 25,
            "returnproducthd_creditday": props.flagPayment == true ? null : parseInt(props.creditDay),
            "returnproducthd_creditduedate": props.flagPayment == true ? null : Moment(props.creditDate).format("YYYYMMDD"),
            "returnproducthd_reason_id": parseInt(props.dataReasonSelect[0]['returnproducthd_reason_id'] ),
            "returnproducthd_refdocuid": dataDocHD.salehd_id ? parseInt(dataDocHD.salehd_id) : null,
            "returnproducthd_refdocuno": dataDocHD.salehd_docuno ? dataDocHD.salehd_docuno : null,
            "returnproducthd_refdocutype_id": dataDocHD.salehd_docutype_id ? parseInt(dataDocHD.salehd_docutype_id) : null,
            "returnproducthd_refdocudate": dataDocHD.salehd_docudate ? dataDocHD.salehd_docudate : null
        }
        let dataOrderDetail = []
        props.dataSaleDetail.map((item, idx) => {
                let dataDT = {
                    "returnproductdt_listno": idx + 1,
                    "returnproductdt_master_product_id": parseInt(item.saledt_master_product_id),
                    "returnproductdt_master_product_billname": item.saledt_master_product_billname,
                    "returnproductdt_master_product_barcode_id": item.saledt_master_product_barcode_id,
                    "returnproductdt_master_product_barcode_unit_id": parseInt(item.saledt_master_product_barcode_unit_id),
                    "returnproductdt_qty": parseInt(item.saledt_qty_return),
                    "returnproductdt_saleprice": parseFloat(item.saledt_saleprice),
                    "returnproductdt_discount_amnt": parseFloat(item.saledt_discount_amnt),
                    "returnproductdt_netamnt": parseFloat((parseFloat(item.saledt_netamnt_return)).toFixed(2)),
                    "returnproductdt_stock_unit_rate": item.saledt_stock_unit_rate,
                    "returnproductdt_master_product_barcode_code": item.saledt_master_product_barcode_code,
                    "returnproductdt_master_product_barcode_unitname": item.saledt_master_product_barcode_unitname,
                    "returnproductdt_vatflag": item.saledt_vatflag,
                    "saledt_balance_qty": item.select_active == true  ?
                        parseInt(parseInt(item.saledt_qty) - parseInt(item.saledt_qty_return)) : parseInt(item.saledt_qty_return),
                    "saledt_balance_amnt": item.select_active == true ? item.saledt_netamnt_amt : item.saledt_netamnt_return,
                    "saledt_id": parseInt(item.saledt_id),
                    "saledt_listno": item.saledt_listno,
                    "returnproductdt_active": item.select_active,
                }
                dataOrderDetail.push(dataDT)
        })

        let dataTrans = []
        if (dataTranfer.length > 0 && valueSumTranfer > 0) {
            dataTranfer.map((item, idx) => {
                let datasTranfers = {
                    "bank_booktransfer_out_listno": idx + 1,
                    "des_bankbook_no": item.cq_bankbook_no,
                    "des_bank_name": item.cq_bank_name,
                    "des_bankbook_name": item.cq_bankbook_name,
                    "bank_booktrans_fer_out_amount": item.amount,
                    "bank_booktransfer_out_remark": item.remark
                }
                dataTrans.push(datasTranfers)
            })
        }
        let dataCredits = []
        if (dataCredit.length > 0 && valueSumCredit > 0) {
            dataCredit.map((item, idx) => {
                let datasCredits = {
                    "cheq_cheqdata_pay_listno": idx + 1,
                    "cheq_cheqdata_pay_bankbook_no": item.cq_bankbook_no,
                    "cheq_cheqdata_pay_bank_name": item.cq_bank_name,
                    "cheq_cheqdata_pay_bankbook_name": item.cq_bankbook_name,
                    "cheq_cheqdata_pay_cardno": item.number_credit,
                    "cheq_cheqdata_pay_amount": item.amount,
                    "cheq_cheqdata_pay_remark": item.remark
                }
                dataCredits.push(datasCredits)
            })
        }

        let dataSave = {
            "returnproducthd": [dataHD],
            "returnproductdt": dataOrderDetail,
            "transfer": dataTrans,
            "creditcard": dataCredits
        }
        axios.post(UrlApi() + 'save_returnproduct', dataSave)
            .then(res => {
                if (res.data[0]['fn_insert_returnproduct']) {
                    setAlertMessages("บันทึกข้อมูลสำเร็จ")
                    setAlertSuccess(true)
                    setflagAdd(false)
                    ClearDataAll()
                    setDisibleBtnAdd(true)
                    props.onChangeSave(true)
                } else {
                    setDisibleBtnAdd(false)
                    setflagAdd(false)
                    setAlertMessages("ผิดพลาด")
                    setAlerttWarning(true)
                }
            })
       //console.log(JSON.stringify(dataSave))
    }

    const getDataSummaryBookbank = () => {
        let dataCheck = checkCredit == false ? dataTranfer : dataCredit
        dataCheck.map((item, idx) => {
            item.amount = item.amount ? parseFloat(item.amount) : 0
        })
        var sumData = _.sumBy(dataCheck, 'amount');
        return (<div style={{ marginTop: "5%", marginLeft: "45%" }}>
            <div class="row">
                <div class="col"><p><strong>รวม</strong></p></div>
                <div class="col"><p>{nf.format(sumData)}</p></div>
            </div>
        </div>)
    }

    const getTotalamount = () => {
        return (<div>
            <div class="row">
                <div class="col-6">
                    <p><strong>มูลค่าที่ต้องชำระเงิน</strong></p>
                </div>
                <div class="col-6">
                    <p>{nf.format(paymentValues)}</p>
                </div></div>
        </div>
        )
    }

    const getDialogTranfer = () => {
        return <Dialog open={openDialogTranfer} maxWidth="1200px" >
            <DialogTitle >
                <p>รายละเอียดการชำระเงินโอน</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width:"1000px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogTranfer(!openDialogTranfer)}>x</button>
                <div>
                    {getTotalamount()}
                    <BtnAdd message="เพิ่มบัญชีธนาคาร" onClick={(e) => onCLickAddbookbankTranfer(e)  } />
                    <DataTable
                        customStyles={customStyles}
                        columns={columnbankTranfer}
                        data={dataTranfer}
                    />
                    {getDataSummaryBookbank()}
                </div>
            </DialogContent>
            <DialogActions>
                <span>
                    <Btnsubmit onClick={() => onClickAddDataBank()} message="เพิ่ม" disabled={disibleTranfer} /></span>
                <BtnCancel onClick={() => setOpenDialogTranfer(!openDialogTranfer)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getDialogCredit = () => {
        return <Dialog open={openDialogCredit} maxWidth="1000px">
            <DialogTitle >
                <p>รายละเอียดการชำระบัตรเครดิต</p>
            </DialogTitle>
            <DialogContent dividers='paper'  >
                <button type="button" className="cancel" onClick={() => setOpenDialogCredit(!openDialogCredit)}>x</button>
                <div>
                    {getTotalamount()}
                    <BtnAdd message="เพิ่มบบัตรเครดิต" onClick={(e) => onClickAddBookbankCredit(e)} />
                    <DataTable
                        customStyles={customStyles}
                        columns={columnbankCredit}
                        data={dataCredit}
                    />
                </div>
                {getDataSummaryBookbank()}
            </DialogContent>
            <DialogActions>
                <span><Btnsubmit onClick={() => onClickAddDataBank()} message="เพิ่ม" disabled={disabledCredit} /></span>
                <BtnCancel onClick={() => setOpenDialogCredit(!openDialogCredit)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getDialogPrint = () => {
        return <Dialog open={openDialogPrint} maxWidth="600px" >
            <DialogTitle >
                <p>ข้อมูลลูกค้า</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "800px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogPrint(!openDialogPrint)}>x</button>
                <div class="row">
                    <div class="col-4">
                        <p><strong>ผู้ซื้อ :</strong></p>
                        <p><strong>ที่อยู่ :</strong></p>
                        <p><strong>เบอร์โทรศัพท์ :</strong></p>
                        <p><strong>เลขประจำตัวผู้เสียภาษี :</strong></p>
                    </div>
                    {dataCustomer.length > 0 ?
                        <div class="col">
                            <p>{dataCustomer[0]['name']}</p>
                            <p>{dataCustomer[0]['address_name']}</p>
                            <p>{dataCustomer[0]['arcustomer_addr_tel']}</p>
                            <p>{dataCustomer[0]['arcustomer_taxid']}</p>
                        </div>
                        : <></>
                    }
                </div>
            </DialogContent>
            <DialogActions>
                {dataCustomer.length > 0 ?
                    <>
                        {dataCustomer[0]['arcustomer_taxid'].length > 0 && dataCustomer[0]['arcustomer_taxid'] != 0 ?
                            <><BtnAdd onClick={() => onClickPrints("พิมพ์ไทย")} message="พิมพ์ไทย" />
                                <BtnAdd onClick={() => onClickPrints("พิมพ์อังกฤษ")} message="พิมพ์อังกฤษ" /></>
                            : <></>
                        }</>
                    : <></>
                }
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getPaymentBody = () => {
        return (
             <>
                {props.flagPayment == true ?
                    <Card className="card_sale" style={{ height: "92vh" }}>
                        <div className="card_head" > <p className="textH_Left">รายละเอียดการชำระ</p></div>
                        <Card.Body className="card_body_doc" style={{ fontSize: "16px" }}>
                            <Card clssName="card_payvalue" style={{ height: "5vh", textAlign: "center" }}>
                                <div class="row" style={{ marginLeft: "5%" }}>
                                    <div class="col-6">
                                        <p style={{ height: "5vh", marginTop: "8%", color: "#E74C3C" }}> <strong>มูลค่าที่ต้องชำระ  </strong></p>
                                    </div>
                                    <div class="col-6">
                                        <p style={{ height: "5vh", marginTop: "8%", color: "#E74C3C" }}><strong>{nf.format(paymentValues)} </strong></p>
                                    </div>
                                </div>
                            </Card>
                            <div class="row" style={{ height: "52vh" }}>
                                <div class="col-2">
                                    <BtnAdd style={{ marginTop: "2vh", width: "42%", height: "6vh", position: "absolute" }} message="เงินโอน" icons={<Icon path={mdiCellphoneSound} size={1} />}  onClick={() => onClickTranfer()}></BtnAdd>
                                    <BtnAdd style={{ marginTop: "10vh", width: "42%", height: "6vh", position: "absolute" }} message="บัตรเครดิต" icons={<Icon path={mdiCreditCardOutline} size={1} />} message="บัตรเครดิต" onClick={() => onClickCredit()}></BtnAdd>
                                    <Card className="card_btn_pay" style={{ marginTop: "18vh", width: "400%" }}>
                                        <p style={{ marginTop: "10%" }}> เงินสด</p></Card>
                                </div>
                                <div class="col-10">
                                    <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text" value={nf.format(valueSumTranfer)} disabled />
                                    <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text" value={nf.format(valueSumCredit)} disabled />
                                    <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="number" onChange={(e) => onChangeCurrency(e)} value={valueSumCurr > 0 ? valueSumCurr : ""} />
                                </div>
                            </div>
                            <BtnAdd style={{ height: "5vh", marginTop: "1%", marginLeft: "2%", width: "95%" }} icons={<Icon path={mdiPrinterOutline} size={1} />}
                                onClick={() => onClicDialogCus()} message={"ออกใบกำกับภาษี" + ' ' + printsName}
                            />
                            <BtnAdd style={{ marginLeft: "2%", height: "6vh", marginTop: "2%", width: "95%" }} message="บันทึก/ปิด" icons={< Icon path={mdiContentSaveCheckOutline} size={1} />}
                                onClick={() => { onClickSaveDocuments("save") }} disabled={paymentValues > 0 ? true : false} />
                        </Card.Body>
                    </Card>
                    : <></>}
             </> 
        )
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    return (<>
        {getAlert()}
        {getDialogPrint()}
        {getDialogTranfer()}
        {getDialogCredit()}
        {getPaymentBody()}
    </>)
}


export default memo(DataPaymentReturn);