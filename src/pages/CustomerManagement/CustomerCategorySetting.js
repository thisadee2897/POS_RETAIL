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

const CustomerCategorySetting = () => {
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


    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,

        },
        {
            name: 'ชื่อ',
            selector: row => row.arcustomer_category_name,
            sortable: true,
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Switchstatus value={row.arcustomer_category_active} /></>,
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
        }
        axios.post(UrlApi() + 'get_customercategory_data', dataApi).then((res) => {
            if (res.data) {
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
        if (data.arcustomer_category_id) {
            axios.post(UrlApi() + 'update_customercategory_data', data)
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
            data.arcustomer_category_active = data.arcustomer_category_active != undefined ? data.arcustomer_category_active : true
            axios.post(UrlApi() + 'add_customercategory_data', data)
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
        { name: 'ชือ', type: "input_text", key: "arcustomer_category_name", validate: true },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "arcustomer_category_active" }
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                keys="arcustomer_category_id"
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
        { "header": "ชื่อ", "selector": "salehd_voucher_type_name" },
        { "header": "มูลค่า", "selector": "salehd_voucher_type_rate" },
        { "header": "วันที่เริ่มใช้", "selector": "salehd_voucher_datebegindates" },
        { "header": "วันที่สิ้นสุด", "selector": "salehd_voucher_dateenddates" },
        { "header": "สถานะการใช้งาน", "selector": "salehd_voucher_type_active_name" },
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

export default CustomerCategorySetting
