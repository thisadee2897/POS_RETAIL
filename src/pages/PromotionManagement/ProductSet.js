import { React, useState, useEffect, useContext } from "react";
import axios from 'axios';
import DataTable from '../../components/Datatable/Datatables';
import BtnEdit from "../../components/Button/BtnEdit";
import BtnDelete from "../../components/Button/BtnDelete";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertWarning from "../../components/Alert/AlertWarning";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import Switchstatus from "../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import DialogMaster from "../../components/DialogMaster/DialogMaster"
import BtnAdd from "../../components/Button/BtnAdd";
import DialogProduct from "../../components/DialogProduct/DialogProduct"

const ProductSet = () => {
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [branchId, setbranchId] = useState(BranchData[0].master_branch_id)
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogProduct, setOpenDialogProduct] = useState(false)
    const [dataMaster, setDataMaster] = useState([])
    const [dataMasterDefault, setDataMasterDefault] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const [dataEditDT, setDataEditDT] = useState([])
    const [textValidate, setTextValidate] = useState({})
    const [valueDialog, setvalueDialog] = useState()
    const [dataProductSelect, setDataProductSelect] = useState([])
    const [docCode, setDocCode] = useState("")
    const dataApi = {
        "company_id": companyId,
        "branch_id": parseInt(branchId)
    }

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx+1,
            sortable: false,
        },
        {
            name: 'รหัสเซ็ตสินค้า',
            selector: row => row.set_hd_docuno,
            sortable: true,
        },
        {
            name: 'ชื่อเซ็ตสินค้า',
            selector: row => row.set_hd_name,
            sortable: true,
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Switchstatus value={row.set_hd_active} /></>,
            sortable: true,
        },
        {
            name: 'เปิด',
            selector: row => <BtnEdit onClick={() => onClickEdit(row)} />,
            sortable: false,
        },
    ]

    const columnsdataProduct = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'รหัสสินค้า',
            selector: row => row.master_product_code,
            sortable: false,
        },
        {
            name: 'บาร์โค๊ด',
            selector: row => row.master_product_barcode,
            sortable: false,
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.master_product_name_bill,
            sortable: false,
            width: '350px'
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.master_product_unit_name,
            sortable: false,
        },
        {
            name: 'ราคา',
            selector: row => nf.format(row.master_product_price),
            sortable: false,
            right: true,
        },
        {
            selector: (row,idx) => <BtnDelete style={{ height: "24px" }} onClick={() => onClickDelete(row,idx)} />,
            width: '100px'
        },
    ]

    useEffect(() => {
        getDataMaster()
        getDataMasterDefault()
        getDocCode()
    }, [])

    useEffect(() => {
        getDialog()
        getDialogProduct()
    }, [valueDialog, dataProductSelect])

    const getDataMaster = () => {
        axios.post(UrlApi() + 'get_sethd_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx +1
                    item.set_hd_active_name = item.set_hd_active == true ? "เปิดการใช้งาน" : "ปิดการใช้งาน"
                    item.set_dt.map((its, ids) => {
                        its.set_dt_active = true
                    })
                })
                setDataMaster(res.data)
            }
        })
    }

    const getDataMasterDefault = () => {
        axios.post(UrlApi() + 'get_sethd_data', dataApi).then((res) => {
            if (res.data) {
                setDataMasterDefault(res.data)
            }
        })
    }

    const getDocCode = () => {
        axios.post(UrlApi() + 'get_set_hd_document', dataApi).then((res) => {
            if (res.data) {
                setDocCode(res.data[0].docuno)
            }
        })
    }

    const onClickAddData = () => {
        setDataEdit({})
        setDataProductSelect([])
        getDialogProduct()
        setOpenDialog(true)
    }

    const onClickEdit = (row, idx) => {
        let findIdx = _.findIndex(dataMasterDefault, { set_hd_id: row.set_hd_id })
        setDataEditDT(dataMasterDefault[findIdx].set_dt)
        setDataAdd({})
        setDataProductSelect(row.set_dt)
        setOpenDialog(true)
        setDataEdit(row)
 
    }

    const onClickDelete = (row, idx) => {
        let findIdx = _.findIndex(dataEditDT, { set_dt_id: row.set_dt_id })
        if (findIdx >= 0) {
            dataEditDT[findIdx].set_dt_active = false
        }
        dataProductSelect.splice(idx, 1)
        setvalueDialog(row)
    }

    const onClickSave = (data) => {
        if (data.set_hd_id) {
            let dataList = []
            dataEditDT.map((Hitem, Hidx) => { dataList.push(Hitem) })
            dataEdit.set_dt.map((item, idx) => {
                if (!item.set_dt_id) {
                    item.set_dt_active = true
                    item.set_dt_id = null
                    dataList.push(item)
                } 
            })
            data.set_hd_docuno = docCode
            data.company_id = parseInt(companyId)
            data.branch_id = parseInt(branchId)
            data.set_hd_remark = data.set_hd_remark ? data.set_hd_remark : ''
            data.set_hd_active = data.set_hd_active 
            data.employee_id = parseInt(userData[0].emp_employeemasterid)
            data.product_set_dt = dataList
            axios.post(UrlApi() + 'update_product_set_data', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataMaster()
                    getDataMasterDefault()
                }
            })
        } else {
            data.set_hd_docuno = docCode
            data.company_id = parseInt(companyId)
            data.branch_id = parseInt(branchId)
            data.set_hd_remark = data.set_hd_remark ? data.set_hd_remark : ''
            data.set_hd_active = data.set_hd_active ? data.set_hd_active : true
            data.employee_id = parseInt(userData[0].emp_employeemasterid)
            data.product_set_dt = dataProductSelect
            axios.post(UrlApi() + 'add_product_set_data', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataMaster()
                    getDataMasterDefault()
                }
            })
        }

    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataMaster} />)
    }

    const columnDialog = [
        { name: 'รหัสเซ็ตสินค้า', type: "text", defaultvalue: docCode, key: "set_hd_docuno", },
        { name: 'วันที่จัดเซ็ต', type: "text_date", key: "set_hd_docudate"},
        { name: 'ชื่อเช็ตสินค้า', type: "input_text", key: "set_hd_name", validate: true,width: "90%"  },
        { name: 'หมายเหตุ', type: "input_text", key: "set_hd_remark", width: "90%" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "set_hd_active"  },
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                width="1100px"
                col="2"
                keys="set_hd_id"
                openDialog={openDialog}
                onClose={(e) => setOpenDialog(e)}
                columnDialog={columnDialog}
                customDialog={getDetailSet()}
                dataAdd={dataAdd}
                onChangeDialog={(data) => onClickSave(data)}
                dataEdit={dataEdit}
                textValidates={textValidate}
            />)
    }

    const getDetailSet = () => {
        return (<><BtnAdd message="เพิ่มสินค้า" onClick={() => setOpenDialogProduct(true)} />
                <DataTable
                    style={{ marginTop: "1%", marginLeft: "0%" }}
                     columns={columnsdataProduct}
                     data={dataProductSelect} />
        </>)
    }

    const getDialogProduct = () => {
        return (<DialogProduct
                    datadefault={dataProductSelect}
                    onClose={(e) => setOpenDialogProduct(e)}
                    openDialog={openDialogProduct}
                    onClick={(e) => setDataProductSelect(e)} />)
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
        { "header": "รหัสเช็ตสินค้า", "selector": "set_hd_docuno" },
        { "header": "ชื่อเช็ตสินค้า", "selector": "set_hd_name" },
        { "header": "สถานะการใช้งาน", "selector": "set_hd_active_name" },
    ]

    return (<>
        <HeaderPage
            onChange={(e) => onChangeFilterTable(e)}
            value={valueFilter}
            onClick={() => onClickAddData()}
            data={dataMaster}
            columns={columnExport}
        />
        {getDialogProduct()}
        {getAlert()}  
        {getDataTable()}
        {getDialog()}

    </>)
}

export default ProductSet
