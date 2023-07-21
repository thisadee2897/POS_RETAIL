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

const VoucherSetting = () => {
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
            selector: row => row.salehd_voucher_type_name,
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => row.salehd_voucher_type_rate,
            sortable: true,
        },
        {
            name: 'วันที่เริ่มใช้',
            selector: row => row.salehd_voucher_datebegindates,
            sortable: true,
        },
        {
            name: 'วันที่สิ้นสุด',
            selector: row => row.salehd_voucher_dateenddates,
            sortable: true,
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Switchstatus value={row.salehd_voucher_type_active} /></>,
            sortable: true,
        },
        {
            name: 'เปิด',
            cell: row => <BtnEdit onClick={() => onClickEdit(row)} />,
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
        axios.post(UrlApi() + 'get_voucher_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx +1
                    let Str_y = parseInt(Moment(item.salehd_voucher_datebegin).format("YYYY")) + 543
                    let End_y = parseInt(Moment(item.salehd_voucher_dateend).format("YYYY")) + 543
                    item.salehd_voucher_datebegindates = (Moment(item.salehd_voucher_datebegin).format("DD/MM/") + Str_y)
                    item.salehd_voucher_dateenddates = (Moment(item.salehd_voucher_dateend).format("DD/MM/") + End_y)
                    item.salehd_voucher_type_active_name = item.salehd_voucher_type_active == true ? "เปิดการใช้งาน" : "ปิดการใช้งาน"
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
        console.log(row)
        setDataAdd({})
        setOpenDialog(true)
        setDataEdit(row)
    }

    const onClickSave = (data) => {
        if (data.salehd_voucher_type_id) {
            data.salehd_voucher_datebegin = data.salehd_voucher_datebegin != undefined ? Moment(data.salehd_voucher_datebegin).format("YYYYMMDD") : Moment(new Date).format("YYYYMMDD")
            data.salehd_voucher_dateend = data.salehd_voucher_dateend != undefined ? Moment(data.salehd_voucher_dateend).format("YYYYMMDD") : Moment(new Date).format("YYYYMMDD")
                axios.post(UrlApi() + 'update_voucher_data', data)
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
            data.master_company_id = companyId
            data.salehd_voucher_type_active = data.salehd_voucher_type_active != undefined ? data.salehd_voucher_type_active : true
            data.salehd_voucher_datebegin = data.salehd_voucher_datebegin != undefined ? Moment(data.salehd_voucher_datebegin).format("YYYYMMDD") : Moment(new Date).format("YYYYMMDD")
            data.salehd_voucher_dateend = data.salehd_voucher_dateend != undefined ? Moment(data.salehd_voucher_dateend).format("YYYYMMDD") : Moment(new Date).format("YYYYMMDD")
                axios.post(UrlApi() + 'add_voucher_data', data)
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
        { name: 'ชือ', type: "input_text", key: "salehd_voucher_type_name", validate: true },
        { name: 'มูลค่า', type: "input_num", key: "salehd_voucher_type_rate", validate: true },
        { name: 'วันที่เริ่มต้น', type: "select_date", key: "salehd_voucher_datebegin" },
        { name: 'วันที่สิ้นสุด', type: "select_date", key: "salehd_voucher_dateend" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "salehd_voucher_type_active" }
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                keys="salehd_voucher_type_id"
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

export default VoucherSetting
