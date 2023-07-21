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
import InputText from "../../../components/Input/InputText";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import BtnAdd from "../../../components/Button/BtnAdd";
import BtnCloseDialog from "../../../components/Button/BtnCloseDialog";
import BtnCancel from "../../../components/Button/BtnCancel";
import Switchstatus from "../../../components/SwitchStatus/Switchstatus";
import HeaderPage from "../../../components/HeaderPage/HeaderPage";
import DialogMaster from "../../../components/DialogMaster/DialogMaster";
import FilterDataTable from "../../../components/SearchDataTable/FilterDataTable";
import Moment from 'moment';
import Icon from '@mdi/react';
import {
    mdiAccountMultiplePlusOutline, mdiAccountOutline, mdiLockOutline,
    mdiEyeOffOutline, mdiEyeOutline, mdiAlphaCCircleOutline
} from '@mdi/js';
import Card from 'react-bootstrap/Card';
import {  Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';
import Grid from '@mui/material/Grid';

const OpenShiftTransection = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [employeeName, setEmployeeName] = useState(userData[0].firstname +' '+ userData[0].lastname )
    const [branchId, setbranchId] = useState(parseInt(BranchData[0].master_branch_id))
    const [alertMessages, setAlertMessages] = useState("")
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertWarning, setAlerttWarning] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogEmployee, setOpenDialogEmployee] = useState(false)
    const [openDialogConfirm,setOpenDialogConfirm]=useState(false)
    const [dataMaster, setDataMaster] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [dataAdd, setDataAdd] = useState({})
    const [dataEdit, setDataEdit] = useState({})
    const [shiftCode, setShiftCode] = useState('')
    const [dataShift, setDataShit] = useState([])
    const [dataCashier, setDataCashier] = useState([])
    const [dataCurrency, setDataCurrency] = useState([])
    const [dataCheck, setDataCheck] = useState([])
    const [dataCurrencyDefaul, setDataCurrencyDefaul] = useState([])
    const [openDialogCheck, setOpenDialogCheck] = useState(false)
    const [dataDateCheck, setDataDateCheck] = useState([])
    const [cancleDoc, setCancleDoc] = useState(true);
    const [dataEmployee, setDataEmployee] = useState([])
    const [dataEmployeeSelect, setDataEmployeeSelect] = useState([])
    const [shiftTransactionData, setShiftTransactionData] = useState([]);
    const [textFilterEmp, setTextFilterEmp] = useState("")
    const [validateText, setValidateText] = useState("")
    const [validateTextUser, setValidateTextUser] = useState("")
    const [validateTextPass, setValidateTextPass] = useState("")
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cashierName, setCashierName] = useState("");
    const [eyeStatus, setEyeStatus] = useState(false);
    
    const dataAPI = {
        "company_id": companyId,
        "branch_id": branchId,
        "username": username,
        "password": password,
    }
    
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row,idx) =>idx +1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'วันที่',
            selector: row => row.document_date,
            sortable: true,
        },
        {
            name: 'เวลา',
            selector: row => row.document_time,
            sortable: true,
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => row.shift_transaction_hd_docuno,
            sortable: true,
        },
        {
            name: 'พนักงาน',
            selector: row => row.emp_name,
            sortable: true,
        },
        {
            name: 'เครื่อง',
            selector: row => row.master_pos_cashier_machine_name,
            sortable: true,
        },
        {
            name: 'รอบการขาย',
            selector: row => row.master_shift_job_name,
            sortable: true,
        },
        {
            name: 'สถานะ',
            selector: row => row.shift_transaction_hd_status_id === 1 || row.shift_transaction_hd_status_id === 4 ?
                <Switchstatus type="success" message={row.shift_transaction_hd_status_name} /> :
                row.shift_transaction_hd_status_id == 3 ?
                    <Switchstatus type="cancle" message={row.shift_transaction_hd_status_name} /> :
                    <Switchstatus type="close" message={row.shift_transaction_hd_status_name} />,
            sortable: true,
        },
        {
            name: 'เปิด',
            selector: row => <BtnEdit onClick={() =>{
                onClickEdit(row)
                setCashierName(row.emp_name)
            }}/>,
            sortable: false,
        },
    ]


    const columnsEmployee = [
        {
            name: 'เลือก',
            selector: (row, idx) => <div style={{ marginLeft: "20%" }}>
                <FormControlLabel style={{ color: "black" }} 
                control={
                    <Radio style={{ color: "#6598F6" }} 
                        defaultValue={row.defalutsale_active} 
                        checked={row.defalutsale_active}
                        value={row.emp_employeemasterid}
                        onClick={(e) => {
                            setCashierName(row.fullname);
                            OnchangeCheckEmployee(e, row, idx)}
                        }
                    />} /> 
                </div>,
            sortable: true,
            width: '100px'
        },
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'รหัสพนักงาน',
            selector: row => row.employeecode,
            sortable: true,
        },
        {
            name: 'คำนำหน้า',
            selector: row => row.emp_title_name,
            sortable: true,
        },
        {
            name: 'ชื่อ',
            selector: row =>row.firstname,
            sortable: true,
        },
        {
            name: 'นามสกุล',
            selector: row => row.lastname,
            sortable: true,
        },

    ]

    useEffect(() => {
        setValidateTextUser("")
        setValidateTextPass("")
        getShiftCode()
        getDataEmployeeMaster()
        getDataMaster()
        getDataShift()
        getDataCashier()
        getCurrancyDatas()
        //getDataShipthtransectionDateCheck()
    }, [])

    const getDataMaster = () => {
        let dataActive = []
        axios.post(UrlApi() + 'getshift_transaction_data', dataAPI).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    if (parseInt(item.shift_transaction_hd_status_id) === 1) {
                        dataActive.push(item)
                    }
                })
                setDataMaster(res.data)
                setDataCheck(dataActive)
            }
        })
    }

    const getDataEmployeeMaster = () => {
        dataAPI.textfilter = textFilterEmp
        axios.post(UrlApi() + 'get_employee_filter_data', dataAPI).then((res) => {
            if (res.data) {
                setDataEmployee(res.data)
            }
        })
    
    }

    const getDataShipthtransectionDateCheck = () => {
        var date = new Date()
        var days = (date.getDate() - 1)
        if (days < 10) {
            days = '0' + days
        }
        var dateCheck = Moment(new Date()).format("YYYYMM") + days
        dataAPI.dates = dateCheck
        axios.post(UrlApi() + 'getshift_transaction_date', dataAPI)
            .then(res => {
                if (res.data) {
                    setDataDateCheck(res.data)
                }
            })
    }

    const getShiftCode = () => {
        axios.post(UrlApi() + 'get_shift_code', dataAPI)
            .then(res => {
                if (res.data) {
                    setShiftCode(res.data[0]['fn_generate_shift_transaction_hd_docuno'])
                }
            })
    }

    const getDataShift= () => {
        axios.post(UrlApi() + 'get_shift_data', dataAPI).then((res) => {
            if (res.data) {
                setDataShit(res.data)
            }
        })
    }

    const getDataCashier = () => {
        axios.post(UrlApi() + 'get_cashier_machine_data', dataAPI).then((res) => {
            if (res.data) {
                setDataCashier(res.data)
            }
        })
    }

    const getCurrancyDatas = () => {
        axios.post(UrlApi() + 'getdata_currency', dataAPI)
            .then(res => {
                if (res.data.length > 0) {
                    res.data.forEach((item, idx) => {
                        if (item.master_currency_main == true) {
                            setDataCurrencyDefaul([item])
                        } else {
                            setDataCurrency(res.data)
                        }
                    })
                }
            })
    }

    const OnchangeCheckEmployee = (e, row, idx) => {
        dataEmployee.map((item, idx) => {
            if (item.emp_employeemasterid == row.emp_employeemasterid) {
                item.defalutsale_active = true
            } else {
                item.defalutsale_active = false
            }
        })
        setDataEmployee(dataEmployee)
        if (e.target.value) {
            setValidateText("")
            setDataEmployeeSelect([row])
        }
        setOpenDialogEmployee(false)
    }


    const onClickAddData = () => {
        setDataEdit({})
        setDataAdd({})
        //getDataShipthtransectionDateCheck()
        if (dataDateCheck.length > 0) {
            setOpenDialogCheck(true)
        } else {
            setOpenDialog(true)
        }
    }

    const onClickEdit = (row) => {
        if (row.shift_transaction_hd_status_id == 2) {
            setCancleDoc("close");
        } else if (row.shift_transaction_hd_status_id == 1){
            setCancleDoc(true);
        }else{
            setCancleDoc("close");
        }
        setDataAdd({})
        setOpenDialog(true)
        setDataEdit(row)
    }

    const onClickSave = (data) => {
        if (data.shift_transaction_hd_id) {
            data.shift_transaction_status_id = 3;
            axios.post(UrlApi() + 'update_shift_transaction', data).then((res) => {
                if (res.data) {
                    setCancleDoc(true);
                    setAlertSuccess(true);
                    setAlertMessages("ยกเลิกเอกสารสำเร็จ")
                    setOpenDialog(false)
                    getDataMaster()
                }
            })
        } else {
            onClickSaveData(data)
        }
    }

    const onClickSaveData = (data) => {
        let findIndex = _.findIndex(dataCheck, { master_pos_cashier_machine_id : data.master_pos_cashier_machine_id})
        if (findIndex >= 0) {
            setAlertMessages("จุดแคชเชียร์ซ้ำกับเอกสาร " + dataCheck[findIndex].shift_transaction_docuno)
            setAlerttWarning(true)
        } else if (dataEmployeeSelect.length == 0) {
            setValidateText("กรุณาเลือกพนักงานประจำจุดแคชเชียร์")
        } else {
            setOpenDialogConfirm(true)
            let dataHD = {
              
            }
            data.pos_cashier_machine_emp_id = dataEmployeeSelect[0].emp_employeemasterid
            data.branch_id = parseInt(branchId)
            data.company_id = parseInt(companyId)
            data.shift_transaction_open_emp_id = parseInt(userData[0].emp_employeemasterid)
            data.shift_transaction_status_id = 1
            data.master_currency_id = parseInt(dataCurrencyDefaul[0].master_currency_id)
            data.master_currency_rate = dataCurrencyDefaul.length > 0 ? parseInt(dataCurrencyDefaul[0]['master_currency_rate']) :
                dataCurrency.length > 0 ? parseInt(dataCurrency[0]['master_currency_rate']) : 0
            data.shift_transaction_docudate = Moment(new Date()).format("YYYYMMDD")
            axios.post(UrlApi() + 'add_shift_transaction', data).then((res) => {
                if (res.data) {
                    setAlertSuccess(true);
                    setCancleDoc(true);
                    setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                    setOpenDialog(false)
                    getDataMaster()
                }
            })
        }
    }


    const onchangeInput = (e, type) => {
        setValidateTextUser("")
        setValidateTextPass("")
        dataAPI[type] = e.target.value;
    }

    const onClickLogin = () => {
        if (dataAPI.username.length < 1) {
            setValidateTextUser("***กรุณากรอกชื่อผู้ใช้งาน")
            return false;
        }
        if (dataAPI.password.length < 1) {
            setValidateTextPass("***กรุณากรอกรหัสผ่าน")
            return false;
        }
        axios.post(UrlApi() + 'login', dataAPI).then((res) => {
            if (res.data.status === 200) {
                setValidateTextUser("")
                setValidateTextPass("")
                shiftTransactionData.user_data = res.data.userinfo[0];
                onClickSave(shiftTransactionData);
                setOpenDialogConfirm(false);
            } else {
                setValidateTextUser("")
                setValidateTextPass("")
                setAlerttWarning(true)
                setAlertMessages("Username/Password ไม่ถูกต้อง")
            }
        })
    }

    const onClickOpenDiaogEmployee = () => {
        setOpenDialogEmployee(true)
    }

    const onChangeFilterEmployee = (e) => {
        if (e.target.value) {
            setTextFilterEmp(e.target.value)
            getDataEmployeeMaster()
        } else {
            setTextFilterEmp("")
           getDataEmployeeMaster()
        }
    }

    const getBtnEmployee = () => {
        return (<>
            <div class="row" style={{ marginTop: "15px" }}>
                <div class="col-9">
                    <InputText type="text" style={{ height: "40px", width: "120%" }}
                        value={cashierName}
                        disabled />
                </div>
                <div class="col-1">
                    <BtnAdd style={{ width: "9%", height: "40px", position: "absolute", background: "#74E0C0" }}
                        icons={<Icon path={mdiAccountMultiplePlusOutline} size={1} />} 
                        onClick={() => onClickOpenDiaogEmployee()} 
                    />
                </div>
                {validateText.length > 1 ? <p style={{color:"red"}}> { validateText }</p> :<></>}
            </div>
            </>)
    }

    const getDataTable = () => {
        return (<DataTable columns={columnData} data={dataMaster} />)
    }

    const columnDialog = [
        {
            name: 'เลขที่เอกสาร', type: "text", defaultvalue: dataEdit.shift_transaction_hd_docuno ? dataEdit.shift_transaction_hd_docuno : shiftCode,
            key: "shift_transaction_docuno"
        },
        {
            name: 'พนักงาน', type: "text", defaultvalue: dataEdit.fullname ? dataEdit.fullname : employeeName, key: "employee"
        },
        {
            name: 'วันที่เปิด', type: dataEdit.document_date ? "text" : "text_date",
            key: "shift_transaction_docudates", defaultvalue: dataEdit.document_date
        },
        {
            name: 'เวลาที่เปิด',  type: dataEdit.document_time ? "text" :  "text_time",
            key: "document_time", 
        },
        {
            name: 'จุดแคชเชียร์', type: "dropdown", key: "master_pos_cashier_machine_id", disabled: dataEdit.master_pos_cashier_machine_name ? true : false,
            value_key: "master_pos_cashier_machine_name", option: dataCashier, validate: true
        },
        {
            name: 'พนักงานประจำจุดแคชเชียร์',  custom:getBtnEmployee()
        },
        {
            name: 'รอบการขาย', type: "dropdown", key: "master_shift_job_id", disabled: dataEdit.master_shift_job_name ? true : false,
            value_key: "master_shift_job_name", option: dataShift, validate: true,
        },
        {
            name: 'จำนวนเงินสำรองไว้ทอน', type: "input_num", disabled: dataEdit.master_shift_job_name ? true : false,
            key: "shift_transaction_hd_open_cash_amount", validate: true,
        }
    ]

    const clearData = (e) =>{
        setDataEmployeeSelect([]);
        setValidateText("");
        setCancleDoc(true);
        setCashierName("");
        setOpenDialog(e);
    }

    const getDialog = () => {
        return (
            <DialogMaster
                keys="master_shift_job_id"
                cancleDoc={cancleDoc}
                openDialog={openDialog}
                onClose={(e) => {
                    clearData(e);
                }}
                columnDialog={columnDialog}
                alertWarning={alertWarning}
                alertMessages={alertMessages}
                onCloseAlert={(e) => setAlerttWarning(e)}
                dataAdd={dataAdd}
                onChangeDialog={(data) => {
                    if (dataEmployeeSelect.length == 0) {
                        setValidateText("กรุณาเลือกพนักงานประจำจุดแคชเชียร์")
                        return false;
                    }
                    setOpenDialogConfirm(true);
                    setShiftTransactionData(data);
                    // onClickSave(data)
                }}
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
         </>)
    }

    const getDialogCheck = () => {
        return (
            <Dialog open={openDialogCheck} maxWidth="1000px" >
                <DialogTitle >
                </DialogTitle>
                <DialogContent dividers='paper' style={{ width: "600px" }}>
                    <BtnCloseDialog  onClick={() => setOpenDialogCheck(!openDialogCheck)} />
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

    const getDialogEmployee = () => {
        return (<Dialog open={openDialogEmployee} maxWidth="1000px" >
            <DialogTitle >
                <p className="text_card_dialog" style={{ color: "#2F3A9E", fontSize: "20px" }}>ข้อมูลพนักงาน</p>
                
            </DialogTitle>
            <DialogContent dividers='paper' style={{ width: "800px" }}>
                <Card.Body className="card_body_doc" style={{ marginTop: "0px" }}>
                <FilterDataTable value={textFilterEmp} onChange={(e) => onChangeFilterEmployee(e)} onKeyPress={(e) => onChangeFilterEmployee(e)} />
                <div style={{ marginTop: "1%" }}>
                  <DataTable
                        columns={columnsEmployee}
                        data={dataEmployee}
                    />
                    </div>
                </Card.Body>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => setOpenDialogEmployee(!openDialogEmployee)} message="ปิด" />
            </DialogActions>
        </Dialog>)
    }

    const getFormLogin = () => {
        return (
            <Card className="card_body_doc" >
                <div class="row" style={{ marginTop: "10%"}}>
                    <div class="col-1">
                        <Icon style={{ color: "#A3C5FA", position: "absolute", marginLeft: "3.5rem", marginTop: "8px" }}
                            path={mdiAccountOutline} size={1} />
                    </div>
                    <div class="col-11">
                        <InputText type="text" style={{
                            borderColor: validateTextUser.length > 1 ? "#FF002D" : "#E3E9F3",
                            backgroundColor: "#E3E9F3", height: "40px", width: "90%", paddingLeft: "60px", fontSize: "16px"
                        }}
                            onChange={(e) => {
                                setValidateTextUser("");
                                setUsername(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onClickLogin()
                                }
                            }} />
                            {validateTextUser.length > 1 ? <p style={{ color: "#FF002D" }}>{validateTextUser}</p> : null}
                    </div>
                </div>
                <div class="row" style={{ marginTop: "5%", marginBottom: '10%'}}>
                    <div class="col-1">
                        <Icon style={{ color: "#A3C5FA", position: "absolute", marginLeft: "3.5rem", marginTop: "8px"}}
                            path={mdiLockOutline} size={1} />
                    </div>
                    <div class="col-10">
                        <InputText style={{
                            borderColor: validateTextPass.length > 1 ? "#FF002D" : "#E3E9F3",
                            backgroundColor: "#E3E9F3", height: "40px", width: "100%", paddingLeft: "60px", fontSize: "16px"
                        }}
                            type={eyeStatus == false ? "password" : "text"} 
                            onChange={(e) => {
                                setValidateTextPass("");
                                setPassword(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onClickLogin()
                                }
                            }}
                        />
                        {validateTextPass.length > 1 ? <p style={{ color: "#FF002D" }}>{validateTextPass}</p> : null}
                    </div>

                    <div class="col-1">
                        <i onClick={() => setEyeStatus(!eyeStatus)}>
                            <Icon style={{ color: "#A3C5FA", position: "absolute", right: "10%", marginTop: "8px" }}
                                path={eyeStatus == true ? mdiEyeOutline : mdiEyeOffOutline} size={1} /></i>
                    </div>
                </div>
        </Card >)
    }


    const getDialogConfirm = () => {
        return (<>
            <Dialog open={openDialogConfirm} maxWidth="1000px" >
                <DialogTitle >
                    <p className="text_card_dialog" style={{ color: "#2F3A9E", fontSize: "20px"}}>ยืนยันตัวตน</p>                 
                </DialogTitle>
                <DialogContent dividers='paper' style={{ width: "600px" }}> 
                    {getFormLogin()}
                </DialogContent>
                <DialogActions>
                    <BtnAdd style={{ width: "5rem", height: "40px", marginRight: '10px'}} message="ยืนยัน" onClick={() => onClickLogin()} />
                    <BtnCancel onClick={() => setOpenDialogConfirm(!openDialogConfirm)} message="ปิด" />
                </DialogActions>
            </Dialog>
           </> )

    }

    const columnExport = [
        { "header": "ลำดับ", "selector": "no" },
        { "header": "วันที่เปิดเอกสาร", "selector": "document_date" },
        { "header": "เวลาเปิด", "selector": "document_time" },
        { "header": "เลขที่เอกสาร", "selector": "shift_transaction_hd_docuno" },
        { "header": "ผู้เปิดเอกสาร", "selector": "emp_open_name" },
        { "header": "เครื่อง", "selector": "master_pos_cashier_machine_name" },
        { "header": "รอบการขาย", "selector": "master_shift_job_name" },
        { "header": "สถานะ", "selector": "shift_transaction_hd_status_name" },
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
        {getDialogCheck()}
        {getDialogEmployee()}
        {getDialogConfirm()}

    </>)
}

export default OpenShiftTransection
