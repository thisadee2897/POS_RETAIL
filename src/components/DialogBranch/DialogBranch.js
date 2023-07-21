import React, { useState, useContext } from "react";
import { useEffect } from "react";
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import UrlApi from "../../url_api/UrlApi";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import makeAnimated from 'react-select/animated';
import { Dialog, DialogTitle, FormGroup, FormControlLabel, Checkbox, IconButton , DialogContent, DialogActions } from '@mui/material';
import Icon from '@mdi/react';
import { mdiStoreSettingsOutline } from '@mdi/js';
import BtnCancel from "../../components/Button/BtnCancel";
import BtnConfirm from "../../components/Button/BtnConfirm";
import InputText from "../../components/Input/InputText";

const DialogBranch = (props) => {
    const userData = useContext(DataContext);
    const [dataBranch, setDataBranch] = useState([])
    const [checksAll, setChecksAll] = useState(false)
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const [opens, setOpens] = useState(false)
    const [dataBranchSelect, setDataBranchSelect] = useState([])
    const [dataBranchCheck, setDataBranchCheck] = useState([])
    const [valueCheck, setValueCheck] = useState()

    useEffect(() => {
        getDataBranch()
    }, [props])

    useEffect(() => {
        getDialog()
    }, [valueCheck])

    useEffect(() => {
        console.log(dataBranchSelect)
    }, [dataBranchSelect])

    const getDataBranch = () => {
        let branchSelect = []
        if (dataBranch.length < 1) {
            const datas = {
                "company_id": parseInt(userCompanyID),
                "user_id": parseInt(userId)
            }
            axios.post(UrlApi() + 'get_branch_data', datas)
                .then(res => {
                    if (res.data) {
                        res.data.map((item, idx) => {
                            if (props.allBranchID == true) {
                                item.checks = true
                            } else if (props.branchsDataID) {
                                props.branchsDataID.forEach((its, ids) => {
                                    if (its == item.master_branch_id) {
                                        branchSelect.push(item)
                                        item.checks = true
                                    } else {
                                        item.checks = false
                                    }
                                })
                            } else {
                                item.checks = false
                            }
                        })
                        setDataBranch(res.data)
                        setDataBranchSelect(branchSelect)
                        setDataBranchCheck(branchSelect)
                    }
                })
        }
    }

    const OnchangeCheck = (e, item, idx) => {
        if (e.target.value == 0) {
            setValueCheck(e)
            setChecksAll(e.target.checked)
            dataBranch.map((item, idx) => {
                item.checks = e.target.checked
                if (e.target.checked == true) {
                    dataBranchCheck.push(item)
                } else {
                    setDataBranchCheck([])
                }
            })
            setDataBranch(dataBranch)
        } else {
            dataBranch[idx]['checks'] = e.target.checked
            if (e.target.checked == true) {
                dataBranchCheck.push(item)
            } else if (e.target.checked == false) {
                dataBranchCheck.splice(1, idx)
            }
            setValueCheck(e)
            setDataBranch(dataBranch)
        }
    }

    const OnchangeBranch = () => {
        setDataBranchSelect(dataBranchCheck)
        props.onChangeBranchValue(dataBranchCheck)
        setOpens(false)
    }

    const onClickOpenDialog = () => {
        setOpens(true)
    }

    const getDialog = () => {
        return (<Dialog open={opens} maxWidth={ "900px"}>
            <DialogTitle style={{ height: "50px" }}><p>เลือกสาขา</p> </DialogTitle>
            <DialogContent dividers="paper" style={{ width:"800px" }}>
                <button type="button" className="cancel" onClick={() => setOpens(false)}>x</button>
                <Card className="card_body_doc" style={{ marginTop: "0px" }}>
                    <FormGroup>
                        <div class="row" style={{ marginLeft: "1%", marginRight: "1%", marginTop:"1%" }}>
                            {dataBranch.map((item, idx) => {
                                return (<div class="col-4">
                                    < FormControlLabel control={
                                        <Checkbox style={{ color: "#6598F6" }} value={item.master_branch_id} defaultChecked={item.checks} checked={item.checks}
                                                onClick={(e) => { OnchangeCheck(e, item, idx) }} />}
                                        label={ <span>{item.master_branch_name}</span> } />
                                </div>)
                            })}
                            <div class="col-4">
                                < FormControlLabel control={<Checkbox style={{ color: "#6598F6" }}
                                    value={0} defaultChecked={props.allBranchID ? props.allBranchID : checksAll}
                                    checked={props.allBranchID ? props.allBranchID : checksAll}
                                     onClick={(e) => { OnchangeCheck(e) }} />}
                                    label={ <span >ทั้งหมด</span> } />
                            </div>
                        </div>
                    </FormGroup>
                </Card>
            </DialogContent>
            <DialogActions>
                <BtnConfirm onClick={() => OnchangeBranch()} />
                <BtnCancel onClick={() => setOpens(false)}/>
            </DialogActions>
        </Dialog>)
    }

    const getBranchSelect = () => {
        let Text = ""
        dataBranchSelect.forEach((item, idx) => {
            Text = Text + item.master_branch_name +","
        })
        return (<InputText style={{ width: "110%", height: "40px", background: "#E6E6E6", borderColor: "#E6E6E6" }}
            type="text" value={props.allBranchID == true ? "ทั้งหมด" :  Text } disabled />)
    }


    return (
        <div class="row">
            <div class="col-8">
                { getBranchSelect()}
            </div>
            <div class="col-1">
                    <IconButton style={{ marginTop: "0px", background: "#74E0C0", borderRadius: "12px",
                    fontSize: "25px", marginTop: "1%", width: "50px"  }}
                    onClick={() => { onClickOpenDialog() }}>
                    <Icon path={mdiStoreSettingsOutline} size={1} style={{color:"white"}}/>
               </IconButton>
            </div>
            {getDialog()}

        </div>
    );
};

export default DialogBranch;