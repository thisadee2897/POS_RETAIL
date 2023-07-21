import { React, useState, useEffect, useContext } from "react";
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

const CashierSetting = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [branchId, setbranchId] = useState(parseInt(BranchData[0].master_branch_id))
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [dataMaster, setDataMaster] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const [dataCustomerCategory, setDataCustomerCategory] = useState([])

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,

        },
        {
            name: 'เครื่องแคชเชียร์',
            selector: row => row.master_pos_cashier_machine_name,
            sortable: true,
        },
        {
            name: 'หมายเหตุ',
            selector: row => row.master_pos_cashier_machine_remark,
            sortable: true,
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Switchstatus value={row.master_pos_cahier_machine_active} /></>,
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
    }, [])

    const getDataMaster = () => {
        const dataApi = {
            "company_id": companyId,
            "branch_id": branchId
        }
        axios.post(UrlApi() + 'get_cashier_machine_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    item.master_pos_cahier_machine_active_name = item.master_pos_cahier_machine_active == true ?
                        'เปิดการใช้งาน' : 'ปิดการใช้งาน'
                })
                setDataMaster(res.data)
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
        if (data.master_pos_cashier_machine_id) {
           axios.post(UrlApi() + 'update_cashier_machine_data', data)
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
            data.master_pos_cashier_machine_empsave_id = parseInt(userData[0].emp_employeemasterid)
            data.master_company_id = companyId
            data.master_pos_cashier_machine_branch_id = parseInt(branchId)
            data.master_pos_cahier_machine_active = data.master_pos_cahier_machine_active ? data.master_pos_cahier_machine_active : true
            data.master_pos_cashier_machine_remark = data.master_pos_cashier_machine_remark ? data.master_pos_cashier_machine_remark :''
            axios.post(UrlApi() + 'add_cashier_machine_data', data)
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
        { name: 'เครื่องแคชเชียร์', type: "input_text", key: "master_pos_cashier_machine_name", validate: true },
        { name: 'หมายเหตุ', type: "input_text", key: "master_pos_cashier_machine_remark" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "master_pos_cahier_machine_active" }
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_pos_cashier_machine_id"
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
        { "header": "เครื่องแคชเชียร์", "selector": "master_pos_cashier_machine_name" },
        { "header": "หมายเหตุ", "selector": "master_pos_cashier_machine_remark" },
        { "header": "สถานะการใช้งาน", "selector": "master_pos_cahier_machine_active" },
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

export default CashierSetting
