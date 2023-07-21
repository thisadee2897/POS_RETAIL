import React, { memo, useEffect, useState, useCallback} from "react";
import AlertError from "../../components/Alert/AlertError";
import AlertWarning from "../../components/Alert/AlertWarning";
import axios from "axios";
import UrlApi from "../../url_api/UrlApi";
import Loading from "../../components/Loading/Loading";
import PathRouter from "../../PathRouter/PathRouter";
import { version } from '../../components/Version/Version';
import Grid from '@mui/material/Grid';
import Card from 'react-bootstrap/Card';
import Logo from '../../components/Navbar/logo.png';
import InputText from "../../components/Input/InputText";
import Btnadd from "../../components/Button/BtnAdd"
import { Link, NavLink } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiAccountOutline, mdiLockOutline, mdiEyeOffOutline, mdiEyeOutline, mdiAlphaCCircleOutline } from '@mdi/js';
import { encode, decode } from 'string-encode-decode'
import base64 from 'react-native-base64'



function Login() {
    const [eyeStatus, setEyeStatus] = useState(false);
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertWarning, setAlerttWarning] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [validateTextUser, setValidateTextUser] = useState("")
    const [validateTextPass, setValidateTextPass] = useState("")
    const [dataAPI, setDataAPI] = useState({})
    const [userID, setUserID] = useState(0)


    const onchangeInput = (e, type) => {
        setValidateTextUser("")
        setValidateTextPass("")
        dataAPI[type] = e.target.value;
    }

    const onClickLogin = () => {
        setOpenLoading(true)
        if (!dataAPI.username || dataAPI.username.length < 1) {
            setValidateTextUser("***กรุณากรอกชื่อผู้ใช้งาน")
        } else if (!dataAPI.password || dataAPI.password.length < 1) {
            setValidateTextPass("***กรุณากรอกรหัสผ่าน")
        } else {
            axios.post(UrlApi() + 'login', dataAPI).then((res) => {
                setOpenLoading(false)
                if (res.data.status == 200) {
                    setOpenLoading(false)
                    localStorage.setItem('user_data', JSON.stringify(res.data.userinfo[0]));
                    localStorage.setItem('token', res.data.token);
                    window.location = `${PathRouter()}/page-set/select-branch`;
                } else {
                    setOpenLoading(false)
                    setAlerttWarning(true)
                    setAlertMessages("Username/Password ไม่ถูกต้อง")
                }
            })
        }
    }

    const getAlert = () => {
        return (<>
            <AlertWarning isOpen={alertWarning} openAlert={(e) => setAlerttWarning(e)}  messages={alertMessages} />
        </>)
    }


    const getCardWelcome = () => {
        return (<Card className="card_welcome" style={{ fontFamily: 'Noto Sans Thai'}}>
            <Card.Body style={{ marginTop: "30%" }}>
                <Grid container spacing={0.1} style={{ marginLeft: "5%" }}>
                    <Grid item xs={6} >
                        <div style={{ textAlign: "center"}}>
                        <p style={{ fontSize: "70px", color: "white", marginLeft: "3%" }}>Welcome to</p>
                        <p style={{ fontSize: "70px", color: "white", textTransform: "uppercase" }}>
                            <img style={{ height: "108px", width: "109px" }} src={Logo} />
                                oho pos</p>
                        </div>
                    </Grid>
                    <Grid item xs={0.3} >
                        <div className="border_right" style={{ marginTop: "35px", color:"#D9D9D9" }}></div>
                    </Grid>
                    <Grid item xs={4} >
                        <div style={{
                            fontSize: "20px", color: "white", color: "#FED98B",
                            textTransform: "capitalize", textAlign: "center", marginTop:"20%"
                        }}>
                            <p> <Icon path={mdiAlphaCCircleOutline} size={1}/>
                                Copyright Tech Care Solution. </p>
                            <p>All Rights Reserved.</p>
                            <p> {version}</p>
                        </div> 
                    </Grid>
                </Grid>
            </Card.Body>
        </Card>)
    }

    const getFormLogin = () => {
        return (<Card className="card_login" style={{ width: "80%", textAlign: "center", marginLeft: "10%", marginTop: "18%" }}>
            <Card.Body style={{ marginTop: "20%", marginRight: "15%" }}>
                <b style={{ textTransform: "uppercase", color: "#6598F6", fontSize: "2.5vw", marginLeft:"8%" }}>user login</b>
                <div class="row" style={{ marginTop:"10%" }}>
                    <div class="col-1">
                        <Icon style={{ color: "#A3C5FA", position: "absolute", marginLeft: "8%", marginTop:"1%" }}
                            path={mdiAccountOutline} size={1.5} />
                    </div>
                    <div class="col-11">
                        <InputText type="text" style={{
                            borderColor: validateTextUser.length > 1 ? "#FF002D" :  "#E3E9F3",
                            backgroundColor: "#E3E9F3", height: "50px", width: "108%", paddingLeft: "60px", fontSize: "24px"
                        }}
                            onChange={(e) => onchangeInput(e, "username")}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onClickLogin()
                                }
                            }}/>
                    </div>
                    {validateTextUser.length > 1 ? <p style={{ color: "#FF002D" }}>{validateTextUser}</p> : null}
                </div>
                <div class="row" style={{ marginTop: "10%" }}>
                    <div class="col-1">
                        <Icon style={{ color: "#A3C5FA", position: "absolute", marginLeft: "8%", marginTop: "1%"}}
                            path={mdiLockOutline } size={1.5} />
                    </div>
                    <div class="col-10">
                        <InputText style={{
                            borderColor:  validateTextPass.length > 1 ? "#FF002D" : "#E3E9F3" ,
                            backgroundColor: "#E3E9F3", height: "50px", width: "120%",paddingLeft: "60px", fontSize: "24px"
                        }}
                            type={eyeStatus == false ? "password" : "text"} onChange={(e) => onchangeInput(e, "password")}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onClickLogin()
                                }
                            }}
                        />
                    </div>
                    <div class="col-1">
                        <i onClick={() => setEyeStatus(!eyeStatus)}>
                                <Icon style={{ color: "#A3C5FA", position: "absolute", marginRight: "10%", marginTop: "1%" }}
                                path={eyeStatus == true ? mdiEyeOutline  :  mdiEyeOffOutline} size={1.5}/></i>
                    </div>
                    {validateTextPass.length > 1 ? <p style={{ color: "#FF002D" }}>{validateTextPass}</p> : null}
                </div>
                <Btnadd style={{ height: "50px", marginTop: "10%", marginLeft: "8%", width: "60%" }}
                    message="LOG IN" onClick={() => onClickLogin()} />
                {getLoading()}
            </Card.Body>
           
            </Card >)
    }

    const getLoading = () => {
        return (<div><Loading open={openLoading} /></div>)
    }

    return (<>
        <Grid container spacing={0.1} style={{ height: "100%" }}>
            <Grid item xs={7} >
                {getCardWelcome()}
            </Grid>
            <Grid item xs={5} >
                {getFormLogin()}
            </Grid>
        </Grid>

        {getAlert()}
        </>
    );
}

export default memo(Login);