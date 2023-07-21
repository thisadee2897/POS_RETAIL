import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import DataContext from "../../../DataContext/DataContext";
import DataContextMenuActions from "../../../DataContext/DataContextMenuActions";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import DataTable from '../../../components/Datatable/Datatables';
import axios from 'axios';
import UrlApi from "../../../url_api/UrlApi";
import DataTables from 'react-data-table-component';
import InputText from "../../../components/Input/InputText";
import Card from 'react-bootstrap/Card';
import BtnAdd from "../../../components/Button/BtnAdd";
import { useLocation, useParams } from "react-router-dom";
import * as AiIcons from 'react-icons/ai';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import th from 'date-fns/locale/th';
import _ from "lodash";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Moment from 'moment';
import DialogProduct from "../../../components/DialogProduct/DialogProduct"
import DialogCustomer from "../../../components/DialogCustomer/DialogCustomer"
import DatePicker, { registerLocale } from "react-datepicker";
import BtnDelete from "../../../components/Button/BtnDelete";
import DateRangeIcon from '@mui/icons-material/DateRange';
import Icon from '@mdi/react';
import { mdiContentSaveCheckOutline} from '@mdi/js';
import InputSelect from "../../../components/Input/InputSelect";

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

const SaleOrder = (props) => {
    const actions = useContext(DataContextMenuActions)
    const userData = useContext(DataContext)
    const BranchData = useContext(DataContextBranchData);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const location = useLocation();
    const [openDialogProduct, setOpenDialogProduct] = useState(false)
    const [alertMessages, setAlertMessages] = useState("")
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertWarning, setAlerttWarning] = useState(false)
    const [openDialogCustomer, setOpenDialogCustomer] = useState(false)
    const [dateDoc, setDateDoc] = useState(new Date());
    const [docCode, setDocCode] = useState("")
    const [dataProductSelect, setDataProductSelect] = useState([])
    const [dataCustomer, setDataCustomer] = useState([])
    const [dataCustomerSelect, setDataCustomerSelect] = useState([])
    const [valueDialog, setValueDialog] = useState()
    const [dataVat, setDataVat] = useState([])
    const [dataVatData, setDataVatData] = useState([])
    const [dataDiscount, setDataDiscount] = useState([])
    const [fullPrice, setFullPrice] = useState(0);
    const [productNetamnt, setProductNetamnt] = useState(0);
    const [productAmount, setProductAmount] = useState(0);
    const [disibleDis, setDisibleDis] = useState(false);
    const [remark, setRemark] = useState("");
    const [discountSelect, setDiscountSelect] = useState([]);
    const [rateDiscountvalue, setRateDiscountvalue] = useState(0);
    const [discountTypeId, setDiscountTypeId] = useState(0);
    const [clearData, setClearData] = useState(false);
    const [vatGroupId, setVatGroupId] = useState("");
    const [roundingId, setRoundingId] = useState(0);
    const [baseAmountVat, setBaseAmountVat] = useState(0);
    const [vatAmount, setVatAmount] = useState(0);
    const [vatRate, setVatRate] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [disableSave, setDisableSave] = useState(false);
    const [valueText, setValueText] = useState("");
    const [valueChange, setValueChange] = useState()
    const [dataOrderDetail, setDataOrderDetail] = useState([]);
    const [customerData, setCustomerData] = useState([])


    const dataAPI = {
        "company_id": parseInt(userCompanyID),
        "branch_id": BranchData[0].master_branch_id,
    }

    const columnsProduct = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: true,
            width: "50px"
        },
        {
            name: 'Barcode',
            selector: row => row.master_product_barcode,
            sortable: true,
            width: "220px"
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.master_product_name_bill,
            sortable: true,
            width: "14rem"
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.master_product_unit_name,
            sortable: true,
        },
        {
            name: 'จำนวน',
            selector: (row, idx) => <InputText style={{ height: "100%", width: "50%", marginLeft:"50%",borderColor:"grey" }}
                type="number" id="saledt_qty" defaultValue={row.saledt_qty} onChange={(e) => onChangeQtyProduct(e, row, idx)} />,
            sortable: true,
            right: true
        },
        {
            name: 'ราคา/หน่วย',
            selector: row => nf.format(row.master_product_price),
            sortable: true,
        },
        {
            name: 'ส่วนลด(บาท)',
            selector: (row, idx) => <InputText style={{ height: "100%", width: "50%", marginLeft:"50%",borderColor:"grey" }}
                type="number" id="discount" defaultValue={row.discount} onChange={(e) => onChangeDiscountValueProduct(e, row, idx)} />,
            sortable: true,
            right: true
        },
        {
            name: 'ส่วนลด(%)',
            selector: (row, idx) => <InputText style={{ height: "100%", width: "50%", marginLeft:"50%",borderColor:"grey" }}
                type="number" id="discount_percent" defaultValue={row.discount} onChange={(e) => onChangeDiscountPercentProduct(e, row, idx)} />,
            sortable: true,
            right: true
        },
        {
            name: 'มูลค่าต่อรายการ',
            selector: row => nf.format(row.product_netamnt),
            sortable: true,
            right: true
        },
        {
            selector: (row, idx) => <BtnDelete style={{ height: "70%" }} onClick={(row) => onClickdeleteProduct(row, idx)} />,
            sortable: true,
            right: true
        },
    ]

    useEffect(() => {
        getDataDocumentCode()
        getDataVat()
        getDataDiscount();
        getDataRoinding();
    }, [])

    useEffect(() => {
        getDatatableOrderDtail()
    }, [valueDialog])

    useEffect(() => {
        
        setDiscountTypeId(0);
        getNetamntOrder(vatGroupId, 0, rateDiscountvalue)
        // if (dataProductSelect.length > 0) {
        //     getNetamntOrder(vatGroupId)
        // }
    }, [dataProductSelect, valueDialog]);

    useEffect(() => {
        if(productNetamnt === 0 && dataProductSelect.length === 0){
            setDisableSave(true);
        }else{
            setDisableSave(false);
        }
    }, [productNetamnt, dataProductSelect]);

    const getDataDocumentCode = () => {
        axios.post(UrlApi() + 'get_orderhd_docuno', dataAPI).then((res) => {
            if (res.data) {
                setDocCode(res.data[0]['docuno'])
            }
        })
    }

    const getDataVat = () => {
        axios.post(UrlApi() + 'getdata_vat', dataAPI).then((res) => {
            if (res.data) {
                setDataVat(res.data)
                setVatGroupId(res.data[0].master_vat_group_id);
                getDataVatData();
            }
        })
    }

    const getDataVatData = () => {
        axios.post(UrlApi() + 'getdata_vat_data', dataAPI).then((res) => {
            if (res.data) {
                setDataVatData(res.data)
            }
        })
    }

    const getDataRoinding = () => {
        axios.post(UrlApi() + 'getdata_roinding', dataAPI).then((res) => {
            if (res.data) {
                setRoundingId(parseInt(res.data[0].master_rounding_id))
            }
        })
    }

    const onChangeQtyProduct = (e, row, idx) => {
        if (e.target.value && parseInt(e.target.value) > 0) {
            let product_netamnt_value = (parseFloat(e.target.value) * parseFloat(row.master_product_price));
            row[e.target.id] = e.target.value;
            row.product_netamnt = (product_netamnt_value - parseFloat(row.discount)) - ((product_netamnt_value - parseFloat(row.discount)) * row.discount_percent / 100);
            getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue)
            setValueDialog(e)
        }else{
            row[e.target.id] = 1;
            getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue)
        }
    }

    const onChangeDiscountValueProduct = (e, row, idx) => {
        if (e.target.value !== "") {
            if(parseFloat(e.target.value) >= (row.full_price * parseInt(row.saledt_qty))){
                row.product_netamnt = 0;
                getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue)
            }else{
                let discount_value = parseFloat(row.saledt_qty) * parseFloat(row.master_product_price);
                row[e.target.id] = e.target.value;
                row.discount = parseFloat(e.target.value);
                row.product_netamnt = (discount_value - parseFloat(e.target.value)) - ((discount_value - parseFloat(e.target.value)) * row.discount_percent / 100);
                getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue)
                setValueDialog(e)
            } 
        }else{
            let discount_value = parseFloat(row.saledt_qty) * parseFloat(row.master_product_price);
            row.product_netamnt = discount_value - (row.discount_percent * discount_value) / 100;
            row.discount = 0;
            getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue)
        }
    }

    const onChangeDiscountPercentProduct = (e, row, idx) => {
        if (e.target.value !== "") {
            if(parseFloat(e.target.value) <= 100){
                let percent_value = (parseFloat(row.saledt_qty) * parseFloat(row.master_product_price)) - row.discount;
                row[e.target.id] = e.target.value;
                row.discount_percent = parseFloat(e.target.value);
                row.product_netamnt = percent_value - ((parseFloat(e.target.value) * percent_value) / 100);
                getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue)
                setValueDialog(e)
            }
        }else{
            row.product_netamnt = (parseFloat(row.saledt_qty) * parseFloat(row.master_product_price)) - row.discount;
            row.discount_percent = 0;
            getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue)
        }
    }

    const onClickdeleteProduct = (row, idx) => {
        let newData = [...dataProductSelect];
        newData.splice(idx, 1)
        setDataProductSelect(newData)
        getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue)
    }

    const onClickAddProduct = () => {
        setOpenDialogProduct(true)
    }

    const getValueMath = (value) => {
        if (value) {
            if (roundingId == 1) {
                return Math.round(parseFloat(value.toFixed(1)))
            } else if (roundingId == 2) {
                return Math.round(value)
            } else if (roundingId == 3) {
                return Math.floor(value)
            } else if (roundingId == 4) {
                return parseFloat(value.toFixed(2))
            }
        } else {
            return 0.00
        }
        
    }

  


    const getNetamntOrder = (vatGroupId, DiscountTypeid, DiscountRate) => {
        let rateVatvalue;
        let taxs;
        let taxValue;
        let amountTotals;
        dataVatData.map((item)=>{
            if(parseInt(vatGroupId) === parseInt(item.master_vat_group_id)){
                rateVatvalue = parseFloat(item.master_vat_rate);
            }
        });
        setVatRate(rateVatvalue);
        if (parseInt(vatGroupId) === 4) {
            let groupProductVat = _.groupBy(dataProductSelect, 'vat_activeflag');
            let sumProductVat = _.sumBy(groupProductVat[true], 'product_netamnt');
            let sumProduct = _.sumBy(dataProductSelect, 'product_netamnt');
            taxValue = ((parseFloat(sumProductVat) * (parseFloat(rateVatvalue)) / (100 + parseFloat(rateVatvalue))))
            taxs = ((parseFloat(sumProductVat)) - parseFloat(taxValue))
            amountTotals = (parseFloat(sumProduct))
            setProductAmount(getValueMath(sumProduct))
            setFullPrice(getValueMath(amountTotals));
            setProductNetamnt(getValueMath(amountTotals));
            setVatAmount(taxValue.toFixed(2));
            setBaseAmountVat(taxs.toFixed(2));
            onChangeDiscount(DiscountTypeid, DiscountRate, sumProduct, amountTotals, vatGroupId);
        } else if (parseInt(vatGroupId) === 5) {
            let groupProductVat = _.groupBy(dataProductSelect, 'vat_activeflag');
            let sumProductNoVat = _.sumBy(groupProductVat[false], 'product_netamnt');
            let sumProductVat = _.sumBy(groupProductVat[true], 'product_netamnt');
            taxValue = ((parseFloat(sumProductVat) * (parseFloat(rateVatvalue)) / 100))
            taxs = (parseFloat(sumProductVat))
            amountTotals = (parseFloat(sumProductVat) + parseFloat(taxValue)) + sumProductNoVat;
            setVatAmount(taxValue.toFixed(2));
            setBaseAmountVat(taxs.toFixed(2));
            setProductAmount(getValueMath(sumProductVat + sumProductNoVat))
            setFullPrice(getValueMath(amountTotals));
            setProductNetamnt(getValueMath(amountTotals));
            onChangeDiscount(DiscountTypeid, DiscountRate, sumProductVat + sumProductNoVat, amountTotals, vatGroupId);

        }else if(parseInt(vatGroupId) === 6){
            let sumProduct = _.sumBy(dataProductSelect, 'product_netamnt');
            taxValue = 0;
            amountTotals = (parseFloat(sumProduct))
            setProductAmount(getValueMath(sumProduct))
            setProductNetamnt(getValueMath(amountTotals))
            setFullPrice(getValueMath(amountTotals));
            setVatAmount(taxValue);
            setBaseAmountVat(0);
            onChangeDiscount(DiscountTypeid, DiscountRate, sumProduct, amountTotals, vatGroupId);

        }
    }

    const onChangeDiscount = (DiscountTypeid, DiscountRate, productAmount, productNetamnt, vatGroupId) => {
        if(DiscountTypeid !== 0){
            let rateVatvalue;
            let taxs;
            let taxValue;
            let totalDiscount;
            let sumProduct = productAmount;
            let amountTotals = productNetamnt;
            dataVatData.map((item)=>{
                if(parseInt(vatGroupId) === parseInt(item.master_vat_group_id)){
                    rateVatvalue = parseFloat(item.master_vat_rate);
                }
            });
            if (parseInt(DiscountTypeid) === 1) {
                if(sumProduct  >= DiscountRate){
                    totalDiscount = parseFloat(DiscountRate);
                    sumProduct = sumProduct - parseFloat(DiscountRate);
                    amountTotals = amountTotals - parseFloat(DiscountRate);
                }else{
                    totalDiscount = parseFloat(sumProduct);
                    sumProduct = 0;
                    amountTotals = 0;
                }
                setTotalDiscount(totalDiscount);
            } else if (parseInt(DiscountTypeid) === 2) {
                totalDiscount = (amountTotals * parseFloat(DiscountRate) / 100);
                setTotalDiscount(totalDiscount);
                sumProduct = sumProduct - ((sumProduct * parseFloat(DiscountRate)) / 100);
                amountTotals = amountTotals - ((amountTotals * parseFloat(DiscountRate)) / 100);
            }
            if (parseInt(vatGroupId) === 4) {
                taxValue = ((parseFloat(sumProduct) * (parseFloat(rateVatvalue)) / (100 + parseFloat(rateVatvalue))))
                taxs = ((parseFloat(sumProduct)) - parseFloat(taxValue))
                amountTotals = (parseFloat(sumProduct));
                setProductAmount(getValueMath(sumProduct));
                setProductNetamnt(getValueMath(amountTotals));
                setVatAmount(taxValue.toFixed(2));
                setBaseAmountVat(taxs.toFixed(2));
            } else if (parseInt(vatGroupId) === 5) {
                taxValue = ((parseFloat(sumProduct) * (parseFloat(rateVatvalue)) / 100))
                taxs = (parseFloat(sumProduct))
                amountTotals = (parseFloat(sumProduct));
                setVatAmount(taxValue.toFixed(2));
                setBaseAmountVat(taxs.toFixed(2));
                setProductAmount(getValueMath(sumProduct))
                setProductNetamnt(getValueMath(amountTotals + taxValue))
            }else if(parseInt(vatGroupId) === 6){
                taxValue = 0;
                amountTotals = (parseFloat(sumProduct))
                setProductAmount(getValueMath(sumProduct))
                setProductNetamnt(getValueMath(amountTotals))
                setVatAmount(taxValue);
                setBaseAmountVat(0);        
            }
        }
    }

    const onClickClear = () => {
        setTotalDiscount(0);
        setClearData(true);
        getDataDocumentCode()
        setDataProductSelect([])
        setProductNetamnt(0)
        setProductAmount(0)
    }

    const onChangeAddOrder = (e) => {
        if (dataCustomerSelect.length < 1) {
            setAlertMessages("กรุณาเลือกกลุ่มลูกค้า")
            setAlerttWarning(true)
        } else {
            if (e.target.value.length > 0) {
                let dataAPI = {
                    "company_id": parseInt(userCompanyID),
                    "branch_id": BranchData[0].master_branch_id,
                    "barcode": e.target.value.trim(),
                    "customer_id": parseInt(dataCustomerSelect[0]['arcustomer_id']),
                    "docdate": Moment(dateDoc).format("YYYYMMDD"),
                    "qty": 1
                }
                axios.post(UrlApi() + 'get_product_barcode_for_sale_order', dataAPI).then((res) => {
                    if (res.data.length > 0) {
                        res.data.map((item, idx) => {
                            item.saledt_qty = 1
                            item.product_netamnt = parseFloat(item.master_product_price)
                            item.full_price = parseFloat(item.master_product_price)
                            item.discount = 0;
                            item.discount_percent = 0;
                        })
                        dataProductSelect.push(res.data[0])
                        getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue);
                        setValueText("")
                        setValueChange(e)
                    } else {
                        setAlertMessages("ไม่พบข้อมูลสินค้านี้ในระบบ")
                        setAlerttWarning(true)
                        setValueText("")
                        setValueChange(e)
                    }
                })
                getInputTextBarcode()
                setAlerttWarning(false)
            }
        }
    }

    const onClickProductData = (data) => {
        data.map((item, idx) => {
            item.saledt_qty = 1
            item.product_netamnt = parseFloat(item.master_product_price)
            item.full_price = parseFloat(item.master_product_price)
            item.discount = 0;
            item.discount_percent = 0;
        })
        getNetamntOrder(vatGroupId, discountTypeId, rateDiscountvalue);
        setDataProductSelect(data)
    }

    const getdefaultCheck = () => {
        if (dataCustomerSelect.length > 0 && dataCustomerSelect.length > 0) {
            let Checks = _.findIndex(dataCustomer, { arcustomer_id: dataCustomerSelect[0]['arcustomer_id'].toString() })
            if (Checks >= 0) {
                dataCustomer[Checks]['defalutcus_active'] = true
            }
            setDataCustomer(dataCustomer)
        }
    }

    const OpenDialogCustomer = () => {
        getdefaultCheck()
        setOpenDialogCustomer(true)
    }

    const onClickSaveSaleOrder = () => {
        dataAPI.vatRate = vatRate;
        dataAPI.totalDiscount = totalDiscount;
        dataAPI.baseAmountVat = baseAmountVat;
        dataAPI.vatAmount = vatAmount;
        dataAPI.vatGroupId = vatGroupId;
        dataAPI.productNetamnt = productNetamnt;
        dataAPI.fullPrice = fullPrice;
        dataAPI.discountTypeId = discountTypeId;
        dataAPI.rateDiscountvalue = rateDiscountvalue;
        dataAPI.productAmount = productAmount;
        dataAPI.dataCustomerSelect = dataCustomerSelect
        dataAPI.remark = remark;
        dataAPI.emp_id = parseInt(userData[0]['emp_employeemasterid'])
        dataAPI.orderdt = dataProductSelect
        setDisableSave(true);
        axios.post(UrlApi() + 'save_orderhd_data', dataAPI).then((res) => {
            if (res.data.status == true) {
                setDisableSave(false);
                setAlertMessages("บันทึกข้อมูลเอกสารสำเร็จ")
                setAlertSuccess(true)
                onClickClear()
            } else {
                setDisableSave(false);
                setAlertMessages("ผิดพลาด")
                setAlerttWarning(true)
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
                setDataDiscount(res.data);
            })
    }

    const cusInput = () => {
        return (<i className="icon_date">
            <DateRangeIcon style={{ fontSize: "25px", color: "white", position: "center", marginLeft: "20px" }} /></i>
        )
    }

    const getDocument = () => {
        let dateDocs = Moment(dateDoc).format('DD/MM/') + (parseInt(dateDoc.getFullYear()) + 543)
        return (<Card className="card_sale"  style={{ maxHeight: "24vh", minHeight: "20vh", fontSize: "16px" }}>
            <div className="card_head" ><p className="textH_Left">ข้อมูลเอกสารใบสั่งขาย</p></div>
            <Card.Body className="card_body_doc">
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                    <div class="row">
                        <div class="col-3">
                            <p className="text_sale">วันที่เอกสาร</p>
                            <InputText type="text" style={{ height: "3vh", width: "135%" }} value={dateDocs} />
                        </div>
                        <div class="col-1">
                            <DatePicker
                                locale="th"
                                dateFormat="dd/MM/yyyy"
                                minDate={ new Date()}
                                customInput={cusInput()}
                                selected={dateDoc}
                                onChange={(date) => setDateDoc(date)}
                            />
                        </div>
                        <div class="col-4"  >
                            <p className="text_sale">เลขที่เอกสาร</p>
                            <InputText type="text" style={{ height: "3vh" }} value={docCode} disabled />
                        </div>
                        <div class="col-4" >
                            <span> <p className="text_sale">กลุ่มลูกค้า</p>
                                {dataCustomerSelect.length > 0 ?
                                    <InputText type="text" style={{ width: "85%", height: "3vh" }}
                                        value={dataCustomerSelect[0]['arcustomer_name']} disabled />
                                    : <InputText style={{ width: "85%", height: "3vh" }}/>
                                }
                                <BtnAdd style={{ width: "5%", height: "3vh", position: "absolute" }}
                                    onClick={() => { OpenDialogCustomer() }} icons={<AiIcons.AiOutlineUserAdd />} />
                            </span>
                        </div>
                        <div class="col-4">
                            <p className="text_sale" >ผู้บันทึก</p>
                            <InputText style={{ height: "3vh" }} type="text" value={userData[0]['user_name'] + ':' + userData[0]['firstname'] + ' ' + userData[0]['lastname']} disabled />
                        </div>
                        <div class="col-4">
                            <p className="text_sale">รายละเอียดกลุ่มลูกค้า</p>
                            <InputText type="text" style={{ height: "3vh" }} value={dataCustomerSelect.length > 0 ? dataCustomerSelect[0].address_name :""} disabled />
                        </div>
                        <div class="col-4">
                            <p className="text_sale">หมายเหตุเอกสาร </p>
                            <InputText type="text" style={{ height: "3vh" }}  onChange={(e)=>{
                                setRemark(e.target.value);
                            }}/>
                        </div>
                    </div>
                </LocalizationProvider>
            </Card.Body>
        </Card>)
    }

    const getInputTextBarcode = () => {
        return <InputText 
            type="text" 
            style={{ height: "3vh", fontSize: "16px", width: "130%" }}
            defaultValue={valueText} 
            value={valueText} 
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' ? onChangeAddOrder(e) : null} 
            onChange={(e) => setValueText(e.target.value)} 
        />
    }

    const getDatatableOrderDtail = () => {
        return (
            <Card className="card_sale" style={{ minHeight: "32vh", maxHeight: "48vh", marginTop: "1%" }}>
                <div className="card_head" ><p className="textH_Left">รายละเอียดใบสั่งขาย</p></div>
                <Card.Body className="card_body_doc">
                    <div class="row">
                        <div class="col-2">
                            {getInputTextBarcode()}
                        </div>
                        <div class="col-1">
                            <BtnAdd style={{ height: "3.2vh", width: "100%", backgroundColor: "#74E0C0" }} message="สินค้า"onClick={() => onClickAddProduct()} icons={<ZoomInIcon />} />
                        </div>
                        <div class="col-1">
                            <BtnAdd style={{ height: "3.2vh", width: "120%", backgroundColor: "#FEAE5F" }} message="ล้างข้อมูล"  onClick={() => onClickClear()}  />
                        </div>
                    </div>
                    <div style={{ minHeight: "30vh", maxHeight: "42vh", overflow: 'auto', marginTop: "1%"  }}>
                        <DataTables
                            striped
                            dense
                            customStyles={customStyles}
                            data={dataProductSelect}
                            columns={columnsProduct}
                        />
                    </div>
                </Card.Body>
            </Card>
        )
    }

    const getDataDetail = () => {
        return (<Card className="card_sale" style={{ maxHeight: "24vh", minHeight: "22vh", marginTop: "1%", fontSize: "16px" }}>
            <div className="card_head"> <p className="textH_Left">รายละเอียดการคำนวณ</p></div>
            <Card.Body className="card_body_doc">
                <div class="row">
                    <div class= "col-4">
                        <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มส่วนลด</p>
                        <InputSelect style={{ height: "3vh" }} option={dataDiscount} id_key="promotion_discount_id"
                                     value_key="promotion_discount_name"
                                     onChange={(e) => {
                                        if(e.target.value === ""){                         
                                            getNetamntOrder(vatGroupId, 0, 0)
                                            setDiscountTypeId(0);
                                            setRateDiscountvalue(0);
                                        }else{
                                            dataDiscount.map((item)=>{
                                                if(item.promotion_discount_id === parseInt(e.target.value)){
                                                    setDiscountTypeId(item.promotion_discount_type_id);
                                                    setRateDiscountvalue(parseFloat(item.promotion_discount_rate));
                                                    onChangeDiscount(item.promotion_discount_type_id, parseFloat(item.promotion_discount_rate), productAmount, productNetamnt, vatGroupId);
                                                }
                                            });
                                        }
                                       
                                     }} 
                                     value={discountSelect.length > 0 ? discountSelect[0]['promotion_discount_id'] : "0"} 
                                     disabled={disibleDis} 
                                     defaultValue={discountTypeId}/>
                        <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มภาษี</p>
                        <InputSelect style={{ height: "3vh" }} option={dataVatData} id_key="master_vat_group_id"
                                     value_key="master_vat_group_name"
                                     onChange={(e) => {
                                        if(e.target.value !== ""){
                                            setVatGroupId(e.target.value);
                                            getNetamntOrder(e.target.value, discountTypeId, rateDiscountvalue);
                                        }                                      
                                     }} value={discountSelect.length > 0 ? discountSelect[0]['master_vat_group_id'] : "0"} disabled={disibleDis} 
                                     defaultValue={dataVat.length > 0 && dataVat[0].master_vat_group_id}/>
                    </div>
                    <div class= "col-4">
                        <p className="text_sale" style={{ marginTop: "1%" }}>รวมมูลค่าสินค้า</p>
                        <InputText style={{ height: "3vh" }} type="text" value={nf.format(productAmount)} disabled />
                        <p className="text_sale" style={{ marginTop: "1%" }}>มูลค่าสุทธิ</p>
                        <InputText style={{ fontSize: "1.5vw", height: "4vh" }} type="text" value={nf.format(productNetamnt)} disabled />
                    </div>
                    <div class="col-4">
                        <BtnAdd className="btn_add_pay" style={{ height: "8vh", marginTop: "6%", marginLeft: "2%", width: "95%", fontSize: "1.5vw" }}
                            message="บันทึก" 
                            icons={< Icon path={mdiContentSaveCheckOutline} size={2} />} 
                            onClick={()=>onClickSaveSaleOrder()}
                            disabled={disableSave}/>
                    </div>
                </div>
            </Card.Body>
        </Card>)
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const getDialogProduct = () => {
        return (<DialogProduct
            cleardata={clearData}
            datadefault={dataProductSelect}
            onClose={(e) => {
                setClearData(false);
                setOpenDialogProduct(e);
            }}
            openDialog={openDialogProduct}
            onClick={(e) => {
                setClearData(false);
                console.log(e);
                onClickProductData(e)
            }} />)
    }

    const getDialogCustomer = () => {
        return (<DialogCustomer
            datadefault={dataCustomerSelect}
            onClose={(e) => setOpenDialogCustomer(e)}
            openDialog={openDialogCustomer}
            onClick={(e) => setDataCustomerSelect(e)} />)
    }

    return (<div style={{ marginLeft: "1%", marginRight:"1%" }}>
        {getDialogProduct()}
        {getDialogCustomer()}
        {getAlert()}
        <div style={{ marginRight: "1%", marginLeft: "1%", marginTop: "10px" }}>
            <div class="row">
                <div class="col-12">
                    {getDocument()}
                    {getDatatableOrderDtail()}
                    {getDataDetail()}
                </div>
            </div>
        </div>
    </div>)
}

export default memo(SaleOrder);