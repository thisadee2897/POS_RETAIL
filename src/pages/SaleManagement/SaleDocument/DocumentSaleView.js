/* eslint-disable no-dupe-keys */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { React, useState, useEffect, useContext, memo } from "react";
import axios from 'axios';
import InputText from "../../../components/Input/InputText";
import DataTables from 'react-data-table-component';
import DataTable from '../../../components/Datatable/Datatables';
import BtnCancel from "../../../components/Button/BtnCancel";
import BtnAdd from "../../../components/Button/BtnAdd";
import Moment from 'moment';
import Card from 'react-bootstrap/Card';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import '../../../components/CSS/sale.css'
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import th from 'date-fns/locale/th';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useLocation, useParams } from 'react-router-dom';
import DataContextMenuActions from "../../../DataContext/DataContextMenuActions";
import PathRouter from "../../../PathRouter/PathRouter";
import Icon from '@mdi/react';
import DialogProduct from "../../../components/DialogProduct/DialogProduct";
import {
    mdiViewHeadline,  mdiTicketPercentOutline, mdiCellphoneSound, mdiCreditCardOutline,
    mdiTrayFull, mdiPrinterOutline, mdiFileCancelOutline } from '@mdi/js';


const customStyles = {
    headCells: {
        style: {
            background: '#F2F2F2',
            color: "#2F3A9E",
            minHeight: "0.5vh",
            maxHeight: "4vh",
            fontSize: "16px"
        },
    },
};


const DocumentSaleView = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const actions = useContext(DataContextMenuActions);
    const location = useLocation();
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [dataDocumentHead, setDataDocumentHead] = useState([])
    const [dataDocument, setDataDocument] = useState([])
    const [dataSalehd, setDataSalehd] = useState([])
    const [dataSaledtHead, setDataSaledtHead] = useState([])
    const [dataSaledt, setDataSaledt] = useState([])
    const [dataSaleCash, setDataSaleCash] = useState([])
    const [dataSaleVoucher, setDataSaleVoucher] = useState([])
    const [dataSaleTranfer, setDataSaleTranfer] = useState([])
    const [dataSaleCredit, setDataSaleCredit] = useState([])
    const [dataSalePartner, setDataSalePartner] = useState([])
    const [dataSaleChange, setDataSaleChange] = useState([])
    const [valueInput, setValueInput] = useState()
    const [salehdID, setSaledhID] = useState()
    const [openDialogbookBank, setOpenDialogbookbank] = useState(false)
    const [openDialogTranfer, setOpenDialogTranfer] = useState(false)
    const [openDialogCredit, setOpenDialogCredit] = useState(false)
    const [openDialogdetail, setOpenDialogdetail] = useState(false)
    const [openDialogCurrency, setOpenDialogCurrency] = useState(false)
    const [openDialogCashback, setOpenDialogCashback] = useState(false)
    const [openDialogPartner, setOpenDialogPartner] = useState(false)
    const [openDialogVoucher, setOpenDialogVoucher] = useState(false)
    const [openDialogConfirm, setOpenDialogConfirm] = useState(false)
    const [openDialogReason, setOpenDialogReason] = useState(false)
    const [openDialogDeposit, setOpenDialogDeposit] = useState(false)
    const [dataReason, setDataReason] = useState([])
    const [dataReasonSelect, setDataReasonSelect] = useState([])
    const [valueReason, setValueReason] = useState()
    const [status, setStatus] = useState()
    const [timer, setTimer] = useState(null)
    const [checkedCancle, setCheckedCancle] = useState()
    const [dataMenuAction, setDataMenuAction] = useState([])
    const [printTax, setPrintTax] = useState(true)
    const [dataDeposit, setDataDeposit] = useState([])
    const [docType,setDocType] = useState("credit")


    const columnsOrderDetail = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx +1,
            sortable: true,
            width: "50px"
        },
        {
            name: 'Barcode',
            selector: row => row.saledt_master_product_barcode_code,
            sortable: true,
            width: "220px"
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.saledt_master_product_billname,
            sortable: true,
            width: "200px"
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.saledt_master_product_barcode_unitname,
            sortable: true,
        },
        {
            name: 'จำนวน',
            selector: row => nf.format(row.saledt_qty),
            sortable: true,
            right: true
        },
        {
            name: 'ราคา',
            selector: row => nf.format(row.saledt_saleprice),
            sortable: true,
        },
        {
            name: 'ส่วนลด',
            selector: row => nf.format(row.saledt_discount_amnt),
            sortable: true,
            right: true
        },
        {
            name: 'มูลค่าต่อรายการ',
            selector: row => nf.format(row.saledt_netamnt),
            sortable: true,
            right: true
        },
        {
            name: 'คิดภาษี',
            selector: row =>
                row.saledt_vatflag === true ? <CheckIcon color="success" /> : <ClearIcon color="disabled" />,
            sortable: true,
        },
    ]

    const columnsdatabookbank = [
        {
            name: 'เลือก',
            selector: row => row,
            sortable: true,
        },
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
            selector: row => row.cq_bankbook_no,
            sortable: true,
        },
        {
            name: 'ชื่อบัญชี',
            selector: row => row.cq_bankbook_name,
            sortable: true,
        },
        {
            name: 'มูลค่าเงินโอนที่ได้รับ',
            selector: row => row.bank_booktransfer_ref_amnt,
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
        },
        {
            name: 'ประเภทการชาร์ท',
            selector: row => row.cq_cardtype_name,
            width: "200px",
            sortable: true
        },
        {
            name: 'วันที่เอกสาร',
            selector: row => row.datedocs,
            sortable: true,
        },
        {
            name: 'เลขบัตร (4 หลักสุดท้าย)',
            selector: row => row.cheq_cheqdata_rec_cardno,
            width: "300px",
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => row.cheq_cheqdata_rec_amount,
            sortable: true,
        },
        {
            name: 'Rate (%)',
            selector: row => row.cheq_cheqdata_rec_bankfeerate,
            sortable: true,
        },
        {
            name: 'ค่าธรรมเนียม',
            selector: row => row.cheq_cheqdata_rec_bankfeeamnt,
            sortable: true,
        },
        {
            name: 'ยอดรวมตัดบัตร',
            selector: row => row.cheq_cheqdata_rec_netamount,
            sortable: true,
        },
        {
            name: 'หมายเหตุ',
            selector: row => row.cheq_cheqdata_rec_remark,
            sortable: true,
        },
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
            selector: row => nf.format(row.salecash_cashamnt),
            sortable: true,
        },
        {
            name: 'Exchange',
            selector: row => row.master_currency_rate,
            sortable: true,
        },
        {
            name: 'มูลค่ารวม',
            selector: row => nf.format(row.salecash_netamnt),
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
            selector: row => row.salecash_cashamnt,
            sortable: true,
        },
        {
            name: 'Exchange',
            selector: row => nf.format(row.master_currency_rate),
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => nf.format(row.salecash_netamnt),
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
            selector: row => row.salepartner_netamnt,
            sortable: true,
        },
    ]


    const columnVoucher = [

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
            selector: row => row.salevoucher_docuno,
            sortable: true,
        },
        {
            name: 'มูลค่าเงินที่ได้รับ',
            selector: row => row.salevoucher_netamnt,
            sortable: true,
        },
    ]

    const columnReason = [
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}>
                <FormControlLabel style={{ color: "black" }}
                    control={
                        <Radio defaultChecked={row.defaultChecked} checked={row.defaultChecked}
                            value={row.salehd_cancel_reason_id}
                            onClick={(e) => { OnchangeCheckReason(e, row) }}
                        />} /> </div>
            ,
            width: '80px'
        },
        {
            name: 'เหตุผลในการยกเลิก',
            selector: row => row.salehd_cancel_reason_name,
            sortable: true,
        },
    ]

    const columnsdataDeposit = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => row.deposithd_docuno,
            sortable: true,
        },
        {
            name: 'วันที่เอกสาร',
            selector: row => row.docDate,
            sortable: true,
            width: '100px'
        },
        {
            name: 'มูลค่าเงินมัดจำ',
            selector: row => nf.format(row.deposithd_ref_totalamnt),
            sortable: true,
        },
        {
            name: 'มูลค่าที่ใช้',
            selector: row => nf.format(row.deposithd_ref_amnt),
            sortable: true,
        },
        {
            name: 'มูลค่าเหลือ',
            selector: row => nf.format(row.deposithd_ref_lastamnt),
            sortable: true,
        },
    ]


    useEffect(() => {
        getDataMenuAction()
        location.state.map((item, idx) => {
            setSaledhID(item.salehd_id)
            setStatus(item.status)
            setPrintTax(item.printtax)
            setDocType(item.doc_type)
        })
    }, [])

    useEffect(() => {
        if (salehdID >0) {
            getDataSaleHd()
            getDataSaleDt()
            getDataSaleCash()
            getDataSaleVoucher()
            getDataSaleTranfer()
            getDataSaleCredit()
            getDataSalePartner()
            getDataSaleChange()
            getReasonData()
            getDataMenuAction()
            getDataDeposit()
        }
    }, [salehdID])

    useEffect(() => {
        getOrderHead()
    }, [dataSaledt])

    useEffect(() => {
        getDialogReason()
    }, [valueReason])

    const getDataSaleHd = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_salehd', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let Str_y = parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543
                        item.dates = Moment(item.salehd_docudate).format("DD/MM/") + Str_y
                    })
                    setDataSalehd(res.data)
                }
            })
    }

    const getDataMenuAction = () => {
        const datas = {
            "master_company_id": parseInt(userData[0]['master_company_id']),
            "role_group_id": parseInt(userData[0]['role_group_id']),
            "master_menu_id": 196
        }
        axios.post(UrlApi() + 'get_role_group_menu_action', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        if (item.master_menu_action_id === 4) {
                            setDataMenuAction(item.role_group_menu_action_active)
                        }
                    })
                }
            })
    }

    const getDataDeposit = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_deposit_sale_doc', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let Str_y = parseInt(Moment(item.deposithd_docudate).format("YYYY")) + 543
                        item.docDate = Moment(item.deposithd_docudate).format("DD/MM/") + Str_y
                    })
                    setDataDeposit(res.data)
                }
            })
    }

    const getDataSaleDt = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_saledt', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.defaultExpanded = true
                    })
                    setDataSaledt(res.data)
                }
            })
    }

    const getOrderHead = () => {
        let groupdatas = _.groupBy(dataSaledt, 'saledt_orderhd_docuno')
        let datasname = []
        dataSaledt.map((item, idx) => {
            if (datasname.length > 0) {
                let finIndex = _.findIndex(datasname, { saledt_orderhd_docuno: item.saledt_orderhd_docuno })
                if (finIndex < 0) {
                    datasname.push(item)
                }
            } else if (groupdatas[item.saledt_orderhd_docuno]) {
                datasname.push(item)
            }
        })
        setDataSaledtHead(datasname)
    }

    const getDataSaleCash = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_salecash', datas)
            .then(res => {
                if (res.data) {
                    setDataSaleCash(res.data)
                }
            })
    }

    const getDataSaleVoucher = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_salevoucher', datas)
            .then(res => {
                if (res.data) {
                    setDataSaleVoucher(res.data)
                }
            })
    }

    const getDataSaleTranfer = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_saletranfer', datas)
            .then(res => {
                if (res.data) {
                    setDataSaleTranfer(res.data)
                }
            })
    }

    const getDataSaleCredit = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_salecredit', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let Str_y = parseInt(Moment(item.cheq_cheqdata_rec_docudate).format("YYYY")) + 543
                        item.datedocs = Moment(item.cheq_cheqdata_rec_docudate).format("DD/MM/") + Str_y

                    })
                    setDataSaleCredit(res.data)
                }
            })
    }

    const getDataSalePartner = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_salepartner', datas)
            .then(res => {
                if (res.data) {
                    setDataSalePartner(res.data)
                }
            })
    }

    const getDataSaleChange = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_salechange', datas)
            .then(res => {
                if (res.data) {
                    setDataSaleChange(res.data)
                }
            })
    }


    const onClickPrint = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_printsale', datas)
            .then(res => {
                if (res.data) {
                    if (res.data[0].fn_update_print_bill === true) {
                        setAlertMessages("สำเร็จ")
                        setAlertSuccess(true)
                    } else {
                        setAlertMessages("ผิดพลาด")
                        setAlerttWarning(true)
                    }
                }
            })
    }

    const onClickPrintTax = () => {
        const datas = {
            "salehd_id": parseInt(salehdID)
        }
        axios.post(UrlApi() + 'get_printsaletax', datas)
            .then(res => {
                if (res.data) {
                    if (res.data[0].fn_update_print_invoice === true) {
                        setAlertMessages("สำเร็จ")
                        setAlertSuccess(true)
                    } else {
                        setAlertMessages("ผิดพลาด")
                        setAlerttWarning(true)
                    }
                }

            })
    }

    const onCLickCancleDocument = () => {
        setOpenDialogConfirm(false)
        setOpenDialogReason(false)
        const datas = {
            "salehd_id": parseInt(salehdID),
            "em_id": parseInt(userData[0]['emp_employeemasterid']),
            "reason_id": parseInt(dataReasonSelect[0]['salehd_cancel_reason_id'])
        }
        axios.post(UrlApi() + 'update_cancel_sale', datas)
            .then(res => {
                if (res.data[0]['fn_update_cancel_sale'] === true) {
                    setAlertMessages("ยกเลิกสำเร็จ")
                    setAlertSuccess(true)

                    getTimeOutLocations()
                } else if (res.data[0]['fn_update_cancel_sale'] === false) {
                    setAlertMessages("ผิดพลาด")
                    setAlerttWarning(true)
                }
            })
    }

    const getReasonData = () => {
        let datas = {
            "company_id": parseInt(userData[0]['master_company_id'])
        }
        axios.post(UrlApi() + 'get_cancel_reason', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.defaultChecked = false
                    })
                    setDataReason(res.data)
                }
            })
    }

    const getTimeOutLocations = () => {
        setTimer(setTimeout((window.location = `${PathRouter()}/main/document/salehd`), 6000))
        clearTimeout(timer)
    }

    const OnchangeCheckReason = (e, row) => {
        dataReason.map((item, idx) => {
            if (item.salehd_cancel_reason_id === row.salehd_cancel_reason_id) {
                item.defaultChecked = true
                setDataReasonSelect([item])
            } else {
                item.defaultChecked = false
            }
        })
        setValueReason(e)
        setDataReason(dataReason)

    }

    const getDataDocument = () => {
        return (
            <Card className="card_sale" style={{ minHeight: "20vh", maxHeight: "20vh", fontSize: "16px" }}>
                <div className="card_head" ><p className="textH_Left">ข้อมูลเอกสาร</p></div>
                <Card.Body className="card_body_doc" >
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                        <div class="row" style={{ marginTop: "1%" }}>
                            <div class="col-3">
                                <p className="text_sale">วันที่เอกสาร</p>
                                <p className="text_sale" style={{ height: "3vh" }}> {dataSalehd.length > 0 ? dataSalehd[0]['dates'] : ""}</p>
                                <p className="text_sale">รายละเอียดกลุ่มลูกค้า</p>
                                <InputText style={{ height: "3vh" }} type="text" value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_arcustomer_addr'] : null} disabled />
                            </div>
                            <div class="col-3">
                                <p className="text_sale">เลขที่เอกสาร</p>
                                <InputText type="text" style={{ height: "3vh" }} value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_docuno'] : null} disabled />
                                <p className="text_sale" >หมายเหตุ</p>
                                <InputText type="text" style={{ width: "90%", height: "3vh" }} value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_remark'] : null} disabled />
                            </div>
                            <div class="col-3">
                                <p className="text_sale">กลุ่มลูกค้า</p>
                                <InputText style={{ width: "85%", height: "3vh" }} type="text" value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_arcustomer_name'] : null} disabled />
                            </div>
                            <div class="col-3">
                                <p className="text_sale">ผู้บันทึกรายการ</p>
                                <InputText style={{ height: "3vh" }} type="text" value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_empemployeemastercode'] : null} disabled />
                            </div>
                        </div>
                    </LocalizationProvider>
                </Card.Body>
            </Card>)
    }

    const getDataTableOrderTB = () => {
        return (<Card className="card_sale" style={{ minHeight: "32vh", maxHeight: "46vh", marginTop: "1%" }}>
            <div className="card_head" ><p className="textH_Left">รายละเอียดการขาย</p></div>
            <Card.Body className="card_body_doc">
                <div style={{ minHeight: "30vh", maxHeight: "45vh", overflow: 'auto' }}>
                    <DataTables
                        striped
                        dense
                        customStyles={customStyles}
                        data={dataSaledt}
                        columns={columnsOrderDetail}
                    />
                </div>
            </Card.Body>
        </Card>
        )
    }

    const getDataDetail = () => {
        return (
            <div>
                <div class="row">
                    <div class="col-5">
                        <Card className="card_sale" style={{ minheight: "32vh", maxheight: "32vh", marginTop: "2%", fontSize: "1vw" }}>
                            <div className="card_head"> <p className="textH_Left">รายละเอียดสะสมคะแนน</p></div>
                            <Card.Body className="card_body_doc">
                                <p className="text_sale">ลูกค้าสะสมคะแนน</p>
                                <div class="row">
                                    <div class="col-6">
                                        <InputText type="text"  style={{ height: "3vh" }} value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_arcustomer_redeemcode'] : null} disabled />
                                    </div>
                                    <div class="col-6">
                                        <InputText type="text"  style={{ height: "3vh" }}  value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_arcustomer_redeemname'] : null} disabled />
                                    </div>
                                </div>
                                <p className="text_sale" style={{ marginTop: "1%" }}>คะแนนจากยอดซื้อสินค้าครั้งนี้</p>
                                <InputText type="text"   style={{ height: "3vh" }}  value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_point_quantity'] : null} disabled />
                                <p className="text_sale" style={{ marginTop: "1%" }}>ใช้แลกคะแนนครั้งนี้</p>
                                <InputText type="text"   style={{ height: "3vh" }}  value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_point_redeem'] : null} disabled />
                            </Card.Body>
                        </Card>
                    </div>
                    <div class="col-7">
                        <Card className="card_sale" style={{ minheight: "32vh", maxheight: "32vh", marginTop: "1%", fontSize: "16px" }}>
                            <div className="card_head">    <p className="textH_Left">รายละเอียดการคำนวณ</p></div>
                            <Card.Body className="card_body_doc">
                                <div class="row">
                                    <div class="col-4">
                                        <span>
                                            <p className="text_sale" style={{ marginTop: "1%" }}>เงินมัดจำ</p>
                                            <InputText type="text" style={{ height: "3vh", width: "80%" }} value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_depositamnt'] : null} disabled />
                                            <BtnAdd style={{ height: "3vh", position: "absolute", background: "#74E0C0" }} onClick={() => setOpenDialogDeposit(true)}  icons={<Icon path={mdiViewHeadline} size={1} />} />
                                        </span>
                                        <p className="text_sale"  style={{ marginTop: "1%" }}>หัก ณ ที่จ่าย</p>
                                        <InputText type="text"    style={{ height: "3vh" }}  value={dataSalehd.length > 0 ? dataSalehd[0]['wht_category_name'] : null} disabled />
                                        <p className="text_sale"  style={{ marginTop: "1%" }}>แลกคะแนน</p>
                                        <InputText type="text"    style={{ height: "3vh" }}  value={dataSalehd.length > 0 ? dataSalehd[0]['promotion_point_type_name'] : null} disabled />
                                    </div>
                                    <div class="col-4">
                                        <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มส่วนลด</p>
                                        <InputText type="text"  style={{ height: "3vh" }} value={dataSalehd.length > 0 ? dataSalehd[0]['salehd_discount_type_name'] : null} disabled />
                                        <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มภาษี</p>
                                        <InputText type="text"   style={{ height: "3vh" }}   value={dataSalehd.length > 0 ? dataSalehd[0]['master_vat_group_name'] : null} disabled />
                                        <p className="text_sale" style={{ marginTop: "1%" }}>ค่าบริการ (10%)</p>
                                        <InputText type="text"   style={{ height: "3vh" }}   value={dataSalehd.length > 0 ? nf.format((parseFloat(dataSalehd[0]['salehd_service_chargeamnt']) + parseFloat(dataSalehd[0]['salehd_service_chargeamnt_takeaway']))) : null} disabled />
                                    </div>
                                    <div class="col-4">
                                        <p className="text_sale"  style={{ marginTop: "1%" }}>รวมมูลค่าสินค้า</p>
                                        <InputText type="text"    style={{ height: "4vh" }}  value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_sumgoodamnt']) : null} disabled />
                                        <p className="text_sale"  style={{ marginTop: "1%" }}>มูลค่าสุทธิ</p>
                                        <InputText type="text"    style={{ height: "4vh", fontSize: "1.5vw" }} value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_netamnt']) : null} disabled />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    const getPaymentDetail = () => {
        return (
            <Card className="card_sale" style={{ height: "90vh" }}>
                <div className="card_head"> <p className="textH_Left">รายละเอียดการชำระ</p></div>
                <Card.Body className="card_body_doc">
                    <div class="row">
                        <div class="col-2">
                            <BtnAdd style={{ marginTop: "2vh", width: "42%", height: "6vh", position: "absolute" }} message="Voucher"  icons={<Icon path={mdiTicketPercentOutline} size={1} />} onClick={() => setOpenDialogVoucher(true)}/>
                            <BtnAdd style={{ marginTop: "10vh", width: "42%", height: "6vh", position: "absolute" }} message="เงินโอน"   icons={<Icon path={mdiCellphoneSound} size={1} />}  onClick={() => setOpenDialogTranfer(true)}/>
                            <BtnAdd style={{ marginTop: "18vh", width: "42%", height: "6vh", position: "absolute" }} message="บัตรเครดิต" icons={<Icon path={mdiCreditCardOutline} size={1} />}  onClick={() => setOpenDialogCredit(true)}/>
                            {dataSaleCash.length > 1 ?
                                <BtnAdd style={{ marginTop: "52%", width: "40%", height: "6vh", position: "absolute" }} message="เงินสดที่ได้รับ" onClick={() => setOpenDialogCurrency(true)}/>
                                : <Card className="card_btn_pay" style={{ marginTop: "26vh", width: "400%" }}>  <p style={{ marginTop: "10%" }}><strong>เงินสดที่ได้รับ</strong></p> </Card>
                            }
                            <Card className="card_btn_pay" style={{ marginTop: "2vh", width: "400%" }}><p style={{ marginTop: "10%" }}><strong>เงินสด</strong></p></Card>
                            <Card className="card_btn_pay" style={{ marginTop: "2vh", width: "400%" }}><p style={{ marginTop: "10%" }}><strong> ทิป </strong></p></Card>
                            {dataSaleChange.length > 1 ?
                                <BtnAdd style={{ marginTop: "20px", width: "90%", fontSize: "1vw", height: "5vh" }}
                                    message="เงินทอน" onClick={() => setOpenDialogCashback(true)}/>
                                : <Card className="card_btn_pay" style={{ marginTop: "2vh", width: "400%" }} > <p style={{ marginTop: "10%" }}><strong>เงินทอน</strong></p></Card>
                            }
                        </div>
                        <div class="col-10">
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text"   value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_voucheramnt']) : 0.00} disabled />
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text"   value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_transferamnt']) : 0.00} disabled />
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text"   value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_creditcardamnt']) : 0.00} disabled />
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text"   value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_cashamnt_actual']) : 0.00} disabled />
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text"   value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_cashamnt']) : 0.00} disabled />
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="number" value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_tipamnt']) : 0.00} disabled />
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text"   value={dataSalehd.length > 0 ? nf.format(dataSalehd[0]['salehd_changeamnt']) : 0.00} disabled />
                        </div>
                    </div>
                    <div>
                        <div class="row" style={{ marginTop: "3vh" }}>
                            <div class="col-6">
                                <BtnAdd style={{ height: "5vh", width: "100%",height: "6vh", }} icons={<Icon path={mdiPrinterOutline} size={1} />} onClick={() => onClickPrint()} message="พิมพ์ใบแจ้งหนี้"/>
                            </div>
                            <div class="col-6">
                                <Button style={{
                                    background: printTax === true ? "grey" : "#0064b0", color: "white", borderRadius: "8px",
                                    height: "6vh",  width: "95%", 
                                }}
                                    onClick={() => onClickPrintTax()} disabled={printTax}>
                                    <Icon path={mdiTrayFull} size={1} style={{marginRight:"10px"}}/>
                                    {' '} ออกใบกำกับภาษี พิมพ์ {dataSalehd.length > 0 ? dataSalehd[0].salehd_print_taxinvoice_language === 1 ? "ไทย"
                                        : dataSalehd[0].salehd_print_taxinvoice_language === 2 ? "อังกฤษ" : "" : ""
                                    }</Button>
                            </div>
                        </div>
                        {dataMenuAction === true ?
                            <Button style={{ background: "#FD6F88", color: "white", width: "98%", height: "6vh", marginTop: "3%", borderRadius: "8px", fontSize: "1.5vw"}}
                                onClick={() => setOpenDialogReason(true)} disabled={status === 1 ? false : true} >
                                <Icon path={mdiFileCancelOutline} size={2} style={{ marginRight: "10px" }}/> ยกเลิกเอกสาร</Button>
                            : <></>
                        }
                    </div>
                </Card.Body>
            </Card>
        )
    }

    const getDialogTranfer = () => {
        if (dataSaleTranfer.length > 0) {
            dataSaleTranfer.map((item, idx) => { item.row_num = idx + 1 })
        }
        return <Dialog open={openDialogTranfer} maxWidth="1000px" >
            <DialogTitle >
                <p>รายละเอียดการชำระเงินโอน</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1000px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogTranfer(!openDialogTranfer)}>x</button>
                <div>
                    <DataTable
                        columns={columnbankTranfer}
                        data={dataSaleTranfer}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogTranfer(!openDialogTranfer)} message="ปิด" />
            </DialogActions>
        </Dialog>
    }

    const getDialogCurrency = () => {
        if (dataSaleCash.length > 0) {
            dataSaleCash.map((item, idx) => { item.row_num = idx + 1 })
        }
        return <Dialog open={openDialogCurrency} maxWidth="1000px" >
            <DialogTitle >
                <p>รายละเอียดการชำระเงินสด</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }} >
                <button type="button" className="cancel" onClick={() => setOpenDialogCurrency(!openDialogCurrency)}>x</button>
                <div>
                    <DataTable
                        columns={columnCurrency}
                        data={dataSaleCash}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogCurrency(!openDialogCurrency)} message="ปิด" />
            </DialogActions>
        </Dialog>
    }
    const getDialogCredit = () => {
        if (dataSaleCredit.length > 0) {
            dataSaleCredit.map((item, idx) => { item.row_num = idx + 1 })
        }
        return <Dialog open={openDialogCredit} maxWidth="1000px">
            <DialogTitle >
                <p>รายละเอียดการชำระบัตรเครดิต</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1000px" }} >
                <button type="button" className="cancel" onClick={() => setOpenDialogCredit(!openDialogCredit)}>x</button>
                <div>
                    <DataTable
                        columns={columnbankCredit}
                        data={dataSaleCredit}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogCredit(!openDialogCredit)} message="ปิด" />
            </DialogActions>
        </Dialog>
    }

    const getDialogCashback = () => {
        if (dataSaleChange.length > 0) {
            dataSaleChange.map((item, idx) => { item.row_num = idx + 1 })
        }
        return (<Dialog open={openDialogCashback} maxWidth="600px" >
            <DialogTitle >
                <p>เงินทอน</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogCashback(!openDialogCashback)}>x</button>
                <DataTable
                    columns={columnCurrencyCashback}
                    data={dataSaleChange} />
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogCashback(!openDialogCashback)} message="ปิด" />
            </DialogActions>
        </Dialog>)
    }

    const getDialogPartner = () => {
        if (dataSalePartner.length > 0) {
            dataSalePartner.map((item, idx) => { item.row_num = idx + 1 })
        }
        return (<><Dialog open={openDialogPartner} maxWidth="1000px" >
            <DialogTitle >
                <p>เครดิตสินเชื่อ</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1000px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogPartner(!openDialogPartner)}>x</button>
                <DataTable
                    columns={columnPartner}
                    data={dataSalePartner} />
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogPartner(!openDialogPartner)} message="ปิด" />
            </DialogActions>
        </Dialog>
        </>
        )
    }

    const getDialogVoucher = () => {
        dataSaleVoucher.map((item, idx) => { item.row_num = idx + 1 })
        return (<Dialog open={openDialogVoucher} maxWidth="600px" >
            <DialogTitle >
                <p>Voucher</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogVoucher(!openDialogVoucher)}>x</button>
                <DataTable
                    columns={columnVoucher}
                    data={dataSaleVoucher} />
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogVoucher(!openDialogVoucher)} message="ปิด" />
            </DialogActions>
        </Dialog>
        )
    }

    const getDialogConfirm = () => {
        return (<Dialog open={openDialogConfirm} maxWidth="600px" >
            <DialogTitle >
                <p>ยกเลิกเอกสาร</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogConfirm(!openDialogConfirm)}>x</button>
                <div class="row">
                    <div class="col-4"> <p>ต้องการยกเลิกเอกสาร </p> </div>
                    <div class="col">
                        <p > <strong >{dataSalehd.length > 0 ? dataSalehd[0]['salehd_docuno'] : ""}</strong> </p>
                    </div>
                    <p><strong>เนื่องจาก </strong> {dataReasonSelect.length > 0 ? dataReasonSelect[0]['salehd_cancel_reason_name'] : ""}</p>
                </div>
            </DialogContent>
            <DialogActions>
                <span><Button style={{ background: "#0064b0", color: "white", borderRadius: "8px", fontFamily: "Kanit" }} onClick={() => onCLickCancleDocument()} >ตกลง</Button> </span>
                <BtnCancel onClick={() => setOpenDialogConfirm(!openDialogConfirm)} message="ปิด" />
            </DialogActions>
        </Dialog>
        )
    }

    const getDialogReason = () => {
            return (<><Dialog open={openDialogReason} maxWidth="1000px" >
                <DialogTitle >
                    <p> เหตุผลในการยกเลิก</p>
                </DialogTitle>
                <DialogContent dividers='paper' style={{ width: "1000px" }}>
                    <button type="button" className="cancel" onClick={() => setOpenDialogReason(!openDialogReason)}>x</button>
                    <DataTable
                        columns={columnReason}
                        data={dataReason} />
                </DialogContent>
                <DialogActions>
                    <span> <Button style={{ background: "#0064b0", color: "white", borderRadius: "8px", fontFamily: "Kanit" }} onClick={() => onClickConfirmReason()} >ตกลง</Button></span>
                    <BtnCancel onClick={() => setOpenDialogReason(!openDialogReason)} message="ปิด" />
                </DialogActions>
                {getAlert()}
            </Dialog>
            </>)
    }

    const getDialogDeposit = () => {
        return (
            <Dialog open={openDialogDeposit} maxWidth="1000px" >
                <DialogTitle >เงินมัดจำ</DialogTitle>
                <DialogContent dividers='paper' style={{ width: "900px" }}>
                    <button type="button" className="cancel" onClick={() => setOpenDialogDeposit(false)}>x</button>
                    <div>
                        <DataTable
                            columns={columnsdataDeposit}
                            data={dataDeposit}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <BtnCancel onClick={() => setOpenDialogDeposit(false)} message="ปิด" />
                </DialogActions>
            </Dialog>
        )
    }

    const onClickConfirmReason = () => {
        if (dataReasonSelect.length > 0) {
            setOpenDialogConfirm(true)
        } else {
            setAlertMessages("กรุณาเลือกเหตุผลในการยกเลิกเอกสาร")
            setAlerttWarning(true)
        }
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
                  <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    return (<div>
        {getDialogTranfer()}
        {getDialogCredit()}
        {getDialogCurrency()}
        {getDialogCashback()}
        {getDialogPartner()}
        {getDialogVoucher()}
        {getAlert()}
        {getDialogConfirm()}
        {getDialogReason()}
        {getDialogDeposit()}
        <div style={{ marginRight: "1%", marginLeft: "1%", marginTop: "10px" }}>
            <div class="row">
                <div class={docType === "cash" ? "col-9" : "col-12"} >
                    {getDataDocument()}
                    {getDataTableOrderTB()}
                    {getDataDetail()}
                </div>
                {docType === "cash" ?
                    <div class="col">
                    {getPaymentDetail()}
                </div>
                    : <></> }
            </div>
        </div>

    </div>)

}

export default memo(DocumentSaleView);