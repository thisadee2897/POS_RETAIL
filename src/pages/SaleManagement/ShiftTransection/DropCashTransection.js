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
import BtnCancel from "../../../components/Button/BtnCancel";
import Switchstatus from "../../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../../components/HeaderPage/HeaderPage";
import DialogMaster from "../../../components/DialogMaster/DialogMaster"
import Moment from 'moment';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const CollectShiftTransection = () => {

    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [employeeName, setEmployeeName] = useState(userData[0].firstname + ' ' + userData[0].lastname)
    const [branchId, setbranchId] = useState(BranchData[0].master_branch_id)
    const [alertMessages, setAlertMessages] = useState("")
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertWarning, setAlerttWarning] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [dataMaster, setDataMaster] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const [shiftCode, setShiftCode] = useState('')
    const [openDialogCheck, setOpenDialogCheck] = useState(false)
    const [dataDateCheck, setDataDateCheck] = useState([])
    const [cancleDoc, setCancleDoc] = useState()
    const [dataSaleamount, setDataSaleamount] = useState(0)
    const [dataShiftDetail, setDataShiftDetail] = useState([{ shift_transaction_dt_amount: "100" }, { shift_transaction_dt_amount: "1000" },
        { shift_transaction_dt_amount: "500" }    ])

    const dataApi = {
        "company_id": companyId,
        "branch_id": branchId
    }
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'วันที่เปิดเอกสาร',
            selector: row => row.openDate,
            sortable: true,
            width: '7vw'
        },
        {
            name: 'วันที่ปิดเอกสาร',
            selector: row => row.shift_transaction_close_savetime,
            sortable: true,
            width: '7vw'
        },
        {
            name: 'เวลาปิด',
            selector: row => row.closetime,
            sortable: true,
            width: '6vw'
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => row.shift_transaction_docuno,
            sortable: true,
            wrap: true
        },
        {
            name: 'เครื่อง',
            selector: row => row.master_pos_cashier_machine_name,
            sortable: true,
            wrap: true
        },
        {
            name: 'รอบการขาย',
            selector: row => row.master_shift_job_name,
            sortable: true,
        },
        {
            name: 'พนักงาน',
            selector: row => row.fullnameclose ? row.fullnameclose : '',
            sortable: true,
            wrap: true
        },
        {
            name: 'สถานะ',
            selector: row => row.shift_transaction_status_id == 1 ?
                <Switchstatus type="success" message="ปกติ" /> :
                row.shift_transaction_status_id == 3 ?
                    <Switchstatus type="cancle" message="ยกเลิก" /> :
                    <Switchstatus type="close" message="ปิด Shift" />,
            sortable: true,
        },
        {
            name: 'เปิด',
            selector: row => <BtnEdit onClick={() => onClickEdit(row)} />,
            sortable: false,
        },
    ]

    const columnDetailShift = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'จำนวนเงินเก็บระหว่างวัน',
            selector: row => row.shift_transaction_dt_amount,
            sortable: false,
        },
    ]

    useEffect(() => {
        setDataMaster([
            { shift_transaction_docuno: "TCS001", master_shift_job_name: "Test" },
            { shift_transaction_docuno: "TCS001", master_shift_job_name: "Test" }
        ])
        
        /*getDataMaster()
        getSaleAmount()*/
    }, [])

    const getDataMaster = () => {
        axios.post(UrlApi() + 'getshift_transaction_data', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let yOpent = parseInt(Moment(item.shift_transaction_open_savetime).format("YYYY")) + 543
                    item.openDate = Moment(item.shift_transaction_open_savetime).format("MM/DD/") + yOpent
                    let y = parseInt(Moment(item.shift_transaction_close_savetime).format("YYYY")) + 543
                    item.no = idx + 1
                    item.closetime = item.shift_transaction_close_savetime ? Moment(item.shift_transaction_open_savetime).format("hh:mm:ss") : ''
                    item.shift_transaction_close_savetime = item.shift_transaction_close_savetime ? Moment(item.shift_transaction_close_savetime).format("DD/MM/") + y : ''
                    item.shift_transaction_status_name = item.shift_transaction_status_id == 1 ? 'ปกติ' :
                        item.shift_transaction_status_id == 2 ? 'ปิด shift เรียบร้อย' : 'ยกเลิก'
                })
                setDataMaster(res.data)
            }
        })
    }

    const getSaleAmount = () => {
        dataApi.emp_id = parseInt(userData[0].emp_employeemasterid)
        axios.post(UrlApi() + 'get_salehd_cashamnt', dataApi)
            .then(res => {
                if (res.data) {
                    setDataSaleamount(res.data[0].salehd_cashamnt)
                }
            })
    }

    const onClickEdit = (row) => {
        if (row.shift_transaction_status_id == 1) {
            setDataAdd({})
            setDataEdit(row)
            setCancleDoc(false)
        } else {
            setCancleDoc("close")
        }
        setOpenDialog(true)

    }

    const onClickSave = (data) => {
        if (data.shift_transaction_id) {
            if (data.master_shift_job_last_day_active == true) {
                axios.post(UrlApi() + 'get_order_status', dataApi)
                    .then(res => {
                        if (res.data.length > 0) {
                            setAlerttWarning(true)
                            setAlertMessages("ไม่สามารถปิดเอกสารได้ กรุณาปิดออเดอร์ " + res.data[0]['dates'] + " ในระบบให้เรียบร้อย")
                        } else {
                            CloseShift(data)
                        }
                    })
            } else {
                CloseShift(data)
            }
        }
    }

    const CloseShift = (data) => {
        data.shift_transaction_status_id = 2
        data.shift_transaction_close_emp_id = parseInt(userData[0].emp_employeemasterid)
        data.shift_transaction_sale_cash_amount = dataSaleamount > 0 ? parseFloat(dataSaleamount) : 0
        data.shift_transaction_difference_amount = parseInt(data.shift_transaction_open_cash_amount - data.shift_transaction_close_cash_amount)
        axios.post(UrlApi() + 'close_shift_transaction', data).then((res) => {
            if (res.data) {
                setAlertSuccess(true);
                setAlertMessages("ปิดเอกสารสำเร็จ")
                setOpenDialog(false)
                getDataMaster()
            }
        })
    }



    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataMaster} />)
    }

    const getDetailShift = () => {
        return (<div>
            <DataTable columns={columnDetailShift} data={dataShiftDetail} />
        </div>)
    }

    const columnDialog = [
        {
            name: 'เลขที่เอกสาร', type: "text", defaultvalue: dataEdit.shift_transaction_docuno ? dataEdit.shift_transaction_docuno : shiftCode,
            key: "shift_transaction_docuno"
        },
        { name: 'พนักงาน', type: "text", defaultvalue: employeeName, key: "employee" },
        { name: 'วันที่ปิด', type: "text_date", key: "shift_transaction_close_savetimes" },
        { name: 'เวลาที่ปิด', type: "text_time", key: "closetime" },
        { name: 'จุดแคชเชียร์', type: "text", key: "master_pos_cashier_machine_name" },
        { name: 'รอบการขาย', type: "text", key: "master_shift_job_name" },
        { name: 'จำนวนเงินสำรองไว้ทอน', type: "text", key: "shift_transaction_open_cash_amount" },
        {
            name: 'จำนวนเงินสดในลิ้นชักทั้งหมด', type: "input_num", key: "shift_transaction_close_cash_amount",
            validate: true
        }
    ]

    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_shift_job_id"
                closeDoc
                cancleDoc={cancleDoc}
                openDialog={openDialog}
                onClose={(e) => setOpenDialog(e)}
                columnDialog={columnDialog}
                alertWarning={alertWarning}
                alertMessages={alertMessages}
                onCloseAlert={(e) => setAlerttWarning(e)}
                dataAdd={dataAdd}
                onChangeDialog={(data) => onClickSave(data)}
                dataEdit={dataEdit}
                customDialog={getDetailShift()}
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
        </>)
    }

    const getDialogCheck = () => {
        return (
            <Dialog open={openDialogCheck} maxWidth="1000px" >
                <DialogTitle >
                </DialogTitle>
                <DialogContent dividers='paper' style={{ width: "600px" }}>
                    <button type="button" className="cancel" onClick={() => setOpenDialogCheck(!openDialogCheck)}>x</button>
                    <div>
                        <p>กรุณาปิดเอกสาร Shift ให้เรียบร้อยก่อน</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <BtnCancel onClick={() => setOpenDialogCheck(!openDialogCheck)} message="ปิด" />
                </DialogActions>
            </Dialog>
        )
    }


    const columnExport = [
        { "header": "ลำดับ", "selector": "no" },
        { "header": "วันที่เปิดเอกสาร", "selector": "shift_transaction_open_savetime" },
        { "header": "วันที่ปิด", "selector": "shift_transaction_close_savetime" },
        { "header": "เวลาปิด", "selector": "closetime" },
        { "header": "เลขที่เอกสาร", "selector": "shift_transaction_docuno" },
        { "header": "คนเปิดเอกสาร", "selector": "fullname" },
        { "header": "เครื่อง", "selector": "master_pos_cashier_machine_name" },
        { "header": "รอบการขาย", "selector": "master_shift_job_name" },
        { "header": "คนปิดเอกสาร", "selector": "fullnameclose" },
        { "header": "สถานะ", "selector": "shift_transaction_status_name" },
    ]

    return (<>
        <HeaderPage
            flagMasterCreate={false}
            onChange={(e) => onChangeFilterTable(e)}
            value={valueFilter}
            data={dataMaster}
            columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialog()}
        {getDialogCheck()}

    </>)
}

export default CollectShiftTransection
