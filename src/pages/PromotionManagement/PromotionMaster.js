import { React, useState, useEffect, useContext } from "react";
import axios from 'axios';
import DataTable from '../../components/Datatable/Datatables';
import BtnEdit from "../../components/Button/BtnEdit";
import BtnDelete from "../../components/Button/BtnDelete";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertWarning from "../../components/Alert/AlertWarning";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import Switchstatus from "../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import DialogMaster from "../../components/DialogMaster/DialogMaster"
import Select from "../../components/Input/InputSelect";
import InputText from "../../components/Input/InputText";
import BtnAdd from "../../components/Button/BtnAdd";
import DialogProduct from "../../components/DialogProduct/DialogProduct"
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox } from '@mui/material';
import Card from 'react-bootstrap/Card';
import BtnCancel from "../../components/Button/BtnCancel";
import BtnConfirm from "../../components/Button/BtnConfirm";
import FilterDataTable from "../../components/SearchDataTable/FilterDataTable";
import Icon from '@mdi/react';
import {
    mdiTagPlusOutline, mdiPlusCircleOutline,
    mdiPlaylistPlus, mdiHistory
} from '@mdi/js';
import dayjs, { Dayjs } from "dayjs";
import { Key } from "@mui/icons-material";
import Moment from 'moment';


const PromotionMaster = ({ addData,onAdd,open, item_flag, give_away, pro_every, pro_genus, pro_begin, pro_end, pro_discount, discount_value,
    discount_type, product, product_set, width, onChangePromotion, onClose, promotion_setting_id,
    promotion_type_id, getData, discountItem }) => {
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [branchId, setbranchId] = useState(BranchData[0].master_branch_id)
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogProduct, setOpenDialogProduct] = useState(false)
    const [openDialogProductGiveAway, setOpenDialogProductGiveAway] = useState(false)
    const [openDialogProductSet, setOpenDialogProductSet] = useState(false)
    const [openDialogPromotion, setOpenDialogPromotion] = useState(false)
    const [dataMaster, setDataMaster] = useState([])
    const [dataMasterDefault, setDataMasterDefault] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const [dataEditDT, setDataEditDT] = useState([])
    const [textValidate, setTextValidate] = useState({})
    const [valueDialog, setvalueDialog] = useState()
    const [dataProDetail, setDataProDetail] = useState([])
    const [docCode, setDocCode] = useState("")
    const [dataBranch, setDataBranch] = useState([])
    const [dataPromotionType, setDataPromotionType] = useState([])
    const [dataCustomerGroup, setDataCustomerGroup] = useState([])
    const [dataMemberType, setDataMemberType] = useState([])
    const [dataDiscountValue, setDataDiscountValue] = useState([])
    const [dataProductSet, setDataProductSet] = useState([])
    const [dataProductSetSelect, setDataProductSetSelect] = useState([])
    const [dataDiscountType, setDataDiscountType] = useState([])
    const [dataProEveryday, setDataProEveryday] = useState([])
    const [dataPromotionGenus, setDataPromotionGenus] = useState([])
    const [dataProductGiveAwaySelect, setDataProductGiveAwaySelect] = useState([])
    const [rowSelectGiveAway, setRowSelectGiveAway] = useState({})
    const [dataProSelect,setDataProSelect] = useState([])
    const [dataPromotionDT,setDataPromotionDT]=useState([])
    const dataApi = {
        "company_id": companyId,
        "branch_id": parseInt(branchId),
        "promotion_setting_id": promotion_setting_id,
        "text_filter" :""
    }

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
        },
        {
            name: 'รหัสโปรโมชั่น',
            selector: row => row.promotion_hd_docuno,
            sortable: true,
        },
        {
            name: 'ชื่อโปรโมชั่น',
            selector: row => row.promotion_hd_name,
            sortable: true,
        },
        {
            name: 'สถานะ',
            selector: row => row.promotion_status_id == 1 ?
                <Switchstatus type="success" message={row.promotion_status_name} /> :
                    <Switchstatus type="close" message={row.promotion_status_name} />,
            sortable: true,
        },
        {
            name: 'เปิด',
            selector: row => <BtnEdit onClick={() => onClickEdit(row,"edit")} />,
            sortable: false,
        },
    ]

    const columnsdataProduct = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        item_flag ? {
            name: 'ประเภท',
            selector: (row, idx) => row.promotion_item_flag_name,
            sortable: false,
          
        } : { width: '0px'},
        discountItem ? { width: '0px' } :{
            name: 'รหัสสินค้า',
            selector: row => row.master_product_code,
            sortable: false,
            width: '160px'
        },
        discountItem ? { width: '0px' } :{
            name: 'ชื่อสินค้า',
            selector: row => row.master_product_name_bill,
            sortable: false,
        },
        discountItem ? { width: '0px' } :{
            name: 'หน่วยนับ',
            selector: row => row.master_product_unit_name,
            sortable: false,
            width: '90px'
        },
        give_away ? {
            name: 'ของแถม',
            selector: row => <div class="row">
                <div class="col">
                    <p style={{ marginTop: "10px" }}>{row.productGivwAway && row.productGivwAway.length > 0 ? row.productGivwAway[0].master_product_barcode : ""}</p>
                </div>
                <div class="col"><BtnAdd style={{ marginLeft: "1%", height: "70%", marginTop: "4px" }} icons={<Icon path={mdiTagPlusOutline} size={1} />}
                    onClick={() => onClickAddProductGiveAway(row)} />
                </div>
            </div>,
            sortable: false,
            width: '200px'
           } : { width: '0px' }, 
        give_away ? {
            name: 'จำนวนของแถม',
            selector: row => <InputText style={{ height: "30px", borderColor: "#7EA8F6", width: "80%" }}
                id="promotion_dt_giveaway_qty" type="number"
                defaultValue={row.promotion_dt_giveaway_qty ? row.promotion_dt_giveaway_qty : 0}
                disabled={dataEdit.promotion_hd_id ? true : false}
                onChange={(e) => onChangeInput(e, row)} />,
            sortable: false,
            width: '150px'
        } : { width: '0px' },
        pro_every ? {
            name: 'การสั่งซื้อ',
            selector: row => <Select style={{ height: "30px", borderColor: "#7EA8F6", width: "80%" }} option={dataProEveryday}
                id_key="promotion_every_id" value_key="promotion_every_name" id="promotion_every_id"
                defaultValue={row.promotion_every_id ? row.promotion_every_id : 0}
                disabled={dataEdit.promotion_hd_id ? true : false}
                onChange={(e) => onClickSelect(e, row)} />,
            sortable: false,
            width: '130px'
        } : { width: '0px'},
        discount_value ?   {
            name: 'คำนวณจาก',
            selector: row => <Select style={{ height: "30px", borderColor: "#7EA8F6", width: "80%" }} option={dataDiscountValue}
                id_key="promotion_discount_value_id" value_key="promotion_discount_value_name" id="promotion_discount_value_id"
                defaultValue={row.promotion_discount_value_id ? row.promotion_discount_value_id : 0}
                disabled={dataEdit.promotion_hd_id ? true : false}
                onChange={(e) => onClickSelect(e, row)} />,
            sortable: false,
            
        } : { width: '0px' },
        pro_begin ?    {
            name: 'ยอดซื้อเริ่มต้น',
            selector: row => <InputText style={{ height: "30px", borderColor: "#7EA8F6", width: "90%" }}
                defaultValue={row.promotion_dt_begin > 0 ? row.promotion_dt_begin : 0}
                disabled={dataEdit.promotion_hd_id ? true : false}
                id="promotion_dt_begin" type="number"
                onChange={(e) => onChangeInput(e, row)} />,
            sortable: false,
            
        } : { width: '0px' },
        pro_end ?{
            name: 'ถึงยอด',
            selector: row => <InputText style={{ height: "30px", borderColor: "#7EA8F6", width: "80%" }}
                id="promotion_dt_end" type="number" onChange={(e) => onChangeInput(e, row)}
                defaultValue={row.promotion_dt_end > 0 ? row.promotion_dt_end : 0}
                disabled={dataEdit.promotion_hd_id ? true : false} />,
            sortable: false,
          
        } : { width: '0px' },
        pro_discount ? {
            name: 'ส่วนลด',
            selector: row => <InputText style={{ height: "30px", borderColor: "#7EA8F6", width: "80%" }}
                id="promotion_dt_discount" type="number"
                disabled={dataEdit.promotion_hd_id ? true : false}
                defaultValue={row.promotion_dt_discount ? row.promotion_dt_discount : 0}
                onChange={(e) => onChangeInput(e, row)} />,
            sortable: false,
            
        }  :{ width: '0px' },
        discount_type  ? {
            name: 'หน่วย',
            selector: row => <Select style={{ height: "30px", borderColor: "#7EA8F6", width: "80%" }} option={dataDiscountType}
                id_key="promotion_discount_type_id" value_key="promotion_discount_type_name" id="promotion_discount_type_id"
                defaultValue={row.promotion_discount_type_id ? row.promotion_discount_type_id : 0}
                disabled={dataEdit.promotion_hd_id ? true : false}
                onChange={(e) => onClickSelect(e, row)} />,
            sortable: false,
        } : { width: '0px' },
        {
            selector: (row, idx) => <BtnDelete style={{ height: "24px" }} onClick={() => onClickDelete(row, idx)} />,
            width: '100px'
        },
    ]

    const columnsdataProductSet = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}>
                <FormControlLabel style={{ color: "grey" }} control={
                    <Checkbox style={{ color: "#6598F6" }} value={row.set_hd_id} defaultChecked={row.defaultChecked}
                        onClick={(e) => { OnchangeCheckProductSet(e, row) }}
                    />} /> </div>,
            sortable: false,
            width: '80px'
        },
        {
            name: 'รหัสเช็ตสินค้า',
            selector: row => row.set_hd_docuno,
            sortable: false,
        },

        {
            name: 'ชื่อเช็ตสินค้า',
            selector: row => row.set_hd_name,
            sortable: false,
        },
    ]

    const columnsdataPromotion = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}>
                <FormControlLabel style={{ color: "grey" }} control={
                    <Checkbox style={{ color: "#6598F6" }} value={row.promotion_hd_id} defaultChecked={row.defaultChecked}
                        onClick={(e) => { OnchangeCheckPromotion(e, row) }}
                    />} /> </div>,
            sortable: false,
            width: '80px'
        },
        {
            name: 'รหัสโปรโมชั่น',
            selector: row => row.promotion_hd_docuno,
            sortable: true,
        },
        {
            name: 'ชื่อโปรโมชั่น',
            selector: row => row.promotion_hd_name,
            sortable: true,
        },
        {
            name: 'สถานะ',
            selector: row => row.promotion_status_id == 1 ?
                <Switchstatus type="success" message={row.promotion_status_name} /> :
                <Switchstatus type="close" message={row.promotion_status_name} />,
            sortable: true,
        },
    ]

    useEffect(() => {
        getDataMaster()
        getDataBranch()
        getPromotionType()
        getCustomerGroup()
        getDataDiscountValue()
        getDataDiscountType()
        getDocCode()
        getDataProductSet()
        getPromotionEveryDay()
        getMemberType()
    }, [])

    useEffect(() => {
        getDialog()
        getDialogProduct()
    }, [valueDialog, dataProDetail])

    useEffect(() => {
        getDialog()
    }, [valueDialog, dataProDetail])

    useEffect(() => {
        if (addData == true) {
            setDataProDetail([])
            setDataEdit({})
            onAdd(false)
        }
    }, [addData])

    useEffect(() => {
          getDataMaster()
    }, [getData])

    useEffect(() => {
        console.log(promotion_setting_id)
    }, [promotion_setting_id])

  
    const getDataMaster = () => {
        axios.post(UrlApi() + 'get_promotionHD_data', dataApi).then((res) => {
            if (res.data) {
                setDataMaster(res.data)
            }
        })
    }

    const getDataProductSet = () => {
        axios.post(UrlApi() + 'get_sethd_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.defaultChecked = false
                })
                setDataProductSet(res.data)
            }
        })
    }

    const getDataBranch = () => {
        let newData = []
        dataApi.user_id = parseInt(userData[0].user_login_id)
        axios.post(UrlApi() + 'get_branch_data', dataApi)
            .then(res => {
                if (res.data) {
                    let dataAll = {
                        "master_branch_name": "ทั้งหมด",
                        "master_branch_id": 0
                    }
                    res.data.forEach((item, idx) => { newData.push(item) })
                    newData.push(dataAll)
                    setDataBranch(newData)
                }
            })
    }

    const getPromotionEveryDay = () => {
        axios.get(UrlApi() + 'get_promotion_every_data').then((res) => {
            if (res.data) {
                setDataProEveryday(res.data)
            }
        })
    }


    const getPromotionType = () => {
        axios.get(UrlApi() + 'get_promotiontype_data').then((res) => {
            if (res.data) {
                setDataPromotionType(res.data)
            }
        })
    }

    const getDocCode = () => {
        axios.post(UrlApi() + 'get_promotion_docuno', dataApi).then((res) => {
            if (res.data) {
                setDocCode(res.data[0].promotion_hd_docuno)
            }
        })
    }

    const getCustomerGroup = () => {
        let dataActive = []
        axios.post(UrlApi() + 'get_customergroup_data', dataApi).then((res) => {
            if (res.data) {
                let dataAll = {
                    "arcustomer_group_name": "ทั้งหมด",
                    "arcustomer_group_id": 0
                }
                res.data.forEach((item, idx) => { if (item.arcustomer_group_active == true) { dataActive.push(item) } })
                dataActive.push(dataAll)
                setDataCustomerGroup(dataActive)
            }
        })
    }

    const getMemberType = () => {
        let dataActive = [] 
        axios.post(UrlApi() + 'get_membertype_data', dataApi).then((res) => {
            if (res.data) {
                let dataAll = {
                    "master_member_type_name": "ทั้งหมด",
                    "master_member_type_id": 0
                }
                res.data.forEach((item, idx) => { if (item.member_type_active == true) { dataActive.push(item) } })
                dataActive.push(dataAll)
                setDataMemberType(dataActive)
            }
        })
    }

    const getDataDiscountValue = () => {
        axios.get(UrlApi() + 'get_discount_value_data', dataApi).then((res) => {
            if (res.data) {
                setDataDiscountValue(res.data)
            }
        })
    }

    const getDataDiscountType = () => {
        axios.get(UrlApi() + 'get_discount_type_data', dataApi).then((res) => {
            if (res.data) {
                setDataDiscountType(res.data)
            }
        })
    }

    const onClickAddProductGiveAway = (row) => {
        setRowSelectGiveAway(row)
        setDataProductGiveAwaySelect(row.productGivwAway)
        setOpenDialogProductGiveAway(true)
    }

    const OnchangeCheckProductSet = (e, row) => {
        if (e.target.checked == true) {
            dataProductSetSelect.push(row)
        } else {
            let findInd = _.findIndex(dataProductSetSelect, { set_hd_docuno: row.set_hd_docuno })
            dataProductSetSelect.splice(findInd, 1)
        }
    }

    const OnchangeCheckPromotion = (e, row) => {
        if (e.target.checked == true) {
            dataProSelect.push(row)
        } else {
            let findInd = _.findIndex(dataProSelect, { promotion_hd_id: row.promotion_hd_id })
            dataProSelect.splice(findInd, 1)
        }
    }

    const onClickEdit = (row, type) => {
        dataApi.promotionHD_id = parseInt(row.promotion_hd_id)
        getDataPromotionDetail()
        getDataPromotionDetailBranch()
        getDataPromotionDetailCustomer()
        getDataPromotionDetailMember()
        setDataProDetail(dataProDetail)
        if (type == "edit") {
            setDataEdit(row)
            onClose(true)
        }
        setvalueDialog(row.promotion_hd_id)
    }

    const getDataPromotionDetail = () => {
        axios.post(UrlApi() + 'get_promotionDT_data', dataApi).then((res) => {
            if (res.data) {
                dataProDetail.dataDetail = res.data
            }
        })
    }

    const getDataPromotionDetailBranch = () => {
        axios.post(UrlApi() + 'get_promotionDT_branch', dataApi).then((res) => {
            if (res.data) {
                dataBranch.map((item) => {
                    res.data.forEach((itemRes) => {
                        if (itemRes.master_branch_id == item.master_branch_id) {
                            item.value_checked = true
                        } else {
                            item.value_checked = false
                        }
                    })

                })
                dataProDetail.branch = res.data
            }
        })
    }

    const getDataPromotionDetailCustomer = () => {
        axios.post(UrlApi() + 'get_promotionDT_customergroup', dataApi).then((res) => {
            if (res.data) {
                dataCustomerGroup.map((item) => {
                    res.data.forEach((itemRes) => {
                        if (itemRes.arcustomer_group_id == item.arcustomer_group_id) {
                            item.value_checked = true
                        } else {
                            item.value_checked = false
                        }
                    })

                })
                dataProDetail.customerGroup = res.data
            }
        })
    }

    const getDataPromotionDetailMember = () => {
        axios.post(UrlApi() + 'get_promotionDT_membettype', dataApi).then((res) => {
            if (res.data) {
                dataMemberType.map((item) => {
                    res.data.forEach((itemRes) => {
                        if (itemRes.master_member_type_id == item.master_member_type_id) {
                            item.value_checked = true
                        } else {
                            item.value_checked = false
                        }
                    })
                })
                dataProDetail.memberType = res.data
            }
        })
    }

    const onClickDelete = (row, idx) => {
        let findIdx = _.findIndex(dataEditDT, { set_dt_id: row.set_dt_id })
        if (findIdx >= 0) {
            dataEditDT[findIdx].set_dt_active = false
        }
        dataProDetail.splice(idx, 1)
        setvalueDialog(row)
    }

    const onClickSelect = (e, row) => {
        if (e.target.value) {
            row[e.target.id] = parseInt(e.target.value)
            if (e.target.id == "promotion_every_id") {
                if (e.target.value == 2 && row.promotion_dt_begin > 0)  {
                    row.promotion_dt_end = row.promotion_dt_begin
                }
            }
        }
    }

    const onChangeInput = (e, row) => {
        if (e.target.value) {
            if (e.target.id == "promotion_dt_begin") {
                if (row.promotion_every_id == 2) {
                    row.promotion_dt_begin = e.target.value
                    row.promotion_dt_end = e.target.value
                }
            } else {
                row[e.target.id] = e.target.value
            }
        }
    }

    const onClickAddProductSet = () => {
        let newPro = []
        dataProductSetSelect.map((item, idx) => {
            item.master_product_code = item.set_hd_docuno
            item.master_product_name_bill = item.set_hd_name
            newPro.push(item)
        })
        newPro.forEach((item, idx) => { dataProDetail.push(item) })
        setOpenDialogProductSet(false)
    }

    const onClickAddProSelect = () => {
        onClickEdit(dataProSelect[0], "add")
        setOpenDialogPromotion(false)
    }

    const onCloseDialogProductSet = () => {

    }

    const onCloseDialogPromotion = () => {
        setDataProSelect([])
    }

    const onClickProductSelect = (data) => {
        data.map((item, idx) => item.productGivwAway = [])
        setDataProDetail(data)
    }

    const onClickProductGiveAwaySelect = (data) => {
        let findIdx = _.findIndex(dataProDetail, { master_product_barcode_id: rowSelectGiveAway.master_product_barcode_id })
        dataProDetail[findIdx].productGivwAway = []
        dataProDetail[findIdx].productGivwAway.push(data[0])
        dataProDetail[findIdx].promotion_dt_giveaway_product_barcode_id = data[0].master_product_id
        dataProDetail[findIdx].promotion_dt_giveaway_product_id = data[0].master_product_barcode_id
    }

    const addDiscountItem = () => {
        let ItemDiscount = { "master_product_id" :null}
        dataProDetail.push(ItemDiscount)
        setvalueDialog(ItemDiscount)
    }

    const onClickSave = (data) => {
        let dataPromotion = {}
            data.promotion_hd_create_emp_id = parseInt(userData[0].emp_employeemasterid)
            data.promotion_hd_remark = data.promotion_hd_remark ? data.promotion_hd_remark : ""
            data.promotion_status_id = dataEdit[Key] ? 2 : 1
            data.promotion_hd_startdate = Moment(data.promotion_hd_startdate).format("YYYYMMDD")
            data.promotion_hd_enddate = Moment(data.promotion_hd_enddate).format("YYYYMMDD")
            data.master_company_id = companyId
            data.promotion_hd_starttime = data.promotion_hd_starttime ? data.promotion_hd_starttime :"00:01"
            data.promotion_hd_endtime = data.promotion_hd_endtime ? data.promotion_hd_endtime : "23:59"
            data.promotion_type_setting_id = promotion_setting_id
            data.promotion_type_id = promotion_type_id
            dataPromotion.promotion_HD = data

        dataProDetail.map((item, idx) => {
            item.master_product_barcode_id = item.master_product_barcode_id ? parseInt(item.master_product_barcode_id) : null
            item.master_product_id = item.master_product_id ? parseInt(item.master_product_id) : null
            item.set_hd_id = item.set_hd_id ? parseInt(item.set_hd_id) : null
            item.promotion_dt_begin = item.promotion_dt_begin ? item.promotion_dt_begin : null
            item.promotion_dt_end = item.promotion_dt_end ? item.promotion_dt_end : null
            item.promotion_dt_discount = item.promotion_dt_discount ? item.promotion_dt_discount : null
            item.promotion_discount_type_id = item.promotion_discount_type_id ? item.promotion_discount_type_id : null
            item.promotion_dt_giveaway_qty = item.promotion_dt_giveaway_qty ? item.promotion_dt_giveaway_qty : null
            item.promotion_discount_value_id = item.promotion_discount_value_id ? item.promotion_discount_value_id : null
            item.promotion_dt_giveaway_product_barcode_id = item.promotion_dt_giveaway_product_barcode_id ? item.promotion_dt_giveaway_product_barcode_id : null
            item.promotion_dt_giveaway_product_id = item.promotion_dt_giveaway_product_id ? item.promotion_dt_giveaway_product_id : null
            item.promotion_item_flag_id = item.promotion_item_flag_id ? item.promotion_item_flag_id : null
            item.promotion_dt_active = true
            item.promotion_every_id = item.promotion_every_id ? item.promotion_every_id : null
        })
         
        data.promotion_detail = dataProDetail
        onChangePromotion(data)
        //onClose(false)

    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataMaster} />)
    }

    const disableValue =  dataEdit.promotion_hd_docuno ?  true : false

    const columnDialog = [
        {
            name: 'สาขา', type: "check_box", key: "master_branch_id", value_key: "master_branch_name",
            data:  dataBranch,
            validate: dataProDetail.branch ? false : true, disabled: dataEdit.promotion_hd_id ? true : false,
            groups: 1
        },
        {
            name: 'กลุ่มลูกค้า', type: "check_box", key: "arcustomer_group_id", value_key: "arcustomer_group_name",
            data:  dataCustomerGroup,
            validate: dataProDetail.customerGroup ? false : true, disabled: dataEdit.promotion_hd_id ? true : false,
            groups: 2
        },
        {
            name: 'ประเภทสมาชิก', type: "check_box", key: "master_member_type_id", value_key: "master_member_type_name",
            data:  dataMemberType,
            validate: dataProDetail.memberType ? false : true, disabled: dataEdit.promotion_hd_id ? true : false,
            groups: 3
        },
        {
            name: 'เลขที่เอกสาร', type: "text", defaultvalue: dataEdit.promotion_hd_docuno ? dataEdit.promotion_hd_docuno : docCode,
            key: "promotion_hd_docuno", disabled: disableValue, groups: 4
        },
        { name: 'วันที่', type: "text_date", key: "promotion_hd_docdate", groups: 4 },
        { name: 'ชื่อโปรโมชัน', type: "input_text", key: "promotion_hd_name",  disabled: disableValue,validate: true, groups: 4 },
        {
            name: 'ประเภทโปรโมชัน', type: "dropdown", option: dataPromotionType, key: "promotion_type_id", value_key: "promotion_type_name",
            defaultvalue: promotion_type_id, disabled:true ,groups: 4
        },
        { name: 'วันที่เริ่มต้น', type: "select_date", key: "promotion_hd_startdate", defaultvalue: null, validate: true, disabled: disableValue, groups: 4 },
        { name: 'วันที่สิ้นสุด', type: "select_date", key: "promotion_hd_enddate", defaultvalue: null, validate: true, disabled: disableValue, groups: 4 },
        { name: 'เวลาเริ่มต้น', type: "select_time", key: "promotion_hd_starttime", defaultvalue: "00:01:00", groups: 4 },
        { name: 'เวลาสิ้นสุด', type: "select_time", key: "promotion_hd_endtime", defaultvalue:"23:59:00", groups: 4 },
        { name: 'หมายเหตุ', type: "input_text", key: "promotion_hd_remark", disabled: disableValue, groups: 4 },
        /*{ name: 'เปิดใช้ส่วนลดอัตโนมัติ', type: "switch_status", key: "promotion_hd_active", groups: 3 },*/
    ]

    const colCard = [
        { name: "สาขา", group: 1, colsgroup:"col-4" , cols: 6, },
        { name: "กลุ่มลูกค้า", group: 2, colsgroup: "col-4", cols: 6 },
        { name: "กลุ่ประเภทสมาชิก", group: 3, colsgroup: "col-4", cols: 12 },
        { name: "รายละเอียด", group: 3, colsgroup: "col-12", cols: 2 },]

    const CustomBtnTB = () => {
        return (<>
            <span>
            {product && !dataEdit.promotion_hd_docuno ?
                    <BtnAdd message="เพิ่มสินค้า" style={{ height: "50px" }}
                        onClick={() => setOpenDialogProduct(true)}
                            icons={<Icon path={mdiPlusCircleOutline} size={1} />} />
                : <></>}
                    {product_set && !dataEdit.promotion_hd_docuno ?
                    <BtnAdd style={{ marginLeft: "12px", height: "50px"  }} message="เพิ่มเช็ตสินค้า"
                        onClick={() => setOpenDialogProductSet(true)}
                            icons={<Icon path={mdiPlaylistPlus} size={1} />} />
                : <></>}
            {product_set && !dataEdit.promotion_hd_docuno ?
                    <BtnAdd style={{ marginLeft: "12px", height: "50px"  }} message="ประวัติโปรโมชั่น"
                        onClick={() => setOpenDialogPromotion(true)}
                            icons={<Icon path={mdiHistory} size={1} />}                         />
                : <></>}
            {discountItem && !dataEdit.promotion_hd_docuno ?
                    <BtnAdd style={{ marginLeft: "12px", height: "50px"  }} message="เพิ่มส่วนลด"
                        onClick={() => addDiscountItem()}
                        icons={<Icon path={mdiPlaylistPlus} size={1} />}                        />
                : <></>}
            </span>
        </>)
    }
    const getDialog = () => {
        return (
            <DialogMaster
                promoTionMaster
                cancleDoc
                width={width ? width :"1200px"}
                groupCard
                colcards={colCard}
                keys="promotion_hd_id"
                openDialog={open}
                onClose={(e) => onClose(e)}
                customBtnTB={CustomBtnTB()}
                columnDialog={columnDialog}
                customDialog={getDetailSet()}
                dataAdd={dataAdd}
                onChangeDialog={(data) => onClickSave(data)}
                dataEdit={dataEdit}
                textValidates={textValidate}
            />)
    }

    const getDetailSet = () => {
        dataProDetail.map((item, idx) => {
            item.promotion_item_flag_name = item.promotion_item_flag_name ? item.promotion_item_flag_name :item.master_product_barcode ? "ITEM" : "SET"
            item.promotion_item_flag_id = item.promotion_item_flag_id ? item.promotion_item_flag_id :item.master_product_barcode ? 2 : 1
        })
        return (
            <div style={{ marginTop: "18px" }}>
              
                <DataTable
                    style={{ marginTop: "2px", marginLeft: "0%" }}
                    columns={columnsdataProduct}
                    data={dataProDetail.dataDetail ? dataProDetail.dataDetail : dataProDetail} />
            </div>)
    }

    const getDialogProduct = () => {
        return (<DialogProduct
            datadefault={dataProDetail}
            onClose={(e) => setOpenDialogProduct(e)}
            openDialog={openDialogProduct}
            onClick={(e) => onClickProductSelect(e)} />)
    }

    const getDialogProductGiveAway = () => {
        return (<DialogProduct
            checkRadio
            datadefault={dataProductGiveAwaySelect}
            onClose={(e) => setOpenDialogProductGiveAway(e)}
            openDialog={openDialogProductGiveAway}
            onClick={(e) => onClickProductGiveAwaySelect(e)} />)
    }

    const getDialogProductSet = () => {
        return (<><Dialog open={openDialogProductSet} maxWidth="1200px" >
            <DialogTitle ><p>ข้อมูลสินเช็ตค้า</p></DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1250px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogProductSet(false)}>x</button>
                <Card className="card_body_doc" style={{ marginTop: "0px" }}>
                    <div style={{ marginLeft: "1%", marginRight: "2%", marginTop: "10px" }}>
                        <FilterDataTable value={""} />
                    </div>
                    <div style={{ marginTop: "1%" }}>
                        <DataTable
                            columns={columnsdataProductSet}
                            data={dataProductSet}
                        />
                    </div>
                </Card>
            </DialogContent>
            <DialogActions>
                <span><BtnConfirm onClick={() => onClickAddProductSet()} /></span>
                <BtnCancel onClick={() => { onCloseDialogProductSet() }} />
            </DialogActions>
        </Dialog></>)
    }

    const getDialogPromotions = () => {
        return (<><Dialog open={openDialogPromotion} maxWidth="1200px" >
            <DialogTitle ><p>ข้อมูลสินเช็ตค้า</p></DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1250px" }}>
                <button type="button" className="cancel" onClick={() => setOpenDialogPromotion(false)}>x</button>
                <Card className="card_body_doc" style={{ marginTop: "0px" }}>
                    <div style={{ marginLeft: "1%", marginRight: "2%", marginTop: "10px" }}>
                        <FilterDataTable value={""} />
                    </div>
                    <div style={{ marginTop: "1%" }}>
                        <DataTable
                            columns={columnsdataPromotion}
                            data={dataMaster}
                        />
                    </div>
                </Card>
            </DialogContent>
            <DialogActions>
                <span><BtnConfirm onClick={() => onClickAddProSelect()} /></span>
                <BtnCancel onClick={() => { onCloseDialogPromotion() }} />
            </DialogActions>
        </Dialog></>)
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    return (<>
        {getDialogProduct()}
        {getDialogProductGiveAway()}
        {getDialogProductSet()}
        {getDialogPromotions()}
        {getAlert()}
        {getDataTable()}
        {getDialog()}
    </>)
}

export default PromotionMaster
