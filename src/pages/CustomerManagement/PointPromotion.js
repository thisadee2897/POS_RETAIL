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

const PointPromotion = () => {
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
    const [dataPointType, setDataPointType] = useState([])

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
        },
        {
            name: 'ชื่อ',
            selector: row => row.promotion_point_type_name,
            sortable: true,
        },
        {
            name: 'จำนวนคะแนน',
            selector: row => row.promotion_point_type_quantity,
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => row.promotion_point_type_rate,
            sortable: true,
        },
        {
            name: 'ประเภทมูลค่า',
            selector: row => row.promotion_point_cal_type_name,
            sortable: true,
        },
        {
            name: 'วันที่เริ่มใช้',
            selector: row => row.promotion_point_type_datebegindate,
            sortable: true,
        },
        {
            name: 'วันที่สิ้นสุด',
            selector: row => row.promotion_point_type_dateenddate,
            sortable: true,
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Switchstatus value={row.promotion_point_type_active} /></>,
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
        getPintTypeCal()
    }, [])

    const getDataMaster = () => {
        const dataApi = {
            "company_id": companyId,
        }
        axios.post(UrlApi() + 'get_promotion_point_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let Str_y = parseInt(Moment(item.promotion_point_type_datebegin).format("YYYY")) + 543
                    let End_y = parseInt(Moment(item.promotion_point_type_dateend).format("YYYY")) + 543
                    item.promotion_point_type_datebegindate = (Moment(item.promotion_point_type_datebegin).format("DD/MM/") + Str_y)
                    item.promotion_point_type_dateenddate = (Moment(item.promotion_point_type_dateend).format("DD/MM/") + End_y)
                })
                setDataMaster(res.data)
            }
        })
    }

    const getPintTypeCal = () => {
        axios.get(UrlApi() + 'get_point_cal_type_data')
            .then(res => {
                if (res.data) {
                    setDataPointType(res.data)
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
        if (data.promotion_point_type_id) {
            console.log(data,"dataEdit")
            data.promotion_point_type_datebegin = data.promotion_point_type_datebegin != undefined ? Moment(data.promotion_point_type_datebegin).format("YYYYMMDD") : Moment(new Date).format("YYYYMMDD")
            data.promotion_point_type_dateend = data.promotion_point_type_dateend != undefined ? Moment(data.promotion_point_type_dateend).format("YYYYMMDD") : Moment(new Date).format("YYYYMMDD")
            axios.post(UrlApi() + 'update_promotion_point_data', data)
                .then(res => {
                    if (res.data) {
                        setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                        setAlertSuccess(true)
                        setOpenDialog(false)
                        getDataMaster()
                    }
                })

        } else {
            console.log(data, "dataAdd")
            data.master_company_id = companyId
            data.promotion_point_type_active = data.promotion_point_type_active != undefined ? data.promotion_point_type_active : true
            data.promotion_point_type_datebegin = data.promotion_point_type_datebegin != undefined ? Moment(data.promotion_point_type_datebegin).format("YYYYMMDD") : Moment(new Date).format("YYYYMMDD")
            data.promotion_point_type_dateend = data.promotion_point_type_dateend != undefined ? Moment(data.promotion_point_type_dateend).format("YYYYMMDD") : Moment(new Date).format("YYYYMMDD")
            axios.post(UrlApi() + 'add_promotion_point_data', data)
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
        { name: 'ชือ', type: "input_text", key: "promotion_point_type_name", validate: true },
        { name: 'จำนวนคะแนน', type: "input_num", key: "promotion_point_type_quantity", defaultvalue: 1, validate: true },
        { name: 'มูลค่า', type: "input_num", key: "promotion_point_type_rate", defaultvalue:1, validate: true },
        { name: 'ประเภทมูลค่า', type: "dropdown", key: "promotion_point_cal_type_id", value_key: "promotion_point_cal_type_name", option: dataPointType, validate: true },
        { name: 'วันที่เริ่มต้น', type: "select_date", key: "promotion_point_type_datebegin" },
        { name: 'วันที่สิ้นสุด', type: "select_date", key: "pr  omotion_point_type_dateend" },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "promotion_point_type_active"}
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                keys="promotion_point_type_id"
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
        { "header": "ชื่อ", "selector": "promotion_point_type_name" },
        { "header": "จำนวนคะแนน", "selector": "promotion_point_type_quantity" },
        { "header": "มูลค่า", "selector": "promotion_point_type_rate" },
        { "header": "ประเภทมูลค่า", "selector": "promotion_point_cal_type_name" },
        { "header": "วันที่เริ่มใช้", "selector": "promotion_point_type_datebegindate" },
        { "header": "วันที่สิ้นสุด", "selector": "promotion_point_type_dateenddate" },
        { "header": "สถานะการใช้งาน", "selector": "promotion_point_type_active_name" },
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

export default PointPromotion
