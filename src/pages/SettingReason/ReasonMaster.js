import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import InputText from "../../components/Input/InputText";
import DataTable from '../../components/Datatable/Datatables';
import BtnEdit from "../../components/Button/BtnEdit";
import {Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertWarning from "../../components/Alert/AlertWarning";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import BtnCancel from "../../components/Button/BtnCancel";
import Swithstatus from "../../components/SwitchStatus/Switchstatus"
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import Btnsubmit from "../../components/Button/BtnSubmit";
import InputSwitch from "../../components/Input/InputSwitch";

const ReasonReturnProduct = (props) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [dataEdit,setDataEdit]= useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [dataAdd, setDataAdd] = useState({ name: "", status: true })
    const [valueCheck, setValueCheck] = useState()
    const [columnsdata, setColumnsdata] = useState([])
    const [dataMaster,setDataMaster]=useState([])
    const [filterText, setFilterText] = useState("")
    const columns = [
        {
            selector: (row, idx) => idx +1,
            sortable: false,
            width: '70px'
        },
        {
            selector: (row, idx) => row.name,
        },
        {
           
            selector: row => <><Swithstatus value={row.status}/></>,
            sortable: true,
        },
        {
           
            selector: (row,idx) => <BtnEdit onClick={() => {onChaneEditData(row,idx) }} />,
            sortable: false,
        },
    ]

    useEffect(() => {
        if (props.columnsdata) {
            props.columnsdata.map((item, idx) => {
                columns.map((items, ids) => {
                    if (idx === ids)
                    items.name = item
                })
            })
            setColumnsdata(columns)
        }
    },[props])

    useEffect(() => {
        getDialogDataEdit()
    }, [valueCheck])

    useEffect(() => {
        setDataMaster(props.dataReason)
        getDataTable()
    }, [props.dataReason, columnsdata])

    const onChaneEditData = (row, idx) => {
        setDataAdd({})
        setDataEdit(row)
        setOpenDialog(true)
    }

    const onChangeNameReson = (e) => {
        if (dataEdit.name != undefined) {
            dataEdit[0]['name'] = e.target.value
        } else if (dataAdd.name != undefined){
            dataAdd.name = e.target.value
        }
    }

    const onChangeStatus = (e) => {
        if (dataEdit.status != undefined) {
            dataEdit.status = e
        } else if (dataAdd.status != undefined){
            dataAdd.status = e
        }
        setValueCheck(e)
    }

    const OnClickSunmitReason = () => {
        if (dataEdit.name &&  dataEdit.name.length < 1 ) {
            setAlertMessages("กรุณากรอกข้อมูลให้ครบถ้วน")
            setAlerttWarning(true)
        } else if (dataAdd.name && dataAdd.name.length < 1) {
            setAlertMessages("กรุณากรอกข้อมูลให้ครบถ้วน")
            setAlerttWarning(true)
        }else {
            if (dataEdit.name &&  dataEdit.name.length > 0) {
                props.onChangeDataEdit(dataEdit)
                setOpenDialog(false)
                setAlertMessages("แก้ไขข้อมูลสำเร็จ")
                setAlertSuccess(true)
            } else {
                props.onChangeDataAdd(dataAdd)
                setOpenDialog(false)
                setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                setAlertSuccess(true)
            }
        }
    }

    const onClickDialog = () => {
        setDataEdit([])
        setValueCheck()
        setOpenDialog(true)
    }

    const OnClickCancle = () => {
        setDataAdd({ name: "", status: true })
        setDataEdit([])
        setValueCheck()
        setOpenDialog(false)
    }

    const getDialogDataEdit = () => {
    return(
            <Dialog open={openDialog} maxWidth="1500px">
                <DialogTitle id="scroll-dialog-title">
                    {dataEdit.name ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
            </DialogTitle>
                <DialogContent dividers="paper" style={{ width: "500px" }}>
                    <div class="row">
                        <div class="col-4">
                            {props.colName.map((item, idx) => {
                                return (<p style={{ height:"50px" }}>{item} :</p>)
                            })}
                        </div>
                        <div class="col">
                            <InputText type="text" defaultValue={dataEdit.name ? dataEdit.name : ""} onChange={(e) => onChangeNameReson(e)} />
                            <InputSwitch style={{ marginTop: "8%" }} onChange={(e) => onChangeStatus(e)} statusCheck={dataEdit.status ? dataEdit.status : dataAdd.status} />
                        </div>
                    </div>
                    {getAlert()}
                </DialogContent>
                <DialogActions>
                    <Btnsubmit onClick={() => { OnClickSunmitReason() }} />
                    <BtnCancel onClick={() => { OnClickCancle() }} />
                </DialogActions>
            </Dialog>
         )
    }

    const getDataTable = () => {
        return (<div style={{ marginRight: "1%" }}>
            <DataTable
                columns={columnsdata}
                data={dataMaster}
                paginationPerPage="50"
                paginationRowsPerPageOptions={[50, 100, 150, 200,]}
                pagination
                striped/>
             </div>)
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
            <AlertWarning isOpen={alertWarning} openAlert={() => setAlerttWarning(false)} messages={alertMessages} /></>)
    }

    const columnExport = [
        { "header": "ลำดับ", "selector": "row_num" },
        { "header": "เหตุผลการยกเลิก", "selector": "name" },
        { "header": "สถานะการใช้งาน", "selector": "status_name" },
    ]

    const onChangeFilterTable = (e) => {
        setFilterText(e.target.value)
        if (e.target.value.length > 0) {
            let data = props.dataReason.filter((item, idx) =>
                JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1
            )
            setDataMaster(data)
        } else {
            setDataMaster(props.dataReason)
        }
    }

    return (<>
        <HeaderPage
            onChange={(e) => onChangeFilterTable(e)}
            value={filterText}
            onClick={() => { onClickDialog() }}
            data={dataMaster}
            columns={columnExport}
        />
        {getAlert()}
        {getDataTable()}
        {getDialogDataEdit()}
    </>)
}
export default memo(ReasonReturnProduct);