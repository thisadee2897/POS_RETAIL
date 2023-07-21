import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import InputText from "../../../components/Input/InputText";
import DataTables from 'react-data-table-component';
import DataTable from '../../../components/Datatable/Datatables';
import BtnAdd from "../../../components/Button/BtnAdd";
import BtnCancel from "../../../components/Button/BtnCancel";
import Moment from 'moment';
import Card from 'react-bootstrap/Card';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import * as AiIcons from 'react-icons/ai';
import InputSelect from "../../../components/Input/InputSelect";
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import '../../../components/CSS/report.css';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import DataContextActions from "../../../DataContext/DataContextMenuActions";
import Swithstatus from "../../../components/SwitchStatus/Switchstatus"
import FilterDataTable from "../../../components/SearchDataTable/FilterDataTable";
import SearchDialog from "../../../components/SearchDialog/SearchDialog";
import AddIcon from '@mui/icons-material/Add';
import BtnDelete from "../../../components/Button/BtnDelete";
import { addDays } from '@progress/kendo-date-math';
import SaveIcon from '@mui/icons-material/Save';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Icon from '@mdi/react';
import { mdiAccountMultiplePlusOutline } from '@mdi/js';

const customStyles = {
    headCells: {
        style: {
            background: '#0064B0',
            color: "white",
            minHeight: "1vh",
            maxHeight: "4vh",
            fontSize: "16px"
        },
    },
};

const DataDetail = (props) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const ActionsData = useContext(DataContextActions);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [dateDoc, setDateDoc] = useState(new Date());
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogCreditVat, setOpenDialogCreditVat] = useState(false)
    const [openDialogtran, setOpenDialogtran] = useState(false)
    const [dataCustomer, setDataCustomer] = useState([])
    const [cusData, setCusData] = useState()
    const [dataDiscount, setDataDiscount] = useState([])
    const [dataVoucher, setDataVoucher] = useState([])
    const [dataCategory, setDataCategory] = useState([])
    const [dataPoint, setDataPoint] = useState([])
    const [dataPointSelect, setDataPointSelect] = useState([])
    const [dataVat, setDataVat] = useState([])
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
    const [disiPoint, setDisiPoint] = useState(false)
    const [dataOrderDetail, setDataOrderDetail] = useState([])
    const [customerDataDefault, setCustomerDataDefault] = useState([])
    const [voucherValue, setVoucherValue] = useState(0)
    const [rateDisvalue, setRateDisvalue] = useState(0)
    const [rateCatvalue, setRateCatvalue] = useState(0)
    const [rateVatvalue, setRateVatvalue] = useState(0)
    const [ratePoint, setRatePoint] = useState(0)
    const [vateName, setVateName] = useState("")
    const [vateID, setVateID] = useState("")
    const [pointCus, setPointCus] = useState([])
    const [pointType, setPointType] = useState([])
    const [pointCustrans, setPointCustrans] = useState([])
    const [pointQuantity, setPointQuantity] = useState(0)
    const [pointDis, setPointDis] = useState(0)
    const [totalPoint, setTotalPoint] = useState(0)
    const [dataPointCus, setDataPointCus] = useState([])
    const [dataRounding, setDataRounding] = useState([])
    const [Mathsvalue, setMathsvalue] = useState()
    const [disibleDis, setDisibleDis] = useState(false)
    const [sumProductVat, setSumProductVat] = useState(0)
    const [sumProductNoVat, setSumProductNoVat] = useState(0)
    const [dataCheckOptions, setDataCheckOptions] = useState(true)
    const [dataCustomerPoint, setdataCustomerPoint] = useState([])
    const [valueInput, setValueInput] = useState()
    const [dataSearch, setDataSearch] = useState([])
    const [discountSelect, setDiscountSelect] = useState([])
    const [disValue, setDisvalue] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [deleteDeposit, setDeleteDeposit] = useState()
    const [deposiValue, setDepositValue] = useState(0)
    const [depositUses, setDipositUses] = useState(0)
    const [openDialogDeposit, setOpenDialogDeposit] = useState(false)
    const [openDialogDepositAdd, setOpenDialogDepositAdd] = useState(false)
    const [dataDeposit, setDataDeposit] = useState([])
    const [dataDepositSelect, setDataDepositSelect] = useState([])
    const [valueCheck, setValueCheck] = useState()
    const [dataVatselect, setDataVatselect] = useState([])
    const [creditDate, setCreditDate] = useState(new Date())
    const [creditDay, setCreditDay] = useState(0)

    const columnsdata = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}>
                < FormControlLabel style={{ color: "black" }} control={
                    <Radio defaultChecked={row.cusdefault_active} disabled={!row.arcustomer_active}
                        value={row.arcustomer_id} onClick={(e) => { OnchangeCheckcus(e, row) }}
                    />} /> </div>,
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

    const columnsdatatrans = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'ชื่อสาขา',
            selector: row => row.master_branch_name,
            width: '150px',
        },
        {
            name: 'วันที่เอกสาร',
            selector: row => row.dates,
            sortable: true,
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => row.point_trans_docuno,
            sortable: true,
        },
        {
            name: 'ยอดค่าใช้จ่าย',
            selector: row => nf.format(row.salehd_netamnt),
            sortable: true,
        },
        {
            name: 'คะแนนสะสมที่ได้รับ',
            selector: row => row.point_quantity,
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
            name: 'เลือก',
            selector: (row, idx) => <div style={{ marginLeft: "10%" }}>
                <FormControlLabel style={{ color: "black" }}
                    control={<Checkbox defaultChecked={row.defaultCheck} checked={row.defaultCheck}
                        value={row.deposithd_balance_amnt} onClick={(e) => { OnchangeCheckDeposit(e, row, idx) }}
                    />} /> </div>
            ,
            sortable: true,
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => row.deposithd_docuno,
            sortable: true,
            width: "200px"
        },
        {
            name: 'วันที่เอกสาร',
            selector: row => row.docDate,
            sortable: true,
            width: '300px'
        },
        {
            name: 'มูลค่า',
            selector: row => nf.format(row.deposithd_balance_amnt),
            sortable: true,
        },
    ]

    const columnsdataDepositSelect = [
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
            width: '300px'
        },
        {
            name: 'มูลค่าเงินมัดจำ',
            selector: row => nf.format(row.deposithd_balance_amnt),
            sortable: true,
        },
        {
            name: 'มูลค่าที่ใช้',
            selector: (row, idx) => <InputText style={{ width: "60%" }} type="number" defaultValue={row.deposit_use > 0 ? row.deposit_use : row.deposithd_balance_amnt} onChange={(e) => onChangeAmountDeposit(e, row, idx)} />,
            sortable: true,
        },
        {
            name: 'มูลค่าเหลือ',
            selector: row => nf.format(row.deposit_amt),
            sortable: true,
        },
        {
            selector: (row, idx) => <BtnDelete onClick={() => onClciDeleteDepositSelect(row, idx)} />,
            sortable: true,
        },
    ]

    useEffect(() => {
        if (ActionsData.length > 0 && ActionsData[0].menuID) {
            getDataDefault()
            getCheckOption()
        }
    }, [ActionsData])

    useEffect(() => {
        setCusData(props.customersData)
    }, [props.customersData])

    useEffect(() => {
        setvatCredit(props.vatsCredit)
    }, [props.vatsCredit])

    useEffect(() => {
        setDataOrderDetail(props.dataOrderdetails)
        sumDataOrderdetail()
        getDataSumVatFromproduct()
        // if (props.dataOrderdetails.length > 0) {
           
        // }
    }, [props])

    useEffect(() => {
        if (props.customersData) {
            setCustomerDataDefault(props.customersData)
        }
    }, [props.customersData])

    useEffect(() => {
        getCustomerDataDetail()
    }, [customerDataDefault])

    useEffect(() => {
        getDataCuspoint()
        getdataPointtype()
        getDataCuspointTransection()
        CheckPoint()
        CalPointType()
    }, [customerDataDefault])

    useEffect(() => {
        if (dataCustomerPoint.length > 0) {
            getdataPointtypeCus()
            CheckPoint()
            CalPointType()
        }
    }, [dataCustomerPoint])

    useEffect(() => {
        getValueAmount()
    }, [amountProduct, vateName, disValue, rateDisvalue, catesRate, vatCredit, pointDis, ratePoint, depositUses, amountTotal])

    useEffect(() => {
        if (dataPointSelect.length > 0) {
            CheckPoint()
        }
    }, [dataPointSelect])

    useEffect(() => {
        CalPointType()
    }, [amountTotal, dataPointSelect, pointType])

    useEffect(() => {
        props.onChageMathvalue(Mathsvalue)
    }, [Mathsvalue])

    useEffect(() => {
        props.onChangeTaxs(taxs)
        props.onChangeTaxsBase(taxBase)
        props.onchangeAmount(amountTotal)
        props.onChangeDiscount(discount)
        props.onChangeCat(cates)
        props.onChangeDepositSelect(dataDepositSelect)
        props.onChangeDataVatSelect(dataVatselect)
        props.onChangeCreditDay(creditDay)
        props.onChangeCreditDate(creditDate)
    }, [taxs, taxBase, amountTotal, discount, cates, dataDepositSelect, dataVatselect, creditDay, creditDate])


    useEffect(() => {
        if (props.clearDatavalue == true) {
            ClearDatas()
        }
    }, [props.clearDatavalue])

    useEffect(() => {
        getDataCustomer()
    }, [searchText])

    useEffect(() => {
        getDialogDepositAdd()
    }, [valueCheck])

    useEffect(() => {
        setCusData(props.customersData)
    }, [props.customersData])

    useEffect(() => {
        getDataDeposit()
    }, [cusData])

    useEffect(() => {
        getCreditDate()
    }, [customerDataDefault, creditDay])

    const ClearDatas = () => {
        setDiscountSelect([])
        setdataCustomerPoint([])
        setDataDepositSelect([])
        setDataDiscount([])
        setDataVoucher([])
        setDataCategory([])
        setDataPoint([])
        setDataPointSelect([])
        setCustomerDataDefault(props.customersData)
        setDataVat([])
        setCates(0)
        setCatesRate(0)
        setPointDis(0)
        setRatePoint(0)
        setDiscount(0)
        setTaxBase(0)
        setAmountProduct(0)
        setamountTotal(0)
        setProductDiscount(0)
        setTaxs(0)
        setvatCredit(0)
        setTotalPoint(0)
        setSumProductVat(0)
        setSumProductNoVat(0)
        setRateDisvalue(0)
        setDiscountSer(0)
        setDepositValue(0)
        setDipositUses(0)
        setDisiPoint(false)
        getDataDefault()
    }

    const getDataDefault = () => {
        getDataDiscount()
        getDataVoucher()
        getDataCategory()
        getDataPoint()
        getDataVat()
        getDataCustomer()
        getDataBranchRounding()
    }

    const getCheckOption = () => {
        let datas = {
            "company_id": parseInt(userCompanyID),
            "menu_id": parseInt(ActionsData[0].menuID)
        }
        //console.log(datas)
        axios.post(UrlApi() + 'get_check_option_menu', datas).
            then((res) => {
                //setDataCheckOptions(res.data[0]['fn_check_option_menu'])
            })
    }

    const getDataBranchRounding = () => {
        let datas = {
            "company_id": parseInt(userCompanyID),
            "branch_id": BranchData[0].master_branch_id,
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

    const getDataCuspoint = () => {
        if (customerDataDefault.length > 0) {
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "customer_id": parseInt(customerDataDefault[0]['arcustomer_id'])
            }
            axios.post(UrlApi() + 'getcustomer_points', datas)
                .then(res => {
                    if (res.data) {
                        setPointCus(res.data)
                    }
                })
        }
    }

    const getDataCuspointCus = (data) => {
        if (data.length > 0) {
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "customer_id": parseInt(data[0]['arcustomer_id'])
            }
            axios.post(UrlApi() + 'getcustomer_points', datas)
                .then(res => {
                    if (res.data) {
                        setDataPointCus(res.data)
                    }
                })
        }
    }

    const getDataCuspointTransection = () => {
        if (customerDataDefault.length > 0) {
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "customer_id": parseInt(customerDataDefault[0]['arcustomer_id']),
                "years": Moment(new Date()).format("YYYY")
            }
            axios.post(UrlApi() + 'getcustomer_pointstransection', datas)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            let y = parseInt(Moment(item.point_trans_docudate).format("YYYY")) + 543
                            item.dates = Moment(item.point_trans_docudate).format("DD/MM/") + y
                            item.row_num = idx + 1
                        })
                        setPointCustrans(res.data)
                        CheckPoint()
                    }
                })
        }
    }

    const getDataCuspointTransectionCus = (data) => {
        if (data.length > 0) {
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "customer_id": parseInt(data[0]['arcustomer_id']),
                "years": Moment(new Date()).format("YYYY")
            }
            axios.post(UrlApi() + 'getcustomer_pointstransection', datas)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            let y = parseInt(Moment(item.point_trans_docudate).format("YYYY")) + 543
                            item.dates = Moment(item.point_trans_docudate).format("DD/MM/") + y
                            item.row_num = idx + 1
                        })
                        setPointCustrans(res.data)
                        CheckPoint()
                    }
                })
        }
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

    const getDataDeposit = () => {
        if (cusData && cusData.length > 0) {
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "customer_id": parseInt(cusData[0]['arcustomer_id']),
                "branch_id": BranchData[0].master_branch_id,
            }
            axios.post(UrlApi() + 'get_deposit_sale', datas)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            item.defaultCheck = false
                            let Str_y = parseInt(Moment(item.deposithd_docudate).format("YYYY")) + 543
                            item.docDate = Moment(item.deposithd_docudate).format("DD/MM/") + Str_y
                            item.deposit_amt = 0
                        })
                        setDataDeposit(res.data)
                    }
                })
        }
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
                            setDisiPoint(true)
                            getPointSelect()
                            props.onChangeDataDiscountSelect([item])
                        }
                        item.id = item.salehd_discount_type_id
                        item.value = item.salehd_discount_type_name
                    })
                    setDataDiscount(res.data)
                }
            })
    }

    const getDataVoucher = () => {
        const datas = {
            "company_id": parseInt(userCompanyID),
        }
        axios.post(UrlApi() + 'getdata_voucher', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.id = item.salehd_voucher_type_id
                        item.value = item.salehd_voucher_type_name
                    })
                    setDataVoucher(res.data)
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

    const getDataPoint = () => {
        const datas = {
            "company_id": parseInt(userCompanyID),
        }
        axios.post(UrlApi() + 'getdata_promotion_point', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.id = item.promotion_point_type_id
                        item.value = item.promotion_point_type_name
                    })
                    setDataPoint(res.data)
                }
            })
    }

    const getDataVat = () => {
        const datas = {
            "company_id": parseInt(userCompanyID),
            "branch_id": BranchData[0].master_branch_id,
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

    const getdataPointtype = () => {
        if (customerDataDefault.length > 0 && dataCustomerPoint.length == 0) {
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "customer_id": parseInt(customerDataDefault[0]['arcustomer_id'])
            }
            axios.post(UrlApi() + 'getdata_pointtype', datas)
                .then(res => {
                    if (res.data) {
                        setPointType(res.data)
                    }
                })
        }
    }

    const getdataPointtypeCus = () => {
        if (dataCustomerPoint.length > 0) {
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "customer_id": parseInt(dataCustomerPoint[0]['arcustomer_id'])
            }
            axios.post(UrlApi() + 'getdata_pointtype', datas)
                .then(res => {
                    if (res.data) {
                        setPointType(res.data)
                    }
                })
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
        } else if (customerDataDefault.length > 0 && customerDataDefault[0]['arcustomer_creditday']) {
            setCreditDay(customerDataDefault[0]['arcustomer_creditday'])
        }
    }

    const OnchangeCheckDeposit = (e, row, idx) => {
        if (e.target.value) {
            dataDeposit[idx]['defaultCheck'] = e.target.checked
        }
        setDataDeposit(dataDeposit)
        setValueCheck(row)
        //setOpenDialogDepositAdd(false)
    }

    const onClickAddDepositSelect = () => {
        let dataAdds = []
        dataDeposit.map((item, idx) => {
            if (item.defaultCheck == true) {
                dataAdds.push(item)
            }
        })
        setDataDepositSelect(dataAdds)
        setOpenDialogDepositAdd(false)
    }

    const onChangeAmountDeposit = (e, row, idx) => {
        let netAmt = dataDepositSelect[idx]['deposithd_balance_amnt']
        if (parseFloat(e.target.value) > parseFloat(netAmt)) {
            setAlertMessages("ไม่สามารถใช้จำนวนเงินมัดจำ")
            setAlerttWarning(true)
            dataDepositSelect[idx]['deposit_amt'] = netAmt
        } else {
            let Amonuts = (parseFloat(netAmt) - parseFloat(e.target.value))
            dataDepositSelect[idx]['deposit_use'] = e.target.value
            dataDepositSelect[idx]['deposit_amt'] = Amonuts
            setDataDepositSelect(dataDepositSelect)
            setDeleteDeposit(e.target.value)
        }
    }

    const onClciDeleteDepositSelect = (row, idx) => {
        dataDepositSelect.splice(idx, 1)
        setDataDepositSelect(dataDepositSelect)
        setDeleteDeposit(row)
        let findIdx = _.findIndex(dataDeposit, { depositdt_id: row.depositdt_id })
        dataDeposit[findIdx]['defaultCheck'] = false
    }

    const onClickAddDeposit = () => {
        setDiscountSelect([])
        setDataCategory([])
        getDataCategory()
        setRateDisvalue(0)
        setCatesRate(0)
        dataDepositSelect.map((item, idx) => {
            item.deposit_use = item.deposit_use ? parseFloat(item.deposit_use) : parseFloat(item.deposithd_balance_amnt)
        })
        let SumUse = _.sumBy(dataDepositSelect, 'deposit_use');
        if (parseFloat(SumUse) > parseFloat(amountProduct)) {
            setAlertMessages("จำนวนเงินมัดจำที่ใช้มากกว่ายอดสุทธิ")
            setAlerttWarning(true)
        } else {
            setDipositUses(SumUse)
            setOpenDialogDeposit(false)
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

    const checkDefault = () => {
        if (dataCustomerPoint.length > 0) {
            dataCustomer.map((item, idx) => {
                item.cusdefault_active = item.arcustomer_id == dataCustomerPoint[0]['arcustomer_id'] ?
                    true : false
            })
        } else if (customerDataDefault.length > 0) {
            dataCustomer.map((item, idx) => {
                item.cusdefault_active = item.arcustomer_id == customerDataDefault[0]['arcustomer_id'] ?
                    true : false
            })
        }
        setDataCustomer(dataCustomer)
    }

    const OnchangeCheckcus = (e, row) => {
        if (e.target.value) {
            setdataCustomerPoint([row])
            setCustomerDataDefault([row])
            setOpenDialog(false)
            getDataCuspointCus([row])
            getDataCuspointTransectionCus([row])
            checkDefault()
            CalPointType()
        }
    }

    const onClickAddCustomer = () => {
        setOpenDialog(false)
    }

    const sumDataOrderdetail = () => {
        if (props.dataOrderdetails.length > 0) {
            props.dataOrderdetails.map((item, idx) => {
                item.saledt_netamnt = parseFloat(item.saledt_netamnt)
            })
            let sumNetamnt = _.sumBy(props.dataOrderdetails, 'saledt_netamnt')
            setAmountProduct(sumNetamnt)
            props.onChangeAmountTotals(sumNetamnt)
        } else {
            setAmountProduct(0)
            props.onChangeAmountTotals(0)
        }
    }

    const getDataSumVatFromproduct = () => {
        let groupdatas = _.groupBy(props.dataOrderdetails, 'saledt_vatflag')
        if (groupdatas[true]) {
            let sumNetamntvat = _.sumBy(groupdatas[true], 'saledt_netamnt')
            setSumProductVat(getValueMath(sumNetamntvat))
            props.onChageSumProvat(getValueMath(sumNetamntvat))

        } else if (groupdatas[false]) {
            let sumNetamntNovat = _.sumBy(groupdatas[false], 'saledt_netamnt')
            setSumProductNoVat(getValueMath(sumNetamntNovat))
            props.onChageSumProNovat(getValueMath(sumNetamntNovat))
        }
    }

    const onChangeVoucher = (e) => {
        if (e.target.value) {
            let findIndex = _.findIndex(dataVoucher, { id: parseInt(e.target.value) })
            let voucherValue = dataVoucher[findIndex]['salehd_voucher_type_rate']
            setVoucherValue(voucherValue)
            //props.onChangeVoucher(voucherValue)
            props.onChangeDataVoucherSelect(dataVoucher[findIndex])
        }
    }

    const onChangeDiscount = (e) => {
        if (e.target.value) {
            let findIndex = _.findIndex(dataDiscount, { promotion_discount_id: parseInt(e.target.value) })
            setDiscountSelect([dataDiscount[findIndex]])
            if (dataDiscount[findIndex]['promotion_discount_type_id'] === 2) { //ตรวจสอบไอดีประเภทส่วนลด 1 = ส่วนลดเป็น บาท 2 = ส่วนลดเป็น %
                setRateDisvalue(parseFloat(dataDiscount[findIndex]['promotion_discount_rate']))
                setDisvalue(0)
            } else {
                setDisvalue(parseFloat(dataDiscount[findIndex]['promotion_discount_rate']))
                setRateDisvalue(0)
            }
            setDisiPoint(true)
            getPointSelect()
            getValueAmount()
            props.onChangeDataDiscountSelect([dataDiscount[findIndex]])
        } else {
            setDisvalue(0)
            setRateDisvalue(0)
            getValueAmount()
            setDiscountSelect([])
            props.onChangeDataDiscountSelect([])
            setDisiPoint(!disiPoint)
            getPointSelect()
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

    const onChangePoint = (e) => {
        if (pointCustrans.length > 0) {
            pointCustrans.map((item, idx) => {
                item.point_quantity = parseInt(item.point_quantity)
            })
        }
        let SumPoints = _.sumBy(pointCustrans, 'point_quantity');
        if (e.target.value) {
            if (pointCustrans.length > 0) {
                let findIndex = _.findIndex(dataPoint, { id: parseInt(e.target.value) })
                if (parseFloat(dataPoint[findIndex]['promotion_point_type_quantity']) > parseInt(SumPoints)) {
                    setAlerttWarning(true)
                    setAlertMessages("แต้มสะสมน้อยกว่าที่จะใช้แลก")
                    setPointQuantity(0)
                    setDataPoint(dataPoint)
                    props.onChagePointSelect()
                    setDataPoint([])
                    getDataPoint()
                } else {
                    if (dataPoint[findIndex]['promotion_point_cal_type_id'] == 1) {
                        setRatePoint(parseFloat(dataPoint[findIndex]['promotion_point_type_rate']))
                        setPointQuantity(parseFloat(dataPoint[findIndex]['promotion_point_type_quantity']))
                    } else if (dataPoint[findIndex]['promotion_point_cal_type_id'] == 2) {
                        setPointQuantity(parseFloat(dataPoint[findIndex]['promotion_point_type_quantity']))
                        setPointDis(parseFloat(dataPoint[findIndex]['promotion_point_type_rate']))
                        setRatePoint(0)
                    }
                    getValueAmount()
                    setDisibleDis(true)
                    props.onChagePointSelect(dataPoint[findIndex])
                }
            } else {
                setAlerttWarning(true)
                setAlertMessages("แต้มสะสมน้อยกว่าที่จะใช้แลก")
                setPointQuantity(0)
                setDataPoint(dataPoint)
                props.onChagePointSelect()
                setDataPoint([])
                getDataPoint()
            }
        } else {
            setRatePoint(0)
            setPointQuantity(0)
            getValueAmount()
            props.onChagePointSelect([])
            setDisibleDis(false)
        }
    }

    const CheckPoint = () => {
        if (pointCustrans.length > 0 && pointCus.length > 0) {
            pointCustrans.map((item, idx) => {
                item.point_quantity = parseInt(item.point_quantity)
            })
            let Sumdata = _.sumBy(pointCustrans, 'point_quantity');
            if (parseInt(pointCustrans[0]['point_quantity']) > parseInt(Sumdata)) {
                setAlerttWarning(true)
                setAlertMessages("แต้มสะสมไม่สามารถใช้ได้")
                setPointQuantity(0)
            } else {
                getValueAmount()
            }
        } else if (pointQuantity > 0) {
            setAlerttWarning(true)
            setAlertMessages("แต้มสะสมไม่สามารถใช้ได้")
            setPointQuantity(0)
        }
    }

    const CalPointType = () => {
        if (dataCustomerPoint.length > 0) {
            if (pointType.length > 0) {
                let rates = pointType[0]['point_type_rate']
                let points = Math.floor(parseInt(amountTotal) / parseInt(rates))
                setTotalPoint(points)
                let dataPointall = []
                dataCustomerPoint.map((item, idx) => {
                    item.pointvalue = points
                    dataPointall.push(item)
                })
                props.onChagePoints(dataCustomerPoint)
                props.onChangePointType(pointType)
            } else {
                let dataPointall = []
                setTotalPoint(0)
                dataCustomerPoint.map((item, idx) => {
                    item.pointvalue = 0
                    dataPointall.push(item)
                })
                props.onChagePoints(dataCustomerPoint)
                props.onChangePointType([])
            }
        } else if (customerDataDefault.length > 0) {
            if (pointType.length > 0) {
                let rates = pointType[0]['point_type_rate']
                let points = Math.floor(parseInt(amountTotal) / parseInt(rates))
                setTotalPoint(points)
                let dataPointall = []
                customerDataDefault.map((item, idx) => {
                    item.pointvalue = points
                    dataPointall.push(item)
                })
                props.onChagePoints(customerDataDefault)
                props.onChangePointType(pointType)
            } else {
                let dataPointall = []
                setTotalPoint(0)
                customerDataDefault.map((item, idx) => {
                    item.pointvalue = 0
                    dataPointall.push(item)
                })
                props.onChagePoints(dataCustomerPoint)
                props.onChangePointType([])
            }
        }
    }


    const getValueAmount = () => {
        let taxValue = 0
            let taxs = 0
            let sum_dis = 0
            let totalProductDiscount = 0
            let catValue = 0
            let amount = 0
            let amountTotals = 0
            let disCount = 0
            let groupdatas = _.groupBy(props.dataOrderdetails, 'master_order_location_type_id')
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
            //Cal with DepositSelect
            if (parseFloat(depositUses) > parseFloat(amount_disCount)) {
                let deposUse = (parseFloat(depositUses) - parseFloat(amount_disCount))
                let totalnetmnt_deposit = (parseFloat(depositUses) - parseFloat(deposUse))
                amount = 0
                dataDepositSelect.map((item, idx) => {
                    item.depositUses = deposUse
                    item.deposit_amt = totalnetmnt_deposit
                })
                setDipositUses(deposUse)
                setDataDepositSelect(dataDepositSelect)
            } else if (parseFloat(amount_disCount) >= parseFloat(depositUses)) {
                amount = (parseFloat(amount_disCount) - parseFloat(depositUses)) + parseFloat(vatCredit)
                dataDepositSelect.map((item, idx) => {
                    item.depositUse = deposiValue
                    item.deposit_netamt = 0
                })
                setDataDepositSelect(dataDepositSelect)
            } else {
                amount = ((parseFloat(amountProduct) + parseFloat(vatCredit) + parseFloat(discountSer)) - parseFloat(sum_dis))
            }
            //Cal from Vat
            //1/4/2565 change cal creditvat
            if (vateID == 4) {
                taxValue = ((parseFloat(amount) * (parseFloat(rateVatvalue)) / (100 + parseFloat(rateVatvalue))))
                taxs = ((parseFloat(amount)) - parseFloat(taxValue))
                catValue = (parseFloat(taxs) * (parseFloat(catesRate) / 100))
                amountTotals = (parseFloat(amount) - parseFloat(catValue))
            } else if (vateID == 5) {
                taxValue = ((parseFloat(amount) * (parseFloat(rateVatvalue)) / 100))
                taxs = (parseFloat(amount))
                catValue = (parseFloat(taxs) * (parseFloat(catesRate) / 100))
                amountTotals = (parseFloat(amount) + parseFloat(taxValue)) - parseFloat(catValue)
            }
            if (parseFloat(vatCredit) > 0) {
                setamountTotal(parseFloat(amountTotals))
            } else {
                setamountTotal(getValueMath(amountTotals))
            }
            setTaxs(taxValue)
            setTaxBase(taxs)
            setCates(catValue)
            setDiscount(getValueMath(sum_dis))
            setProductDiscount(getValueMath(totalProductDiscount))
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

    const onClicDialogCus = () => {
        checkDefault()
        setOpenDialog(true)
    }

    const onClicPointTrasection = () => {
        setOpenDialogtran(true)
    }

    const OpenDialogDeposit = () => {
        setOpenDialogDeposit(true)
    }

    const getPointSelect = () => {
        return (<><p className="text_sale" style={{ marginTop: "1%" }}>แลกคะแนน</p>
            <InputSelect style={{ height: "3vh" }} option={dataPoint} disabled={disiPoint} onChange={(e) => { onChangePoint(e) }} /></>)
    }

    const getSearchInput = () => {
        return (<div>
            <FilterDataTable value={valueInput} onChange={(e) => { OnchangeSearch(e) }} placeholder="ค้นหา" />

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
                {filterComp()}
                {/*getSearchInput()*/}
                <div style={{ marginTop: "1%" }}> <DataTable
                    columns={columnsdata}
                    data={dataCustomer}
                />
                </div>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => { setOpenDialog(!openDialog) }} message="ปิด" />
            </DialogActions>
        </Dialog>
    }


    const getDialogPointTransection = () => {
        if (pointCustrans.length > 0) {
            pointCustrans.map((item, idx) => {
                item.point_quantity = parseInt(item.point_quantity)
            })
        }
        let Sumdata = _.sumBy(pointCustrans, 'point_quantity');
        return <Dialog open={openDialogtran} maxWidth="800px" >
            <DialogTitle >
                <p>ประวัติคะแนน</p>
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1200px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogtran(!openDialogtran)}>x</button>
                <div>
                    <div class="row">
                        <div class="col-4">
                            <p> ลูกค้า :</p>
                            <p> คะแนนสะสมคงเหลือ : </p>
                        </div>
                        <div class="col">
                            <p>{customerDataDefault.length > 0 ? customerDataDefault[0]['name'] : ''}</p>
                            <p>{Sumdata ? nf.format(Sumdata) : 0.00}</p>
                        </div>
                    </div>
                    <DataTable
                        columns={columnsdatatrans}
                        data={pointCustrans}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => { setOpenDialogtran(!openDialogtran) }} message="ปิด" />
            </DialogActions>
        </Dialog>
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

    const getDialogDeposit = () => {
        return (
            <Dialog open={openDialogDeposit} maxWidth="1500px" >
                <DialogTitle >เงินมัดจำ</DialogTitle>
                <DialogContent dividers='paper' style={{ width: "1200px" }}>
                    <button type="button" className="cancel" onClick={() => setOpenDialogDeposit(false)}>x</button>
                    <BtnAdd message="เลือกเงินมัดจำ" onClick={() => setOpenDialogDepositAdd(true)} />
                    <div>
                        <p>รวมมูลค่าสินค้า {nf.format(amountProduct)}</p>
                        <DataTables
                            dense
                            customStyles={customStyles}
                            columns={columnsdataDepositSelect}
                            data={dataDepositSelect}
                        />
                    </div>
                    {getDataSumDeposit()}
                    {getAlert()}
                </DialogContent>
                <DialogActions>
                    <span><BtnAdd onClick={() => onClickAddDeposit()} message="บันทึก" /></span>
                    <BtnCancel onClick={() => setOpenDialogDeposit(false)} message="ปิด" />
                </DialogActions>
            </Dialog>
        )
    }

    const getDataSumDeposit = () => {
        dataDepositSelect.map((item, idx) => {
            item.deposit_use = item.deposit_use ? parseFloat(item.deposit_use) : parseFloat(item.deposithd_balance_amnt)
        })
        let SumUse = _.sumBy(dataDepositSelect, 'deposit_use')
        return (
            <div class="row" style={{ marginLeft: "50%", marginTop: "1%" }}>
                <div class="col-3">
                    <p><strong>รวม</strong></p>
                </div>
                <div class="col">
                    <p>{nf.format(SumUse)}</p>
                </div>
            </div>
        )

    }

    const getDialogDepositAdd = () => {
        return (
            <Dialog open={openDialogDepositAdd} maxWidth="1000px" >
                <DialogTitle >เงินมัดจำ</DialogTitle>
                <DialogContent dividers='paper' style={{ width: "900px" }}>
                    <button type="button" className="cancel" onClick={() => setOpenDialogDepositAdd(false)}>x</button>
                    <div>
                        <DataTable
                            columns={columnsdataDeposit}
                            data={dataDeposit}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <span><BtnAdd onClick={() => onClickAddDepositSelect()} message="ตกลง" /></span>
                    <BtnCancel onClick={() => setOpenDialogDepositAdd(false)} message="ปิด" />
                </DialogActions>
            </Dialog>
        )
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const getCustomerDataDetail = () => {
        return (<>
            <p className="text_sale">ลูกค้าสะสมคะแนน</p>
            <div class="row">
                <div class="col-5">
                    <InputText type="text" style={{ height: "3vh" }} value={
                        dataCustomerPoint.length > 0 ? dataCustomerPoint[0]['arcustomer_code']
                            : customerDataDefault.length > 0 ? customerDataDefault[0]['arcustomer_code'] : ""
                    } disabled />
                </div>
                <div class="col-7">
                    <InputText type="text" style={{ height: "3vh" }} value={dataCustomerPoint.length > 0 ? dataCustomerPoint[0]['name']
                        : customerDataDefault.length > 0 ? customerDataDefault[0]['name'] : ""
                    } disabled />
                </div>
            </div>
            <p className="text_sale" style={{ marginTop: "1%" }}>คะแนนจากยอดซื้อสินค้าครั้งนี้</p>
            <InputText style={{ height: "3vh" }} type="text" value={nf.format(totalPoint)} disabled />
            <p className="text_sale" style={{ marginTop: "1%" }}>ใช้แลกคะแนนครั้งนี้</p>
            <InputText style={{ height: "3vh" }} type="text" value={nf.format(pointQuantity)} disabled />
            <BtnAdd style={{ marginTop: "1%", width: "20%", height: "3vh", background: "#74E0C0" }} onClick={() => { onClicDialogCus() }}
                icons={<Icon path={mdiAccountMultiplePlusOutline} size={1} />} />
            <BtnAdd style={{ marginTop: "1%", height: "3vh", marginLeft: "1%", background: "#74E0C0" }} message="ประวัติคะแนน" onClick={() => { onClicPointTrasection() }} />
        </>
        )
    }

    const getDataDetails = () => {
        let Years = creditDate.getFullYear() + 543
        let creditDates = Moment(creditDate).format('DD/MM/') + Years
        return (<div class="row">
            {dataCheckOptions == true ?
                <div class={props.flagPayment == false ? "col-3" : "col-5"}>
                    <Card className="card_sale" style={{ maxHeight: "32vh", minHeight: "32h", marginTop: "2%", fontSize: "16px" }}>
                        <div className="card_head"> <p className="textH_Left">รายละเอียดสะสมคะแนน</p></div>
                        <Card.Body className="card_body_doc">
                            {getCustomerDataDetail()}
                        </Card.Body>
                    </Card>
                </div> : <></>}
            <div class={dataCheckOptions == true && props.flagPayment == false ? "col-9" : dataCheckOptions == true ? "col-7" : "col-12"}>
                <Card className="card_sale" style={{ maxHeight: "32vh", minHeight: "30vh", marginTop: "1%", fontSize: "16px" }}>
                    <div className="card_head">  <p className="textH_Left">รายละเอียดการคำนวณ</p></div>
                    <Card.Body className="card_body_doc">
                        <div class="row">
                            <div class={props.flagPayment == false ? "col-3" : "col-4"}>
                                <span>
                                    <p className="text_sale">เงินมัดจำ</p>
                                    <InputText style={{ height: "3vh", width: "80%" }} type="text" disabled value={depositUses > 0 ? nf.format(depositUses) : nf.format(deposiValue)} />
                                    <BtnAdd style={{ height: "3vh", position: "absolute", background: "#74E0C0" }} onClick={() => { OpenDialogDeposit() }} icons={<AddIcon style={{ fontSize: "0.8vw" }} />} />
                                </span>
                                <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มส่วนลด</p>
                                <InputSelect style={{ height: "3vh" }} option={dataDiscount} id_key="promotion_discount_id"
                                    value_key="promotion_discount_name"
                                    onChange={(e) => onChangeDiscount(e)} value={discountSelect.length > 0 ? discountSelect[0]['promotion_discount_id'] : "0"} disabled={disibleDis} />
                                {dataCheckOptions == true && pointCus.length > 0 ? getPointSelect() : <></>}
                            </div>
                            <div class={props.flagPayment == false ? "col-3" : "col-4"}>
                                {props.flagPayment == false ?
                                    <><p className="text_sale" style={{ marginTop: "1%" }}>จำนวนวนวันเครดิต</p>
                                        <InputText style={{ height: "3vh" }} type="text" value={creditDay} disabled /> </> : <></>}
                                <p className="text_sale" style={{ marginTop: "1%" }}>กลุ่มภาษี</p>
                                <InputText type="text" style={{ height: "3vh" }} value={vateName} disabled />
                                <p className="text_sale" style={{ marginTop: "1%" }}>หัก ณ ที่จ่าย</p>
                                <InputSelect style={{ height: "3vh" }} option={dataCategory}
                                    id_key="wht_category_id" value_key="wht_category_name"
                                    onChange={(e) => onChangeCategory(e)} />
                            </div>
                            <div class={props.flagPayment == false ? "col-3" : "col-4"}>
                                {props.flagPayment == false ?
                                    <><p className="text_sale" style={{ width: "200%" }}>วันครบกำหนดชำระ</p>
                                        <InputText style={{ height: "3vh" }} type="text" value={creditDates} disabled /> </> : <></>}
                                <p className="text_sale" style={{ marginTop: "1%" }}>รวมมูลค่าสินค้า</p>
                                <InputText style={{ height: "3vh" }} type="text" value={nf.format(amountProduct)} disabled />
                                <p className="text_sale" style={{ marginTop: "1%" }}>มูลค่าสุทธิ</p>
                                <InputText style={{ fontSize: "1.5vw", height: "4vh" }} type="text" value={nf.format(amountTotal)} disabled />
                            </div>
                            {props.flagPayment == false ? <>
                                <div class="col-3" style={{ marginTop: "3%" }}>
                                    <span>
                                        {/* <BtnAdd style={{ height: "4vh", marginTop: "5%", width: "45%" }} icons={<LocalPrintshopIcon />} onClick={() => props.onClickPrint(true)} message="พิมพ์ใบแจ้งหนี้"></BtnAdd> */}
                                        <BtnAdd style={{ height: "5vh", marginTop: "3%", width: "100%" }} icons={<LocalPrintshopIcon />} onClick={() => props.onClickPrintTax(true)} message="ออกใบกำกับภาษี"></BtnAdd>
                                    </span>
                                    <BtnAdd style={{ height: "5vh", marginTop: "3%", width: "100%" }} icons={<SaveIcon />} onClick={() => props.onClickSave(true)} message="บันทึก/ปิด"></BtnAdd>

                                </div>
                            </> : <></>}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
        )

    }

    return (
        <div>
            {getAlert()}
            {getDialogCustomer()}
            {getDialogPointTransection()}
            {getDialogCreditvat()}
            {getDialogDeposit()}
            {getDialogDepositAdd()}
            {getDataDetails()}
        </div>
    )

}

export default memo(DataDetail);
