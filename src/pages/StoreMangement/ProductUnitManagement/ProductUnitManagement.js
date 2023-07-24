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
import Switchstatus from "../../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../../components/HeaderPage/HeaderPage";
import DialogMaster from "./DialogMaster"

const ProductUnitManagement = () => {
    const userData = useContext(DataContext);
    const [companyId] = useState(userData[0].master_company_id)
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [ProductUnit, setProductUnit] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})


    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row) => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'ชื่อหมวดสินค้า(TH)',
            selector: row => row.master_product_unit_name,
            sortable: true,
            // width: '200px',
            center: "true"
        },
        {
            name: 'ชื่อหมวดสินค้า(EN)',
            selector: row => row.master_product_unit_name_eng,
            sortable: true,
            // width: '200px',
            center: "true"

        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <Switchstatus value={row.master_product_unit_active} />,
            sortable: true,
            width: '160px',
            center: "true"
        },
        {
            name: 'แก้ไข',
            selector: (row, idx) => <BtnEdit onClick={() => onClickEdit(row, idx)} />,
            right: true,
            width: '90px',
            center: "true"
        },
    ]

    useEffect(() => {
        getDataShiftSeeting()
    }, [])

    const getDataShiftSeeting = () => {
        const dataApi = {
            "company_id": companyId
        }
        axios.post(UrlApi() + 'get_product_unit_management', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => { item.row_num = idx + 1 })
                setProductUnit(res.data)
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
        console.log(data)
        if (!data.master_product_unit_id && data.master_product_unit_name) {
            data.company_id = parseInt(companyId)
            data.master_product_unit_name = data.master_product_unit_name ? data.master_product_unit_name : ""
            data.master_product_unit_name_eng = data.master_product_unit_name_eng ? data.master_product_unit_name_eng : ""
            data.master_product_unit_active = data.master_product_unit_active ? data.master_product_unit_active : true
            axios.post(UrlApi() + 'add_product_unit_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataShiftSeeting()
                }
            })
        } else if (data.master_product_unit_id && data.master_product_unit_name) {
            data.company_id = parseInt(data.master_company_id)
            axios.post(UrlApi() + 'update_product_unit_management', data).then((res) => {
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
        return (<DataTable columns={columnData} data={ProductUnit} />)
    }


    const columnDialog = [
        { name: 'ชื่อหมวดสินค้า(TH)', type: "input_text", key: "master_product_unit_name" },
        { name: 'ชื่อหมวดสินค้า(EN)', type: "input_text", key: "master_product_unit_name_eng" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "master_product_unit_active" },
    ]



    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_product_unit_id"
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
            const filteredItems = ProductUnit.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                setProductUnit([])
            } else {
                setProductUnit(filteredItems)
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
        { "header": "รอบการขาย", "selector": "master_product_unit_name" },
        { "header": "หมายเหตุ", "selector": "master_shift_job_remark" },
        { "header": "รอบการขายสุดท้ายของวัน", "selector": "master_shift_job_last_day_active_name" },
        { "header": "สถานะการใช้งาน", "selector": "master_shift_job_active_name" },
    ];

    return (<>
        <HeaderPage
            onChange={(e) => onChangeFilterTable(e)}
            value={valueFilter}
            onClick={() => onClickAddData()}
            data={ProductUnit}
            // columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialog()}

    </>)

}

export default ProductUnitManagement
