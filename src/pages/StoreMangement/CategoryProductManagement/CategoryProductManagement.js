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

const CategoryProductManagement = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId] = useState(userData[0].master_company_id)
    const [branchId] = useState(parseInt(BranchData[0].master_branch_id))
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [dataCategoryProductManagement, setDataCategoryProductManagement] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const [typeProductManagement, setTypeProductManagement] = useState([]);


    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => row.row_num,
            sortable: false,
            width: '80px'
        },
        {
            name: 'ประเภทสินค้า',
            selector: row => {
                const typeProduct = typeProductManagement.find(item => item.master_product_type_id === row.master_product_type_id);
                if (typeProduct) {
                    return typeProduct.master_product_type_name;
                } else {
                    return 'ถูกปิดการใช้งาน';
                }
            },
            cell: row => {
                const typeProduct = typeProductManagement.find(item => item.master_product_type_id === row.master_product_type_id);
                if (!typeProduct) {
                    return <span style={{ color: 'red', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ถูกปิดการใช้งาน</span>;
                }
                return <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{typeProduct.master_product_type_name}</span>;
            },
            width: '200px',
            left: true,
            sortable: true,
        },
        {
            name: 'รหัสหมวดสินค้า',
            selector: row => row.master_product_category_code,
            sortable: true,
            width: '120px',
            center: "true"
        },
        {
            name: 'ชื่อหมวดสินค้า(TH)',
            selector: row => row.master_product_category_name,
            sortable: true,
            width: 'auto'
        },
        {
            name: 'ชื่อหมวดสินค้า(EN)',
            selector: row => row.master_product_category_name_eng,
            sortable: true,
            width: 'auto'

        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <Switchstatus value={row.master_product_category_active} />,
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
        getDataCategory()
    }, [])

    const getDataCategory = () => {
        const dataApi = {
            "company_id": companyId,
            "branch_id": branchId
        }
        axios.post(UrlApi() + 'get_category_product_management', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => { item.row_num = idx + 1 })
                setDataCategoryProductManagement(res.data)
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
        if (!data.master_product_category_id && data.master_product_category_name) {
            console.log("1")
            data.company_id = parseInt(companyId)
            data.master_product_type_id = data.master_product_type_id ? data.master_product_type_id : ""
            data.master_product_category_code = data.master_product_category_code ? data.master_product_category_code : ""
            data.master_product_category_name = data.master_product_category_name ? data.master_product_category_name : ""
            data.master_product_category_name_eng = data.master_product_category_name_eng ? data.master_product_category_name_eng : ""
            data.master_product_category_active = data.master_product_category_active ? data.master_product_category_active : true
            axios.post(UrlApi() + 'add_category_product_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataCategory()
                }
            })
        } else if (data.master_product_category_id && data.master_product_category_name) {
            console.log("2")
            data.company_id = parseInt(data.master_company_id)
            axios.post(UrlApi() + 'update_category_product_management', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataCategory()
                }
            })
        }
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataCategoryProductManagement} />)
    }


    const columnDialog = [
        {
            name: 'ประเภทสินค้า', type: "dropdown", key: "master_product_type_id", validate: true,
            value_key: "master_product_type_name",
            id_key: "master_product_type_id",
            option: typeProductManagement
        },
        { name: 'รหัสหมวดสินค้า', type: "input_text", key: "master_product_category_code" },
        { name: 'ชื่อหมวดสินค้า(TH)', type: "input_text", key: "master_product_category_name" },
        { name: 'ชื่อหมวดสินค้า(EN)', type: "input_text", key: "master_product_category_name_eng" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "master_product_category_active" },
    ]
    useEffect(() => {
        const getTypeProductManagement = async () => {
            try {
                const dataApi = {
                    "company_id": companyId,
                    "branch_id": branchId,
                };
                const response = await axios.post(UrlApi() + 'get_type_product_management', dataApi);
                if (response.data) {
                    const modifiedData = response.data.filter(item => item.master_product_type_active === true).map((item, idx) => ({ ...item, row_num: idx + 1 }));
                    setTypeProductManagement(modifiedData);
                }
                console.log(response.data);
            } catch (error) {
                console.error("Error while fetching data:", error);
            }
        };
        getTypeProductManagement();
    }, []);
    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_product_category_id"
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
            const filteredItems = dataCategoryProductManagement.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                setDataCategoryProductManagement([])
            } else {
                setDataCategoryProductManagement(filteredItems)
            }
        } else {
            setValueFilter("")
            getDataCategory()
        }
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const columnExport = [
        { "header": "ลำดับ", "selector": "row_num" },
        { "header": "รอบการขาย", "selector": "master_product_category_name" },
        { "header": "หมายเหตุ", "selector": "master_shift_job_remark" },
        { "header": "รอบการขายสุดท้ายของวัน", "selector": "master_shift_job_last_day_active_name" },
        { "header": "สถานะการใช้งาน", "selector": "master_shift_job_active_name" },
    ];

    return (<>
        <HeaderPage
            onChange={(e) => onChangeFilterTable(e)}
            value={valueFilter}
            onClick={() => onClickAddData()}
            data={dataCategoryProductManagement}
            columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialog()}

    </>)

}

export default CategoryProductManagement
