import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import InputText from "../../../components/Input/InputText";
import DataTable from '../../../components/Datatable/Datatables';
import BtnAdd from "../../../components/Button/BtnAdd";
import BtnCancel from "../../../components/Button/BtnCancel";
import Moment from 'moment';
import Card from 'react-bootstrap/Card';
import PathRouter from "../../../PathRouter/PathRouter";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import th from 'date-fns/locale/th';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import FilterDataTable from "../../../components/SearchDataTable/FilterDataTable";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import HistoryIcon from '@mui/icons-material/History';
import { useLocation } from "react-router-dom";
const DataDocumentReturn = (props) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const [dateDoc, setDateDoc] = useState(new Date());
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogReason, setOpenDialogReason,] = useState(false)
    const [remarks, setRemarks] = useState("")
    const [docCodeReturn, setDocCodeReturn] = useState("")
    const [textSearch, setTextSearch] = useState("")
    const [dataSaleHD, setDataSaleHD] = useState([])
    const [dataSaleHDSelect, setDataSaleHDSelect] = useState([])
    const [valueCheck, setValueCheck] = useState("")
    const [dataReason, setDataReason] = useState([])
    const [dataReasonSelect, setDataReasonSelect] = useState([])

    const columnsHD = [
        {
            name: 'เลือก',
            selector: (row, idx) => <div style={{ marginLeft: "20%" }}><
                FormControlLabel style={{ color: "black" }} control={
                    <Radio style={{ color: "#6598F6" }} defaultValue={row.defalutsale_active} checked={row.defalutsale_active}
                        value={row.salehd_id}
                        onClick={(e) => { OnchangeCheckSaleHD(e, row, idx) }}
                    />} /> </div>,
            sortable: true,
            width: '100px'
        },
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => row.salehd_docuno,
        },
        {
            name: 'ชื่อลูกค้า',
            selector: row => row.salehd_arcustomer_name,
        },
        {
            name: 'ยอดขาย',
            selector: row => nf.format(row.salehd_sumgoodamnt),
        },
    ]

    const columnsReason = [
        {
            name: 'เลือก',
            selector: (row, idx) => <div style={{ marginLeft: "20%" }}><
                FormControlLabel style={{ color: "black" }} control={
                    <Radio style={{ color: "#6598F6" }} defaultValue={row.defalut_active} checked={row.defalut_active}
                        value={row.returnproducthd_reason_id}
                        onClick={(e) => { OnchangeCheckReason(e, row, idx) }}
                    />} /> </div>,
            sortable: true,
            width: '100px'
        },
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เหตุผลการคืนสินค้า',
            selector: row => row.returnproducthd_reason_name,
        },
    ]

    useEffect(() => {
        getSalehd()
        getDataReason()
    }, [])

    useEffect(() => {
        getDocCode()
        getSalehd()
    }, [props])

    useEffect(() => {
        getDialogSaleDocument()
    }, [valueCheck])

    useEffect(() => {
        props.onChangeSaleHD(dataSaleHDSelect)
    }, [dataSaleHDSelect])

    useEffect(() => {
        if (props.clearDatavalue == true) {
            setDataSaleHDSelect([])
            setDataReasonSelect([])
            setDocCodeReturn("")
            setTextSearch("")
            getDocCode()
        }
    }, [props.clearDatavalue])

    useEffect(() => {
        if (props.onChangeReason) {
            props.onChangeReason(dataReasonSelect)
        }
    }, [dataReasonSelect])

    useEffect(() => {
        if (props.onChangeRemarkDocument) {
            props.onChangeRemarkDocument(remarks)
        }
    }, [remarks])

    useEffect(() => {
        if (props.onChangeDocCode) {
            props.onChangeDocCode(docCodeReturn)
        }
    }, [docCodeReturn])

    const getDocCode = () => {
        let dataAPI = {
            "doc_date": Moment(new Date).format('YYYYMMDD'),
            "doc_type": props.flagPayment == true ? 11 : 25,
            "company_id": parseInt(userData[0]['master_company_id']),
            "branch_id": parseInt(BranchData[0].master_branch_id),
        }
        axios.post(UrlApi() + 'get_returnproducthd_docuno', dataAPI)
            .then(res => {
                if (res.data.length > 0) {
                    setDocCodeReturn(res.data[0].fn_generate_returnproducthd_docuno)
                }
            })
    }

    const getDataReason = () => {
        let dataAPI = {
            "company_id": parseInt(userData[0]['master_company_id']),
        }
        axios.post(UrlApi() + 'get_returnproducthd_reason', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.defalut_active = false
                    })
                    setDataReason(res.data)
                }
            })
    }

    const getSalehd = () => {
        let dataAPI = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "branch_id": parseInt(BranchData[0].master_branch_id),
            "doc_type": props.flagPayment == true ? 8 : 9,
            "textfilter": textSearch
        }
        axios.post(UrlApi() + 'get_filter_salehd', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.defalutsale_active = false
                    })
                    setDataSaleHD(res.data)
                }
            })
    }

    const OnchangeCheckSaleHD = (e, row, idx) => {
        dataSaleHD.map((item, idx) => {
            if (item.salehd_id == row.salehd_id) {
                item.defalutsale_active = true
            } else {
                item.defalutsale_active = false
            }
        })
        setDataSaleHD(dataSaleHD)
        if (e.target.value) {
            setDataSaleHDSelect([row])
        }
        setOpenDialog(false)
    }

    const OnchangeCheckReason = (e, row, idx) => {
        dataReason.map((item, idx) => {
            if (item.returnproducthd_reason_id == row.returnproducthd_reason_id) {
                item.defalut_active = true
            } else {
                item.defalut_active = false
            }
        })
        setDataReason(dataReason)
        if (e.target.value) {
            setDataReasonSelect([row])
        }
        setOpenDialogReason(false)
    }

    const onClickOpenDocumentSale = () => {
        setOpenDialog(true)
    }

    const onChangeFilterDocument = (e) => {
        setTextSearch(e.target.value.trim())
        getSalehd()
    }

    const getDialogSaleDocument = () => {
        return (
            <Dialog open={openDialog} maxWidth="600px" >
                <DialogTitle ><p>ข้อมูลเอกสารขาย</p></DialogTitle>
                <DialogContent dividers='paper' style={{ width: "900px" }}>
                    <button type="button" className="cancel" onClick={() => setOpenDialog(false)}>x</button>
                    <FilterDataTable value={textSearch} onChange={(e) => onChangeFilterDocument(e)} onKeyPress={(e) => onChangeFilterDocument(e)} />
                    <div style={{ marginTop: "1%" }}>
                        <DataTable
                            columns={columnsHD}
                            data={dataSaleHD}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <span><BtnAdd message="บันทึก" /></span>
                    <BtnCancel onClick={() => { setOpenDialog(false) }} message="ปิด" />
                </DialogActions>
            </Dialog>)
    }

    const getDailogReason = () => {
        return (
            <Dialog open={openDialogReason} maxWidth="600px" >
                <DialogTitle ><p>เหตุผลการคืนสินค้า</p></DialogTitle>
                <DialogContent dividers='paper' style={{ width: "900px" }}>
                    <button type="button" className="cancel" onClick={() => setOpenDialogReason(false)}>x</button>
                    <div style={{ marginTop: "1%" }}>
                        <DataTable
                            columns={columnsReason}
                            data={dataReason}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <BtnCancel onClick={() => { setOpenDialogReason(false) }} message="ปิด" />
                </DialogActions>
            </Dialog>)
    }
    const location = useLocation();
    const path = location.pathname;
    const getCustomeName = () => {
        let Dates = dateDoc
        let dateDocs = Moment(dateDoc).format('DD/MM/') + (Dates.getFullYear() + 543)
        let pathNames = props.flagPayment == true ? `${PathRouter()}/main/document/returnproduct/cash` : `${PathRouter()}/main/document/returnproduct/credit`
        return (<Card className="card_sale" style={{ maxHeight: "24vh", minHeight: "20vh", fontSize: "16px" }}>
            <div className="card_head">
                <div class="row justify-content-between">
                    <div class="col text-left">
                        {path === "/main/return-product-cash" && (
                            <p className="textH_Left">ข้อมูลเอกสารรับคืนสินค้า(เงินสด)</p>
                        )}
                        {path === "/main/return-product-credit" && (
                            <p className="textH_Left">ข้อมูลเอกสารรับคืนสินค้า(เงินเชื่อ)</p>
                        )}
                    </div>
                    <div class="col d-flex justify-content-end">
                        <BtnAdd
                            message="ดูประวัติเงินมัดจำ"
                            style={{ height: "100%", width: "200px" }}
                            icons={<HistoryIcon />}
                            onClick={() =>
                                window.open(`${PathRouter()}/main/document/deposit`)
                            }
                        />
                    </div>
                </div>

            </div>
            <Card.Body className="card_body_doc">
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                    <div class="row">
                        <div class="col-3">
                            <p className="text_sale">วันที่เอกสาร</p>
                            <p className="text_sale">{dateDocs}</p>
                        </div>
                        <div class="col-3"  >
                            <p className="text_sale">เลขที่เอกสารคืน</p>
                            <InputText type="text" style={{ height: "3vh" }} value={docCodeReturn} disabled />
                        </div>
                        <div class="col-2">
                            <p className="text_sale">เลขที่เอกสารซื้อ</p>
                            <InputText type="text" style={{ height: "3vh", width: "150%" }} value={dataSaleHDSelect.length > 0 ? dataSaleHDSelect[0]['salehd_docuno'] : ""} disabled />
                        </div>
                        <div class="col-1">
                            <BtnAdd style={{ marginLeft: "3%", width: "4%", height: "3.2vh", marginTop: "26px", position: "absolute", background: "#74E0C0" }} onClick={() => onClickOpenDocumentSale()} icons={<ZoomInIcon />} />
                        </div>
                        <div class="col-3" >
                            <p className="text_sale">กลุ่มลูกค้า</p>
                            <InputText type="text" style={{ height: "3vh" }} value={dataSaleHDSelect.length > 0 ? dataSaleHDSelect[0]['salehd_arcustomer_name'] : ""} disabled />
                        </div>
                        <div class="col-2">
                            <p className="text_sale">เหตุผลการคืนสินค้า</p>
                            <InputText type="text" style={{ height: "3vh", width: "150%" }} value={dataReasonSelect.length > 0 ? dataReasonSelect[0]['returnproducthd_reason_name'] : ''} disabled />
                        </div>
                        <div class="col-1">
                            <BtnAdd style={{ marginLeft: "3%", width: "4%", height: "3.2vh", marginTop: "26px", position: "absolute", background: "#74E0C0" }} onClick={() => setOpenDialogReason(true)} icons={<ZoomInIcon />} />
                        </div>
                        <div class="col-3">
                            <p className="text_sale" >ผู้บันทึก</p>
                            <InputText style={{ height: "3vh" }} type="text" value={userData[0]['user_name'] + ':' + userData[0]['firstname'] + ' ' + userData[0]['lastname']} disabled />
                        </div>
                        <div class="col-3">
                            <p className="text_sale">รายละเอียดกลุ่มลูกค้า</p>
                            <InputText type="text" style={{ height: "3vh" }} value={dataSaleHDSelect.length > 0 ? dataSaleHDSelect[0]['salehd_arcustomer_addr'] : ""} disabled />
                        </div>
                        <div class="col-3">
                            <p className="text_sale">หมายเหตุเอกสาร </p>
                            <InputText type="text" style={{ height: "3vh" }} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                        </div>
                    </div>
                </LocalizationProvider>
            </Card.Body>
        </Card>)
    }

    return (<>
        {getCustomeName()}
        {getDialogSaleDocument()}
        {getDailogReason()}
    </>
    )

}

export default memo(DataDocumentReturn);
