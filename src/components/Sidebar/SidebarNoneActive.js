import React, { useState, useContext, useEffect } from "react";
import './SidebarStyle/Sidebar.css';
import DataContext from "../../DataContext/DataContext";
import IconButton from '@mui/material/IconButton';
import PathRouter from "../../PathRouter/PathRouter";
import axios from "axios";
import Icon from '@mdi/react';
import {
    mdiDatabaseOutline, mdiViewDashboardOutline, mdiStoreCogOutline,
    mdiCurrencyUsd, mdiListBoxOutline, mdiTicketPercentOutline,
    mdiAccountDetailsOutline, mdiFileChartOutline,
    mdiChevronUp, mdiChevronDown

} from '@mdi/js';
import UrlApi from "../../url_api/UrlApi";
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import Tooltip from '@mui/material/Tooltip';
import *  as MaterailIcon from '@mui/icons-material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import parse from 'html-react-parser';
import * as AiIcons from 'react-icons/ai';

const SidebarNoneActive = (props) => {
    const userData = useContext(DataContext);
    const [valueInput, setValueInput] = useState()
    const [dataSearch, setDataSearch] = useState([])
    const [dataSearchMenu, setDataSearchMenu] = useState([])
    const [dataMenudefault, setDataMenudefault] = useState([])
    const [SidebarData, setSidebarData] = useState([])
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id'])

    useEffect(() => {
        getDataSreach()
        getSideBarData()
    }, [])

    useEffect(() => {
        getMenus()
    }, [dataSearchMenu])

    const getDataSreach = () => {
        let datas = []
        setDataMenudefault(SidebarData)
        setDataSearch(SidebarData)
    }

    const getSideBarData = () => {
        const datas = {
            "user_login_id": userLoginID,
            "company_id": userCompanyID,
        }
        axios.post(UrlApi() + 'get_sidebar_data', datas)
            .then(res => {
                if (res.data) {
                    setSidebarData(res.data[0].select_role)
                }
            })
    }


    const getMenus = () => {
        let someHtml = '<MaterailIcon.Dashboard/>'
        SidebarData.map((its, idx) => { its.icons = parse(someHtml) })
        return SidebarData.map((item, idx) => {
            return ( <div style={{ marginTop: "30px" }}>
                    <Tooltip title={item.title}>
                    <IconButton style={{ color: "white" }} onClick={() => props.onClickActive(!props.sidebarActive)} >
                        {
                            idx == 0 ? <Icon path={mdiViewDashboardOutline} size={1} /> : idx == 1 ? <Icon path={mdiDatabaseOutline} size={1} /> :
                                idx == 2 ? <Icon path={mdiStoreCogOutline} size={1} /> : idx == 3 ? <Icon path={mdiCurrencyUsd} size={1} /> :
                                    idx == 4 ? <Icon path={mdiListBoxOutline} size={1} /> : idx == 5 ? <Icon path={mdiTicketPercentOutline} size={1} /> :
                                        idx == 6 ? <Icon path={mdiAccountDetailsOutline} size={1} /> : idx == 7 ? <Icon path={mdiFileChartOutline} size={1} /> :
                                            idx == 8 ? <Icon path={mdiFileChartOutline} size={1} /> : idx == 9 ? <Icon path={mdiFileChartOutline} size={1} /> :
                                                idx == 10 ? <Icon path={mdiFileChartOutline} size={1} /> : idx == 11 ? <Icon path={mdiFileChartOutline} size={1} /> : <></>
                        }
                        </IconButton>
                    </Tooltip></div>
                )
            })
    }

    return (
        <>
            <div style={{ height: '90vh', overflow: 'auto', backgroundColor: "#6598F6", color: "white" }}>
                <IconButton onClick={() => props.onClickActive(!props.sidebarActive)}>
                    <KeyboardDoubleArrowRightIcon   style={{ color: "white" }} />
                </IconButton>
                {getMenus()}
            </div>
            <div style={{ height: '10vh', overflow: 'auto', backgroundColor: "#6598F6", color: "white" }}>
                <Tooltip title='เลือกสาขา'>
                    <IconButton onClick={() => window.location = `${PathRouter()}/page-set/select-branch?com_id=${userData[0].master_company_id}&u_id=${userData[0].user_login_id}`}>
                        <OtherHousesIcon style={{ color: "white" }} />
                    </IconButton>
               </Tooltip>
            </div>
        </>
    );
}

export default SidebarNoneActive;