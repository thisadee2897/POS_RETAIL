import React, { useState, useContext, useEffect } from "react";
import * as IoIcons from 'react-icons/io';
import './SidebarStyle/Sidebar.css';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import PathRouter from "../../PathRouter/PathRouter";
import HomeIcon from '@mui/icons-material/HomeOutlined';
import IconButton from '@mui/material/IconButton';
import *  as MaterailIcon from '@mui/icons-material';
import axios from "axios";
import _ from "lodash";
import Tooltip from '@mui/material/Tooltip';
import UrlApi from "../../url_api/UrlApi";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SubMenu from "./SubMenu"
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Icon from '@mdi/react';
import {
    mdiDatabaseOutline, mdiViewDashboardOutline, mdiStoreCogOutline,
    mdiCurrencyUsd, mdiListBoxOutline, mdiTicketPercentOutline,
    mdiAccountDetailsOutline, mdiFileChartOutline,
    mdiChevronUp, mdiChevronDown

} from '@mdi/js';

function Sidebar(props) {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [valueInput, setValueInput] = useState()
    const [dataSearchMenu, setDataSearchMenu] = useState([])
    const [SidebarData, setSidebarData] = useState([])
    const [dataSubmenuSelect,setDataSubmenuSelect] = useState([])
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id'])
    const [flagClickSearch, setflagClickSearch] = useState(false)

    useEffect(() => {
        getSideBarData()
    }, [])

    useEffect(() => {
        getMenus()
    }, [dataSearchMenu])

    const getSideBarData = () => {
        const datas = {
            "user_login_id": userLoginID,
            "company_id": userCompanyID,
        } 
        axios.post(UrlApi() + 'get_sidebar_data', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.user_id = userCompanyID
                    })
                    setSidebarData(res.data[0].select_role)
                }
            })
    }

    const OnchangeSearch = (e) => {
        if (e.target.value) {
            setValueInput(e.target.value)
            let filterText = (e.target.value).trim()
            let dataSearchSub = []
            SidebarData.map((item, idx) => {
                if (item.subNav.length > 0) {
                    item.subNav.map((its, ids) => { dataSearchSub.push(its) })
                }
            })
            let filteredItems = dataSearchSub.filter((item) => JSON.stringify(item).indexOf(filterText) !== -1)
            let dataModule = []
            filteredItems.forEach((item, idx) => {
                let find = _.findIndex(SidebarData, { master_form_module_id: item.master_form_module_id })
                let dupicates = _.findIndex(dataModule, { master_form_module_id: item.master_form_module_id })
                if (dupicates < 0) { dataModule.push(SidebarData[find])}
            })
            dataModule.map((item, idx) => {
                dataModule[idx].subNav = []
                filteredItems.map((its, ids) => {
                    if (item.master_form_module_id == its.master_form_module_id) {
                        dataModule[idx].subNav.push(its)
                    }  })
            })
           if (dataModule.length > 0) {
               setDataSearchMenu(dataModule)
            } else {
                setDataSearchMenu([])
                getSideBarData()
            }
        } else {
            setDataSearchMenu([])
            setValueInput(e.target.value)
            getSideBarData()
        }
    }

    const getMenus = () => {
        let dataSidebar = dataSearchMenu.length > 0 ? dataSearchMenu : SidebarData
        dataSidebar.map((item, idx) => {
            item.icon = idx == 0 ? <Icon path={mdiViewDashboardOutline} size={1} /> : idx == 1 ? <Icon path={mdiDatabaseOutline} size={1} /> :
                idx == 2 ? <Icon path={mdiStoreCogOutline} size={1} /> : idx == 3 ? <Icon path={mdiCurrencyUsd} size={1} /> :
                    idx == 4 ? <Icon path={mdiListBoxOutline} size={1} /> : idx == 5 ? <Icon path={mdiTicketPercentOutline} size={1} /> :
                        idx == 6 ? <Icon path={mdiAccountDetailsOutline} size={1} /> : idx == 7 ? <Icon path={mdiFileChartOutline} size={1} /> :
                            idx == 8 ? <Icon path={mdiFileChartOutline} size={1} /> : idx == 9 ? <Icon path={mdiFileChartOutline} size={1} /> :
                                idx == 10 ? <Icon path={mdiFileChartOutline} size={1} /> : idx == 11 ? <Icon path={mdiFileChartOutline} size={1} /> : <></>
            item.iconClosed = <Icon path={mdiChevronDown} size={1} />
            item.iconsOpened = <Icon path={mdiChevronUp} size={1} />
        })

        return dataSidebar.map((item, index) => {
            return <SubMenu item={item} key={index} openSub={dataSearchMenu.length > 0 ? true : false} onchangeSubmenuData={(e) => onClickSubMenu(e)} />;
            }) 
        
    }

    const onClickSubMenu = (e) => {
        setDataSubmenuSelect(e)
        e.dataBranchSelect = props.branchData
        props.onchangemenuData(e)
    }

    const onClickMenu = () => {
        //indow.location = `${PathRouter()}/page-set/select-branch?com_id=${userData[0].master_company_id}&u_id=${userData[0].user_login_id}`;
    }

    const getFilter = () => {
        return (<Paper component="form"
            style={{
                marginLeft: "0%", marginTop: "0px", height: "50px", marginBottom:"10px",
                border: "1px", borderColor: "#CCD1D1",  borderStyle: "solid",
                width: "138%", backgroundColor: "#F8F9F9" }}>
            <IconButton type="button" style={{ color: "#1976D2" }}
                onClick={() => setflagClickSearch(!flagClickSearch)}>
                <MaterailIcon.Search  style={{ color: "#1976D2", fontSize: "30px" }} />
            </IconButton>
            <InputBase
                autoFocus
                value={valueInput}
                onChange={(e) => OnchangeSearch(e)}
                onKeyPress={(e) => e.key === 'Enter' ? OnchangeSearch(e) : null}
                sx={{ ml: 1, flex: 1 }}
                placeholder="ค้นหา"
            />
        </Paper>)
    }

    return (
        <>
            <div className="side-bar" style={props.style}>
                <div class="row">
                    <div class="col-9">
                        {flagClickSearch == true ? <>{getFilter()}</> :
                            < Tooltip title="ค้นหา">
                            <IconButton type="button"
                                style={{ marginTop: "10px", marginLeft: "%", color: "#1976D2" }}
                                onClick={() => setflagClickSearch(!flagClickSearch)}>
                                <MaterailIcon.Search style={{ color: "white", fontSize: "30px" }} />
                            </IconButton>
                        </Tooltip>
                        }
                    </div>
                    <div class="col">
                        <IconButton style={{ marginTop: "10px" }}
                            onClick={() => props.onClickActive(!props.sidebarActive)}>
                            <KeyboardDoubleArrowLeftIcon style={{
                                color: flagClickSearch == true ? "#6598F6" : "white" }} />
                        </IconButton>
                    </div>
                </div>
                <div style={{ height: '88vh', overflow: 'auto', backgroundColor: "#6598F6", color: "white" }}>
                    {getMenus()}
                </div>
                <div style={{ height: '12vh', cursor: 'pointer', backgroundColor: "#6598F6"}}
                        onClick={()=>onClickMenu()}>
                    <IconButton onClick={() => window.location = `${PathRouter()}/page-set/select-branch?com_id=${userData[0].master_company_id}&u_id=${userData[0].user_login_id}`}>
                        <HomeIcon style={{ color: "white" }} fontSize="large" />
                        <label style={{ cursor: 'pointer', color: 'white', fontSize:"16px" }}>เลือกสาขา</label>
                        </IconButton>
                    </div>
            </div>
        </>
    );
}

export default Sidebar;