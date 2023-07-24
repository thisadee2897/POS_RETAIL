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

const ProductBrandManagement = () => {
    const userData = useContext(DataContext);
    const [companyId] = useState(userData[0].master_company_id)
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [dataProductBrand, setDataProductBrand] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'ชื่อยี่ห้อสินค้า(TH)(EN)',
            selector: row => row.master_product_brand_name,
            sortable: true,
            // width: 'auto',
            center: true
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <Switchstatus value={row.master_product_brand_active} />,
            sortable: true,
            // width: '160px',
            center: true
        },
        {
            name: 'แก้ไข',
            selector: (row, idx) => <BtnEdit onClick={() => onClickEdit(row, idx)} />,
            right: true,
            width: '90px'
        },
    ]

    useEffect(() => {
        getDataProductBrand()
    }, [])

    const getDataProductBrand = () => {
        const dataApi = {
            "company_id": companyId
        }
        axios.post(UrlApi() + 'get_product_brand_management', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => { item.row_num = idx + 1 })
                setDataProductBrand(res.data)
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
        if (!data.master_product_brand_id && data.master_product_brand_name) {
            data.company_id = parseInt(companyId)
            data.master_product_brand_name = data.master_product_brand_name ? data.master_product_brand_name : ""
            data.master_product_brand_active = data.master_product_brand_active ? data.master_product_brand_active : true
            axios.post(UrlApi() + 'add_product_brand_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataProductBrand()
                    console.loglog("1")
                }
            })
        } else if (data.master_product_brand_id && data.master_product_brand_name) {
            data.company_id = parseInt(data.master_company_id)
            axios.post(UrlApi() + 'update_product_brand_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataProductBrand()
                    console.loglog("2")
                }
            })
        }
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataProductBrand} />)
    }


    const columnDialog = [
        { name: 'ชื่อยี่ห้อสินค้า(TH)(EN)', type: "input_text", key: "master_product_brand_name" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "master_product_brand_active" },
    ]



    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_product_brand_id"
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
            const filteredItems = dataProductBrand.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                setDataProductBrand([])
            } else {
                setDataProductBrand(filteredItems)
            }
        } else {
            setValueFilter("")
            getDataProductBrand()
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
            data={dataProductBrand}
            columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialog()}

    </>)

}

export default ProductBrandManagement
