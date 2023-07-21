import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import DataDocumentReturn from './DataDocumentReturn';
import DataDetailReturn from './DataDetailReturn'
import DataContext from "../../../DataContext/DataContext";
import DataPaymentReturn from './DataPaymentReturn'
import DataContextMenuActions from "../../../DataContext/DataContextMenuActions";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import axios from 'axios';
import UrlApi from "../../../url_api/UrlApi";
import DataTables from 'react-data-table-component';
import InputText from "../../../components/Input/InputText";
import CheckIcon from '@mui/icons-material/Check';
import Card from 'react-bootstrap/Card';
import ClearIcon from '@mui/icons-material/Clear';
import BtnAdd from "../../../components/Button/BtnAdd";
import { useLocation, useParams } from "react-router-dom";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import th from 'date-fns/locale/th';
import _ from "lodash";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import BtnCancel from "../../../components/Button/BtnCancel";
import Icon from '@mdi/react';
import {
    mdiViewHeadline, mdiTicketPercentOutline, mdiCellphoneSound, mdiCreditCardOutline,
    mdiTrayFull, mdiPrinterOutline, mdiFileCancelOutline
} from '@mdi/js';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';

const customStyles = {
    headCells: {
        style: {
            background: 'white',
            color: "#0064B0",
            minHeight: "0.5vh",
            maxHeight: "2vh",
            fontSize: "16px"
        },
    },
};

const DocumentSaleVeiwReturn = (props) => {
    const actions = useContext(DataContextMenuActions)
    const userData = useContext(DataContext)
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const location = useLocation();
    const [flagPayment, setFlagPayment] = useState(true)
    const [alertMessages, setAlertMessages] = useState("")
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertWarning, setAlerttWarning] = useState(false)
    const [openDialogTranfer, setOpenDialogTranfer] = useState(false)
    const [openDialogCredit, setOpenDialogCredit] = useState(false)

    const columnsOrderDetail = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: true,
            width: "90px"
        },
        {
            name: 'Barcode',
            selector: row => row.saledt_master_product_barcode_code,
            sortable: true,
            width: "120px"
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.saledt_master_product_billname,
            sortable: true,
            width: "400px"
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.saledt_master_product_barcode_unitname,
            sortable: true,
            width: "120px"
        },
        {
            name: 'จำนวนที่ซื้อ',
            selector: row => row.saledt_qty,
            sortable: true,
            width: "150px",
            right: true,
        },
        {
            name: 'ราคาขาย',
            selector: row => nf.format(row.saledt_saleprice),
            sortable: true,
            right: true,
            width: "120px"

        },
        {
            name: 'จำนวนรับคืน',
            selector: (row, idx) => row.saledt_qty_return,
            sortable: true,
            width: "140px"
        },
        {
            name: 'มูลค่าคงเหลือ',
            selector: row => nf.format(row.saledt_netamnt_amt),
            sortable: true,
            right: true,
            width: "200px"
        },
        {
            name: 'มูลค่ารับคืน',
            selector: (row, idx) => row.saledt_netamnt_return,
            sortable: true,
            width: "150px"
        },
        {
            name: 'ส่วนลด',
            selector: row => nf.format(row.saledt_discount_amnt),
            sortable: true,
            right: true
        },
        {
            name: 'คิดภาษี',
            selector: row =>
                row.saledt_vatflag == true ? <CheckIcon color="success" /> : <ClearIcon color="disabled" />,
            sortable: true,
        },
    ]

    const columnbankTranfer = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'บัญชีธนาคาร',
            selector: (row, idx) => row.cq_bankbook_no,
            sortable: true,
        },
        {
            name: 'ธนาคาร',
            selector: (row, idx) => row.cq_bank_name,
            sortable: true,
        },
        {
            name: 'ชื่อบัญชี',
            selector: (row, idx) => row.cq_bankbook_name,
            sortable: true,
        },
        {
            name: 'มูลค่าเงินโอนที่ได้รับ',
            selector: (row, idx) => row.amount,
            sortable: true,
            width: '200px',
        },
    ]

    const columnbankCredit = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'บัญชีธนาคาร',
            selector: (row, idx) => row.cq_bankbook_no,
            sortable: true,
        },
        {
            name: 'ธนาคาร',
            selector: (row, idx) => row.cq_bank_name,
            sortable: true,
        },
        {
            name: 'ชื่อบัญชี',
            selector: (row, idx) => row.cq_bankbook_name,
            sortable: true,
            width: "200px",
        },
        {
            name: 'เลขบัตร',
            selector: (row, idx) => row.number_credit,
            width: "300px",
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: (row, idx) => row.amount,
            sortable: true,
        },

        {
            name: 'หมายเหตุ',
            selector: (row, idx) => row.remark,
            sortable: true,
        },
    ]

    useEffect(() => {
        if (location.pathname == '/main/document/returnproduct/credit/view') {
            setFlagPayment(false);
        } else {
            setFlagPayment(true);
        }
    }, [location.pathname]);

    const getDocumentReturn = () => {
        return (<Card className="card_sale" style={{ maxHeight: "24vh", minHeight: "20vh", fontSize: "16px" }}>
            <div className="card_head"> <p className="textH_Left">ข้อมูลเอกสารคืนสินค้า</p></div>
            <Card.Body className="card_body_doc">
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                    <div class="row">
                        <div class="col-3">
                            <p className="text_sale">วันที่เอกสาร</p>
                            <p className="text_sale"></p>
                        </div>
                        <div class="col-3"  >
                            <p className="text_sale">เลขที่เอกสารคืน</p>
                            <InputText type="text" style={{ height: "3vh" }}  disabled />
                        </div>
                        <div class="col-3">
                            <span>
                                <p className="text_sale">เลขที่เอกสารซื้อ</p>
                                <InputText type="text" style={{ height: "3vh" }}  disabled />
                            </span>
                        </div>
                        <div class="col-3" >
                            <p className="text_sale">กลุ่มลูกค้า</p>
                            <InputText type="text" style={{ height: "3vh" }}  disabled />
                        </div>
                        <div class="col-3">
                            <p className="text_sale">เหตุผลการคืนสินค้า </p>
                         <InputText type="text" style={{ height: "3vh" }} disabled/>
                        </div>
                        <div class="col-3">
                            <p className="text_sale" >ผู้บันทึก</p>
                            <InputText style={{ height: "3vh" }} type="text"  disabled />
                        </div>
                        <div class="col-3">
                            <p className="text_sale">รายละเอียดกลุ่มลูกค้า</p>
                            <InputText type="text" style={{ height: "3vh" }}  disabled />
                        </div>
                        <div class="col-3">
                            <p className="text_sale">หมายเหตุเอกสาร </p>
                            <InputText type="text" style={{ height: "3vh" }} disabled />
                        </div>
                    </div>
                </LocalizationProvider>
            </Card.Body>
        </Card>)
    }

    const getDatatableOrderDtail = () => {
        return (
            <Card className="card_sale" style={{ minHeight: "32vh", maxHeight: "48vh", marginTop: "1%" }}>
                <div className="card_head"> <p className="textH_Left">รายละเอียดการคำนวณ</p></div>
                <Card.Body className="card_body_doc">
                    <div style={{ minHeight: "30vh", maxHeight: "42vh", overflow: 'auto' }}>
                        <DataTables
                            dense
                            customStyles={customStyles}
                            data={[]}
                            columns={columnsOrderDetail}
                        />
                    </div>
                </Card.Body>
            </Card>
        )
    }

    const getDataDetailReturn = () => {
        return (<Card className="card_sale"  style={{ maxHeight: "24vh", minHeight: "22vh", marginTop: "1%", fontSize: "16px" }}>
            <div className="card_head"><p className="textH_Left">รายละเอียดการคำนวณ</p></div>
            <Card.Body className="card_body_doc">
                <div class="row">
                    <div class={props.flagPayment == true ? "col-4" : "col-3"}>
                        <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มส่วนลด</p>
                        <InputText style={{ height: "3vh" }} />
                    </div>
                    <div class={props.flagPayment == true ? "col-4" : "col-3"}>
                        <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มภาษี</p>
                        <InputText type="text" style={{ height: "3vh" }}  disabled />
                        <p className="text_sale" style={{ marginTop: "1%" }}>หัก ณ ที่จ่าย</p>
                        <InputText type="text" style={{ height: "3vh" }} disabled />
                    </div>
                    <div class={props.flagPayment == true ? "col-4" : "col-3"}>
                        <p className="text_sale" style={{ marginTop: "1%" }}>รวมมูลค่าสินค้า</p>
                        <InputText style={{ height: "3vh" }} type="text" isabled />
                        <p className="text_sale" style={{ marginTop: "1%" }}>มูลค่าสุทธิ</p>
                        <InputText style={{ fontSize: "1.5vw", height: "4vh" }} type="text" disabled />
                    </div>
                    {flagPayment == false ?
                        <div class="col-3">
                            <button className="btn_add_pay" style={{ height: "5vh", marginTop: "5%", marginLeft: "2%", width: "95%" }}
                            > <LocalPrintshopIcon />ออกใบกำกับภาษี </button>
                            <Button style={{ background: "#D20B0B", color: "white", width: "98%", height: "5vh", marginTop: "5%", borderRadius: "8px", fontSize: "1.5vw", fontFamily: "Kanit" }}
                            > ยกเลิกเอกสาร</Button>
                        </div>
                        : <></>}
                </div>
            </Card.Body>
        </Card>)
    }

    const getDataPaymentReturn = () => {
        return (
            <Card className="card_sale" style={{ height: "92vh" }}>
                <div className="card_head"> <p className="textH_Left">รายละเอียดการชำระ</p></div>
                <Card.Body className="card_body_doc">
                    <div class="row" style={{ height: "52vh" }}>
                        <div class="col-2">
                            <BtnAdd style={{ marginTop: "2vh", width: "42%", height: "6vh", position: "absolute" }} message="เงินโอน" icons={<Icon path={mdiCellphoneSound} size={1} />}  onClick={() => setOpenDialogTranfer(true)}/>
                            <BtnAdd style={{ marginTop: "10vh", width: "42%", height: "6vh", position: "absolute" }} message="บัตรเครดิต" icons={<Icon path={mdiCreditCardOutline} size={1} />}   onClick={() => setOpenDialogCredit(true)}/>
                            <Card className="card_btn_pay" style={{ marginTop: "18vh", width: "400%" }}><p style={{ marginTop: "10%" }}> เงินสด</p></Card>
                        </div>
                        <div class="col-10">
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text"  disabled />
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="text"  disabled />
                            <InputText style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }} type="number"  />
                        </div>
                    </div>
                    <BtnAdd style={{ height: "6vh", width: "95%"}}
                        icons={<Icon path={mdiTrayFull} size={1} style={{ marginRight: "10px" }} />}
                        message="ออกใบกำกับภาษี" />
                    <Button style={{ background: "#FD6F88", color: "white", width: "98%", height: "6vh", marginTop: "3%", borderRadius: "8px", fontSize: "1.5vw" }}>
                         <Icon path={mdiFileCancelOutline} size={2} style={{ marginRight: "10px" }} /> ยกเลิกเอกสาร</Button>
                </Card.Body>
            </Card>
        )
    }

    const getDialogTranfer = () => {
        return <Dialog open={openDialogTranfer} maxWidth="1200px" >
            <DialogTitle >
                <p>รายละเอียดการชำระเงินโอน</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1000px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogTranfer(!openDialogTranfer)}>x</button>
                <div>
                    <DataTables
                        customStyles={customStyles}
                        columns={columnbankTranfer}
                        data={[]}
                    />
                </div>
            </DialogContent>
            <DialogActions>
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
                    <DataTables
                        customStyles={customStyles}
                        columns={[]}
                        data={[]}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogCredit(!openDialogCredit)} message="ปิด" />
            </DialogActions>
            {getAlert()}
        </Dialog>
    }


    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    return (<div style={{ marginTop: "10px", marginLeft: "1%", marginRight:"1%" }}>
        {getDialogTranfer()}
        {getDialogCredit()}
        {getAlert()}
        <div class="row">
            <div class={flagPayment == true ? "col-9" : "col-12"}>
                {getDocumentReturn()}
                {getDatatableOrderDtail()}
                {getDataDetailReturn()}
            </div>
            {flagPayment == true ?
                <div class="col-3">
                    {getDataPaymentReturn()}
                </div> : <></>}
        </div>
    </div>)
}

export default memo(DocumentSaleVeiwReturn);