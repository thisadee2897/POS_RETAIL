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

const PointSetting = () => {
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
    const [memberData, setMemberData] = useState([])

    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
        },
        {
            name: 'ประเภทสมาชิก',
            selector: row => row.master_member_type_name,
            sortable: true,
        },
        {
            name: 'ชื่อ',
            selector: row => row.point_type_name,
            sortable: true,
        },
        {
            name: 'มูลค่า',
            selector: row => row.point_type_rate,
            sortable: true,
        },
        {
            name: 'สถานะการอัตราการสะสมคะแนน',
            selector: row => <>{row.statuspoint == 1 ? <Switchstatus type="success" message="เพิ่มเรียบร้อย" /> :
                <Switchstatus type="cancle" message="รอเพิ่มข้อมูล" />}
            </>,
            sortable: true,
        },

        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Switchstatus value={row.point_type_active} /></>,
            sortable: true,
        },
        {
            name: 'แก้ไข',
            cell: row => <BtnEdit onClick={() => onClickEdit(row)} />,
            sortable: false,

        },
    ]

    useEffect(() => {
        getMemberData()
        getDataMaster()
    }, [])

    useEffect(() => {
        getDataMemberTypeandPoint()
    }, [dataMaster, memberData])

    const getMemberData = () => {
        const dataAPI = {
            "company_id": companyId,
        }
        axios.post(UrlApi() + 'get_memberstype_data', dataAPI)
            .then(res => {
                if (res.data.length > 0) {
                    setMemberData(res.data)
                }
            })
    }

    const getDataMaster = () => {
        const dataApi = {
            "company_id": companyId,
        }
        axios.post(UrlApi() + 'get_point_type_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.master_member_type_id = item.arcustomer_member_type_id
                    item.statuspoint = 1
                })
                setDataMaster(res.data)
            }
        })
    }

    const getDataMemberTypeandPoint = () => {
        memberData.map((item, idx) => {
            let findData = _.findIndex(dataMaster, { master_member_type_id: item.master_member_type_id })
            if (findData < 0) {
                item.statuspoint = 0
                dataMaster.push(item)
            }
        })
        setDataMaster(dataMaster)
        getDataTable()
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
        { name: 'ประเภทสมาชิก', type: "text", key: "master_member_type_name", validate: true },
        { name: 'ชื่อ', type: "input_text", key: "point_type_name", validate: true },
        { name: 'มูลค่า', type: "input_num", key: "point_type_rate", validate: true },
        { name: 'สถานะการใช้งาน', type: "switch_status", key: "point_type_active" }
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                keys="arcustomer_member_type_id"
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
        { "header": "ลำดับ", "selector": "no" },
        { "header": "ประเภทสมาชิก", "selector": "master_member_type_name" },
        { "header": "ชื่อ", "selector": "point_type_name" },
        { "header": "มูลค่า", "selector": "point_type_rate" },
        { "header": "สถานะการอัตราการสะสมคะแนน", "selector": "statuspoint_name" },
        { "header": "สถานะการใช้งาน", "selector": "point_type_active_name" },
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

export default PointSetting
