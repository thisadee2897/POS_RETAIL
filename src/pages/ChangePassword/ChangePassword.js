import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import InputText from "../../components/Input/InputText";
import InputSwitch from "../../components/Input/InputSwitch";
import DataTable from 'react-data-table-component';
import BtnAdd from "../../components/Button/BtnAdd";
import BtnEdit from "../../components/Button/BtnEdit";
import BtnCancel from "../../components/Button/BtnCancel";
import Btnsubmit from "../../components/Button/BtnSubmit";
import Moment from 'moment';
import Card from 'react-bootstrap/Card';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AlertError from "../../components/Alert/AlertError";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertWarning from "../../components/Alert/AlertWarning";
import Loading from "../../components/Loading/Loading";
import * as AiIcons from 'react-icons/ai';
import InputSelect from "../../components/Input/InputSelect";
import Search from '@mui/icons-material/Search';
import UrlApi from "../../url_api/UrlApi";
import * as SiIcons from 'react-icons/si';
import _ from "lodash";
import '../../components/CSS/report.css';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import FilterDataTable from "../../components/SearchDataTable/FilterDataTable";


const ChangePassword = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const userIds = queryParams.get('u_id');
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const [userCompanyID, setUserCompanyID] = useState()
    const [empId, setEmpId] = useState()
    const [userId, setUserId] = useState(userIds)
    const [userName, setUserName] = useState()
    const [userFullName, setUserFulltName] = useState()
    const [userFirstName, setUserFirstName] = useState()
    const [userLastName, setUserLastName] = useState()
    const [userCompany, setUserCompany] = useState()
    const [userBranch, setUserBranch] = useState()
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [alertError, setAlertError] = useState(false);
    const [alertMessages, setAlertMessages] = useState("");
    const [loading, setLoading] = useState(false)
    const [OpenDialog, setOpenDialog] = useState(false)
    const [textValidate, setTextValidate] = useState("")
    const [textValidateNew, setTextValidateNew] = useState("")
    const [textValidateCon, setTextValidateCon] = useState("")
    const [eyeStatus, setEyeStatus] = useState(false)
    const [userLoginbyEmp, setUserLoginbyEmp] = useState([])
    const [oldPass, setOldPass] = useState()
    const [newPass, setnewPass] = useState()
    const [confirmPass, setConfirmPass] = useState()

    useEffect(() => {
        getDataUserLogin()
    }, [])

    useEffect(() => {
        getCardData()
    }, [userLoginbyEmp])

    useEffect(() => {
        if (alertSuccess == true) {
            setTimeout(() => {
                setAlertSuccess(false)
            }, 2000);
        }
    }, [alertSuccess])


    const getDataUserLogin = () => {
        const datas = {
            "user_id": parseInt(empId)
        }
        axios.post(UrlApi() + 'get_user_login', datas)
            .then(res => {
                if (res.data) {
                    console.log(res.data[0]['fullname'])
                    setUserFirstName(res.data[0]['firstname'])
                    setUserFulltName(res.data[0]['fullname'])
                    setUserLastName(res.data[0]['lastname'])
                    setUserName(res.data[0]['user_name'])
                    setUserCompany(res.data[0]['master_company_id'])
                    setUserBranch(res.data[0]['master_branch_id'])
                    setUserLoginbyEmp(res.data)
                 
                }
            })
    }

    const OnchangeInput = (e) => {
        if (e.target.value) {
            if (e.target.name == "oldpass") {
                let datas = { "pass": e.target.value }
                axios.post(UrlApi() + 'encode_user_login', datas)
                    .then(res => {
                        if (res.data) {
                            let OldEncode = res.data[0]['pass_word']
                            if (OldEncode != userLoginbyEmp[0]['pass_word']) {
                                setTextValidate("รหัสผ่านไม่ถูกต้อง")
                            } else {
                                setOldPass(OldEncode)
                                setTextValidate("")
                            }
                        }
                    })
            } else if (e.target.name == "newpass") {
                if (!oldPass) {
                    setTextValidateNew("กรุณากรอกรหัสผ่านเดิม")
                } else {
                    setTextValidateNew("")
                    if (e.target.value.search(/[ก-๏\s]+$/g) >= 0) {
                        setTextValidateNew("***ไม่สามารถใช้ภาษาไทยได้")
                    } else if (e.target.value.search(/[๑-๙]+$/g) >= 0) {
                        setTextValidateNew("***ไม่สามารถใช้ภาษาไทยได้")
                    } else if (e.target.value.search(/["" '' ,]/g) >= 0) {
                        setTextValidateNew("***ไม่สามารถใช้ ,  " + "''" + '"' + "ได้")
                    } else if (e.target.value.search(/[0-9]/g) < 0) {
                        setTextValidateNew("***กรุณากรอกตัวเลข")
                    } else if (e.target.value.search(/[A-Z]/g) < 0) {
                        setTextValidateNew("***กรุณากรอกตัวอักษรพิมพ์ใหญ่")
                    } else if (e.target.value.search(/[a-z]/g) < 0) {
                        setTextValidateNew("***กรุณากรอกตัวอักษรพิมพ์เล็ก")
                    }  else if (e.target.value.search(/[!/@#$%^&*()_+-.]/g) < 0) {
                        setTextValidateNew("***กรุณากรอกอักขระพิเศษ")
                    } else if (e.target.value.length < 8) {
                        setTextValidateNew("***กรุณากรอกให้ครบ 8 หลัก")
                    } else if (e.target.name == "newpass") {
                        setTextValidate("")
                        let datas = { "pass": e.target.value }
                        axios.post(UrlApi() + 'encode_user_login', datas)
                            .then(res => {
                                if (res.data) {
                                    let newEncode = res.data[0]['pass_word']
                                    if (newEncode == oldPass) {
                                        setTextValidateNew("กรุณาตั้งรหัสผ่านใหม่")
                                    } else {
                                        setnewPass(newEncode)
                                        setTextValidateNew("")
                                    }
                                }
                            })

                    }
                }

            } else if (e.target.name == "confirmpass") {
                if (!newPass) {
                    setTextValidateCon("กรุณากรอกรหัสผ่านใหม่")
                } else {
                    setTextValidateNew("")
                    if (e.target.value.search(/[ก-๏\s]+$/g) >= 0) {
                        setTextValidateCon("***ไม่สามารถใช้ภาษาไทยได้")
                    } else if (e.target.value.search(/[๑-๙]+$/g) >= 0) {
                        setTextValidateCon("***ไม่สามารถใช้ภาษาไทยได้")
                    } else if (e.target.value.search(/["" '' ,]/g) >= 0) {
                        setTextValidateCon("***ไม่สามารถใช้ ,  " + "''" + '"' + "ได้")
                    } else if (e.target.value.search(/[0-9]/g) < 0) {
                        setTextValidateCon("***กรุณากรอกตัวเลข")
                    } else if (e.target.value.search(/[A-Z]/g) < 0) {
                        setTextValidateCon("***กรุณากรอกตัวอักษรพิมพ์ใหญ่")
                    } else if (e.target.value.search(/[a-z]/g) < 0) {
                        setTextValidateCon("***กรุณากรอกตัวอักษรพิมพ์เล็ก")
                    } else if (e.target.value.search(/[/!@#$%^&*()_.+-]/g) < 0) {
                        setTextValidateCon("***กรุณากรอกอักขระพิเศษ")
                    } else if (e.target.value.length < 8) {
                        setTextValidateCon("***กรุณากรอกให้ครบ 8 หลัก")
                    } else {
                        let datas = { "pass": e.target.value }
                        axios.post(UrlApi() + 'encode_user_login', datas)
                            .then(res => {
                                if (res.data) {
                                    let conEncode = res.data[0]['pass_word']
                                    if (conEncode != newPass) {
                                        setTextValidateCon("รหัสผ่านไม่ตรงกัน")
                                    } else {
                                        setConfirmPass(conEncode)
                                        setTextValidateCon("")
                                    }
                                }
                            })
                    }
                }
            } else {
                setTextValidate("")
                setTextValidateNew("")
                setTextValidateCon("")
            }
        } else {
            setTextValidate("")
            setTextValidateNew("")
            setTextValidateCon("")
        }
    }

    const onClickSave = () => {
        if (oldPass && newPass && confirmPass) {
            let datas = {
                "em_id": parseInt(empId),
                "user_name": userLoginbyEmp[0]['user_name'],
                "pass_word": newPass,
                "user_active": true,
                "role_group_id": parseInt(userLoginbyEmp[0]['role_group_id']),
                "em_code": userLoginbyEmp[0]['employeecode'],
                "old_pass_word": oldPass,
                "config_active": true,
                "company_id": parseInt(userCompanyID),
                "user_id": parseInt(userId)
            }

            axios.post(UrlApi() + 'update_user_login', datas)
                .then(res => {
                    setAlertSuccess(true);
                    setAlertMessages("แก้ไขข้อมูลสำเร็จ");
                    setOpenDialog(false);
                    setAlerttWarning(false)
                    window.location = "/login"
                   
                })
        } else {
            setAlerttWarning(true);
            setAlertMessages("กรุณากรอกข้อมูลให้ครบถ้วน !!");
        }

    }
        
    const getCardData = () => {
       return (<Card>
            <div style={{ marginLeft: "16%", marginTop: "2%" }}>
                <div class="row" style={{ marginTop: "1%" }}>
                    <div class="col-2" style={{ marginLeft: "10%", marginTop: "1%" }}>
                        <p className="text_left" style={{ marginTop: "1%" }}><strong>ชื่อ :</strong></p>
                        <p className="text_left" style={{ marginTop: "10%" }}><strong>User Name :</strong></p>
                        <p className="text_left" style={{ marginTop: "12%" }}><strong>รหัสผ่านเดิม :</strong></p>
                        <p className="text_left" style={{ marginTop: "12%" }}><strong>รหัสผ่านใหม่ :</strong></p>
                        <p className="text_left" style={{ marginTop: "12%" }}><strong>ยืนยันรหัสผ่าน:</strong></p>
                    </div>
                   <div class="col-4">
                       <p className="text_left" style={{ marginTop: "5%" }}><strong>{userFullName}</strong></p>
                        <p className="text_left" style={{ marginTop: "5%" }}><strong>{userName}</strong></p>
                        <div style={{ display: "-ms-flexbox", display: "flex", marginTop: "2%" }}>
                            <input className='input-text'
                                type={eyeStatus ? "text" : "password"}
                                defaultValue=""
                                name="oldpass"
                                onChange={(e) => OnchangeInput(e)}>
                            </input>
                            <i style={{ position: "absolute", marginLeft: "24%", marginTop: "8px" }} onClick={() => setEyeStatus(!eyeStatus)}> {eyeStatus ?
                                <AiIcons.AiFillEye /> : <AiIcons.AiFillEyeInvisible />}</i>
                        </div>
                        <p className="text_ts" style={{ color: "red" }} > {textValidate}</p>
                        <div>
                            <input className='input-text'
                                type={"password"}
                                defaultValue=""
                                name="newpass"
                                onChange={(e) => OnchangeInput(e)}>
                            </input>
                            <p className="text_ts" style={{ color: "red" }} > {textValidateNew}</p>
                        </div>
                        <div style={{ marginTop: "4%" }}>
                            <input className='input-text'
                                type={"password"}
                                defaultValue=""
                                name="confirmpass"
                                onChange={(e) => OnchangeInput(e)}>
                            </input>
                            <p className="text_ts" style={{ color: "red" }} > {textValidateCon}</p>
                        </div>
                    </div>
                </div>
                <div style={{ marginLeft: "45%", marginBottom: "2%" }}>
                    <Btnsubmit onClick={() => { onClickSave() }}></Btnsubmit>
                </div>
            </div>
        </Card>)
    }

    return (<div>
        <div style={{ marginLeft: "10%", marginRight: "10%" }}>
            { getCardData()}
        </div>
        {loading && <Loading style={{ left: '47%', left: '46%' }} />}
        {<AlertSuccess isOpen={alertSuccess} openAlert={() => {
            setAlertSuccess(false);
            setOpenDialog(false)
        }} messages={alertMessages} />}
        <AlertWarning
            isOpen={alertWarning}
            openAlert={() => {
                setAlerttWarning(false);
            }}
            messages={alertMessages}
            onAninationEnd={() => {
                setTimeout(() => { setAlerttWarning(false); }, 300);
            }} />
        {<AlertError isOpen={alertError} openAlert={() => setAlertError(false)} messages={alertMessages} />}
    </div>)
}

export default memo(ChangePassword);
