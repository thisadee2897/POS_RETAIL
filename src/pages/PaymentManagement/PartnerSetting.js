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
import DialogMaster from "../../components/DialogMaster/DialogMaster"

const CategorySetting = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [branchId, setbranchId] = useState(BranchData['branch_id'])
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [dataMaster, setDataMaster] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const [textValidate, setTextValidate] = useState({})
    const [valueDialog,setvalueDialog]= useState()

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => row.row_num,
            sortable: false,
        },
        {
            name: 'ชื่อเครดิตสินเชื่อ',
            selector: row => row.master_partner_name,
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => row.master_partner_creditamnt,
            sortable: true,
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Switchstatus value={row.master_partner_active} /></>,
            sortable: true,
        },
        {
            name: 'เปิด',
            selector: row => <BtnEdit onClick={() => onClickEdit(row)} />,
            sortable: false,
        },
    ]

    useEffect(() => {
        getDataMaster()
    }, [])

    useEffect(() => {
        getDialog()
    }, [valueDialog])

    const getDataMaster = () => {
        const dataApi = {
            "company_id": companyId,
        }
        axios.post(UrlApi() + 'get_partner_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    item.wht_category_active_name = item.wht_category_active ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน'
                    item.master_partner_name = item.master_partner_name.trim()
                })
                setDataMaster(res.data)
            }
        })
    }

    const onClickAddData = () => {
        setDataEdit({})
        setOpenDialog(true)
    }

    const onClickEdit = (row, idx) => {
        setDataAdd({})
        setOpenDialog(true)
        setDataEdit(row)
    }

    const onClickSave = (data) => {
        let findData = _.findIndex(dataMaster, { master_partner_name: data.master_partner_name})
        if (findData >= 0) {
            textValidate.key = 'master_partner_name'
            textValidate.message = '***ชื่อซ้ำในระบบ กรุณากรอกใหม่อีกครั้ง'
            setvalueDialog(data)
        } else { 
            if (data.master_partner_id) {
                axios.post(UrlApi() + 'update_partner_data_edit', dataEdit)
                    .then(res => {
                        if (res.data) {
                            setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                            setAlertSuccess(true)
                            setOpenDialog(false)
                            setOpenDialog(false)
                            getDataMaster()
                        }
                    })
            } else {
                data.master_company_id = parseInt(companyId)
                data.master_partner_active = data.master_partner_active ? data.master_partner_active : true
                console.log(dataAdd, "dataAdd")
                axios.post(UrlApi() + 'add_partner_data', dataAdd)
                    .then(res => {
                        if (res.data) {
                            setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                            setAlertSuccess(true)
                            setOpenDialog(false)
                            getDataMaster()
                        }
                    })
            }
        }

    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataMaster} />)
    }

    const columnDialog = [
        {
            name: 'ชื่อเครดิตสินเชื่อ', type: "input_text", key: "master_partner_name", validate: true,
            data_duplicate: dataMaster,
        },
        { name: 'มูลค่า', type: "input_num", key: "master_partner_creditamnt", validate: true },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "master_partner_active" },
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_partner_id"
                openDialog={openDialog}
                onClose={(e) => setOpenDialog(e)}
                columnDialog={columnDialog}
                dataAdd={dataAdd}
                onChangeDialog={(data) => onClickSave(data)}
                dataEdit={dataEdit}
                textValidates={textValidate}
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
        { "header": "ชื่อ", "selector": "wht_category_name" },
        { "header": "ชื่อออกบิล", "selector": "wht_category_blii_name" },
        { "header": "มูลค่า", "selector": "wht_category_rate" },
        { "header": "สถานะการใช้งาน", "selector": "wht_category_active_name" },
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
