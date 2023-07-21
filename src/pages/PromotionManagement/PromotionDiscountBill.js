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
import PromotionMaster from "./PromotionMaster";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import DialogMaster from "../../components/DialogMaster/DialogMaster"
import Switchstatus from "../../components/SwitchStatus/Switchstatus";


const PromotionDiscountBill = () => {
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [branchId, setbranchId] = useState(BranchData[0].master_branch_id)
    const [dataMaster, setDataMaster] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [openDialogPromotion, setOpenDialogPromotion] = useState(false)
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [addValue, setAddValue] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [dataEdit, setDataEdit] = useState({})
    const [dataBranch, setDataBranch] = useState([])
    const [dataMemberType, setDataMemberType] = useState([])
    const [dataDiscountType, setDataDiscountType] = useState([])
    const [dataAdd, setDataAdd] = useState({})
    const dataApi = {
        "company_id": companyId,
        "branch_id": parseInt(branchId),
        "text_filter": ""
    }

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
        },
        {
            name: 'ชื่อโปรโมชั่น',
            selector: row => row.promotion_discount_name,
            sortable: true,
        },
        {
            name: 'สถานะ',
            selector: row => row.promotion_discount_status_id  == 1 ?
                <Switchstatus type="success" message="ปกติ" /> :
                <Switchstatus type="close" message= "ยกเลิก" />,
            sortable: true,
        },
        {
            name: 'เปิด',
            selector: row => <BtnEdit onClick={() => onClickEdit(row)} />,
            sortable: false,
        },
    ]

    useEffect(() => {
        getDataMaster()
        getDataBranch()
        getDataDiscountType()
        getMemberType()
    }, [])

    const getDataMaster = () => {
        axios.post(UrlApi() + 'get_promotion_discount', dataApi).then((res) => {
            if (res.data) {
                setDataMaster(res.data)
            }
        })
    }

    const getDataBranch = () => {
        let newData = []
        dataApi.user_id = parseInt(userData[0].user_login_id)
        axios.post(UrlApi() + 'get_branch_data', dataApi)
            .then(res => {
                if (res.data) {
                    let dataAll = {
                        "master_branch_name": "ทั้งหมด",
                        "master_branch_id": 0
                    }
                    res.data.forEach((item, idx) => { newData.push(item) })
                    newData.push(dataAll)
                    setDataBranch(newData)
                }
            })
    }

    const getDataDiscountType = () => {
        axios.get(UrlApi() + 'get_discount_type_data', dataApi).then((res) => {
            if (res.data) {
                setDataDiscountType(res.data)
            }
        })
    }

    const getMemberType = () => {
        let dataActive = []
        axios.post(UrlApi() + 'get_membertype_data', dataApi).then((res) => {
            if (res.data) {
                let dataAll = {
                    "master_member_type_name": "ทั้งหมด",
                    "master_member_type_id": 0
                }
                res.data.forEach((item, idx) => { if (item.member_type_active == true) { dataActive.push(item) } })
                dataActive.push(dataAll)
                setDataMemberType(dataActive)
            }
        })
    }

    const onChangeFilterTable = (e) => {
        axios.post(UrlApi() + 'get_branch_data', dataApi)
            .then(res => {
                if (res.data) {

                }
        })
    }

    const onClickSave = (data) => {
        data.master_company_id = companyId
        data.promotion_discount_status_id = 1
        data.promotion_discount_starttime = data.promotion_discount_starttime ? data.promotion_discount_starttime : "00:01"
        data.promotion_discount_endtime = data.promotion_discount_endtime ? data.promotion_discount_endtime : "23:59"
        data.promotion_discount_remark = data.promotion_discount_remark ? data.promotion_discount_remark : ""
        axios.post(UrlApi() + 'add_promotion_discount', data)
            .then(res => {
                if (res.data) {
                    console.log(res.data)
                }
            })
    }

    const onClose = () => { }

    const onClickAddData = () => {
        setOpenDialog(true)
    }

    const onClickEdit = (row) => {

    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
          </>)
    }

    const disableValue = false 

    const columnDialog = [
        {
            name: 'สาขา', type: "check_box", key: "master_branch_id", value_key: "master_branch_name",
            data: dataBranch,
            validate: disableValue, disabled: dataEdit.promotion_hd_id ? true : false,
            groups: 1
        },
        {
            name: 'ประเภทสมาชิก', type: "check_box", key: "master_member_type_id", value_key: "master_member_type_name",
            data: dataMemberType,
            validate: disableValue, disabled: dataEdit.promotion_hd_id ? true : false,
            groups: 2
        },

        { name: 'ชื่อโปรโมชัน', type: "input_text", key: "promotion_discount_name", disabled: disableValue, validate: true, groups: 4 },
        { name: 'หมายเหตุ', type: "input_text", key: "promotion_discount_remark", disabled: disableValue, groups: 4 },
        { name: 'อัตราส่วน', type: "input_num", key: "promotion_discount_rate", disabled: disableValue, validate: true, groups: 4 },

        {
            name: 'ประเภทส่วนลด', type: "dropdown", option: dataDiscountType, key: "promotion_discount_type_id", value_key: "promotion_discount_type_name",
            defaultvalue:0, groups: 4
        },
        { name: 'วันที่เริ่มต้น', type: "select_date", key: "promotion_discount_datebegin", defaultvalue: null, validate: true, disabled: disableValue, groups: 4 },
        { name: 'วันที่สิ้นสุด', type: "select_date", key: "promotion_discount_dateend", defaultvalue: null, validate: true, disabled: disableValue, groups: 4 },
        { name: 'เวลาเริ่มต้น', type: "select_time", key: "promotion_discount_starttime", defaultvalue: "00:01:00", groups: 4 },
        { name: 'เวลาสิ้นสุด', type: "select_time", key: "promotion_discount_endtime", defaultvalue: "23:59:00", groups: 4 },
       
        /*{ name: 'เปิดใช้ส่วนลดอัตโนมัติ', type: "switch_status", key: "promotion_hd_active", groups: 3 },*/
    ]


    const colCard = [
        { name: "สาขา", group: 1, colsgroup: "col-4", cols: 6, },
        { name: "กลุ่ประเภทสมาชิก", group: 2, colsgroup: "col-4", cols: 12 },
        { name: "รายละเอียด", group: 4, colsgroup: "col-12", cols: 2 },]

    const getDialogMaster = () => {
        return (
            <DialogMaster
            promoTionMaster
            cancleDoc
            width="1600px"
            groupCard
            colcards={colCard}
            columnDialog={columnDialog}
            keys="promotion_discount_id"
            openDialog={openDialog}
            onClose={(e) => setOpenDialog(e)}
            onChangeDialog={(data) => onClickSave(data)}
            dataAdd={dataAdd}
            dataEdit={dataEdit}
          />
           )
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataMaster} />)
    }

    const columnExport =[]

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
        {getDialogMaster()}

    </>)
}

export default PromotionDiscountBill
