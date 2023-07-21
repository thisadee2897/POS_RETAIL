import { React, useState, useEffect, useContext } from "react";
import axios from 'axios';
import DataTable from '../../components/Datatable/Datatables';
import BtnEdit from "../../components/Button/BtnEdit";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertWarning from "../../components/Alert/AlertWarning";
import UrlApi from "../../url_api/UrlApi";
import _, { forEach } from "lodash";
import '../../components/CSS/report.css';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import Switchstatus from "../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import DialogMaster from "../../components/DialogMaster/DialogMaster"
import SelectAuto from "../../components/Input/InputSelectAuto";
import InputText from "../../components/Input/InputText";
import Moment from 'moment';

const CategorySetting = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [branchId, setbranchId] = useState(BranchData[0].master_branch_id)
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [dataMaster, setDataMaster] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const [dataPersonType, setDataPersonType] = useState([])
    const [dataTitle, setDataTitle] = useState([])
    const [dataDistrict, setDataDistrict] = useState([])
    const [dataDistrictSelect, setDataDistrictSelect] = useState([])
    const [dataPrefecture, setDataPrefecture] = useState([])
    const [dataProvince, setDataProvince] = useState([])
    const [dataPostCode, setDataPostCode] = useState([])
    const [dataCustomerCategory, setDataCustomerCategory] = useState([])
    const [dataCustomerGroup, setDataCustomerGroup] = useState([])
    const [dataMemberType, setDataMemmberType] = useState([])
    const [dataPrice,setDataPrice] = useState([])
    const [customerCode,setCustomerCode] = useState("")
    const dataApi = {
        "company_id": companyId,
    }

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '30px'
        },
        {
            name: 'รหัสสมาชิก',
            selector: row => row.arcustomer_code,
            sortable: true,
        },
        {
            name: 'คำนำหน้า',
            selector: row => row.master_title_name,
            sortable: true,
        },
        {
            name: 'ชื่อ',
            selector: row => row.arcustomer_name,
            sortable: true,
        },
        {
            name: 'กลุ่มลูกค้า',
            selector: row => row.arcustomer_group_name,
            sortable: true,
        },
        {
            name: 'ประเภทบุคคล',
            selector: row => row.master_person_type_name,
            sortable: true,
        },
        {
            name: 'หมวดลูกค้า',
            selector: row => row.arcustomer_category_name,
            sortable: true,
        },
        {
            name: 'ประเภทสมาชิก',
            selector: row => row.master_member_type_name,
            sortable: true,
        },
        {
            name: 'ประเภทราคา',
            selector: row => row.arcustomer_price_name,
            sortable: true,
        },
        {
            name: 'จำนวนวันเครดิต',
            selector: row => row.arcustomer_creditday,
            sortable: true,
        },
        {
            name: 'วงเงินเครดิต',
            selector: row => row.arcustomer_credit_amount,
            sortable: true,
        },
        {
            name: 'ที่อยู่',
            selector: row => row.arcustomer_addr,
            sortable: true,
        },
        {
            name: 'เบอร์โทร',
            selector: row => row.arcustomer_addr_tel,
            sortable: true,
        },
        {
            name: 'สถานะ',
            selector: row => <><Switchstatus value={row.arcustomer_active} /></>,
            sortable: true,
        },
        {
            name: 'แก้ไข',
            selector: row => <BtnEdit onClick={() => onClickEdit(row)} />,
            sortable: false,
            width: '30px'
        },
    ]

    useEffect(() => {
        getDataMaster()
        getCustomerCode()
        getDataTitle()
        getPersonTypeData()
        getDataCustomerCategory()
        getDataCustomerGroup()
        getDataMemberType()
        getDataPrice()
        getDistrictData()
    }, [])

    useEffect(() => {
        getDialog()
    }, [dataPrefecture, dataProvince, dataPostCode])

    const getDataMaster = () => {
        dataApi.text =''
        axios.post(UrlApi() + 'get_customer_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    item.arcustomer_active_name = item.arcustomer_active == true ? 'เปิดการใช้งาน' :'ปิดการใช้งาน'
                })
                setDataMaster(res.data)
            }
        })
    }

    const getCustomerCode = () => {
        dataApi.branch_id =  branchId
        axios.post(UrlApi() + 'get_customer_code', dataApi).then((res) => {
            if (res.data) {
                setCustomerCode(res.data[0].docuno)
            }
        })
    }

    const getDataTitle = () => {
        axios.get(UrlApi() + 'get_title_data').then((res) => {
            if (res.data) {
                setDataTitle(res.data)
            }
        })
    }

    const getPersonTypeData = () => {
        axios.get(UrlApi() + 'get_person_type_data').then((res) => {
            if (res.data) {
                setDataPersonType(res.data)
            }
        })
    }

    const getDataCustomerCategory = () => {
        let dataActive = []
        axios.post(UrlApi() + 'get_customercategory_data', dataApi).then((res) => {
            if (res.data) {
                res.data.forEach((item) => {
                    if (item.arcustomer_category_active == true) {dataActive.push(item) }
                })
                setDataCustomerCategory(dataActive)
            }
        })
    }

    const getDataCustomerGroup = () => {
        let dataActive = []
        axios.post(UrlApi() + 'get_customergroup_data', dataApi).then((res) => {
            if (res.data) {
                res.data.forEach((item) => {
                    if (item.arcustomer_group_active == true) { dataActive.push(item) }
                })
                console.log(dataActive)
                setDataCustomerGroup(dataActive)
            }
        })
    }

    const getDataMemberType = () => {
        let dataActive = []
        axios.post(UrlApi() + 'get_membertype_data', dataApi).then((res) => {
            if (res.data) {
                res.data.forEach((item) => {
                    if (item.member_type_active == true) { dataActive.push(item) }
                })
                setDataMemmberType(dataActive)
            }
        })
    }

    const getDataPrice = () => {
        axios.get(UrlApi() + 'get_price_data').then((res) => {
            if (res.data) {
                setDataPrice(res.data)
            }
        })
    }

    const getDistrictData = () => {
        axios.get(UrlApi() + 'get_district_data').then((res) => {
            if (res.data) {
                setDataDistrict(res.data)
            }
        })
    }

    const getDataPrefecture = (per_id) => {
        let dataAPI = { "master_addr_prefecture": parseInt(per_id) }
        axios.post(UrlApi() + 'get_prefecture_data', dataAPI).then((res) => {
            if (res.data.length > 0) {
                setDataPrefecture(res.data)
                getDataProvince(res.data[0])
            }
        })
    }

    const getDataPostCode = (dris_id) => {
        let dataAPI = { "master_addr_district_id": parseInt(dris_id) }
        axios.post(UrlApi() + 'get_postcode_data', dataAPI).then((res) => {
            if (res.data.length > 0) {
                setDataPostCode(res.data)
            }
        })
    }

    const getDataProvince = (data) => {
        let dataAPI = { "master_addr_province_id": parseInt(data.master_addr_province_id) }
        axios.post(UrlApi() + 'get_province_data', dataAPI).then((res) => {
            if (res.data.length > 0) {
                setDataProvince(res.data)
            }
        })
    }

    const onClickAddData = () => {
        setDataEdit({})
        setDataAdd({})
        setDataDistrictSelect([])
        setDataPostCode([])
        setDataProvince([])
        setDataPrefecture([])
        setOpenDialog(true)
    }

    const onClickEdit = (row, idx) => {
        setDataAdd({})
        setOpenDialog(true)
        setDataEdit(row)
    }

    const onClickSave = (data) => {
        if (data.arcustomer_id) {
            data.arcustomer_addr_district_id = data.master_addr_district_id ? parseInt(data.master_addr_district_id) : null
            data.arcustomer_title_id = parseInt(data.master_title_id)
            data.arcustomer_birthday = data.arcustomer_birthday ? Moment(data.arcustomer_birthday).format("YYYYMMDD") : null
            data.arcustomer_addr_prefecture_id = parseInt(data.arcustomer_addr_prefecture_id)
            data.arcustomer_member_type_id = parseInt(data.master_member_type_id)
            data.arcustomer_person_type_id = parseInt(data.master_person_type_id)
            axios.post(UrlApi() + 'update_customer_data', data).then((res) => {
                if (res.data) {
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                    setAlertSuccess(true)
                    setOpenDialog(false)
                    getDataMaster()
                }
            })
        } else {
            data.master_company_id = companyId
            data.master_branch_id = parseInt(branchId)
            data.arcustomer_title_id = parseInt(data.master_title_id)
            data.arcustomer_member_type_id = parseInt(data.master_member_type_id)
            data.arcustomer_person_type_id = parseInt(data.master_person_type_id)
            data.arcustomer_active = data.arcustomer_active ? data.arcustomer_active : true
            data.arcustomer_addr = data.arcustomer_addr ? data.arcustomer_addr : ''
            data.arcustomer_email = data.arcustomer_email ? data.arcustomer_email : ''
            data.arcustomer_addr_tel = data.arcustomer_addr_tel ? data.arcustomer_addr_tel :''
            data.arcustomer_birthday = data.arcustomer_birthday ? Moment(data.arcustomer_birthday).format("YYYYMMDD") : null
            data.arcustomer_addr_district_id = dataDistrictSelect.length > 0 ? parseInt( dataDistrictSelect[0].master_addr_district_id) : null
            data.arcustomer_addr_prefecture_id = dataPrefecture.length > 0 ? parseInt(dataPrefecture[0].master_addr_prefecture_id): null
            data.arcustomer_addr_province_id = dataProvince.length > 0 ? parseInt(dataProvince[0].master_addr_province_id): null
            data.arcustomer_addr_postcode_id = dataPostCode.length > 0 ? parseInt( dataPostCode[0].master_addr_postcode_id) :null
            axios.post(UrlApi() + 'add_customer_data', data).then((res) => {
                if (res.data) {
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setAlertSuccess(true)
                    setOpenDialog(false)
                    getDataMaster()
                }
            })
        }
    }

    const onClickSelect = (values, key) => {
        setDataDistrictSelect([values])
        getDataPrefecture(values.master_addr_prefecture_id)
        getDataPostCode(values.master_addr_district_id)
    }

    const getAutoComplete = (key, value_key, data) => {
        let dataDefault = {
            master_addr_district_name: dataEdit.master_addr_district_name,
            master_addr_district_id: dataEdit.master_addr_district_id
        }
        return (<SelectAuto className="input_dialog"
            defaultValue={dataDefault}
            option={data && data.length > 0 ? data : []}
            value_key={value_key} id_key={key}
            onChange={(values) => onClickSelect(values, key)} />
         )
    }

    const getInputAddress = (data, key) => {
        let dataDefault = data.length > 0 ? data[0] : dataEdit.arcustomer_id != undefined ? dataEdit : ""
        return (<InputText className="input_dialog" type="text" value={dataDefault[key] != undefined ? dataDefault[key] : ""} disabled />)
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataMaster} />)
    }

    const columnDialog = [
        { name: 'รหัสสามชิก', type: "text", key: "arcustomer_code", defaultvalue: customerCode , groups: 1 },
        { name: 'เลขประจำตัวผู้เสียภาษี', type: "input_num", key: "arcustomer_taxid", groups: 1 },
        {
            name: 'คำนำหน้า', type: "dropdown", key: "master_title_id", validate: true,
            value_key: "master_title_name", option: dataTitle, groups: 1
        },
        { name: 'ชื่อ-สกุล (TH)', type: "input_text", key: "arcustomer_name", groups: 1  ,validate: true},
        { name: 'ชื่อ-สกุล (ENG)', type: "input_text", key: "arcustomer_name_eng", groups: 1,},
        { name: 'วันเกิด', type: "select_date", key: "arcustomer_birthday", defaultvalue: null, groups: 1 },
        {
            name: 'ประเภทบุคคล', type: "dropdown", key: "master_person_type_id", validate: true,
            value_key: "master_person_type_name", option: dataPersonType, groups: 1
        },
        {
            name: 'หมวดลูกค้า', type: "dropdown", key: "arcustomer_category_id", validate: true,
            release: "arcustomer_group_id",
            value_key: "arcustomer_category_name", option: dataCustomerCategory, groups: 2
        },
        {
            name: 'กลุ่มลูกค้า', type: "dropdown", key: "arcustomer_group_id", validate: true,
            value_key: "arcustomer_group_name", option: dataCustomerGroup, groups: 2
        }, 
        {
            name: 'ประเภทสมาชิก', type: "dropdown", key: "master_member_type_id", validate: true,
            value_key: "master_member_type_name", option: dataMemberType, groups: 2
        },
        {
            name: 'ประเภทราคา', type: "dropdown", key: "arcustomer_price_id", validate: true,
            value_key: "arcustomer_price_name",option: dataPrice, groups: 2
        },
        { name: 'จำนนวนวันเครดิต', type: "input_num", key: "arcustomer_creditday", defaultvalue:0, groups: 2 },
        { name: 'วงเงินเครดิต', type: "input_num", key: "arcustomer_credit_amount", defaultvalue: 0, groups: 2 },
        { name: 'สำหรับขายออนไลน์', type: "check", key: "arcustomer_online_active",label:"ลูกค้าออนไลน์", groups: 2 },
        { name: 'สถานะ', type: "switch_status", key: "arcustomer_active" , groups: 2 },
        { name: 'ที่อยู่', type: "input_text", key: "arcustomer_addr", groups: 3 },
        {
            name: 'ตำบล', custom: getAutoComplete('master_addr_district_id', 'master_addr_district_name', dataDistrict),
            groups: 3
        },
        { name: 'อำเภอ', custom: getInputAddress(dataPrefecture, 'master_addr_prefecture_name'), groups: 3},
        { name: 'จังหวัด', custom: getInputAddress(dataProvince, 'master_addr_province_name'), groups: 3 },
        { name: 'รหัสไปรษณีย์', custom: getInputAddress(dataPostCode, 'master_addr_postcode_code'), groups: 3 },
        { name: 'อีเมล', type: "input_text", key: "arcustomer_email", groups: 3},
        { name: 'เบอร์โทรศัพท์', type: "input_text", key: "arcustomer_addr_tel", groups: 3 },
    ]
    
    const colCard = [
        { name: "ข้อมูล่สวนบุคคล", group: 1, colsgroup: "col-6", cols: 6, },
        { name: "ข้อมูลระบบ", group: 2, colsgroup: "col-6", cols: 6 },
        { name: "กลุ่มข้อมูลติดต่อ", group: 3, colsgroup: "col-12", cols: 2 }]

     
    const getDialog = () => {
        return (
            <DialogMaster
                groupCard
                colcards={colCard}
                width="1300px"
                keys="arcustomer_id"
                openDialog={openDialog}
                onClose={(e) => setOpenDialog(e)}
                columnDialog={columnDialog}
                dataAdd={dataAdd}
                onChangeDialog={(data) => onClickSave(data)}
                dataEdit={dataEdit}
            />)
    }

    const onChangeFilterTable = (e) => {
        if (e.target.value) {
            setValueFilter(e.target.value)
            let filterText = (e.target.value).trim()
            const filteredItems = dataMaster.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                setDataMaster([])
            } else {
                setDataMaster(filteredItems)
            }
        } else {
            setValueFilter("")
            getDataMaster()
        }
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const columnExport = [
        { "header": "ลำดับ", "selector": "row_num" },
        { "header": "รหัสสมาชิก", "selector": "wht_category_name" },
        { "header": "คำนำหน้า", "selector": "master_title_name" },
        { "header": "กลุ่มลูกค้า", "selector": "arcustomer_group_name" },
        { "header": "ประเภทบุคคล", "selector": "master_person_type_name" },
        { "header": "หมวดลูกค้า", "selector": "arcustomer_category_name" },
        { "header": "ประเภทสมาชิก", "selector": "master_member_type_name" },
        { "header": "ประเภทราคา", "selector": "arcustomer_price_name" },
        { "header": "จำนวนวันเครดิต", "selector": "arcustomer_creditday" },
        { "header": "วงเงินเครดิต", "selector": "arcustomer_credit_amount" },
        { "header": "ที่อยู่", "selector": "arcustomer_addr" },
        { "header": "เบอร์โทร", "selector": "arcustomer_addr_tel" },
        { "header": "สถานะ", "selector": "arcustomer_active_name" },
    ]

    return (<>
        <HeaderPage
            onChange={(e) => onChangeFilterTable(e)}
            value={valueFilter}
            onClick={() => onClickAddData()}
            data={dataMaster}
            columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialog()}

    </>)
}

export default CategorySetting
