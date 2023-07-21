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
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useLocation, useParams } from "react-router-dom";
import Moment from 'moment';
import _ from "lodash";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';

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

const ReturnSale = () => {
    const actions = useContext(DataContextMenuActions)
    const userData = useContext(DataContext)
    const BranchData = useContext(DataContextBranchData)
    const location = useLocation();
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const [alertMessages, setAlertMessages] = useState("")
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertWarning, setAlerttWarning] = useState(false)
    const [clearDatavalue, setClearDatavalue] = useState(false)
    const [dataSaleHD, setDataSaleHD] = useState([])
    const [dataSaleDT, setDataSaleDT] = useState([])
    const [valueCheck, setValueCheck] = useState("")
    const [amountProduct, setAmountProduct] = useState(0)
    const [amountTotal, setAmountTotal] = useState(0)
    const [dataVatSelect, setDataVatSelect] = useState([])
    const [dataCatSelect, setDataCatSelect] = useState([])
    const [dataPointCus, setDataPointCus] = useState([])
    const [datapointType, setDatapointType] = useState([])
    const [flagPayment, setFlagPayment] = useState(true)
    const [remarkDocument, setRemarkDocument] = useState("")
    const [taxBase, setTaxBase] = useState(0)
    const [taxs, setTaxs] = useState(0)
    const [cates, setCates] = useState(0)
    const [creditDate, setCreditDate] = useState(new Date())
    const [creditDay, setCreditDay] = useState(0)
    const [actionsSave, setActionsSave] = useState(false)
    const [actionsPrint, setActionsPrint] = useState(false)
    const [docCode, setDocCode] = useState()
    const [saveValue, setSaveValue] = useState(false)
    const [dataReasonSelect, setDataReasonSelect] = useState([])
    const [dataCustomer, setDataCustomer] = useState([])

    const columnsOrderDetail = [
        {
            name: 'เลือก',
            selector: (row, idx) => <div style={{ marginLeft: "20%" }}><
                FormControlLabel style={{ color: "black" }} control={
                    <Checkbox style={{ color: "#2F3A9E" }} defaultValue={row.select_active} checked={row.select_active}
                        value={row.saledt_id}
                        onClick={(e) => { OnchangeCheckSaleDT(e, row, idx) }}
                    />} /> </div>,
            sortable: true,
            width: '100px'
        },
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
            center: true,
        },
        {
            name: 'ราคาขาย',
            selector: row => nf.format(row.saledt_saleprice),
            sortable: true,
            right: true,
            width: "120px"

        },
        {
            name: 'มูลค่าคงเหลือ',
            selector: row => isNaN(row.saledt_netamnt_amt) ? nf.format('0') : nf.format(row.saledt_netamnt_amt),
            sortable: true,
            right: true,
            width: "200px"
        },
        {
            name: 'จำนวนรับคืน',
            selector: (row, idx) => <InputText style={{ height: "90%", width: "70%", borderColor: "#2F3A9E", borderRadius: "5px" }} type="number"
                value={row.select_active == true ? row.saledt_qty_return : 0} onChange={(e) => onChangeQtyProduct(e, row, idx)}
                disabled={row.select_active == true ? false : true} />,
            sortable: true,
            width: "140px"
        },
        {
            name: 'มูลค่ารับคืน',
            selector: (row, idx) => <InputText style={{ height: "90%", width: "70%", borderColor: "#2F3A9E", borderRadius: "5px" }} type="number"
                value={row.saledt_netamnt_return}
                onChange={(e) => onChangePriceProduct(e, row, idx)}
                disabled={row.select_active == true ? false : true} />,
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

    useEffect(() => {
        setClearDatavalue(true)
        setDataSaleDT([])
        setAmountProduct(0)
        if (location.pathname == '/main/return-product-credit') {
            setFlagPayment(false);
        } else {
            setFlagPayment(true);
        }
    }, [location.pathname, actions]);

    useEffect(() => {
        if (dataSaleHD.length > 0) {
            getDataSaleDetail()
        }
    }, [dataSaleHD])

    useEffect(() => {
        getDatatableOrderDtail()
        getAmount()
    }, [valueCheck, dataSaleDT])

    useEffect(() => {
        getDataDetailReturn()
    }, [amountProduct, dataSaleHD, clearDatavalue])

    useEffect(() => {
        getDataPaymentReturn()
    }, [amountTotal, clearDatavalue])

    useEffect(() => {
        if (actionsPrint == true || actionsSave == true) {
            getDataPaymentReturn()
            setActionsPrint(false)
            setActionsSave(false)
        } else {
            getDataDetailReturn()
        }
    }, [actionsPrint, actionsSave])

    useEffect(() => {
        getDocumentReturn()
    }, [clearDatavalue, flagPayment])

    const onClickClear = () => {
        setClearDatavalue(true)
        setDataSaleDT([])
    }

    useEffect(() => {
        if (saveValue == true) {
            setDataSaleDT([])
            setSaveValue(false)
        }
    }, [saveValue])

    const getDataSaleDetail = () => {
        const dataAPI = {
            "salehd_id": parseInt(dataSaleHD[0]['salehd_id'])
        }
        axios.post(UrlApi() + 'get_saledt_remaining', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.saledt_qty_return = parseInt(item.saledt_qty)
                        item.saledt_netamnt_return = parseFloat(item.saledt_netamnt)
                        item.saledt_netamnt_amt = 0
                        item.saledt_qty_amt = 0
                        item.select_active = false
                    })
                    setDataSaleDT(res.data)
                }
            })
    }

    const OnchangeCheckSaleDT = (e, row, idx) => {
        dataSaleDT[idx]['select_active'] = e.target.checked
        setValueCheck(e)
    }

    const onChangeQtyProduct = (e, row, idx) => {
        if (e.target.value === undefined || e.target.value === "") {
            e.target.value = 0;
        } else {
            e.target.value = e.target.value.trim();
            if (e.target.value.charAt(0) === "0" && e.target.value.length > 1) {
                e.target.value = e.target.value.substr(1);
            }
            e.target.value = parseInt(e.target.value);
        }
        if (e.target.value > parseInt(row.saledt_qty)) {
            setAlerttWarning(true)
            setAlertMessages("ไม่สามารถคืนสินค้ามากกว่าจำนวนที่ซื้อได้")
            setTimeout(function () {
                setAlerttWarning(false);
            }, 5000);
        } else if (e.target.value >= 0) {
            dataSaleDT[idx]['saledt_qty_return'] = parseInt(e.target.value)
            dataSaleDT[idx]['saledt_qty_amt'] = parseFloat(parseInt(row.saledt_qty) - parseInt(e.target.value))
            dataSaleDT[idx]['saledt_netamnt_return'] = parseFloat(parseInt(e.target.value) * parseFloat(row.saledt_saleprice))
            dataSaleDT[idx]['saledt_netamnt_amt'] = parseFloat(parseFloat(row.saledt_netamnt) - parseFloat((parseInt(e.target.value) * parseFloat(row.saledt_saleprice))))
        }
        setDataSaleDT(dataSaleDT)
        setValueCheck(e)
    }

    const onChangePriceProduct = (e, row, idx) => {
        if (e.target.value >= 0) {
            dataSaleDT[idx]['saledt_netamnt_return'] = parseFloat(e.target.value)
            dataSaleDT[idx]['saledt_netamnt_amt'] = parseFloat(parseFloat(row.saledt_netamnt) - parseFloat(e.target.value))
            setDataSaleDT(dataSaleDT)
            setValueCheck(e)
        }
    }

    const getAmount = () => {
        let groupdataDetail = _.groupBy(dataSaleDT, 'select_active')
        if (groupdataDetail[true]) {
            groupdataDetail[true].map((item, idx) => { parseFloat(item.saledt_netamnt_return) })
            let Amt = _.sumBy(groupdataDetail[true], 'saledt_netamnt_return')
            setAmountProduct(parseFloat(Amt))
        } else {
            setAmountProduct(0)
        }
        setClearDatavalue(false)
    }

    const getDatatableOrderDtail = () => {
        return (
            <Card className="card_sale" style={{ minHeight: "32vh", maxHeight: "48vh", marginTop: "1%" }}>
                <div className="card_head"><p className="textH_Left">รายละเอียดเอกสารขาย</p></div>
                <Card.Body className="card_body_doc">
                    <BtnAdd style={{ height: "3vh", backgroundColor: "#FEAE5F" }} message="ล้างข้อมูล" onClick={() => onClickClear()} />
                    <div style={{ minHeight: "30vh", maxHeight: "42vh", overflow: 'auto', scrollbarColor: "#7EA8F6" }}>
                        <DataTables
                            striped
                            dense
                            customStyles={customStyles}
                            data={dataSaleDT}
                            columns={columnsOrderDetail}
                        />
                    </div>
                </Card.Body>
            </Card>
        )
    }

    const getDocumentReturn = () => {
        return (<DataDocumentReturn onChangeSaleHD={(e) => setDataSaleHD(e)} clearDatavalue={clearDatavalue}
            flagPayment={flagPayment} onChangeRemarkDocument={(e) => setRemarkDocument(e)}
            onChangeDocCode={(e) => setDocCode(e)} onChangeReason={(e) => setDataReasonSelect(e)}
        />)
    }

    const getDataDetailReturn = () => {
        return (<DataDetailReturn dataSaleDetail={dataSaleDT} amountProduct={amountProduct} flagPayment={flagPayment}
            onChangeAmountTotal={(e) => setAmountTotal(e)} onChangeDataCatSelect={(e) => setDataCatSelect(e)}
            onChangeDataVatSelect={(e) => setDataVatSelect(e)} onChagePoints={(e) => setDataPointCus(e)}
            onChangePointType={(e) => setDatapointType(e)} onChangeTaxBase={(e) => setTaxBase(e)}
            onChangeTaxs={(e) => setTaxs(e)} onChangeCates={(e) => setCates(e)}
            onChangeCreditDate={(e) => setCreditDate(e)} onChangeCreditDay={(e) => setCreditDay(e)}
            onClickSave={(e) => setActionsSave(e)} onClickPrint={(e) => setActionsPrint(e)}
            clearDatavalue={clearDatavalue} dataSleHD={dataSaleHD} actionsPrint={actionsPrint}
            actionsSave={actionsSave} dataCustomer={dataCustomer}
        />)
    }

    const getDataPaymentReturn = () => {
        return (<DataPaymentReturn
            dataSaleHD={dataSaleHD}
            flagPayment={flagPayment}
            dataSaleDetail={dataSaleDT}
            amountTotal={amountTotal}
            dataVatSelect={dataVatSelect}
            dataCatSelect={dataCatSelect}
            clearDatavalue={clearDatavalue}
            datapointType={datapointType}
            datapointCus={dataPointCus}
            remarkDocument={remarkDocument}
            taxBase={taxBase} taxs={taxs}
            cates={cates}
            creditDate={creditDate}
            creditDay={creditDay}
            docCode={docCode}
            actionsSave={actionsSave}
            actionsPrint={actionsPrint}
            onChangeSave={(e) => setSaveValue(e)}
            dataReasonSelect={dataReasonSelect}
            onChangeCustomerData={(e) => setDataCustomer(e)}
        />)
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }


    return (<div style={{ marginRight: "1%", marginLeft: "1%", marginTop: "10px" }}>
        <div class="row" style={{ marginLeft: "1%", marginRight: "1%" }}>
            {getAlert()}
            <div class={flagPayment == true ? "col-9" : "col-12"}>
                {getDocumentReturn()}
                {getDatatableOrderDtail()}
                {getDataDetailReturn()}
            </div>
            <div class="col-3">
                {getDataPaymentReturn()}
            </div>
        </div>
    </div>)
}

export default memo(ReturnSale);