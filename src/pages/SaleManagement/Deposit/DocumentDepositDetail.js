import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import InputText from "../../../components/Input/InputText";
import DataTables from 'react-data-table-component';
import DataTable from '../../../components/Datatable/Datatables';
import BtnAdd from "../../../components/Button/BtnAdd";
import BtnCancel from "../../../components/Button/BtnCancel";
import Moment from 'moment';
import Card from 'react-bootstrap/Card';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import '../../../components/CSS/report.css';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import th from 'date-fns/locale/th';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import SearchDialog from "../../../components/SearchDialog/SearchDialog";
import { useLocation, useParams } from 'react-router-dom';
import PathRouter from "../../../PathRouter/PathRouter";
import Icon from '@mdi/react';
import {
    mdiTicketPercentOutline, mdiCellphoneSound, mdiCreditCardOutline,
    mdiTrayFull, mdiPrinterOutline, mdiContentSaveCheckOutline
} from '@mdi/js';

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

const DocumentDepositDetail = () => {
    const userData = useContext(DataContext);
    const location = useLocation();
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const [alertMessages, setAlertMessages] = useState("")
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertWarning, setAlerttWarning] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogCredit, setOpenDialogCredit] = useState(false)
    const [openDialogTranfer, setOpenDialogTranfer] = useState(false)
    const [dataReason, setDataReason] = useState([])
    const [dataReasonSelect, setDataReasonSelect] = useState([])
    const [dataDepositHD, setDataDepositHD] = useState([])
    const [dataDepositDT, setDataDepositDT] = useState([])
    const [dataDepositTranfer, setDataDepositTranfer] = useState([])
    const [dataDepositCredit, setDataDepositCredit] = useState([])
    const [status, setStatus] = useState(1)
    const [valueReason, setValueReason] = useState()
    const [depositHDID, setDepositHDID] = useState()
    const [checkedCancle, setCheckedCancle] = useState(true)
    const [checkCredit, setCheckCredit] = useState(false)
    const [openDialogReason, setOpenDialogReason] = useState(false)
    const [dataMenuAction, setDataMenuAction] = useState(false)
    const [openDialogConfirm, setOpenDialogConfirm] = useState(false)
    const [timer, setTimer] = useState(null)
    const dataAPI = {
        "depositHD_id": depositHDID
    }

    const columnsdataDeposit = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            width: "80px"
        },
        {
            name: 'Barcode',
            selector: row => row.depositdt_barcode,
            sortable: true,
        },
        {
            name: 'ชื่อ',
            selector: row => row.depositdt_master_product_billname,
            sortable: true,
        },
        {
            name: 'ชื่อใบแจ้งหนี้',
            selector: row => row.depositdt_master_product_invoice_name,
            sortable: true,
            // width: "190px"
        },
        {
            name: 'จำนวน/หน่วย',
            selector: row => nf.format(row.depositdt_qty),
            sortable: true,
        },
        {
            name: 'หน่วย',
            selector: row => row.depositdt_master_product_barcode_unitname,
            sortable: true,
        },
        {
            name: 'ราคา',
            selector: row => nf.format(row.depositdt_saleprice),
            sortable: true,
        },
        {
            name: 'มูลค่าสุทธิ',
            selector: row => nf.format(row.depositdt_netamnt),
            sortable: true,
        },
    ]

    const columnbankTranfer = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx +1 ,
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
            width: '200px'
        },
        {
            name: 'มูลค่าเงินโอนที่ได้รับ',
            selector: row => nf.format(row.bank_booktransfer_ref_amnt),
            sortable: true,
        },
    ]

    const columnbankCredit = [
        {
            name: 'ลำดับ',
            selector: (row,idx) => idx +1 ,
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
            selector: row  => row.cq_cardtype_name,
            width: "200px",
            sortable: true
        },
        {
            name: 'เลขบัตร (4 หลักสุดท้าย)',
            selector: row => row.cheq_cheqdata_rec_cardno,
            width: "300px",
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => nf.format(row.cheq_cheqdata_rec_amount),
            sortable: true,
        },
        {
            name: 'Rate (%)',
            selector: row => row.cheq_cheqdata_rec_bankfeerate,
            sortable: true,
        },
        {
            name: 'ค่าธรรมเนียม',
            selector: row => nf.format(row.cheq_cheqdata_rec_bankfeeamnt),
            sortable: true,
        },
        {
            name: 'ยอดรวมตัดบัตร',
            selector: row => nf.format(row.cheq_cheqdata_rec_netamount),
            sortable: true,
        },
        {
            name: 'หมายเหตุ',
            selector: row => row.cheq_cheqdata_rec_remark,
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

    useEffect(() => {
        getDataMenuAction()
        location.state.map((item, idx) => {
            setDepositHDID(item.deposithd_id)
            setStatus(item.status)
        })
    }, [])

    useEffect(() => {
        if (depositHDID > 0) {
            getDataDocumentDetailHD()
            getDataDocumentDetailDT()
            getDataDepositTranfer()
            getDataDepositCreditCard()
        }
    }, [depositHDID])

    const getDataMenuAction = () => {
        const datas = {
            "master_company_id": parseInt(userData[0]['master_company_id']),
            "role_group_id": parseInt(userData[0]['role_group_id']),
            "master_menu_id": 428
        }
        axios.post(UrlApi() + 'get_role_group_menu_action', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        if (item.master_menu_action_id == 4) {
                            setDataMenuAction(item.role_group_menu_action_active)
                        }
                    })
                }
            })
    }

    const getDataDocumentDetailHD = () => {
        axios.post(UrlApi() + 'get_depositHD', dataAPI)
            .then(res => {
                if (res.data) {
                    setDataDepositHD(res.data)
                }
            })
    }

    const getDataDocumentDetailDT = () => {
        axios.post(UrlApi() + 'get_depositDT', dataAPI)
            .then(res => {
                if (res.data) {
                    setDataDepositDT(res.data)
                }
            })
    }

    const getDataDepositTranfer = () => {
        axios.post(UrlApi() + 'get_deposittransfer', dataAPI)
            .then(res => {
                if (res.data) {
                    setDataDepositTranfer(res.data)
                }
            })
    }

    const getDataDepositCreditCard = () => {
        axios.post(UrlApi() + 'get_depositcreditcard', dataAPI)
            .then(res => {
                if (res.data) {
                    setDataDepositCredit(res.data)
                }
            })
    }

    const onClickPrint = () => {
        axios.post(UrlApi() + 'update_deposit_print_bill', dataAPI)
            .then(res => {
                if (res.data[0]['fn_update_deposit_print_bill'] == true) {
                    setAlertMessages("สำเร็จ")
                    setAlertSuccess(true)
                } else {
                    setAlertMessages("ผิดพลาด")
                    setAlerttWarning(true)
                }
            })
    }

    const OnchangeCheckReason = (e, row) => {
        dataReason.map((item, idx) => {
            if (item.salehd_cancel_reason_id == row.salehd_cancel_reason_id) {
                item.defaultChecked = true
                setDataReasonSelect([item])
            } else {
                item.defaultChecked = false
            }
        })
        setValueReason(e)
        setDataReason(dataReason)
    }

    const onClickConfirmReason = () => {
        if (dataReasonSelect.length > 0) {
            setOpenDialogConfirm(true)
        } else {
            setAlertMessages("กรุณาเลือกเหตุผลในการยกเลิกเอกสาร")
            setAlerttWarning(true)
        }
    }

    const onCLickCancleDocument = () => {
          dataAPI.employee_id = parseInt(userData[0]['emp_employeemasterid'])
          axios.post(UrlApi() + 'cancel_deposit_document', dataAPI)
            .then(res => {
                if (res.data[0]['fn_update_cancel_deposit'] == true) {
                    setAlertMessages("ยกเลิกสำเร็จ")
                    setAlertSuccess(true)
                    getTimeOutLocations()
                } else {
                    setAlertMessages("ผิดพลาด")
                    setAlerttWarning(true)
                }
          })
    }

    const getTimeOutLocations = () => {
        setTimer(setTimeout((window.location = `${PathRouter()}/main/document/deposit`), 60000))
        clearTimeout(timer)
    }

    const getSumdataDeposit = () => {
        dataDepositDT.map((item, idx) => {
            item.depositdt_saleprice = item.depositdt_saleprice ? parseFloat(item.depositdt_saleprice) : 0
            item.depositdt_netamnt = item.depositdt_netamnt ? parseFloat(item.depositdt_netamnt) : 0
        })
        let SumPrice = _.sumBy(dataDepositDT, 'depositdt_saleprice');
        let SumTotal = _.sumBy(dataDepositDT, 'depositdt_netamnt');
        return (<>
            <div class="row" style={{ marginLeft: "60%", marginTop: "1%" }}>
                <div class="col-3">
                    <p>รวม</p>
                </div>
                <div class="col-3">
                    <p>{nf.format(SumPrice)}</p>
                </div>
                <div class="col-3">
                    <p>{nf.format(SumTotal)}</p>
                </div>
            </div>
        </>)
    }

    const getDataSummaryTranfer = () => {
        dataDepositTranfer.map((item, idx) => {
            item.amount_tranfer = item.bank_booktransfer_ref_amnt ? parseFloat(item.bank_booktransfer_ref_amnt) : 0
        })
        var sumTranfer = _.sumBy(dataDepositTranfer, 'amount_tranfer');
        return (<div style={{ marginTop: "5%", marginLeft: "45%" }}>
            <div class="row">
                <div class="col"><p><strong>รวม</strong></p></div>
                <div class="col"><p>{nf.format(sumTranfer)}</p></div>
            </div>
        </div>)
    }

    const getDataSummaryCredit = () => {
        dataDepositCredit.map((item, idx) => {
            item.amount_credits = item.cheq_cheqdata_rec_netamount ? parseFloat(item.cheq_cheqdata_rec_netamount) : 0
            item.vat_credit = item.cheq_cheqdata_rec_bankfeeamnt ? parseFloat(item.cheq_cheqdata_rec_bankfeeamnt) : 0
        })
        let sumamount = _.sumBy(dataDepositCredit, 'amount_credits');
        let sumVat = _.sumBy(dataDepositCredit, 'vat_credit');
        let sumCredit = parseFloat(sumamount) + parseFloat(sumVat)
        return (<div style={{ marginTop: "1%", marginLeft: "80%" }}>
            <div class="row">
                <div class="col-2"><p><strong>รวม</strong></p></div>
                <div class="col-4"><p>{nf.format(sumCredit)}</p></div>
            </div>
        </div>)
    }

    const getDataDocument = () => {
        if (dataDepositHD.length > 0) {
            let Years = parseInt(Moment(dataDepositHD[0]['deposithd_docudate']).format("YYYY")) + 543
            let datas = Moment(dataDepositHD[0]['deposithd_docudate']).format('DD/MM/') + Years
            let YearsUse = parseInt(Moment(dataDepositHD[0]['deposithd_dateused']).format("YYYY")) + 543
            let datasUse = Moment(dataDepositHD[0]['deposithd_dateused']).format('DD/MM/') + YearsUse
            return (
                <Card className="card_sale" style={{ minHeight: "26vh", maxHeight: "28vh", fontSize: "1vw" }}>
                    <div className="card_head" ><p className="textH_Left">ข้อมูลเอกสาร</p></div>
                    <Card.Body className="card_body_doc">
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                            <div class="row" style={{ marginTop: "1%" }}>
                                <div class="col-3">
                                    <p className="text_sale">วันที่เอกสาร</p>
                                    <p className="text_sale" style={{ height:"40px" }}>{datas} </p>
                                    <p className="text_sale">วันที่มาใช้บริการ</p>
                                    <InputText type="text" value={datasUse} disabled />
                                </div>
                                <div class="col-3">
                                    <p className="text_sale">เลขที่เอกสาร</p>
                                    <InputText style={{ height: "4vh" }} type="text" value={dataDepositHD[0]['deposithd_docuno']} disabled />
                                    <p className="text_sale">ผู้บันทึกรายการ</p>
                                    <InputText style={{ height: "4vh" }} type="text" value={userData[0]['user_name'] + ':' + userData[0]['firstname'] + ' ' + userData[0]['lastname']} disabled />
                                </div>
                                <div class="col-3">
                                    <p className="text_sale">กลุ่มลูกค้า</p>
                                    <InputText style={{ height: "4vh" }} type="text" value={dataDepositHD[0]['deposithd_arcustomer_name']} disabled />
                                    <p className="text_sale">หมายเหตุ</p>
                                    <InputText type="text" style={{ width: "90%", height: "4vh" }} value={dataDepositHD[0]['deposithd_remark']} disabled />
                                </div>
                                <div class="col-3">
                                    <p className="text_sale">รายละเอียดกลุ่มลูกค้า</p>
                                    <InputText style={{ height: "4vh" }} type="text" value={dataDepositHD[0]['deposithd_arcustomer_addr']} disabled />
                                </div>
                            </div>
                        </LocalizationProvider>
                    </Card.Body>
                </Card>
                )
        }
    }

    const getDataTableOrderTB = () => {
        return (
            <Card className="card_sale" style={{ minHeight: "34vh", maxHeight: "40vh", marginTop: "1%" }}>
                <div className="card_head"> <p className="textH_Left">รายละเอียดรายการเงินมัดจำ</p></div>
                <Card.Body className="card_body_doc">
                    <div style={{ marginTop: "1%", minHeight: "15vh", maxHeight: "30vh", overflow: 'auto' }}>
                        <DataTables
                            striped
                            dense
                            customStyles={customStyles}
                            data={dataDepositDT}
                            columns={columnsdataDeposit}
                        />
                    </div>
                    {/*dataDepositDT.length > 0 ? getSumdataDeposit() : <></>*/}
                </Card.Body>
            </Card>
        )
    }

    const getDataDetail = () => {
        if (dataDepositHD.length > 0) {
            return (
                <Card className="card_sale" style={{ height: "26vh", marginTop: "1%", fontSize: "1vw" }}>
                    <div className="card_head"> <p className="textH_Left">รายละเอียดการคำนวณ</p></div>
                    <Card.Body className="card_body_doc">
                        <div class="row">
                            <div class="col-4">
                                <p className="text_sale">กลุ่มภาษี</p>
                                <InputText style={{ height: "4vh" }} type="text" value={dataDepositHD[0]["master_vat_group_name"]} disabled />
                            </div>
                            <div class="col-4">
                                <p className="text_sale">รวมมูลค่าสินค้า</p>
                                <InputText style={{ height: "4vh" }} type="text" value={nf.format(dataDepositHD[0]["deposithd_sumgoodamnt"])} disabled />
                            </div>
                            <div class="col-4">
                                <p className="text_sale">มูลค่าสุทธิ</p>
                                <InputText style={{ height: "6vh", fontSize: "1.5vw" }} type="text" value={nf.format(dataDepositHD[0]["deposithd_netamnt"])} disabled />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )
        }
    }

    const onCLickTranferbookbank = () => {
        setCheckCredit(false)
        setOpenDialogTranfer(true)
    }

    const onCLickCrditbookbank = () => {
        setCheckCredit(true)
        setOpenDialogCredit(true)
    }

    const getPaymentDetail = () => {
        if (dataDepositHD.length > 0) {
            return (
                <Card className="card_sale" style={{ height: "90vh" }}>
                    <div className="card_head"><p className="textH_Left">รายละเอียดการชำระ</p></div>
                    <Card.Body className="card_body_doc">
                        <div class="row">
                            <div class="col-2">
                                <BtnAdd style={{ marginTop: "2vh", width: "42%", height: "6vh", position: "absolute" }} icons={<Icon path={mdiCellphoneSound} size={1} />}  onClick={() => onCLickTranferbookbank()} message="เงินโอน"/>
                                <BtnAdd style={{ marginTop: "10vh", width: "42%", height: "6vh", position: "absolute" }} message="บัตรเครดิต" icons={<Icon path={mdiCreditCardOutline} size={1} />}    onClick={() => onCLickCrditbookbank()}/>
                                <Card className="card_btn_pay" style={{ marginTop: "18vh", width: "400%" }}>
                                    <p style={{ marginTop: "5%"}}><strong> เงินสด</strong></p>
                                </Card>
                            </div>
                            <div class="col-10">
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }}  type="text" value={dataDepositHD[0]['deposithd_transferamnt']} disabled />
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text" value={dataDepositHD[0]['deposithd_creditcardamnt']} disabled />
                                <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="number" value={dataDepositHD[0]['deposithd_cashamnt']} disabled />
                            </div>
                        </div>
                        <div>
                            <div style={{ marginTop: "10%" }}>
                                <BtnAdd style={{ height: "6vh", marginTop: "1%", width: "95%", fontSize: "1vw", marginLeft: "2%"  }}
                                    message={"ปริ้นใบมัดจำ"}  icons={<Icon path={mdiTrayFull} size={1} />} onClick={() => onClickPrint()}
                                />
                                {dataMenuAction == true ?
                                    <Button style={{ background: "#FD6F88", color: "white", width: "98%", height: "6vh", marginTop: "3%", borderRadius: "8px", fontSize: "1.5vw" }}
                                        onClick={() => onCLickCancleDocument()} disabled={status == 1 ? false : true} >
                                        ยกเลิกเอกสาร</Button>
                                    : <></>
                                }
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )
        }
    }

    const getDialogCredit = () => {
        return <Dialog open={openDialogCredit} maxWidth="1000px">
            <DialogTitle >
                <p>รายละเอียดการชำระบัตรเครดิต</p>
            </DialogTitle>
            <DialogContent dividers='paper'  >
                <button type="button" className="cancel" onClick={() => setOpenDialogCredit(!openDialogCredit)}>x</button>
                <div>
                    <DataTable
                        columns={columnbankCredit}
                        data={dataDepositCredit}
                    />
                </div>
                {getDataSummaryCredit()}
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogCredit(!openDialogCredit)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }

    const getDialogTranfer = () => {
            return <Dialog open={openDialogTranfer} maxWidth="1000px" >
                <DialogTitle >
                    <p>รายละเอียดการชำระเงินโอน</p>
                </DialogTitle>
                <DialogContent dividers='paper'>
                    <button type="button" className="cancel" onClick={() => setOpenDialogTranfer(!openDialogTranfer)}>x</button>
                    <div>
                        <DataTable
                            columns={columnbankTranfer}
                            data={dataDepositTranfer}
                        />
                        {getDataSummaryTranfer()}
                    </div>
                </DialogContent>
                <DialogActions>
                    <BtnCancel onClick={() => setOpenDialogTranfer(!openDialogTranfer)} message="ปิด" />
                </DialogActions>
            </Dialog>
    }

    const getDialogReason = () => {
        if (checkedCancle == true) {
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
        } else {
            return (<Dialog open={openDialogReason} maxWidth="1000px" >
                <DialogTitle >
                    <p> ยกเลิกเอกสาร</p>
                </DialogTitle>
                <DialogContent dividers='paper' style={{ width: "1000px" }}>
                    <p>ไม่สามารถยกเลิกเอกสารย้อนหลังได้ กรุณาติดต่อฝ่ายบัญชี</p>
                </DialogContent>
                <DialogActions>
                    <BtnCancel onClick={() => setOpenDialogReason(!openDialogReason)} message="ปิด" />
                </DialogActions>
                {getAlert()}
            </Dialog>
            )
        }
    }

    const getDialogConfirm = () => {
        return (<Dialog open={openDialogConfirm} maxWidth="600px" >
            <DialogTitle >
                <p>ยกเลิกเอกสาร</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "600px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogConfirm(!openDialogConfirm)}>x</button>
                <div class="row">
                    <div class="col-4">
                        <p>ต้องการยกเลิกเอกสาร </p>
                    </div>
                    <div class="col">
                        <p >
                            <strong >{dataDepositHD.length > 0 ? dataDepositHD[0]['salehd_docuno'] : ""}</strong>
                        </p>
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

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }


    return (
        <>
            {getAlert()}
            {getDialogTranfer()}
            {getDialogCredit()}
            {getDialogConfirm()}
            {getDialogReason()}
            <div style={{ marginTop: "10px", marginLeft: "1%", fontSize: "1vw"}}>
                <div class="row">
                    <div class="col-9">
                        {getDataDocument()}
                        {getDataTableOrderTB()}
                        {getDataDetail()}
                    </div>
                    <div class="col">
                        {getPaymentDetail()}
                    </div>
                </div>
        </div>
    </>)
}

export default memo(DocumentDepositDetail);