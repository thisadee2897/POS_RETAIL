﻿import { React, useState, useEffect, useContext } from "react";
import axios from 'axios';
import DataTable from '../../components/Datatable/Datatables';
import BtnEdit from "../../components/Button/BtnEdit";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertWarning from "../../components/Alert/AlertWarning";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import Switchstatus from "../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import DialogMaster from "../../components/DialogMaster/DialogMaster";
import Moment from 'moment';

const MemberTypeSetting = () => {
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
    const [dataCustomerCategory,setDataCustomerCategory] = useState([])

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            
        },
        {
            name: 'ชื่อกลุ่มสมาชิก (ภาษาไทย)',
            selector: row => row.arcustomer_group_name,
            sortable: true,
        },
        {
            name: 'ชื่อกลุ่มสมาชิก (ภาษาอังกฤษ)',
            selector: row => row.arcustomer_group_name_eng,
            sortable: true,
        },
        {
            name: 'หมวดหมู่ลูกค้า',
            selector: row => row.arcustomer_category_name,
            sortable: true,
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Switchstatus value={row.arcustomer_group_active} /></>,
            sortable: true,
        },
        {
            name: 'แก้ไข',
            selector: row => <BtnEdit onClick={() => onClickEdit(row)} />,
            sortable: false,

        },
    ]

    useEffect(() => {
        getDataMaster()
        getDataCustomerCatagory()
    }, [])

    const getDataMaster = () => {
        const dataApi = {
            "company_id": companyId,
        }
        axios.post(UrlApi() + 'get_customergroup_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    item.arcustomer_group_active_name = item.arcustomer_group_active == true ? "เปิดการใช้งาน" : "ปิดการใช้งาน"
                })
                setDataMaster(res.data)
            }
        })
    }

    const getDataCustomerCatagory = () => {
        const dataApi = {
            "company_id": companyId,
        }
        axios.post(UrlApi() + 'get_customercategory_data', dataApi).then((res) => {
            if (res.data) {
                setDataCustomerCategory(res.data)
            }
        })
    }

    const onClickAddData = () => {
        setDataEdit({})
        setOpenDialog(true)
    }

    const onClickEdit = (row) => {
        setDataAdd({})
        setOpenDialog(true)
        setDataEdit(row)
    }

    const onClickSave = (data) => {
        if (data.arcustomer_group_id) {
            axios.post(UrlApi() + 'update_customergroup_data', data)
                .then(res => {
                    if (res.data) {
                        setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                        setAlertSuccess(true)
                        setOpenDialog(false)
                        setOpenDialog(false)
                        getDataMaster()
                    }
                })
        } else {
            data.master_company_id = companyId
            data.arcustomer_group_active = data.arcustomer_group_active != undefined ? data.arcustomer_group_active : true
            axios.post(UrlApi() + 'add_customergroup_data', data)
                .then(res => {
                    if (res.data) {
                        setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                        setAlertSuccess(true)
                        setOpenDialog(false)
                        setOpenDialog(false)
                        getDataMaster()
                    }
            })
        }

    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataMaster} />)
    }

    const columnDialog = [
        { name: 'ชือ (ภาษาไทย)', type: "input_text", key: "arcustomer_group_name", validate: true },
        { name: 'ชือ (ภาษาอังกฤษ)', type: "input_text", key: "arcustomer_group_name_eng", validate: true },
        { name: 'หมวดหมู่ลูกค้า', type: "dropdown", key: "arcustomer_category_id", value_key:"arcustomer_category_name", option: dataCustomerCategory, validate: true },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "arcustomer_group_active" }
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                keys="arcustomer_group_id"
                openDialog={openDialog}
                onClose={(e) => setOpenDialog(e)}
                columnDialog={columnDialog}
                dataAdd={dataAdd}
                onChangeDialog={(data) => onClickSave(data)}
                dataEdit={dataEdit}
            />)
    }

    const columnExport = [
        { "header": "ลำดับ", "selector": "row_num" },
        { "header": "ชือ (ภาษาไทย)", "selector": "arcustomer_group_name" },
        { "header": "ชือ (ภาษาอังกฤษ)", "selector": "arcustomer_group_name_eng" },
        { "header": "หมวดหมู่ลูกค้า", "selector": "arcustomer_category_name" },
        { "header": "สถานะการใช้งาน", "selector": "arcustomer_group_active_name" },
    ]

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

export default MemberTypeSetting
