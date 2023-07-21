import { useState, useEffect, useContext } from 'react';
import './SelectBranch.css';
import axios from 'axios';
import UrlApi from '../../url_api/UrlApi';
import "datatables.net-dt/css/jquery.dataTables.min.css"
import BtnSelectBranch from '../../components/Button/BtnSelectBranch';
import Loading from '../../components/Loading/Loading';
import Grid from '@mui/material/Grid';
import * as IoIcons from 'react-icons/io';
import PathRouter from '../../PathRouter/PathRouter';
import FestivalIcon from '@mui/icons-material/Festival';
import Card from 'react-bootstrap/Card';
import * as BiIcons from 'react-icons/bi';
import DataContext from '../../DataContext/DataContext';
import { showBranchImage } from '../../url_api_other/url_api_other';
import Icon from '@mdi/react';
import { mdiStorefrontOutline, mdiChevronRightCircleOutline  } from '@mdi/js';
import { Link, NavLink } from "react-router-dom";


function SelectBranch() {
    const userData = useContext(DataContext);
    const [branchData, setBranchData] = useState([]);
    const user = JSON.parse(userData);
    const [loading, setLoading] = useState(false);
    const [base64File, setBase64File] = useState('');

    const dataAPI = {
        "company_id": user.master_company_id,
        "user_id": user.user_login_id,
    }

    useEffect(() => {
        getBranchDataChoose()
        getImageCompanyData()
    }, []);

    const getBranchDataChoose =()=> {
        axios.post(UrlApi() + 'get_choose_branch_data', dataAPI)
            .then((res) => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.master_branch_id =  parseInt(item.master_branch_id);
                    })
                    setBranchData(res.data)
                }
        });
    }

    const getImageCompanyData = () => {
        axios.post(UrlApi() + 'get_image_company', dataAPI).then((res) => {
            setBase64File(res.data[0]['base64file']);
            setLoading(false);
        });
    }

    const getCardPhoto = () => {
        return (<Card style={{ height: "100vh", borderColor: "#FEFEFE", background:"#FEFEFE", textAlign: "center" }}>
            <b style={{ fontSize: "3vw", color: "#6598F6", marginTop:"70%"}}>PHOTO</b>
        </Card>)
    }

    const getCardBranch = () => {
        return (<>
            <Card className="card_branch">
                <Card.Body style={{ marginTop: "5%", marginLeft: "8%" }}>
                    <b style={{ fontSize: "40px", color: "#6598F6" }}>เลือกสาขา</b>
                    <div style={{ marginTop: "4%", overflow:"auto",height:"70vh" }}>
                    {branchData.length > 0 ?
                        branchData.map((item, idx) => {
                        return (<>
                            <Card className="card_branch_dt" style={{ marginRight: "10%", marginTop: "2%",height:"15vh" }}>
                                <Grid container spacing={0}>
                                    <Grid item xs={2} >
                                        <Card className="card_branch_logo" style={{height:"15vh"}}>
                                            <Icon path={mdiStorefrontOutline} size={2.3}
                                                style={{ color: "#7C7D93", marginLeft: "30%", marginTop: "12%" }} />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} >
                                       <div style={{  marginTop: "10px", marginLeft: "12px" }}>
                                           <b style={{ color: "#6598F6", fontSize: "24px" }}>{item.master_branch_name}</b>
                                            <p style={{ color: "#7C7D93", fontSize: "14px"  }}>
                                                {item.addr_name + " " + item.master_branch_addr + " " +
                                                    item.master_addr_district_name + " " +
                                                    item.master_addr_prefecture_name + " " +
                                                    item.master_addr_province_name + " " +
                                                    item.master_addr_postcode_code + " " + item.master_branch_tel}
                                            </p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={1} >
                                        <div className="border_right" style={{ height: "10vh", marginTop: "10px", }} />
                                    </Grid>
                                    <Grid item xs={3} >
                                        <Grid container spacing={0}>
                                            <Grid item xs={7} style={{ textAlign: "center" }}>
                                                <div style={{ marginTop: "30px", marginLeft: "12px" }}>
                                                    <b style={{ color: "#6598F6", fontSize: "20px" }}>ไปยังสาขา</b>
                                                </div>
                                            </Grid>
                                     
                                            <Grid item xs={2} >
                                                <Link
                                                    // onClick={() => localStorage.setItem("branchData", [item])}
                                                    to={item.master_branch_ho_flag == true ? `/main/dashboard` : `/main`}
                                                    state={[{
                                                        "master_branch_id": item.master_branch_id,
                                                        "user_id": user.user_login_id,
                                                        "dataBranchSelect": [item]
                                                       
                                                    }]}
                                                >
                                                <Icon style={{ marginTop: "70%", color:"#FEAE5F" }}
                                                        path={mdiChevronRightCircleOutline} size={1.6} />
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Card> </>)
                    }): <></>}
                    </div>
                </Card.Body>
            </Card> </>)
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={4} >
                {getCardPhoto()}
            </Grid>
            <Grid item xs={8} >
                {getCardBranch()}
            </Grid>
        </Grid>
    )
}

export default SelectBranch;