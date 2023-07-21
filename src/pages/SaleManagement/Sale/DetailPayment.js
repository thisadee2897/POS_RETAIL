import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import InputText from "../../../components/Input/InputText";
import DataTable from 'react-data-table-component';
import BtnConfirm from "../../../components/Button/BtnConfirm";
import BtnAdd from "../../../components/Button/BtnAdd";
import BtnDelete from "../../../components/Button/BtnDelete";
import BtnCancel from "../../../components/Button/BtnCancel";
import Btnsubmit from "../../../components/Button/BtnSubmit";
import Moment from 'moment';
import Card from 'react-bootstrap/Card';
import {  Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import InputSelect from "../../../components/Input/InputSelect";
import UrlApi from "../../../url_api/UrlApi";
import _, { parseInt } from "lodash";
import '../../../components/CSS/report.css';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import FilterDataTable from "../../../components/SearchDataTable/FilterDataTable";
import Swithstatus from "../../../components/SwitchStatus/Switchstatus"
import SearchDialog from "../../../components/SearchDialog/SearchDialog";
import SaveIcon from '@mui/icons-material/Save';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Icon from '@mdi/react';
import {
    mdiTicketPercentOutline, mdiCellphoneSound, mdiCreditCardOutline,
    mdiTrayFull, mdiPrinterOutline, mdiContentSaveCheckOutline,
    mdiPlaylistPlus
} from '@mdi/js';

const customStyles = {
    headCells: {
        style: {
            background: '#6598F6',
            color: "white",
            minHeight: "0.5vh",
            maxHeight: "4vh",
            fontSize: "16px"
        },
    },
};


const DetailPayment = (props) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [dateDoc, setDateDoc] = useState(new Date());
    const [dataCustomer, setDataCustomer] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogbookBank, setOpenDialogbookbank] = useState(false)
    const [openDialogTranfer, setOpenDialogTranfer] = useState(false)
    const [openDialogCredit, setOpenDialogCredit] = useState(false)
    const [openDialogdetail, setOpenDialogdetail] = useState(false)
    const [openDialogCurrency, setOpenDialogCurrency] = useState(false)
    const [openDialogCashback, setOpenDialogCashback] = useState(false)
    const [openDialogPartner, setOpenDialogPartner] = useState(false)
    const [openDialogPartnerAdd, setOpenDialogPartnerAdd] = useState(false)
    const [openDialogVoucher, setOpenDialogVoucher] = useState(false)
    const [openDialogVoucherAdd, setOpenDialogVoucherAdd] = useState(false)
    const [customerDataDefault, setCustomerDataDefault] = useState([])
    const [printsName, setPrintName] = useState("")
    const [printsLange, setPrintLange] = useState(0)
    const [dataBookbank, setDataBookbank] = useState([])
    const [dataBookbankCredit, setDataBookbankCredit] = useState([])
    const [dataTranfer, setDataTranfer] = useState([])
    const [dataCredit, setDataCredit] = useState([])
    const [valuedelete, setValuedatlete] = useState()
    const [checkCredit, setCheckCredit] = useState(false)
    const [dataCardType, setDataCardType] = useState([])
    const [valueCredit, setValueCredit] = useState()
    const [dateDocs, setDateDocs] = useState()
    const [dataCurrency, setDataCurrency] = useState([])
    const [dataCurrencyCashback, setDataCurrencyCashback] = useState([])
    const [totalOrder, setTotalOrder] = useState(0.00)
    const [currCom, setcurrCom] = useState("")
    const [valueCurr, setValueCurr] = useState()
    const [valueCurrCashback, setValueCurrCashback] = useState()
    const [valueVouch, setValueVouch] = useState()
    const [valueTranfer, setValueTranfer] = useState()
    const [valueSumCurr, setValueSumCurr] = useState()
    const [valueSumTranfer, setValueSumTranfer] = useState(0)
    const [valueSumCredit, setValueSumCredit] = useState(0)
    const [valueSumCreditNoVat, setValueSumCreditNoVat] = useState(0)
    const [cashBack, setCashBack] = useState(0)
    const [vouchers, setVouchers] = useState(0)
    const [tipValue, setTipValue] = useState()
    const [paymentValues, setPaymentValues] = useState(0.00)
    const [valueDialogCash, setValueDialogCash] = useState(true)
    const [disabledCredit, setDisabledCredit] = useState(false)
    const [vatCredit, setVatCredit] = useState(0)
    const [mathValue, setmathValue] = useState(props.mathValue)
    const [dataPartner, setDataPartner] = useState([])
    const [dataPartnerAdd, setDataPartnerAdd] = useState([])
    const [partnerValue, setPartnerValue] = useState(0)
    const [currValue, setcurrValue] = useState(0)
    const [dataVoucher, setDataVoucher] = useState([])
    const [dataVoucherAdd, setDataVoucherAdd] = useState([])
    const [dataVoucherBarcode, setDataVoucherBarcode] = useState([])
    const [dataVoucherSelect, setDataVoucherSelect] = useState([])
    const [valueVouchAdd, setValueVouchAdd] = useState()
    const [disibleVoucherAdd, setDisibleVoucherAdd] = useState(false)
    const [valuePart, setValuePart] = useState()
    const [disiPartner, setDisiPrtner] = useState(false)
    const [preViewOrderValue, setpreViewOrderValue] = useState(0)
    const [valueInput, setValueInput] = useState()
    const [disibleBtnAdd, setDisibleBtnAdd] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [flagAdd, setflagAdd] = useState(false)
    const [disibleTranfer,setDisibleTranfer] = useState(false)


    const columnsdata = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}><FormControlLabel style={{ color: "black" }}
                control={
                    <Radio defaultChecked={row.cusdefault_active} disabled={!row.arcustomer_active}
                        value={row.arcustomer_id} checked={row.cusdefault_active}
                        onClick={(e) => { OnchangeCheckcus(e, row) }}
                    />} /> </div>
            ,
            sortable: true,
            width: '100px'
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Swithstatus value={row.arcustomer_active} /></>,
            width: '150px',
        },
        {
            name: 'รหัสลูกค้า',
            selector: row => row.arcustomer_code,
            sortable: true,
        },
        {
            name: 'กลุ่มลูกค้า',
            selector: row => row.arcustomer_group_name,
            sortable: true,
        },
        {
            name: 'ประเภทสมาชิก',
            selector: row => row.master_member_type_name,
            sortable: true,
        },
        {
            name: 'เลขประจำตัวผู้เสียภาษี',
            selector: row => row.arcustomer_taxid,
            sortable: true,
        },
        {
            name: 'คำนำหน้า',
            selector: row => row.master_member_type_name,
            sortable: true,
        },
        {
            name: 'ชื่อ',
            selector: row => row.arcustomer_name,
            sortable: true,
            width: '350px',
        },
        {
            name: 'ชื่อภาษาอังกฤษ',
            selector: row => row.arcustomer_name_eng,
            sortable: true,
        },
        {
            name: 'จำนวนวันเครดิต',
            selector: row => row.arcustomer_creditday,
            sortable: true,
        },
        {
            name: 'ประเภทบุคคล',
            selector: row => row.master_person_type_name,
            sortable: true,
        },
        {
            name: 'ประเภทใน/ต่างประเทศ',
            selector: row => row.master_person_country_type_name,
            sortable: true,
        },
        {
            name: 'ที่อยู่',
            selector: row => row.address_name,
            sortable: true,
            width: '350px',
        },
        {
            name: 'เบอร์โทรศัพท์',
            selector: row => row.arcustomer_addr_tel,
            sortable: true,
        },
        {
            name: 'แฟกซ์',
            selector: row => row.arcustomer_addr_fax,
            sortable: true,
        },
    ]
    const columnsdatabookbank = [
        {
            name: 'เลือก',
            selector: (row, index) => <div style={{ marginLeft: "20%" }}>
                <FormControlLabel
                    control={
                        <Checkbox style={{ color: "#6598F6" }}
                            value={row.cq_bankbook_id}
                            defaultChecked={row.default_check}
                            onClick={(e) => { OnchangeCheckBookbank(e, row, index) }}
                        />} /> </div>
            ,
            sortable: true,
            width: '100px'
        },
        {
            name: 'ลำดับ',
            selector: row => row.row_no,
            sortable: false,
            width: '80px'
        },
        {
            name: 'บัญชีธนาคาร',
            selector: row => row.cq_bankbook_no,
            sortable: true,
        },
        {
            name: 'ธนาคาร',
            selector: row => row.cq_bank_name,
            sortable: true,
        },
        {
            name: 'ชื่อบัญชี',
            selector: row => row.cq_bankbook_name,
            sortable: true,
        }
    ]

    const columnbankTranfer = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'บัญชีธนาคาร',
            selector: row => row.cq_bankbook_no,
            sortable: true,
        },
        {
            name: 'ธนาคาร',
            selector: row => row.cq_bank_name,
            sortable: true,
        },
        {
            name: 'ชื่อบัญชี',
            selector: row => row.cq_bankbook_name,
            sortable: true,
        },
        {
            name: 'มูลค่าเงินโอนที่ได้รับ',
            selector: row => <InputText type="number" style={{ borderColor:"#6598F6" }}
                defaultValue={row.amount_tranfer} onChange={(e) => onChangevalueTanfer(e, row.cq_bankbook_id, row)} />,
            sortable: true,
            width: '260px'
        },
        {
            selector: row => <BtnDelete
                onClick={() => { OnchangeDeleteBookbank(row) }} />,
            sortable: true,
            width: '130px'
        },
    ]

    const columnbankCredit = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'บัญชีธนาคาร',
            selector: row => row.cq_bankbook_no,
            sortable: true,
        },
        {
            name: 'ธนาคาร',
            selector: row => row.cq_bank_name,
            sortable: true,
        },
        {
            name: 'ชื่อบัญชี',
            selector: row => row.cq_bankbook_name,
            sortable: true,
            width: "200px",
        },
        {
            name: 'ประเภทการชาร์ท',
            selector: (row, index) => <InputSelect style={{ borderColor: "#6598F6" }}
                id_key="cq_cardtype_id" value_key="cq_cardtype_name"
                defaultValue={parseInt(row.cq_cardtype_id)} value={parseInt(row.cq_cardtype_id)}
                option={dataCardType} onChange={(e) => onClickSelectCardType(e, row, index)} />,
            width: "200px",
            sortable: true
        },
        {
            name: 'เลขบัตร (4 หลักสุดท้าย)',
            selector: (row, index) => <InputText type="number" style={{ borderColor: "#6598F6" }}
                defaultValue={row.number_credit} onChange={(e) => onChangeNumberCredit(e, row, index)} />,
            width: "300px",
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: (row, index) => <InputText type="number" style={{ borderColor: "#6598F6" }}
                defaultValue={row.amount_credits} onChange={(e) => onChangeAmountCredit(e, row, index)} />,
            sortable: true,
        },
        {
            name: 'Rate (%)',
            selector: row => row.cq_cardtype_bankfee,
            sortable: true,
        },
        {
            name: 'ค่าธรรมเนียม',
            selector: row => row.vat_credit,
            sortable: true,
        },
        {
            name: 'ยอดรวมตัดบัตร',
            selector: row => nf.format(row.sum_credit),
            sortable: true,
        },
        {
            name: 'หมายเหตุ',
            selector: row => <InputText type="text" style={{ borderColor: "#6598F6" }}
                defaultValue={row.remark} onChange={(e) => onChangeRmarkCredit(e, row)} />,
            sortable: true,
        },
        {
            selector: row => <BtnDelete onClick={() => { OnchangeDeleteBookbank(row) }} />,
            sortable: true,
            width: '130px'
        }
    ]


    const columnCurrency = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'สกุลเงิน',
            selector: row => row.master_currency_name,
            sortable: true,
        },
        {
            name: 'มูลค่า', 
            selector: row => <InputText type="number" style={{ borderColor: "#6598F6" }}
                value={row.amount_values} onChange={(e) => onChangeCurrencyValue(e, row.master_currency_id, row)} />,
            sortable: true,
        },
        {
            name: 'Exchange',
            selector: row => row.master_currency_rate,
            sortable: true,
        },
        {
            name: 'มูลค่า' + currCom,
            selector: row => row.amount_total,
            sortable: true,
        },
    ]

    const columnCurrencyCashback = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'สกุลเงิน',
            selector: row => row.master_currency_name,
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => <InputText type="number" style={{ borderColor: "#6598F6" }}
                defaultValue={nf.format(row.amount_values)} onChange={(e) => onChangeCurrencyCashbackValue(e, row.master_currency_id, row)} />,
            sortable: true,
        },
        {
            name: 'Exchange',
            selector: row => nf.format(row.master_currency_rate),
            sortable: true,
        },
        {
            name: 'มูลค่า' + currCom,
            selector: row => nf.format(row.amount_totals),
            sortable: true,
        },
    ]

    const columnPartner = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'พาร์เนอร์ เครดิตสินเชื่อ',
            selector: row => row.master_partner_name,
            sortable: true,
        },
        {
            name: 'มูลค่าเงินที่ได้รับ',
            selector: row => <InputText style={{ borderColor: "#6598F6" }}  defaultValue={nf.format(row.amountPartner)}
                type="number" onChange={(e) => onChangeAmountPrtner(e, row)} />,
            sortable: true,
        },
        {
            name: 'หมายเหตุ',
            selector: row => <InputText style={{ borderColor: "#6598F6" }}  defaultValue={row.remark}
                type="text" onChange={(e) => onChangeRemarkPrtner(e, row)} />,
            sortable: true,
        },
        {
            selector: row => <BtnDelete
                onClick={() => { OnchangeDeletePartner(row) }} />,
            sortable: true,
            width: '130px'
        }

    ]

    const columnPartnerAdd = [
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}>
                <FormControlLabel style={{ color: "black" }}
                    control={
                        <Radio style={{ color: "#6598F6" }}  defaultChecked={row.defaultChecked} checked={row.defaultChecked}
                            value={row.master_partner_id}
                            onClick={(e) => { OnchangeCheckPartner(e, row) }}
                        />} /> </div>
            ,
            width: '80px'
        },
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'พาร์เนอร์ เครดิตสินเชื่อ',
            selector: row => row.master_partner_name,
            sortable: true,
        },

    ]

    const columnVoucher = [
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}>
                <FormControlLabel 
                    control={
                        <Checkbox style={{ color: "#6598F6" }}
                            value={row.salehd_voucher_cal_type_id}
                            onClick={(e) => { OnchangeCheckVocher(e, row) }}
                        />} /> </div>
            ,
            width: '80px'
        },

        {
            name: 'ลำดับ',
            selector: (row,idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'ชื่อ',
            selector: row => row.salehd_voucher_type_name,
            sortable: true,
        },
        {
            name: 'จำนวน/ใบ',
            selector: row => <InputText type="number" style={{ borderColor:"#6598F6"}}
                defaultValue={nf.format(row.amountVoucherAdd)} onChange={(e) => onChangeAmountVoucherAdd(e, row)} />,
            sortable: true,
        }
    ]

    const columnVoucherAdd = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'ชื่อ',
            selector: row => row.salehd_voucher_type_name,
            sortable: true,
        },
        {
            name: 'รหัส Voucher',
            selector: row => <InputText type="text" style={{ borderColor: "#6598F6" }}
                defaultValue={row.barcode} onChange={(e) => { onChangeCodeVoucher(e, row) }} />,
            sortable: true,
        },
        {
            selector: row => <BtnDelete
                onClick={() => { OnchangeDeleteVoucher(row) }} />,
            sortable: true,
            width: '130px'
        }
    ]

    useEffect(() => {
        getDataMasterDefault()
    }, [paymentValues])

    useEffect(() => {
        if (valueSumCredit == 0 && openDialogCredit == false) {
            getDataBookbankCredit()
        }
    }, [paymentValues, valueSumCredit])

    useEffect(() => {
        if (valueSumCurr == 0) {
            getDataCurrency()
        }
    }, [paymentValues])

    useEffect(() => {
        if (partnerValue == 0) {
            getPartnerDatata()
        }
    }, [paymentValues])

    useEffect(() => {
        if (valueSumTranfer == 0) {
            getDataBookbank()
        }
    }, [paymentValues, valueSumTranfer])

    useEffect(() => {
        if (props.customersData) {
            setCustomerDataDefault(props.customersData)
        }
    }, [props.customersData])

    useEffect(() => {
        if (props.datesDoc) {
            let Str_y = parseInt(Moment(new Date()).format("YYYY")) + 543
            let Str_d = Moment(new Date()).format("DD/MM/") + Str_y
            setDateDocs(Str_d)
        }
    }, [props.datesDoc])

    useEffect(() => {
        getDialogTranfer()
        getDialogPartner()
    }, [valuedelete])

    useEffect(() => {
        getDialogVoucher()
    }, [valueVouch])

    useEffect(() => {
        getDialogTranfer()
    }, [valueTranfer])

    useEffect(() => {
        getDialogCurrency()
    }, [valueCurr])

    useEffect(() => {
        getDialogCashback()
    }, [valueCurrCashback])

    useEffect(() => {
        getDialogCredit()
    }, [valueCredit])

    useEffect(() => {
        setmathValue(props.mathValue)
    }, [props.mathValue])

    useEffect(() => {
        if (props.dataOrderdetails.length > 0) {
            if (tipValue >= 0) {
                getValueCashbackTip()
            } else {
                getCashback()
                getCurrValue()
            }
        }
    }, [paymentValues, valueSumCurr, valueSumTranfer, valueSumCreditNoVat, totalOrder, vouchers, partnerValue])

    useEffect(() => {
        if (tipValue >= 0) {
            getValueCashbackTip()
        }
    }, [tipValue])

    useEffect(() => {
        setTotalOrder(parseFloat(props.amountTotals))
        setPaymentValues(parseFloat(props.amountTotals))
    }, [props.amountTotals])

    useEffect(() => {
        getCurrValue()
    }, [valueSumCurr])

    useEffect(() => {
        if (props.cleardata == true) {
            ClearDataAll()
        }
    }, [props.cleardata])

    useEffect(() => {
        getDataCurrencyCashback()
    }, [cashBack])

    useEffect(() => {
        getDialogVoucherAdd()
    }, [valueVouchAdd])

    useEffect(() => {
        ClearDataAll()
    }, [props.catValue, props.datapointSelect, props.dataDepositSelect, props.dataOrderdetails])

    useEffect(() => {
        getDialogPartnerAdd()
    }, [valuePart])

    useEffect(() => {
        getDataCardType()
    }, [props.dataCatSelect])

    useEffect(() => {
        setpreViewOrderValue(0)
    }, [props.dataOrderdetails,])

    useEffect(() => {
        if (alertSuccess == true) {
            setTimeout(() => {
                setAlertSuccess(false)
            }, 2000);
        }
    }, [alertSuccess])

    useEffect(() => {
        getDataCustomer()
    }, [searchText])

    useEffect(() => {
        if (props.save == true) {
            onClickSaveDocuments("save")
        }
    }, [props.save])

    useEffect(() => {
        if (props.printTax == true) {
            onClicDialogCus()
        }
    }, [props.printTax])

    useEffect(() => {
        if (props.print == true) {
            onClickSaveDocuments("preview")
        }
    }, [props.print])


    const getDataMasterDefault = () => {
        getDataCustomer()
        //getDataVoucher()
        getDataCardType()
        getDataCurrencyCashback()
        getPartnerDatata()
        //getVoucherCode()
        getDataBookbank()
        getDataBookbankCredit()
    }

    const getDataCustomer = () => {
        let datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "filter_text": searchText
        }
        axios.post(UrlApi() + 'filter_customer_data', datas)
            .then(res => {
                if (res.data) {
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
                }
            })
    }

    const getDataVoucher = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
        }
        axios.post(UrlApi() + 'getdata_voucher', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.defaultChecked = false
                        item.amountVoucherAdd = 1
                    })
                    setDataVoucher(res.data)
                }
            })
    }

    const getDataBookbank = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
        }
        axios.post(UrlApi() + 'getdata_bookbanktranfer', datas)
            .then(res => {
                if (res.data) {
                    let datas = []
                    res.data.map((item, idx) => {
                        item.row_no = idx + 1
                        item.default_check = false;
                        if (item.cq_bankbook_default_active === true) {
                            item.amount_tranfer = parseFloat(paymentValues)
                            item.default_check = true
                            datas.push(item)
                        }
                        item.amount_tranfer = parseFloat(paymentValues)
                    })
                    setDataBookbank(res.data)
                    if (valueSumTranfer < 1) {
                        setDataTranfer(datas)
                    }
                }
            })
    }

    const getDataBookbankCredit = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
        }
        axios.post(UrlApi() + 'getdata_bookbankcredit', datas)
            .then(res => {
                if (res.data) {
                    let datas = []
                    res.data.map((item, idx) => {
                        item.row_no = idx + 1
                        item.remark = ""
                        item.datedoc = dateDocs
                        item.sum_credit = 0
                        item.default_check = item.cq_bankbook_default_active
                        if (item.cq_bankbook_default_creditcard_active == true) {
                            item.datedoc = dateDocs
                            item.default_check = false
                            item.amount_credit = parseFloat(paymentValues)
                            item.amount_credits = parseFloat(paymentValues)
                            datas.push(item)
                        }
                        item.amount_credits = parseFloat(paymentValues)
                    })
                    setDataBookbankCredit(res.data)
                    if (valueSumCredit < 1) {
                        setDataCredit(datas)
                    }
                }
            })
    }

    const getDataCardType = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
        }
        axios.post(UrlApi() + 'get_cardtype_data', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, iidx) => {
                        item.charge_max_amnt = props.dataCatSelect.wht_category_rate ? 0 : item.charge_max_amnt
                        item.cq_cardtype_bankfee = props.dataCatSelect.wht_category_rate ? 0 : item.cq_cardtype_bankfee
                        item.id = item.cq_cardtype_id
                        item.value = item.cq_cardtype_name
                    })
                    setDataCardType(res.data)
                }
            })
    }

    const getDataCurrency = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
        }
        axios.post(UrlApi() + 'getdata_currency', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.amount_values = 0
                        item.amount_totals = 0
                        if (item.master_currency_main == true) {
                            item.amount_values = parseFloat(paymentValues)
                            item.amount_totals = parseFloat(paymentValues)
                            setcurrCom(item.master_currency_name)
                        }
                    })
                    setDataCurrency(res.data)
                }
            })
    }

    const getDataCurrencyCashback = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
        }
        axios.post(UrlApi() + 'getdata_currency', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        if (item.master_currency_main == true) {
                            item.amount_values = parseFloat(cashBack)
                            if (item.master_calculate_type_name == "คูณ") {
                                item.amount_totals = parseFloat(cashBack) * parseInt(item.master_currency_rate)
                            } else {
                                item.amount_totals = parseFloat(cashBack) / parseInt(item.master_currency_rate)
                            }
                        } else {
                            item.amount_values = parseFloat(0)
                            item.amount_totals = parseFloat(0)
                        }
                    })
                    setDataCurrencyCashback(res.data)

                }
            })
    }

    const getPartnerDatata = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
        }
        axios.post(UrlApi() + 'get_partner', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.row_num = idx + 1
                        item.defaultChecked = false
                        if (item.master_partner_creditamnt == 0) {
                            item.amountPartner = parseFloat(paymentValues)
                        } else {
                            item.amountPartner = parseFloat(paymentValues) == 0 ? 0 : item.master_partner_creditamnt
                        }
                    })
                    setDataPartner(res.data)
                }
            })
    }

    const getVoucherCode = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "branch_id": BranchData[0]['master_branch_id'],
        }
        axios.post(UrlApi() + 'get_vouchercode', datas)
            .then(res => {
                if (res.data) {
                    setDataVoucherBarcode(res.data)
                }
            })
    }

    const checkDefault = () => {
        if (customerDataDefault.length > 0) {
            dataCustomer.map((item, idx) => {
                item.cusdefault_active = item.arcustomer_id == customerDataDefault[0]['arcustomer_id'] ?
                    true : false
            })
        }
        setDataCustomer(dataCustomer)
    }

    const onChangevalueTanfer = (e, id, row) => {
        if (e.target.value < 0) {
            setAlertMessages("กรุณากรอกมูลค่าให้ถูกต้อง")
            setAlerttWarning(true)
            setDisibleBtnAdd(true)
        } else {
            let findData = _.findIndex(dataTranfer, { row_num: row.row_num })
            let findBank = _.findIndex(dataBookbank, { row_no: row.row_num })
            dataTranfer[findData]['amount_tranfer'] = e.target.value
            dataBookbank[findBank]['amount_tranfer'] = e.target.value
            setDisibleBtnAdd(false)
            setValueTranfer(e)
        }

    }

    const onChangeNumberCredit = (e, row, idx) => {
        if (e.target.value) {
            dataCredit.map((item, idx) => {
                if (item.cq_bank_id == row.cq_bank_id && item.cq_cardtype_id == row.cq_cardtype_id) {
                    item.number_credit = e.target.value
                }
            })
        }
    }

    const onChangeAmountCredit = (e, row, idx) => {
        if (e.target.value < 0) {
            setAlertMessages("กรุณากรอกมูลค่าให้ถูกต้อง")
            setAlerttWarning(true)
            setDisabledCredit(true)
        } else {
            if (dataCredit[idx]['cq_cardtype_id']) {
                dataCredit[idx]['amount_credits'] = e.target.value
                if (parseInt(e.target.value) <= parseInt(dataCredit[idx]['charge_max_amnt'])) {
                    let vat_credit = ((parseInt(e.target.value) * parseInt(dataCredit[idx]['cq_cardtype_bankfee'])) / 100)
                    dataCredit[idx]['vat_credit'] = vat_credit
                    dataCredit[idx]['sum_credit'] = parseFloat(dataCredit[idx]['amount_credits']) + parseFloat(vat_credit)
                    getSumVatCredit()
                } else {
                    dataCredit[idx]['sum_credit'] = dataCredit[idx]['amount_credits']
                    dataCredit[idx]['vat_credit'] = 0
                    getSumVatCredit()
                }
                setDataCredit(dataCredit)
                setValueCredit(e.target.value, row)
            } else {
                setAlertMessages("กรุณาเลือกประเภทการชาร์ท")
                dataCredit[idx]['amount_credits'] = 0
                setAlerttWarning(true)
                setDisabledCredit(true)
                setValueCredit(e.target.value, row)
            }
        }
    }

    const getSumVatCredit = () => {
        dataCredit.map((item, idx) => {
            item.amount_credits = item.amount_credits ? parseFloat(item.amount_credits) : 0
            item.vat_credit = item.vat_credit ? parseFloat(item.vat_credit) : 0
        })
        let sumamount = _.sumBy(dataCredit, 'amount_credits');
        let sumVat = _.sumBy(dataCredit, 'vat_credit');
        props.onChangeVatredit(sumVat)
        let sumCre = parseFloat(sumamount) + parseFloat(sumVat)
        setValueSumCredit(sumCre)
    }

    const onChangeRmarkCredit = (e, row) => {
        if (e.target.value) {
            let findData = _.findIndex(dataCredit, { cq_bankbook_id: row.cq_bankbook_id })
            dataCredit[findData]['remark'] = e.target.value
        }
    }


    const onChangeCurrencyValue = (e, id, row) => {
        if (e.target.value) {
            let findData = _.findIndex(dataCurrency, { master_currency_id: id })
            dataCurrency[findData]['amount_values'] = e.target.value
            if (dataCurrency[findData]['master_calculate_type_name'] == "คูณ") {
                dataCurrency[findData]['amount_totals'] =
                    (parseInt(e.target.value) * parseInt(dataCurrency[findData]['master_currency_rate']))
                setDataCurrency(dataCurrency)
            } else if (dataCurrency[findData]['master_calculate_type_name'] == "หาร") {
                dataCurrency[findData]['amount_totals'] = parseInt(e.target.value) / parseInt(dataCurrency[findData]['master_currency_rate'])
                setDataCurrency(dataCurrency)
            }
            setValueCurr(e.target.value)
        }
    }

    const onChangeCurrencyCashbackValue = (e, id, row) => {
        if (e.target.value) {
            let findData = _.findIndex(dataCurrencyCashback, { master_currency_id: id })
            dataCurrencyCashback[findData]['amount_values'] = parseFloat(e.target.value)
            if (dataCurrencyCashback[findData]['master_calculate_type_name'] == "คูณ") {
                dataCurrencyCashback[findData]['amount_totals'] =
                    (parseFloat(e.target.value) * parseInt(dataCurrencyCashback[findData]['master_currency_rate']))
                setDataCurrencyCashback(dataCurrencyCashback)
            } else if (dataCurrencyCashback[findData]['master_calculate_type_name'] == "หาร") {
                dataCurrencyCashback[findData]['amount_totals'] = parseFloat(e.target.value) / parseFloat(dataCurrencyCashback[findData]['master_currency_rate'])
                setDataCurrencyCashback(dataCurrencyCashback)
            }
            setValueCurrCashback(e)
        }
    }

    const onClickAddCurrCashbck = () => {
        dataCurrencyCashback.map((item, idx) => {
            item.amount_totals = item.amount_totals ? parseFloat(item.amount_totals) : 0
        })
        var amount_total = _.sumBy(dataCurrencyCashback, 'amount_totals');
        if (parseFloat(amount_total) > parseFloat(cashBack)) {
            setAlertMessages("จำนวนเงินมากว่าจำนวนเงินทอน")
            setAlerttWarning(true)
            getDataCurrencyCashback()
            setValueCurrCashback("")
        } else if (parseFloat(amount_total) < parseFloat(cashBack)) {
            setAlertMessages("จำนวนเงิน้อยกว่าจำนวนเงินทอน")
            setAlerttWarning(true)
            getDataCurrencyCashback()
            setValueCurrCashback("")
        } else {
            setOpenDialogCashback(false)
        }
    }

    const onClickSelectCardType = (e, row, idx) => {
        if (e.target.value) {
            setDisabledCredit(false)
            let findData = _.findIndex(dataCardType, { cq_cardtype_id: parseInt(e.target.value) })
            let findDatabank = idx
            dataCredit[findDatabank]['charge_max_amnt'] = parseInt(dataCardType[findData]['charge_max_amnt'])
            dataCredit[findDatabank]['cq_cardtype_bankfee'] = dataCardType[findData]['cq_cardtype_bankfee']
            dataCredit[findDatabank]['cq_cardtype_id'] = dataCardType[findData]['cq_cardtype_id']
            setDataCredit(dataCredit)
            if (parseInt(dataCredit[findDatabank]['amount_credits']) <= parseInt(dataCredit[findDatabank]['charge_max_amnt'])) {
                let vat_credit = ((parseFloat(dataCredit[findDatabank]['amount_credits']) * parseFloat(dataCredit[findDatabank]['cq_cardtype_bankfee'])) / 100)
                dataCredit[findDatabank]['vat_credit'] = parseFloat(vat_credit.toFixed(2))
                let amounts = dataCredit[findDatabank]['amount_credits']
                dataCredit[findDatabank]['sum_credit'] = parseFloat(vat_credit.toFixed(2)) + parseFloat(amounts.toFixed(2))
                setValueCredit(e.target.value, row)
            } else if (parseInt(dataCredit[findDatabank]['amount_credits']) > parseInt(dataCredit[findDatabank]['charge_max_amnt'])) {
                let amounts = dataCredit[findDatabank]['amount_credits']
                dataCredit[findDatabank]['vat_credit'] = 0
                dataCredit[findDatabank]['sum_credit'] = parseFloat(amounts.toFixed(2))
            }
            setDisabledCredit(false)
            setValueCredit(e.target.value, row)
        } else {
            setDisabledCredit(true)
        }


    }

    const onClicDialogCus = () => {
        checkDefault()
        setOpenDialog(true)
    }

    const OnchangeCheckcus = (e, row) => {
        if (e.target.checked) {
            setCustomerDataDefault([row])
            dataCustomer.map((item, idx) => {
                if (item.arcustomer_id == row.arcustomer_id) {
                    item.cusdefault_active = true
                } else {
                    item.cusdefault_active = false
                }
            })
            getDialogCustomer()
            setOpenDialogdetail(true)
        } else {

        }
    }

    const onClickAddCustomer = () => {
        setOpenDialogdetail(true)

    }

    const onClickcancle = () => {
        setOpenDialog(false)
    }

    const onClickPrints = (e) => {
        setPrintName(e)
        setflagAdd(false)
        if (e == "พิมพ์ไทย") {
            setPrintLange(1)
        } else {
            setPrintLange(2)
        }
        setOpenDialogdetail(false)
        setOpenDialog(false)
    }

    const OnchangeCheckBookbank = (e, row, index) => {
        console.log(dataBookbank);
        console.log(e.target.checked);
        if (e.target.value && checkCredit == false) {
            // let Checksdefault = _.findIndex(dataBookbank, { cq_bankbook_id: row.cq_bankbook_id })
            dataBookbank[index]['default_check'] = e.target.checked;
        } else if (e.target.value && checkCredit == true) {
            // let Checksdefault = _.findIndex(dataBookbankCredit, { cq_bankbook_id: row.cq_bankbook_id })
            dataBookbankCredit[index]['default_check'] = e.target.checked;
        }
    }

    const onClickAddBookbank = () => {
        let datas = []
        console.log(dataBookbank);
        if (checkCredit == false) {
            dataBookbank.map((item, idx) => {
                if (item.default_check == true) {
                    console.log(133456);
                    let datas = {
                        amount_tranfer: 0,
                        cq_bank_id: item.cq_bank_id,
                        cq_bank_name: item.cq_bank_name,
                        cq_bankbook_code: item.cq_bankbook_code,
                        cq_bankbook_default_active: item.cq_bankbook_default_active,
                        cq_bankbook_id: item.cq_bankbook_id,
                        cq_bankbook_name: item.cq_bankbook_name,
                        cq_bankbook_no: item.cq_bankbook_no
                    }
                    dataTranfer.push(datas)
                }
            })
            //setDataTranfer(datas)
            setOpenDialogbookbank(!openDialogbookBank)
        } else if (checkCredit == true) {
            dataBookbankCredit.map((item, idx) => {
                if (item.default_check == true) {
                    let datas = {
                        amount_credits: item.amount_credits,
                        charge_max_amnt: item.charge_max_amnt,
                        cq_bank_id: item.cq_bank_id,
                        cq_bank_name: item.cq_bank_name,
                        cq_bankbook_code: item.cq_bankbook_code,
                        cq_bankbook_id: item.cq_bankbook_id,
                        cq_bankbook_name: item.cq_bankbook_name,
                        cq_bankbook_no: item.cq_bankbook_no,
                        cq_cardtype_bankfee: item.cq_cardtype_bankfee,
                        cq_cardtype_id: item.cq_cardtype_id,
                        datedoc: item.datedocs,
                        default_check: item.default_check,
                        remark: item.remark,
                        sum_credit: item.sum_credit,
                        vat_credit: item.vat_credit,
                    }
                    dataCredit.push(datas)
                }
            })
            //setDataCredit(datas)
            setOpenDialogbookbank(!openDialogbookBank)
        }
        // dataBookbank.map((item, idx) => {
        //     item.default_check = false
        // })
        // setDataBookbank(dataBookbank)
    }

    const OnchangeDeleteBookbank = (row) => {
        if (checkCredit == false) {
            let findIndex = _.findIndex(dataTranfer, { cq_bankbook_id: row.cq_bankbook_id })
            dataTranfer.splice(findIndex, 1)
            setValuedatlete(row)
            let Checksdefault = _.findIndex(dataBookbank, { cq_bankbook_id: row.cq_bankbook_id })
            dataBookbank[Checksdefault]['default_check'] = false
            var sumTranfer = _.sumBy(dataTranfer, 'amount_tranfer');
            setValueSumTranfer(sumTranfer)
        } else if (checkCredit == true) {
            let findIndex = _.findIndex(dataCredit, { cq_bankbook_id: row.cq_bankbook_id })
            dataCredit.splice(findIndex, 1)
            setValuedatlete(row)
            let Checksdefault = _.findIndex(dataBookbankCredit, { cq_bankbook_id: row.cq_bankbook_id })
            dataBookbankCredit[Checksdefault]['default_check'] = false
            getSumVatCredit()
        }

    }

    const onClickAddTranferData = () => {
        let findIndex = _.findIndex(dataTranfer, { amount_tranfer: "0" })
        if (findIndex >= 0) {
            setAlertMessages("กรุณากรอกจำนวนเงินให้มากกว่า 0")
            setAlerttWarning(true)
        }
        var sumTranfer = _.sumBy(dataTranfer, 'amount_tranfer');
        setValueSumTranfer(sumTranfer)
        setOpenDialogTranfer(false)
    }

    const onClickAddCreditData = () => {
        let sumAmount = _.sumBy(dataCredit, 'amount_credits');
        let sumVat = _.sumBy(dataCredit, 'vat_credit');
        let sumCredit = parseFloat(sumAmount) + parseFloat(sumVat)
        setValueSumCreditNoVat(parseFloat(sumAmount))
        setValueSumCredit(parseFloat(sumCredit))
        setVatCredit(sumVat)
        props.onChangeVatredit(sumVat)
        setOpenDialogCredit(false)
    }

    const onClickAddCurrData = () => {
        setDataCurrency(dataCurrency)
        var amount_total = _.sumBy(dataCurrency, 'amount_totals');
        setValueSumCurr(amount_total)
        setOpenDialogCurrency(false)
    }

    const onClickCredit = () => {
        setCheckCredit(true)
        setOpenDialogCredit(true)
    }

    const onClickTranfer = () => {
        setCheckCredit(false)
        setOpenDialogTranfer(true)
    }

    const onClickCurrency = () => {
        setOpenDialogCurrency(true)
    }

    const getDataSummaryCurrency = () => {
        dataCurrency.map((item, idx) => {
            item.amount_values = item.amount_values ? parseFloat(item.amount_values) : 0
            item.amount_totals = item.amount_totals ? parseFloat(item.amount_totals) : 0
        })
        var sum_amount = _.sumBy(dataCurrency, 'amount_values');
        var amount_total = _.sumBy(dataCurrency, 'amount_totals');
        return (<div style={{ marginTop: "5%", marginLeft: "45%" }}>
            <div class="row">
                <div class="col"><p><strong>รวม</strong></p></div>
                <div class="col"> <p>{nf.format(amount_total)}</p></div>
            </div>
        </div>)
    }

    const getDataSummaryCurrencyCashback = () => {
        dataCurrencyCashback.map((item, idx) => {
            item.amount_values = item.amount_values ? parseFloat(item.amount_values) : 0
            item.amount_totals = item.amount_totals ? parseFloat(item.amount_totals) : 0
        })
        var sum_amount = _.sumBy(dataCurrencyCashback, 'amount_values');
        var amount_total = _.sumBy(dataCurrencyCashback, 'amount_totals');
        return (<div style={{ marginTop: "5%", marginLeft: "45%" }}>
            <div class="row">
                <div class="col"><p><strong>รวม</strong></p></div>
                <div class="col"> <p>{nf.format(amount_total)}</p></div>
            </div>
        </div>)
    }

    const getDataSummaryTranfer = () => {
        dataTranfer.map((item, idx) => {
            item.amount_tranfer = item.amount_tranfer ? parseFloat(item.amount_tranfer) : 0
        })
        var sumTranfer = _.sumBy(dataTranfer, 'amount_tranfer');
        return (<div style={{ marginTop: "5%", marginLeft: "45%" }}>
            <div class="row">
                <div class="col"><p><strong>รวม</strong></p></div>
                <div class="col"><p>{nf.format(sumTranfer)}</p></div>
            </div>
        </div>)
    }

    const getDataSummaryCredit = () => {
        dataCredit.map((item, idx) => {
            item.amount_credits = item.amount_credits ? parseFloat(item.amount_credits) : 0
            item.vat_credit = item.vat_credit ? parseFloat(item.vat_credit) : 0
        })
        let sumamount = _.sumBy(dataCredit, 'amount_credits');
        let sumVat = _.sumBy(dataCredit, 'vat_credit');
        let sumCredit = parseFloat(sumamount) + parseFloat(sumVat)

        return (<div style={{ marginTop: "1%", marginLeft: "50%" }}>
            <div class="row">
                <div class="col-2"><p><strong>รวม</strong></p></div>
                <div class="col-4"><p>{nf.format(sumCredit)}</p></div>
            </div>
        </div>)
    }

    const getSummaryVoucher = () => {
        dataVoucherAdd.map((item, idx) => {
            item.salehd_voucher_type_rate = parseInt(item.salehd_voucher_type_rate)
        })
        var sumamount = _.sumBy(dataVoucherAdd, 'salehd_voucher_type_rate');
        return (<div style={{ marginTop: "2%", marginLeft: "60%" }}>
            <div class="row">
                <div class="col-4"><p><strong>รวม</strong></p></div>
                <div class="col"><p>{nf.format(sumamount)}</p></div>
            </div>
        </div>)
    }

    const onChangeTipvalue = (e) => {
        let totalSum = 0
        let valueSumCurrs = valueSumCurr ? valueSumCurr : 0
        if (props.dataCatSelect.wht_category_rate) {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCreditNoVat) + parseFloat(vouchers) + parseFloat(partnerValue)
        } else {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCredit) + parseFloat(vouchers) + parseFloat(partnerValue)
        }
        let Cashbacks = 0
        if (parseFloat(totalSum) > parseFloat(totalOrder)) {
            Cashbacks = (parseFloat(totalSum) - parseFloat(totalOrder))
        }
        if (e.target.value < 0) {
            setAlertMessages("กรุณากรอก มูลค่าให้ถูกต้อง")
            setAlerttWarning(true)
            setDisibleBtnAdd(false)
        } else {
            if (e.target.value) {
                if (parseFloat(e.target.value) > parseFloat(Cashbacks)) {
                    setAlertMessages("จำนวน Tip มากกว่าเงินทอน")
                    setCashBack(Cashbacks)
                    setTipValue(0)
                    setAlerttWarning(true)
                } else {
                    setTipValue(e.target.value)
                    getValueCashbackTip()
                }

            } else {
                setCashBack(Cashbacks)
                setTipValue(0)
            }
        }

    }


    const onCliclcloseCashback = () => {
        setOpenDialogCashback(false)
        setValueDialogCash(false)
    }

    const onClickPartner = () => {
        setOpenDialogPartner(true)
    }

    const OnchangeCheckPartner = (e, row) => {
        dataPartner.map((item, idx) => {
            if (item.master_partner_id == row.master_partner_id) {
                item.defaultChecked = true
            } else {
                item.defaultChecked = false
            }
        })
        setDataPartner(dataPartner)
        setValuePart(e)
    }


    const onClickAddPartner = () => {
        dataPartner.map((item, idx) => {
            if (item.defaultChecked == true) {
                let datas = {
                    master_partner_creditamnt: item.master_partner_creditamnt,
                    master_partner_id: item.master_partner_id,
                    master_partner_name: item.master_partner_name,
                    amountPartner: item.amountPartner
                }
                setDataPartnerAdd([datas])
                setDisiPrtner(false)
            } else {
            }
        })
        setOpenDialogPartnerAdd(false)
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

    const onChangeAmountPrtner = (e, row) => {
        if (e.target.value < 0) {

        } else {
            let findIndex = _.findIndex(dataPartnerAdd, { master_partner_id: row.master_partner_id })
            let MaxValue = row.master_partner_creditamnt
            if (parseFloat(e.target.value) > parseFloat(paymentValues)) {
                dataPartnerAdd[findIndex]['amountPartner'] = parseFloat(paymentValues)
                setAlertMessages("มูลค่ามากกว่ามูลค่าสุทธิ")
                setAlerttWarning(true)
                setDisiPrtner(true)
                setValuedatlete(row)
            } else if (MaxValue > 0 && parseFloat(e.target.value) > parseFloat(MaxValue)) {
                dataPartnerAdd[findIndex]['amountPartner'] = MaxValue
                setAlertMessages("มูลค่าเกินกว่าค่า " + MaxValue + " ที่กำหนดไว้")
                setAlerttWarning(true)
                setValuedatlete(row)
            } else {
                dataPartnerAdd[findIndex]['amountPartner'] = e.target.value
                setDisiPrtner(false)
            }
        }
    }

    const onChangeRemarkPrtner = (e, row) => {
        if (e.target.value) {
            let findIndex = _.findIndex(dataPartnerAdd, { master_partner_id: row.master_partner_id })
            dataPartnerAdd[findIndex]['remark'] = e.target.value
        }
    }

    const onClickAddPartnerSum = () => {
        dataPartnerAdd.map((item, idx) => { item.amountPartner = parseFloat(item.amountPartner) })
        let sumPertNer = _.sumBy(dataPartnerAdd, 'amountPartner');
        setPartnerValue(sumPertNer)
        setOpenDialogPartner(false)
    }

    const OnchangeDeletePartner = (row) => {
        let findIndexs = _.findIndex(dataPartnerAdd, { master_partsetDataVoucherSelectner_id: row.master_partner_id })
        dataPartnerAdd.splice(findIndexs, 1)
        setValuedatlete(row)
        let sumPertNer = _.sumBy(dataPartnerAdd, 'amountPartner');
        setPartnerValue(sumPertNer)
        let findIndexCheck = _.findIndex(dataPartner, { master_partner_id: row.master_partner_id })
        dataPartner[findIndexCheck]['defaultChecked'] = !dataPartner[findIndexCheck]['defaultChecked']

    }

    const OnchangeDeleteVoucher = (row) => {
        let findIndexs = _.findIndex(dataVoucherAdd, { salehd_voucher_type_id: row.salehd_voucher_type_id })
        dataVoucherAdd.splice(findIndexs, 1)
        setValueVouchAdd(row)
        let sumVoucher = _.sumBy(dataVoucherAdd, 'salehd_voucher_type_rate');
        setVouchers(sumVoucher)
        let findIndexCheck = _.findIndex(dataVoucher, { salehd_voucher_type_id: row.salehd_voucher_type_id })
        dataVoucher[findIndexCheck]['defaultChecked'] = !dataVoucher[findIndexCheck]['defaultChecked']
    }

    const onClickVoucher = () => {
        setOpenDialogVoucherAdd(true)
    }

    const OnchangeCheckVocher = (e, row) => {
        let findIndexs = _.findIndex(dataVoucher, { salehd_voucher_type_id: row.salehd_voucher_type_id })
        dataVoucher[findIndexs]['defaultChecked'] = e.target.checked
    }

    const onChangeAmountVoucherAdd = (e, row) => {
        let findIndex = _.findIndex(dataVoucher, { salehd_voucher_type_id: row.salehd_voucher_type_id })
        dataVoucher[findIndex]['amountVoucherAdd'] = e.target.value
    }

    const onChangeCodeVoucher = (e, row) => {
        let findCheck = _.findIndex(dataVoucherBarcode, { salevoucher_docuno: e.target.value })
        let findChecks = _.findIndex(dataVoucherAdd, { barcode: e.target.value })
        if (findCheck > 0 || findChecks > 0) {
            setAlertMessages("กรุณากรอก รหัส Voucher")
            setAlerttWarning(true)
            setDisibleVoucherAdd(true)
            setValueVouchAdd(e)
        } else if (findCheck >= 0 || findChecks >= 0) {
            setAlertMessages("รหัส Voucher นี้มีการใช้งานแล้ว")
            setAlerttWarning(true)
            setDisibleVoucherAdd(true)
            setValueVouchAdd(e)
        } else {
            let findIndexs = _.findIndex(dataVoucherAdd, { row_num: row.row_num })
            dataVoucherAdd[findIndexs]['barcode'] = e.target.value
            setDataVoucherAdd(dataVoucherAdd)
            setDisibleVoucherAdd(false)
            setValueVouchAdd(e)
        }
    }

    const onClickAddVoucher = () => {
        let datasAdd = []
        dataVoucher.map((item, idx) => {
            if (item.defaultChecked == true) {
                for (let indx = 0; indx < item.amountVoucherAdd; indx++) {
                    let datas = {
                        "salehd_voucher_type_name": item.salehd_voucher_type_name,
                        "salehd_voucher_cal_type_id": item.salehd_voucher_cal_type_id,
                        "salehd_voucher_type_id": item.salehd_voucher_type_id,
                        "salehd_voucher_type_name": item.salehd_voucher_type_name,
                        "salehd_voucher_type_rate": item.salehd_voucher_type_rate,
                        "barcode": ""
                    }
                    dataVoucherAdd.push(datas)
                }
            }
            //dataVoucherAdd(datasAdd)
        })
        dataVoucher.map((item, idx) => { item.defaultChecked = false })
        setDisibleVoucherAdd(true)
        setOpenDialogVoucher(false)
    }

    const onClickAddVoucherAdd = () => {
        dataVoucherAdd.map((item, idx) => {
            if (!item.barcode) {
                setAlertMessages("กรุณากรอกรหัส Voucher")
                setAlerttWarning(true)
                setDisibleVoucherAdd(true)
            } else {
                item.salehd_voucher_type_rate = parseInt(item.salehd_voucher_type_rate)
                setOpenDialogVoucherAdd(false)
                setDisibleVoucherAdd(false)
            }
        })
        let sumVoucher = _.sumBy(dataVoucherAdd, 'salehd_voucher_type_rate');
        setVouchers(sumVoucher)
        setOpenDialogVoucherAdd(false)

    }


    const getCurrValue = () => {
        let diff;
        let cashbacks
        let valueSumCurrs = valueSumCurr ? valueSumCurr : 0
        let totalSum = 0
        if (props.dataCatSelect.wht_category_rate) {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCreditNoVat) + parseFloat(vouchers) + parseFloat(partnerValue)
        } else {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCredit) + parseFloat(vouchers) + parseFloat(partnerValue)
        }
        if (parseFloat(totalOrder) > parseFloat(totalSum)) {
            cashbacks = (parseFloat(totalOrder) - parseFloat(totalSum))
        } else {
            cashbacks = parseFloat(totalSum) - parseFloat(totalOrder)
        }
        if (parseInt(valueSumCurr) == 0) {
            diff = 0
        } else if (parseFloat(valueSumCurr) > parseFloat(cashbacks)) {
            diff = parseFloat(valueSumCurr) - (parseFloat(cashbacks))
        } else {
            diff = 0
        }

        setcurrValue((diff))
        getCashback()

    }

    const onClickOpenClashback = () => {
        setOpenDialogCashback(true)
    }

    const getCashback = () => {
        let totalSum = 0
        let valueSumCurrs = valueSumCurr ? valueSumCurr : 0
        if (props.dataCatSelect.wht_category_rate) {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCreditNoVat) + parseFloat(vouchers) + parseFloat(partnerValue)
        } else {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCredit) + parseFloat(vouchers) + parseFloat(partnerValue)
        }
        // let totalSum = parseFloat(valueSumCurr) + parseFloat(valueSumTranfer) + parseFloat(valueSumCreditNoVat) + parseFloat(vouchers) + parseFloat(partnerValue)
        let difftotal;
        if (totalSum == 0 || totalOrder == totalSum) {
            setPaymentValues(0)
            setCashBack(0)
        }
        if (parseFloat(vouchers) > parseFloat(props.amountTotals)) {
            let diffVoucher;
            setPaymentValues(0)
            diffVoucher = parseFloat(totalSum) - parseFloat(vouchers)
            setCashBack(diffVoucher)
        } else {
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
    }

    const getValueCashbackTip = () => {
        let totalSum = 0
        let tipValues = tipValue ? tipValue : 0
        let valueSumCurrs = valueSumCurr ? valueSumCurr : 0

        if (props.dataCatSelect.wht_category_rate) {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCreditNoVat) + parseFloat(vouchers) + parseFloat(partnerValue)
        } else {
            totalSum = parseFloat(valueSumCurrs) + parseFloat(valueSumTranfer) + parseFloat(valueSumCredit) + parseFloat(vouchers) + parseFloat(partnerValue)
        }

        let Cashbacks = 0
        if (parseFloat(totalSum) > parseFloat(totalOrder)) {
            Cashbacks = (parseFloat(totalSum) - parseFloat(totalOrder))
        }

        if (tipValues == cashBack) {
            setCashBack(0)
        } else {
            let diff = parseFloat(Cashbacks) - parseFloat(tipValues)
            setCashBack(diff)
        }

    }

    const onClickSaveDocuments = (actions) => {
        props.dataOrderdetails.map((item, idx) => {
            item.saledt_saleprice = parseInt(item.saledt_saleprice)
        })

        let SumTotal = _.sumBy(props.dataOrderdetails, 'saledt_saleprice')
        if (SumTotal == 0) {
            setAlertMessages("มูลค่าบิลขายต้องไม่เท่ากับ 0 ");
            setAlerttWarning(true);
        } else {

            if (flagAdd == false) {
                setDisibleBtnAdd(true)
                setflagAdd(true)
                if (customerDataDefault.length > 0 && props.dataOrderdetails.length > 0) {
                    let RemarkOrder = "";
                    let remarks;
                    let customerDataDefaults = props.customersData
                    let SumDeposit = 0

                    props.dataOrder.map((item, idx) => {
                        if (item.orderhd_remark != "ไม่มีหมายเหตุ") {
                            if (idx + 1 == props.dataOrder.length) {
                                remarks = RemarkOrder + item.orderhd_remark
                            } else {
                                remarks = RemarkOrder + item.orderhd_remark + ","
                            }
                        }
                        RemarkOrder = remarks
                    })

                    if (props.dataDepositSelect.length > 0) {
                        props.dataDepositSelect.map((item, idx) => {
                            item.deposit_use = parseFloat(item.deposit_use)
                        })
                        SumDeposit = _.sumBy(props.dataDepositSelect, 'deposit_use')
                    }

                    let datasVou = []
                    dataVoucherAdd.map((item, idx) => {
                        let vouchers = {
                            "salevoucher_listno": idx + 1,
                            "salehd_voucher_type_id": parseInt(item.salehd_voucher_type_id),
                            "salevoucher_netamnt": parseInt(item.salehd_voucher_type_rate),
                            "salevoucher_docuno": item.barcode
                        }
                        datasVou.push(vouchers)
                    })

                    let table = []
                    props.tableName.map((item, idx) => {
                        table.push(item.names)
                    })
                    let dataHd = []
                    let dataHead = {
                        'master_branch_id': parseInt(BranchData[0]['master_branch_id']),
                        'master_company_id': parseInt(userData[0]['master_company_id']),
                        'salehd_arcustomerid': customerDataDefaults[0]['arcustomer_id'] ? parseInt(customerDataDefaults[0]['arcustomer_id']) : null,
                        'salehd_arcustomer_addr_district_id': customerDataDefaults[0]['arcustomer_addr_cont_district_id'] ? parseInt(customerDataDefaults[0]['arcustomer_addr_cont_district_id']) : null,
                        'salehd_arcustomer_addr': customerDataDefaults[0]['arcustomer_addr'],
                        'salehd_arcustomer_addr_postcode_id': customerDataDefaults[0]['arcustomer_addr_postcode_id'] ? parseInt(customerDataDefaults[0]['arcustomer_addr_postcode_id']) : null,
                        'salehd_arcustomer_addr_prefecture_id': customerDataDefaults[0]['arcustomer_addr_cont_prefecture_id'] ? parseInt(customerDataDefaults[0]['arcustomer_addr_cont_prefecture_id']) : null,
                        'salehd_arcustomer_addr_province_id': customerDataDefaults[0]['arcustomer_addr_province_id'] ? parseInt(customerDataDefaults[0]['arcustomer_addr_province_id']) : null,
                        'salehd_arcustomer_name': customerDataDefaults[0]['name'] ? customerDataDefaults[0]['name'] : null,
                        'salehd_arcustomer_taxid': customerDataDefaults[0]['arcustomer_taxid'] ? parseInt(customerDataDefaults[0]['arcustomer_taxid']) : null,
                        'salehd_baseamnt': props.taxsBase ? parseFloat((props.taxsBase.toFixed(2))) : 0,
                        'salehd_vatamnt': props.taxs ? parseFloat((props.taxs.toFixed(2))) : 0,
                        'salehd_cashamnt': currValue ? parseFloat(parseFloat(currValue)) : 0,
                        'salehd_creditcardamnt': valueSumCredit ? parseFloat(valueSumCredit) : 0,
                        'salehd_discountamnt': props.discount ? parseFloat((props.discount)) : 0,
                        'salehd_docudate': Moment(props.startDate).format("YYYYMMDD"),
                        'salehd_empemployeemasterid': parseInt(userData[0]['emp_employeemasterid']),
                        'salehd_netamnt': parseFloat((totalOrder)),
                        'salehd_remark': props.remark ? props.remark : null,
                        'salehd_sumgoodamnt': props.amountTotal ? parseFloat((props.amountTotal)) : 0,
                        'salehd_totalexcludeamnt': props.sumProductNoVat ? parseFloat((props.sumProductNoVat)) : 0,
                        'salehd_totalincludeamnt': props.sumProductVat ? parseFloat((props.sumProductVat)) : 0,
                        'salehd_totalincludeamnt_afterdepositamnt': 0,
                        'salehd_transferamnt': valueSumTranfer,
                        'salehd_vatgroup_id': props.dataVatSelect.length > 0 ? props.dataVatSelect[0]['master_vat_group_id'] : null,
                        'salehd_vatrate': props.dataVatSelect.length > 0 ? parseInt(props.dataVatSelect[0]['master_vat_rate']) : 0,
                        'salehd_cashamnt_actual': valueSumCurr > 0 ? parseFloat((parseFloat(valueSumCurr))) : 0,
                        'salehd_changeamnt': cashBack > 0 ? parseFloat(cashBack.toFixed(2)) : 0,
                        'salehd_discount_type_id': props.dataDiscountSelect.length > 0 ? props.dataDiscountSelect[0]['salehd_discount_type_id'] : null,
                        'salehd_print_taxinvoice': printsLange > 0 ? true : false,
                        'salehd_voucheramnt': parseInt(vouchers),
                        'salehd_voucher_type_id': dataVoucherSelect.length > 0 ? dataVoucherSelect[0]['salehd_voucher_type_id'] : null,
                        'salehd_point_quantity': props.datapointCus.length > 0 ? props.datapointCus[0]['pointvalue'] : 0,
                        'salehd_point_type_id': props.datapointSelect['promotion_point_type_id'] ? parseInt(props.datapointSelect['promotion_point_type_id']) : 0,
                        'salehd_point_redeem': props.datapointSelect['promotion_point_type_quantity'] ? parseInt(props.datapointSelect['promotion_point_type_quantity']) : 0,
                        'salehd_wht_category_id': props.dataCatSelect['wht_category_id'] ? props.dataCatSelect['wht_category_id'] : null,
                        'salehd_whtamnt': props.catValue ? parseFloat((props.catValue).toFixed(2)) : 0,
                        'salehd_arcustomer_redeemid': props.datapointCus.length > 0 ? props.datapointCus[0]['arcustomer_id'] :
                            customerDataDefault[0]['arcustomer_id'] ? parseInt(customerDataDefault[0]['arcustomer_id']) : null,
                        'salehd_arcustomer_redeemname': props.datapointCus.length > 0 ? props.datapointCus[0]['name'] :
                            customerDataDefault[0]['name'] ? customerDataDefault[0]['name'] : null,
                        'salehd_tipamnt': tipValue ? parseFloat(tipValue) : 0,
                        'salehd_table_name': table,
                        'salehd_feeamnt': parseFloat(vatCredit),
                        'salehd_service_chargeamnt': props.sumService ? parseFloat(props.sumService) : 0,
                        'salehd_print_taxinvoice_language': 1,
                        'salehd_service_chargeamnt_takeaway': props.sumServiceTake,
                        'salehd_partneramnt': partnerValue ? parseFloat(partnerValue) : 0,
                        'salehd_remark_order': RemarkOrder ? RemarkOrder : null,
                        'salehd_depositamnt': parseFloat(parseFloat(SumDeposit).toFixed(2)),
                        'salehd_arcustomerid_taxinvoice': customerDataDefault[0]['arcustomer_id'] ? parseInt(customerDataDefault[0]['arcustomer_id']) : null,
                        'salehd_docutype_id': props.flagPayment == true ? 8 : 9,
                        'salehd_creditday': props.flagPayment == false ? props.creditDay : null,
                        'salehd_creditduedate': props.flagPayment == false ? Moment(props.creditDate).format("YYYYMMDD") : null,
                    }
                    dataHd.push(dataHead)
                    let datasDetail = []
                    props.dataOrderdetails.map((item, idx) => {
                        let details = {
                            'saledt_listno': parseInt(idx + 1),
                            'saledt_master_product_id': item.saledt_master_product_id ? parseInt(item.saledt_master_product_id) : null,
                            'saledt_master_product_billname': item.saledt_master_product_billname,
                            'saledt_master_product_barcode_id': item.saledt_master_product_barcode_id ? parseInt(item.saledt_master_product_barcode_id) : null,
                            'saledt_master_product_barcode_unit_id': item.saledt_master_product_barcode_unit_id ? parseInt(item.saledt_master_product_barcode_unit_id) : null,
                            'saledt_qty': parseFloat(item.saledt_qty),
                            'saledt_saleprice': parseFloat(item.saledt_saleprice),
                            'saledt_discount_amnt': parseFloat(item.saledt_discount_amnt),
                            'saledt_netamnt': parseFloat(item.saledt_netamnt),
                            'saledt_stock_unit_rate': parseInt(item.saledt_stock_unit_rate),
                            'saledt_master_product_barcode_code': item.saledt_master_product_barcode_code,
                            'saledt_master_product_barcode_unitname': item.saledt_master_product_barcode_unitname,
                            'saledt_vatflag': item.saledt_vatflag,
                            'saledt_master_product_invoice_id': item.saledt_master_product_invoice_id ? parseInt(item.saledt_master_product_invoice_id) : null,
                            'saledt_master_product_invoice_name': item.saledt_master_product_invoice_name,
                            'saledt_master_product_invoice_code': item.saledt_master_product_invoice_code,
                            'saledt_orderhd_id': item.saledt_orderhd_id ? parseInt(item.saledt_orderhd_id) : null,
                            'saledt_orderhd_docuno': item.saledt_orderhd_docuno,
                            'saledt_master_table_id': item.saledt_master_table_id ? parseInt(item.saledt_master_table_id) : null,
                            'saledt_orderdt_id': item.saledt_orderdt_id ? parseInt(item.saledt_orderdt_id) : null,
                            'saledt_master_product_price1': parseFloat(item.saledt_master_product_price1),
                            'master_product_group_type_id': item.master_product_group_type_id ? parseInt(item.master_product_group_type_id) : null,
                            'saledt_id_main': item.saledt_id_main,
                            'master_order_location_type_id': item.master_order_location_type_id ? parseInt(item.master_order_location_type_id) : null,
                            'promotion_hd_docuno': item.promotion_hd_docuno,
                            'promotion_hd_id': item.promotion_hd_id,
                            'promotion_dt_id': item.promotion_dt_id
                        }
                        datasDetail.push(details)
                    })

                    let dataCash = []
                    dataCurrency.map((item, idx) => {
                        if (item.master_currency_rate > 0) {
                            let datas = {
                                'salecash_listno': idx + 1,
                                'salecash_cashamnt': item.amount_values ? parseFloat(item.amount_values.toFixed(2)) : 0,
                                'salecash_netamnt': item.amount_totals ? parseFloat(item.amount_totals.toFixed(2)) : 0,
                                'master_currency_id': parseInt(item.master_currency_id),
                                'master_currency_name': item.master_currency_name,
                                'master_currency_rate': parseInt(item.master_currency_rate),
                                'master_calculate_type_id': item.master_calculate_type_id ? parseInt(item.master_calculate_type_id) : null,
                            }
                            dataCash.push(datas)
                        }
                    })

                    let cashBacks = []
                    dataCurrencyCashback.map((item, idx) => {
                        if (item.amount_totals > 0) {
                            let datas = {
                                'salecash_listno': idx + 1,
                                'salecash_cashamnt': item.amount_values ? parseFloat(item.amount_values.toFixed(2)) : 0,
                                'salecash_netamnt': item.amount_totals ? parseFloat(item.amount_totals.toFixed(2)) : 0,
                                'master_currency_id': parseInt(item.master_currency_id),
                                'master_currency_name': item.master_currency_name,
                                'master_currency_rate': parseInt(item.master_currency_rate),
                                'master_calculate_type_id': item.master_calculate_type_id ? parseInt(item.master_calculate_type_id) : null,
                            }
                            cashBacks.push(datas)
                        }
                    })

                    let datasTranfer = []
                    if (valueSumTranfer > 0) {
                        dataTranfer.map((item, idx) => {
                            if (item.amount_tranfer > 0) {
                                let datas = {
                                    "bank_booktransfer_ref_listno": idx + 1,
                                    "bank_booktransfer_ref_bankbook_id": parseInt(item.cq_bankbook_id),
                                    "bank_booktransfer_ref_amnt": item.amount_tranfer ? parseFloat(item.amount_tranfer) : 0,
                                    "bank_booktransfer_ref_bank_id": parseInt(item.cq_bank_id)
                                }
                                datasTranfer.push(datas)
                            }

                        })
                    }

                    let dataCre = []
                    dataCredit.map((item, idx) => {
                        if (item.cq_cardtype_id) {
                            let datas = {
                                "cheq_cheqdata_rec_listno": idx + 1,
                                "cheq_cheqdata_rec_bankbook_id": parseInt(item.cq_bankbook_id),
                                "cheq_cheqdata_rec_cardtype_id": parseInt(item.cq_cardtype_id),
                                "cheq_cheqdata_rec_docudate": Moment(props.datesDoc).format("YYYYMMDD"),
                                "cheq_cheqdata_rec_cardno": item.number_credit ? item.number_credit : null,
                                "cheq_cheqdata_rec_amount": item.amount_credits ? parseFloat(item.amount_credits) : 0,
                                "cheq_cheqdata_rec_bankfeerate": parseInt(item.cq_cardtype_bankfee),
                                "cheq_cheqdata_rec_bankfeeamnt": parseFloat(item.vat_credit),
                                "cheq_cheqdata_rec_netamount": item.sum_credit ? parseFloat(item.sum_credit) : 0,
                                "cheq_cheqdata_rec_remark": item.remark,
                                "cheq_cheqdata_rec_bank_id": parseInt(item.cq_bank_id)
                            }
                            dataCre.push(datas)
                        }
                    })


                    let dataPertner = []
                    dataPartnerAdd.map((item, idx) => {
                        let datas = {
                            "salepartner_listno": idx + 1,
                            "master_partner_id": parseInt(item.master_partner_id),
                            "salepartner_netamnt": parseFloat(item.amountPartner),
                            "salepartner_remark": item.remark
                        }
                        dataPertner.push(datas)
                    })

                    let dataDiposit = []
                    if (props.dataDepositSelect.length > 0) {
                        props.dataDepositSelect.map((item, idx) => {
                            let datas = {
                                'deposithd_ref_listno': idx + 1,
                                'deposithd_id': parseInt(item.deposithd_id),
                                'deposithd_ref_amnt': parseFloat(item.deposit_use),
                                'deposithd_ref_totalamnt': parseFloat(item.deposithd_netamnt),
                                'deposithd_ref_lastamnt': parseFloat(item.deposit_amt),
                                'deposithd_docuno': item.deposithd_docuno,
                                'deposithd_docudate': Moment(item.deposithd_docudate).format("YYYYMMDD"),
                            }
                            dataDiposit.push(datas)
                        })
                    }

                    if (valueSumCredit > 0 && dataCre.length == 0) {
                        setAlertMessages("กรุณาตรวจสอบรายละเอียดการชำระบัตรเครดิต")
                        setAlerttWarning(true)
                        setflagAdd(false)
                    } else if (valueSumTranfer > 0 && datasTranfer.length == 0) {
                        setAlertMessages("กรุณาตรวจสอบรายละเอียดการชำระเงินโอน")
                        setAlerttWarning(true)
                        setflagAdd(false)
                    } else if (partnerValue > 0 && dataPertner.length == 0) {
                        setAlertMessages("กรุณาตรวจสอบรายละเอียดการชำระเครดิตสินเชื่อ")
                        setAlerttWarning(true)
                        setflagAdd(false)
                    } else if (partnerValue > 0 && dataPertner.length == 0) {
                        setAlertMessages("กรุณาตรวจสอบรายละเอียดการชำระเครดิตสินเชื่อ")
                        setAlerttWarning(true)
                        setflagAdd(false)
                        /* } else if (currValue > 0 && dataCash.length == 0) {
                             setAlertMessages("กรุณาตรวจสอบรายละเอียดการเงินสด")
                             setAlerttWarning(true)
                         } else if (vouchers > 0 && datasVou.length == 0) {
                             setAlertMessages("กรุณาตรวจสอบรายละเอียดการเงินทอน")
                             setAlerttWarning(true)*/
                    } else {
                        let datas = {
                            "sale_hd": dataHd,
                            "sale_dt": datasDetail,
                            "sale_cash": dataCash,
                            "transfer": datasTranfer,
                            "creditcard": dataCre,
                            "partner": dataPertner,
                            "voucher": datasVou,
                            "salechange": cashBacks,
                            "salehd_id_main": parseInt(preViewOrderValue),
                            "deposithd_ref": dataDiposit
                        }
                        //console.log(JSON.stringify(datas))
                        if (actions == "save") {
                            setDisibleBtnAdd(true)
                            axios.post(UrlApi() + 'add_salehd_order', datas).then(res => {
                                if (res.data) {
                                    if (res.data[0]['fn_insert_sale']) {
                                        setAlertMessages("บันทึกข้อมูลสำเร็จ")
                                        setAlertSuccess(true)
                                        setflagAdd(false)
                                        setTipValue()
                                        ClearDataAll()
                                        setDisibleBtnAdd(true)
                                        props.onChangeSave(true)
                                    } else {
                                        setDisibleBtnAdd(false)
                                        setflagAdd(false)
                                        setAlertMessages("ผิดพลาด")
                                        setAlerttWarning(true)
                                    }
                                }
                            })
                        } else if (actions == "preview") {
                            setflagAdd(false)
                            axios.post(UrlApi() + 'get_salePreview', datas)
                                .then(res => {
                                    if (res.data) {
                                        if (res.data[0]['fn_insert_sale_preview'] > 0) {
                                            setpreViewOrderValue(res.data[0]['fn_insert_sale_preview'])
                                            setAlertMessages("พิมพ์สำเร็จ")
                                            setAlertSuccess(true)
                                            setflagAdd(false)
                                        } else if (res.data[0]['fn_insert_sale_preview'] == false) {
                                            setAlertMessages("ผิดพลาด")
                                            setAlerttWarning(true)
                                            setflagAdd(false)
                                        }
                                    }
                                })
                        }
                    }
                } else {
                    setAlertMessages("กรุณาตรวจสอบข้อมูล")
                    setAlerttWarning(true)
                }
            }
        }
        
    }

    const ClearDataAll = () => {
        setflagAdd(false)
        setTotalOrder(parseFloat(props.amountTotals))
        setPaymentValues(parseFloat(props.amountTotals))
        setDisabledCredit(true)
        setDisibleBtnAdd(true)
        setVatCredit(0)
        setValueSumCredit(0)
        setValueSumTranfer(0)
        setTipValue()
        setValueSumCurr()
        setPartnerValue(0)
        setDataCurrency([])
        setDataCredit([])
        setDataVoucher([])
        setDataVoucherAdd([])
        setDataBookbank([])
        setDataTranfer([])
        setDataPartnerAdd([])
        setVouchers(0)
        setcurrValue(0)
        setValueSumCreditNoVat(0)
        setPartnerValue(0)
        setCashBack(0)
        setPrintLange(0)
        setPrintName("")
        getDataMasterDefault()
        getPaymentBody()
        props.onChangeVatredit(0)
    }

    const ClearDataCurrency = () => {
        dataCurrency.map((item, idx) => {
            item.amount_total = 0
            item.amount_value = 0
        })
        setValueCurr("")
        getDialogCurrency()
    }

    const ClearDataVoucher = () => {
        dataVoucher.map((item, idx) => {
            item.defaultChecked = false
        })
        setDataVoucherAdd([])
        setVouchers(0)
        setValueVouch("")
        getDialogVoucher()
    }

    const OnchangeSearch = (e) => {
        if (e.target.value) {
            setValueInput(e.target.value)
            let filterText = (e.target.value).trim()
            const filteredItems = dataCustomer.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                let redatas = []
                setDataCustomer(redatas)
                getDialogCustomer()
            } else {
                filteredItems.map((item, idx) => { item.row_num = idx + 1 })
                setDataCustomer(filteredItems)
                getDialogCustomer()
            }
        } else {
            setValueInput("")
            getDataCustomer()
        }
    }

    const getSearchInput = () => {
        return (<div>
            <FilterDataTable value={valueInput} onChange={(e) => { OnchangeSearch(e) }} placeholder="ค้นหา" />

        </div>
        )
    }

    const getTotalamount = () => {
        return (<div>
            <div class="row">
                <div class="col-6">
                    <p><strong>มูลค่าที่ต้องชำระ</strong></p>
                </div>
                <div class="col-6">
                    <p>{nf.format(paymentValues)}</p>
                </div></div>
        </div>
        )
    }

    const filterComp = () => {
        return (
            <SearchDialog
                open={true}
                searchText={searchText}
                onChangeSearchText={(e) => { setSearchText(e) }}
                title={'ค้นหา'}
                subTitle={'รหัสลูกค้า / เลขประจำตัวผู้เสียภาษี / ชื่อ - สกุล / เบอร์โทรศัพท์ / กลุ่มลูกค้า'}
            />
        )
    }

    const getDialogCustomer = () => {
        return <Dialog open={openDialog} maxWidth="600px" >
            <DialogTitle >
                <p>ข้อมูลลูกค้า</p>
            </DialogTitle>
            <DialogContent dividers='paper'>
                <button type="button" className="cancel" onClick={() => setOpenDialog(!openDialog)}>x</button>
                <div>
                    <p>***หมายเหตุ ลูกค้าจำเป็นต้องมีเลขประจำตัวผู้เสียภาษี</p>
                    {filterComp()}
                    <div style={{ marginTop: "1%" }}>
                        <DataTable
                            striped
                            dense
                            customStyles={customStyles}
                            columns={columnsdata}
                            data={dataCustomer}
                    />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <span><Btnsubmit onClick={() => onClickAddCustomer()} message="เพิ่ม" /></span>
                <BtnCancel onClick={() => { onClickcancle() }} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getDialogTranfer = () => {
        if (dataTranfer.length > 0) {
            dataTranfer.map((item, idx) => {
                item.row_num = idx + 1
                item.default_check = false
            })
        }
        return <Dialog open={openDialogTranfer} maxWidth="1000px" >
            <DialogTitle style={{height:"50px"}}>
                <p>รายละเอียดการชำระเงินโอน</p>
            </DialogTitle>
            <DialogContent dividers='paper'>
                <button type="button" className="cancel" onClick={() => setOpenDialogTranfer(!openDialogTranfer)}>x</button>
                <div>
                    {getTotalamount()}
                    <BtnAdd message="เพิ่มบัญชีธนาคาร" icons={<Icon path={mdiPlaylistPlus} size={1} />} onClick={() => setOpenDialogbookbank(!openDialogbookBank)} />
                    <div style={{marginTop:"1%"}}><DataTable
                        striped
                        dense
                        customStyles={customStyles}
                        columns={columnbankTranfer}
                        data={dataTranfer}
                    /></div>
                    {getDataSummaryTranfer()}
                </div>
            </DialogContent>
            <DialogActions>
                <span>
                    <BtnConfirm onClick={() => onClickAddTranferData()} disabled={disibleTranfer} /></span>
                <BtnCancel onClick={() => setOpenDialogTranfer(!openDialogTranfer)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getDialogCredit = () => {
        if (dataCredit.length > 0) {
            dataCredit.map((item, idx) => {
                item.row_num = idx + 1
                item.default_check = false
            })
        }
        return <Dialog open={openDialogCredit} maxWidth="1000px">
            <DialogTitle style={{height:"50px"}}>
                <p>รายละเอียดการชำระบัตรเครดิต</p>
            </DialogTitle>
            <DialogContent dividers='paper'  >
                <button type="button" className="cancel" onClick={() => setOpenDialogCredit(!openDialogCredit)}>x</button>
                <div>
                    {getTotalamount()}
                    <BtnAdd message="เพิ่มบัญชีธนาคาร" icons={<Icon path={mdiPlaylistPlus} size={1} />} onClick={() => setOpenDialogbookbank(!openDialogbookBank)} />
                    <div style={{ marginTop: "1%" }}>
                        <DataTable
                            striped
                            dense
                            customStyles={customStyles}
                            columns={columnbankCredit}
                            data={dataCredit}
                    /></div>
                </div>
                {getDataSummaryCredit()}
            </DialogContent>
            <DialogActions>
                <span><BtnConfirm onClick={() => onClickAddCreditData()} message="เพิ่ม" disabled={disabledCredit} /></span>
                <BtnCancel onClick={() => setOpenDialogCredit(!openDialogCredit)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getDialogCurrency = () => {
        if (dataCurrency.length > 0) {
            dataCurrency.map((item, idx) => { item.row_num = idx + 1 })
        }
        return <Dialog open={openDialogCurrency} maxWidth="1000px" >
            <DialogTitle >
                <p>รายละเอียดการชำระเงินสด</p>
            </DialogTitle>
            <DialogContent dividers='paper' >
                <button type="button" className="cancel" onClick={() => setOpenDialogCurrency(!openDialogCurrency)}>x</button>
                <div>
                    <div class="row">
                        <div class="col-6">
                            {getTotalamount()}
                        </div>
                        <div class="col" style={{ marginLeft: "30%" }}>
                            <BtnAdd message="Clear" onClick={() => ClearDataCurrency()} />
                        </div>
                    </div>
                    <DataTable
                        striped
                        dense
                        customStyles={customStyles}
                        columns={columnCurrency}
                        data={dataCurrency}
                    />
                </div>
                {getDataSummaryCurrency()}
            </DialogContent>
            <DialogActions>
                <span>
                    <Btnsubmit onClick={() => onClickAddCurrData()} message="เพิ่ม" /></span>
                <BtnCancel onClick={() => setOpenDialogCurrency(!openDialogCurrency)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getDialogCashback = () => {
        dataCurrencyCashback.map((item, idx) => { item.row_num = idx + 1 })
        return (<Dialog open={openDialogCashback} maxWidth="600px" >
            <DialogTitle >
                <p>เงินทอน</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogCashback(!openDialogCashback)}>x</button>
                <div class="row">
                    <div class="col-2">
                        <p><strong>เงินทอน</strong></p>
                    </div>
                    <div class="col">
                        <p>{nf.format(cashBack)}</p>
                    </div>
                    <div class="col">
                        <BtnAdd style={{ marginLeft: "60%" }}
                            message="Clear" onClick={() => getDataCurrencyCashback()} />
                    </div>
                </div>
                <DataTable
                    customStyles={customStyles}
                    columns={columnCurrencyCashback}
                    data={dataCurrencyCashback} />
                {getDataSummaryCurrencyCashback()}
            </DialogContent>
            <DialogActions>
                <span><Btnsubmit onClick={() => onClickAddCurrCashbck()} message="เพิ่ม" /></span>
                <BtnCancel onClick={() => onCliclcloseCashback()} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>)
    }

    const getDialogBookbank = () => {
        return <Dialog open={openDialogbookBank} maxWidth="1000px" >
            <DialogTitle style={{height:"50px"}}>
                <p>ข้อมูลธนาคาร</p>
            </DialogTitle>
            <DialogContent dividers='paper' >
                <button type="button" className="cancel" onClick={() => setOpenDialogbookbank(!openDialogbookBank)}>x</button>
                <div>
                    <DataTable
                        striped
                        dense
                        customStyles={customStyles}
                        columns={columnsdatabookbank}
                        data={checkCredit ? dataBookbankCredit : dataBookbank}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <span><BtnConfirm onClick={() => onClickAddBookbank()}/></span>
                <BtnCancel onClick={() => { setOpenDialogbookbank(!openDialogbookBank) }} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getDialogCustomerDetail = () => {
        return <Dialog open={openDialogdetail} maxWidth="600px" >
            <DialogTitle >
                <p>ข้อมูลลูกค้า</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "800px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogdetail(!openDialogdetail)}>x</button>
                <div class="row">
                    <div class="col-4">
                        <p><strong>ผู้ซื้อ :</strong></p>
                        <p><strong>ที่อยู่ :</strong></p>
                        <p><strong>เบอร์โทรศัพท์ :</strong></p>
                        <p><strong>เลขประจำตัวผู้เสียภาษี :</strong></p>
                    </div>
                    {customerDataDefault.length > 0 ?
                        <div class="col">
                            <p>{customerDataDefault[0]['name']}</p>
                            <p>{customerDataDefault[0]['address_name']}</p>
                            <p>{customerDataDefault[0]['arcustomer_addr_tel']}</p>
                            <p>{customerDataDefault[0]['arcustomer_taxid']}</p>
                        </div>
                        : <></>
                    }

                </div>
            </DialogContent>
            <DialogActions>
                {customerDataDefault.length > 0 ?
                    <>
                        {customerDataDefault[0]['arcustomer_taxid'].length > 0 && customerDataDefault[0]['arcustomer_taxid'] != 0 ?
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

    const getDialogPartner = () => {
        if (dataPartnerAdd.length > 0) {
            dataPartnerAdd.map((item, idx) => { item.row_num = idx + 1 })
        }
        return (<><Dialog open={openDialogPartner} maxWidth="1000px" >
            <DialogTitle >
                <p>เครดิตสินเชื่อ</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1000px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogPartner(!openDialogPartner)}>x</button>
                <BtnAdd message="เลือกเครดิตสินเชื่อ" onClick={() => { setOpenDialogPartnerAdd(true) }} />
                <DataTable
                    customStyles={customStyles}
                    columns={columnPartner}
                    data={dataPartnerAdd} />
            </DialogContent>
            <DialogActions>
                <Btnsubmit onClick={() => onClickAddPartnerSum()} message="เพิ่ม" disabled={disiPartner} />
                <BtnCancel onClick={() => setOpenDialogPartner(!openDialogPartner)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
        </>
        )
    }

    const getDialogPartnerAdd = () => {
        return (<Dialog open={openDialogPartnerAdd} maxWidth="600px" >
            <DialogTitle >
                <p>เครดิตสินเชื่อ</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogPartnerAdd(!openDialogPartnerAdd)}>x</button>
                <DataTable
                    customStyles={customStyles}
                    columns={columnPartnerAdd}
                    data={dataPartner} />
            </DialogContent>
            <DialogActions>
                <Btnsubmit onClick={() => onClickAddPartner()} message="เพิ่ม" />
                <BtnCancel onClick={() => setOpenDialogPartnerAdd(!openDialogPartnerAdd)} message="ปิด" />
            </DialogActions>
        </Dialog>
        )
    }

    const getDialogVoucher = () => {
        return (<Dialog open={openDialogVoucher} maxWidth="600px" >
            <DialogTitle >
                <p>Voucher</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogVoucher(!openDialogVoucher)}>x</button>
                <div style={{ marginTop: "1%" }}>
                 <DataTable
                    striped
                    dense
                    customStyles={customStyles}
                    columns={columnVoucher}
                    data={dataVoucher} /></div>
            </DialogContent>
            <DialogActions>
                <BtnConfirm onClick={() => onClickAddVoucher()}/>
                <BtnCancel onClick={() => setOpenDialogVoucher(!openDialogVoucher)} message="ปิด" />
            </DialogActions>
        </Dialog>
        )
    }

    const getDialogVoucherAdd = () => {
        dataVoucherAdd.map((item, idx) => { item.row_num = idx + 1 })
        return (<Dialog open={openDialogVoucherAdd} maxWidth="600px" >
            <DialogTitle style={{height:"50px"}}>
                <p>Voucher</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogVoucherAdd(!openDialogVoucherAdd)}>x</button>
                <div class="row">
                    <div class="col">
                        <BtnAdd message="เพิ่ม" onClick={() => { setOpenDialogVoucher(true) }} icons={<Icon path={mdiPlaylistPlus} size={1} />}/>
                    </div>
                    <div class="col">
                        <BtnAdd style={{ marginLeft: "80%" }} message="Clear" onClick={() => ClearDataVoucher()} />
                    </div>
                </div>
                <div style={{ marginTop: "1%" }}>
                    <DataTable
                        striped
                        dense
                        customStyles={customStyles}
                        columns={columnVoucherAdd}
                        data={dataVoucherAdd} />
                </div>
                {getSummaryVoucher()}
            </DialogContent>
            <DialogActions>
                <BtnConfirm onClick={() => onClickAddVoucherAdd()} disabled={disibleVoucherAdd} />
                <BtnCancel onClick={() => setOpenDialogVoucherAdd(!openDialogVoucherAdd)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
        )
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const getPaymentBody = () => {
        return ( <>
          {props.flagPayment == true ?
                <Card className="card_sale"  style={{ height: "90vh" }}>
                    <div className="card_head" ><p className="textH_Left">รายละเอียดการชำระ</p></div>
                    <Card.Body className="card_body_doc"  style={{ fontSize: "16px" }}>
                        <div style={{display: 'flex', background: '#FFFFFF',justifyContent: 'space-between', height: "5vh", alignItems: 'center', padding: '10px', borderRadius: '10px'}}>                  
                                <div style={{alignSelf: 'center'}}>
                                    <label style={{color: "#FF002D"}}>มูลค่าที่ต้องชำระ : </label>
                                </div>
                                <div style={{alignSelf: 'center'}}>
                                    <label style={{color: "#FF002D"}}>{nf.format(paymentValues)}</label>
                                </div>
                        </div>
                        <div class="row" style={{ height: "52vh" }}>
                            <div class="col-2">
                                <BtnAdd style={{ marginTop: "2vh",  width: "42%", height: "6vh", position: "absolute" }} message="Voucher" icons={<Icon path={mdiTicketPercentOutline} size={1} />} onClick={() => onClickVoucher()}></BtnAdd>
                                <BtnAdd style={{ marginTop: "10vh", width: "42%", height: "6vh", position: "absolute" }} message="เงินโอน" icons={<Icon path={mdiCellphoneSound} size={1} />}  onClick={() => onClickTranfer()}></BtnAdd>
                                <BtnAdd style={{ marginTop: "18vh", width: "42%", height: "6vh", position: "absolute" }} message="บัตรเครดิต" icons={<Icon path={mdiCreditCardOutline} size={1} />} onClick={() => onClickCredit()} ></BtnAdd>
                                {/*<BtnAdd style={{ marginTop: "8%", width: "90%", height: "6vh" }} message="เครดิตสินเชื่อ" onClick={() => onClickPartner()}></BtnAdd>*/}
                                <>{
                                    dataCurrency.length > 1 ?
                                        <BtnAdd style={{ marginTop: "52%", width: "40%", height: "6vh", position: "absolute" }}
                                            onClick={() => onClickCurrency()} message="เงินสดที่ได้รับ" ></BtnAdd >
                                        :
                                        <>
                                            <Card className="card_btn_pay" style={{ marginTop: "26vh", width: "400%" }}>  <p style={{ marginTop: "10%" }}><strong>เงินสดที่ได้รับ</strong></p> </Card>
                                        </>
                                }</>
                                <Card className="card_btn_pay" style={{ marginTop: "2vh", width: "400%"  }}><p style={{ marginTop: "10%" }}><strong>เงินสด</strong></p></Card>
                                <Card className="card_btn_pay" style={{ marginTop: "2vh", width: "400%"  }}><p style={{ marginTop: "10%" }}><strong> ทิป </strong></p></Card>
                                <>{dataCurrencyCashback.length > 1 ? <BtnAdd style={{ marginTop: "20px", width: "90%", fontSize: "1vw", height: "5vh" }}
                                    message="เงินทอน" onClick={() => onClickOpenClashback()}></BtnAdd>
                                    : <>
                                        <Card className="card_btn_pay" style={{ marginTop: "2vh", width: "400%"  }} > <p style={{ marginTop: "10%" }}><strong>เงินทอน</strong></p></Card>
                                    </>}</>
                            </div>
                            <div class="col-10">
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text" value={nf.format(vouchers)} disabled />
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center"}} type="text" value={nf.format(valueSumTranfer)} disabled />
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text" value={nf.format(valueSumCredit)} disabled />
                                {/*<InputText style={{ marginTop: "10%", height: "6vh"}} type="text" value={nf.format(partnerValue)} disabled />*/}
                                {dataCurrency.length > 1 ?
                                    <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text" value={nf.format(valueSumCurr)} disabled />
                                    : <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }}
                                        type="number" onChange={(e) => onChangeCurrency(e)} value={valueSumCurr > 0 ? valueSumCurr : ""} />
                                }
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text" value={nf.format(currValue)} disabled />
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="number" onChange={(e) => onChangeTipvalue(e)} value={tipValue > 0 ? tipValue : ""} />
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text" value={cashBack > 0 ? nf.format(cashBack) : 0} disabled />
                            </div>
                           
                        </div>
                    <div class="row" style={{ marginLeft: "1%", marginTop: "20%" }}>
                            {/*div class="col-6">
                                <BtnAdd style={{ height: "5vh", width: "100%" }} icons={<Icon path={mdiPrinterOutline} size={1} />}
                                        onClick={() => onClickSaveDocuments("preview")} message="พิมพ์ใบแจ้งหนี้"></BtnAdd>
                        </div>*/}
                        <div class="col-12">
                                <BtnAdd style={{ height: "5vh", width: "100%" }}  icons={<Icon path={mdiTrayFull} size={1}/>}  onClick={() => onClicDialogCus()}
                                message={"ออกใบกำกับภาษี" + ' ' + printsName}
                            />
                        </div>
                    </div>
                        <BtnAdd style={{ marginLeft: "3%", height: "6vh", marginTop: "5%", width: "95%" }} message="บันทึก/ปิด" icons={< Icon path={mdiContentSaveCheckOutline} size={1} />}
                            onClick={() => { onClickSaveDocuments("save") }} disabled={paymentValues > 0 || props.dataOrderdetails.length < 1 ? true :false} />
                </Card.Body>
             </Card>
                    : <></>}
            </>
        )
    }

    return (<>
        {getPaymentBody()}
        {getDialogCustomer()}
        {getDialogCustomerDetail()}
        {getDialogBookbank()}
        {getDialogTranfer()}
        {getDialogCredit()}
        {getDialogCurrency()}
        {getDialogCashback()}
        {getDialogPartner()}
        {getDialogPartnerAdd()}
        {getAlert()}
        {getDialogVoucher()}
        {getDialogVoucherAdd()}
    </>
    )

}

export default memo(DetailPayment);
