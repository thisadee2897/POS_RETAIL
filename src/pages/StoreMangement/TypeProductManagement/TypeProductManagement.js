import { React, useState, useEffect, useContext } from "react";
import axios from 'axios';
import DataTable from '../../../components/Datatable/Datatables';
import BtnEdit from "../../../components/Button/BtnEdit";
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import '../../../components/CSS/report.css';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import Switchstatus from "../../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../../components/HeaderPage/HeaderPage";
import DialogMaster from "./DialogMaster"

const TypeProductManagement = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId] = useState(userData[0].master_company_id)
    const [branchId] = useState(parseInt(BranchData[0].master_branch_id))
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [TypeProductManagement, setTypeProductManagement] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'รหัสประเภทสินค้า',
            selector: row => row.master_product_type_code,
            sortable: true,
            width: '160px',
        },
        {
            name: 'ชื่อประเภทสินค้า',
            selector: row => row.master_product_type_name,
            sortable: true,
            // width: '400px',
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <Switchstatus value={row.master_product_type_active} />,
            sortable: true,
            width: '200px',
            center: "true"
        },
        {
            name: 'แก้ไข',
            selector: (row, idx) => <BtnEdit onClick={() => onClickEdit(row, idx)} />,
            right: true,
            width: '100px',
            center: "true"

        },
    ]

    useEffect(() => {
        getTypeProductManagement()
    }, [])

    const getTypeProductManagement = () => {
        const dataApi = {
            "company_id": companyId,
            "branch_id": branchId,
        }
        axios.post(UrlApi() + 'get_type_product_management', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => { item.row_num = idx + 1 })
                setTypeProductManagement(res.data)
            }
            console.log(res.data)
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
        console.log(data.master_company_id)
        if (!data.master_product_type_id && data.master_product_type_name) {
            data.company_id = parseInt(companyId)
            data.master_product_type_code = data.master_product_type_code ? data.master_product_type_code : ""
            data.master_product_type_name = data.master_product_type_name ? data.master_product_type_name : ""
            data.master_product_type_active = data.master_product_type_active ? data.master_product_type_active : true
            axios.post(UrlApi() + 'add_type_product_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getTypeProductManagement()
                }
            })
        } else if (data.master_product_type_id && data.master_product_type_name) {
            data.company_id = parseInt(data.master_company_id)
            axios.post(UrlApi() + 'update_type_product_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getTypeProductManagement()
                }
            })
        }
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={TypeProductManagement} />)
    }


    const columnDialog = [
        { name: 'รหัสประเภทสินค้า', type: "input_text", key: "master_product_type_code", validate: true },
        { name: 'ชื่อประเภทสินค้า', type: "input_text", key: "master_product_type_name" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "master_product_type_active" },
    ]
    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_product_type_id"
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
            const filteredItems = TypeProductManagement.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                setTypeProductManagement([])
            } else {
                setTypeProductManagement(filteredItems)
            }
        } else {
            setValueFilter("")
            getTypeProductManagement()
        }
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const columnExport = [
        { "header": "ลำดับ", "selector": "row_num" },
        { "header": "รอบการขาย", "selector": "master_shift_job_name" },
        { "header": "หมายเหตุ", "selector": "master_shift_job_remark" },
        { "header": "รอบการขายสุดท้ายของวัน", "selector": "master_shift_job_last_day_active_name" },
        { "header": "สถานะการใช้งาน", "selector": "master_shift_job_active_name" },
    ];

    return (<>
        <HeaderPage
            onChange={(e) => onChangeFilterTable(e)}
            value={valueFilter}
            onClick={() => onClickAddData()}
            data={TypeProductManagement}
            columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialog()}

    </>)

}

export default TypeProductManagement
