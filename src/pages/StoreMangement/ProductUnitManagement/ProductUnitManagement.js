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

const ProductUnitManagement = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId] = useState(userData[0].master_company_id)
    const [branchId] = useState(parseInt(BranchData[0].master_branch_id))
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [dataShiftSetting, setDataShiftSetting] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})


    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'ชื่อหมวดสินค้า(TH)',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            width: 'auto'
        },
        {
            name: 'ชื่อหมวดสินค้า(EN)',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            width: 'auto'

        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <Switchstatus value={row.master_shift_job_last_day_active} />,
            sortable: true,
            width: 'auto'
        },
        {
            name: 'แก้ไข',
            selector: (row, idx) => <BtnEdit onClick={() => onClickEdit(row, idx)} />,
            right: true,
            width: '50px'
        },
    ]

    useEffect(() => {
        getDataShiftSeeting()
    }, [])

    const getDataShiftSeeting = () => {
        const dataApi = {
            "company_id": companyId,
            "branch_id": branchId
        }
        axios.post(UrlApi() + 'get_shift_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => { item.row_num = idx + 1 })
                setDataShiftSetting(res.data)
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
        if (!data.master_shift_job_id && data.master_shift_job_name) {
            data.company_id = parseInt(companyId)
            data.branch_id = parseInt(branchId)
            data.master_shift_job_remark = data.master_shift_job_remark ? data.master_shift_job_remark : ""
            data.master_shift_job_empsave_id = userData[0].emp_employeemasterid
            data.master_shift_job_last_day_active = data.master_shift_job_last_day_active ? data.master_shift_job_last_day_active : true
            data.master_shift_job_active = data.master_shift_job_active ? data.master_shift_job_active : true
            axios.post(UrlApi() + 'add_shift_data', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataShiftSeeting()
                }
            })
        } else if (data.master_shift_job_id && data.master_shift_job_name) {
            data.branch_id = parseInt(data.master_shift_job_branch_id)
            data.company_id = parseInt(data.master_company_id)
            axios.post(UrlApi() + 'update_shift_data', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataShiftSeeting()
                }
            })
        }
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataShiftSetting} />)
    }


    const columnDialog = [
        { name: 'ชื่อหมวดสินค้า(TH)', type: "input_text", key: "master_shift_job_remark" },
        { name: 'ชื่อหมวดสินค้า(EN)', type: "input_text", key: "master_shift_job_remark" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "master_shift_job_last_day_active" },
    ]



    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_shift_job_id"
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
            const filteredItems = dataShiftSetting.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                setDataShiftSetting([])
            } else {
                setDataShiftSetting(filteredItems)
            }
        } else {
            setValueFilter("")
            getDataShiftSeeting()
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
            data={dataShiftSetting}
            columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialog()}

    </>)

}

export default ProductUnitManagement
