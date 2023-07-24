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
import DialogMaster from "./DialogMaster";


const ProductGroupManagement = () => {
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
    const [DataCategory, setDataCategory] = useState([])
    const defaultFormData = {
        master_product_group_id: '',
        master_product_group_name: '',
        master_product_group_code: '',
        master_product_group_name_eng: '',
        master_product_category_id: '',
        sale_active: true,
    };
    const [formData, setFormData] = useState(defaultFormData);
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'หมวดสินค้า',
            selector: row => {
                const typeCategory = DataCategory.find(item => item.master_product_category_id === row.master_product_category_id);
                if (typeCategory) {
                    return typeCategory.master_product_category_name;
                } else {
                    return 'ถูกปิดการใช้งาน';
                }
            },
            cell: row => {
                const typeCategory = DataCategory.find(item => item.master_product_category_id === row.master_product_category_id);
                if (!typeCategory) {
                    return <span style={{ color: 'red', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ถูกปิดการใช้งาน</span>;
                }
                return <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{typeCategory.master_product_category_name}</span>;
            },
            width: '200px',
            left: true,
            sortable: true,
        },
        {
            name: 'รหัสหมวดสินค้า',
            selector: row => row.master_product_group_code,
            sortable: true,
            width: '200px',
            center: "true"
        },
        {
            name: 'ชื่อหมวดสินค้า(TH)',
            selector: row => row.master_product_group_name,
            sortable: true,
            width: 'auto'
        },
        {
            name: 'ชื่อหมวดสินค้า(EN)',
            selector: row => row.master_product_group_name_eng,
            sortable: true,
            width: 'auto'

        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <Switchstatus value={row.sale_active} />,
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
        getProductGroup()
    }, [])
    useEffect(() => {
        const getDataCategoryManagement = async () => {
            try {
                const dataApi = {
                    "company_id": companyId,
                    "branch_id": branchId,
                };
                const response = await axios.post(UrlApi() + 'get_category_product_management', dataApi);
                if (response.data) {
                    const modifiedData = response.data.filter(item => item.master_product_category_active === true).map((item, idx) => ({ ...item, row_num: idx + 1 }));
                    setDataCategory(modifiedData);
                }
                console.log(response.data);
            } catch (error) {
                console.error("Error while fetching data:", error);
            }
        };
        getDataCategoryManagement();
    }, []);

    const getProductGroup = () => {
        const dataApi = {
            "company_id": companyId
        }
        axios.post(UrlApi() + 'get_product_group_management', dataApi).then((res) => {
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
        console.log(data)
        if (!data.master_product_group_id && data.master_product_group_name) {
            data.company_id = parseInt(companyId)
            data.master_product_category_id = data.master_product_category_id ? data.master_product_category_id : ""
            data.master_product_group_code = data.master_product_group_code ? data.master_product_group_code : ""
            data.master_product_group_name = data.master_product_group_name ? data.master_product_group_name : ""
            data.master_product_group_name_eng = data.master_product_group_name_eng ? data.master_product_group_name_eng : ""
            data.sale_active = data.sale_active ? data.sale_active : true
            axios.post(UrlApi() + 'add_product_group_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ");
                    setOpenDialog(false);
                    getProductGroup();
                    setFormData(defaultFormData);
                }
            })
        } else if (data.master_product_group_id && data.master_product_group_name) {
            data.company_id = parseInt(data.master_company_id)
            axios.post(UrlApi() + 'update_product_group_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ");
                    setOpenDialog(false);
                    getProductGroup();
                    setFormData(defaultFormData);
                }
            })
        }
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataShiftSetting} />)
    }


    const columnDialog = [
        {
            name: 'หมวดสินค้า', type: "dropdown", key: "master_product_category_id", validate: true,
            value_key: "master_product_category_name",
            id_key: "master_product_category_id",
            option: DataCategory
        },
        { name: 'รหัสหมวดสินค้า', type: "input_text", key: "master_product_group_code", validate: true },
        { name: 'ชื่อหมวดสินค้า(TH)', type: "input_text", key: "master_product_group_name" },
        { name: 'ชื่อหมวดสินค้า(EN)', type: "input_text", key: "master_product_group_name_eng" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "sale_active" },
    ]



    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_product_group_id"
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
            getProductGroup()
        }
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const columnExport = [
        { "header": "ลำดับ", "selector": "row_num" },
        {
            "header": "หมวดสินค้า",
            "selector": (row) => {
                const typeCategory = DataCategory.find(item => item.master_product_category_id === row.master_product_category_id);
                return typeCategory ? typeCategory.master_product_category_name : 'ถูกปิดการใช้งาน';
            }
        },
        { "header": "รหัสหมวดสินค้า", "selector": "master_product_group_code" },
        { "header": "ชื่อหมวดสินค้าTH", "selector": "master_product_group_name" },
        { "header": "ชื่อหมวดสินค้าEN", "selector": "master_product_group_name_eng" },
        { "header": "สถานะการใช้งาน", "selector": "sale_active" },
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

export default ProductGroupManagement
