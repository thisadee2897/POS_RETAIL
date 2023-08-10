import { React, useState, useEffect, useContext } from "react";
import axios from 'axios';
import DataTable from '../../../components/Datatable/Datatables';
import BtnEdit from "../../../components/Button/BtnEdit";
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import UrlApi from "../../../url_api/UrlApi";
import _, { set } from "lodash";
import '../../../components/CSS/report.css';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import Switchstatus from "../../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../../components/HeaderPage/HeaderPage";
import DialogMaster from "./DialogMaster";

const ProductManagement = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId] = useState(userData[0].master_company_id)
    const [branchId] = useState(parseInt(BranchData[0].master_branch_id))
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [dataProduct, SetDataProduct] = useState([])
    const [dataUnit, SetDataUnit] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row) => row.row_num,
            sortable: false,
            width: '80px',
            center: true,
        },
        {
            name: 'รหัสสินค้า',
            selector: row => row.master_product_code,
            sortable: true,
            width: '150px',
            left: true,
        },
        {
            name: 'ชื่อหมวดสินค้า(TH)',
            selector: row => row.master_product_name,
            sortable: true,
            left: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ชื่อหมวดสินค้า(EN)',
            selector: row => row.master_product_name_eng,
            sortable: true,
            left: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ชื่อสินค้าในการออกบิล',
            selector: row => row.master_product_name_bill,
            sortable: true,
            // width: '200px',
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'คำอธิบายสินค้า',
            selector: row => row.master_product_remark,
            sortable: true,
            width: '400px',
            left: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.master_product_unit_name,
            sortable: true,
            width: '100px',
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <Switchstatus value={row.sale_activeflag} />,
            sortable: true,
            width: '160px',
        },
        {
            name: 'แก้ไข',
            selector: (row, idx) => <BtnEdit onClick={() => onClickEdit(row, idx)} />,
            right: true,
            width: '90px'
        },
    ]
    const [Code, setCode] = useState([]);
    useEffect(() => {
        getDataProduct()
        getDataUnit()
    }, [])

    const getDataProduct = () => {
        const dataApi = {
            "company_id": companyId
        }
        axios.post(UrlApi() + 'get_product_management', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => { item.row_num = idx + 1 })
                SetDataProduct(res.data)
            }
        })
    }
    const getDataUnit = () => {
        const dataApi = {
            "company_id": companyId
        }
        axios.post(UrlApi() + 'get_product_unit_management', dataApi).then((res) => {
            if (res.data) {
                const modifiedData = res.data.filter(item => item.master_product_unit_active === true).map((item, idx) => ({ ...item, row_num: idx + 1 }));
                SetDataUnit(modifiedData);
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
    const onClickSave = (data, Image, Detail) => {
        const Data = {
            ...data,
            ...Image,
            ...Detail,
        };
        console.log(Data)
        // console.log(data)
        // console.log(Image)
        // console.log(Detail)
        if (!Data.master_product_id && Data.master_product_name) {
            Data.master_company_id = parseInt(companyId)
            Data.master_product_code = Data.master_product_code ? Data.master_product_code : ""
            Data.master_product_name = Data.master_product_name ? Data.master_product_name : ""
            Data.master_product_name_eng = Data.master_product_name_eng ? Data.master_product_name_eng : ""
            Data.master_product_name_bill = Data.master_product_name_bill ? Data.master_product_name_bill : ""
            Data.master_product_remark = Data.master_product_remark ? Data.master_product_remark : ""
            data.sale_activeflag = data.sale_activeflag ? data.sale_activeflag : true
            Data.master_product_unit_id = Data.master_product_unit_id ? Data.master_product_unit_id : ""
            Data.master_product_image_name = Data.master_product_image_name ? Data.master_product_image_name : ""
            Detail.master_product_brand_id = Detail.master_product_brand_id ? Detail.master_product_brand_id : ""
            Data.master_product_category_id = Data.master_product_category_id ? Detail.master_product_category_id : ""
            Data.master_vat_group_id = Data.master_vat_group_id ? Data.master_vat_group_id : ""
            Data.master_product_type_id = Data.master_product_type_id ? Detail.master_product_type_id : ""
            Data.master_product_group_id = Data.master_product_group_id ? Detail.master_product_group_id : ""
            Data.master_vat_purchase_group_id = Data.master_vat_purchase_group_id ? Detail.master_vat_purchase_group_id : ""
            Data.master_product_sell_active = Data.master_product_sell_active ? Detail.master_product_sell_active : true
            Data.master_product_purchase_active = Data.master_product_purchase_active ? Detail.master_product_purchase_active : true
            axios.post(UrlApi() + 'add_product_management', Data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataProduct()
                }
            })
        } else if (data.master_product_id && data.master_product_name) {
            data.branch_id = parseInt(data.master_shift_job_branch_id)
            data.company_id = parseInt(data.master_company_id)
            axios.post(UrlApi() + 'update_product_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataProduct()
                }
            })
        }
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataProduct} />)
    }
    const columnDialog = [
        { name: 'รหัสสินค้า', type: "input_text", key: "master_product_code" },
        { name: 'ชื่อหมวดสินค้า(TH)', type: "input_text", key: "master_product_name" },
        { name: 'ชื่อหมวดสินค้า(EN)', type: "input_text", key: "master_product_name_eng" },
        { name: 'ชื่อสินค้าในการออกบิล', type: "input_text", key: "master_product_name_bill" },
        { name: 'คำอธิบายสินค้า', type: "input_text", key: "master_product_remark" },
        {
            name: 'หน่วยนับ', type: "dropdown", key: "master_product_unit_id",
            value_key: "master_product_unit_name",
            id_key: "master_product_unit_id",
            option: dataUnit
        },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "sale_activeflag" },
    ]

    const Detail = {
        master_product_category_id: "",
        master_product_group_id:"",
        master_product_type_id: "",
        master_product_brand_id:"",
        master_vat_purchase_group_id: "",
        master_vat_group_id: "",
        master_product_sell_active:"",
        master_product_purchase_active :"",
    };
    const Images = { master_product_image_name: "" };
    const Status ={sale_activeflag : ""}
    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_product_id"
                openDialog={openDialog}
                onClose={(e) => setOpenDialog(e)}
                columnDialog={columnDialog}
                img={Images}
                status={Status}
                DetailData={Detail}
                dataAdd={dataAdd}
                dataEdit={dataEdit}
                onChangeDialog={(data, Image, Detail) => onClickSave(data, Image, Detail)}
            />)
    }
    const onChangeFilterTable = (e) => {
        if (e.target.value) {
            setValueFilter(e.target.value)
            let filterText = (e.target.value).trim()
            const filteredItems = dataProduct.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                SetDataProduct([])
            } else {
                SetDataProduct(filteredItems)
            }
        } else {
            setValueFilter("")
            getDataProduct()
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
            data={dataProduct}
            columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialog()}

    </>)

}
export default ProductManagement
