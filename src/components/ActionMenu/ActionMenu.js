import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import UrlApi from "../../url_api/UrlApi";
import { useLocation, useParams } from 'react-router-dom';
import _ from "lodash";
import PathRouter from "../../PathRouter/PathRouter";
import { forEach } from "lodash";
import DataContext from "../../DataContext/DataContext";

const ActionMenu = (props) => {
    const location = useLocation();
    const [dataMenuActions, setDataMenuAction] = useState([])
    const [menuID, setMenuID] = useState([0])
    const [menuName, setMenuName] = useState([0])
    const [dataAction, setDataAction] = useState([])
    const [actionRole, setActionsRole] = useState()
    const [masterActions, setMasterAction] = useState([])
    const [masterFilters, setMasterFilter] = useState([])
    const [dataActionFilter, setDataActionFilter] = useState([])
    const [dataMenu, setDataMenu] = useState([])
    const url = new URL(window.location);
    const searchParams = url.searchParams;

    useEffect(() => {
        if (location.state) {
            location.state.map((item, idx) => {
                setMenuID(item.menu_id)
                setMenuName(item.menu_name)
            })
        } 
        getDataMenuID(location.pathname)
        getMasterActions()
        getMasterFilter()
    }, [location])

    useEffect(() => {
        if (menuID > 0) {
            getDataMenuAction()
            getDataActionReportFilter()
        }
    }, [menuID, menuName])

    useEffect(() => {
        getDataActionmenuRole()
    }, [masterActions, dataMenuActions, dataMenu, masterFilters, menuID, dataActionFilter])

    useEffect(() => {
        getDataFileterReportActions()
    }, [actionRole])

    useEffect(() => {
        if (props.onChangeDataaction && dataAction) {
            props.onChangeDataaction(dataAction)
        }
    }, [dataAction])

    const getMasterActions = () => {
        axios.get(UrlApi() + 'get_menu_action')
            .then(res => {
                if (res.data) {
                    setMasterAction(res.data)
                }
            })
    }

    const getDataMenuID = (pathName) => {
        let dataApi = { path_name: pathName }
        axios.post(UrlApi() + 'get_menu_data_path', dataApi)
            .then(res => {
                if (res.data.length > 0) {
                    setDataMenu(res.data)
                    setMenuID(res.data[0].master_menu_id)
                    setMenuName(res.data[0].master_menu_name)
                }
            })
    }

    const getDataMenuAction = () => {
        if (menuID > 0) {
            let dataUser = props.dataUser ? props.dataUser[0] : []
            const dataAPI = {
                "master_company_id": parseInt(dataUser.master_company_id),
                "role_group_id": parseInt(dataUser.role_group_id),
                "master_menu_id": parseInt(menuID)
            }
            axios.post(UrlApi() + 'get_role_group_menu_action', dataAPI)
                .then(res => {
                    setDataMenuAction(res.data)
                })
        }
    }

    const getMasterFilter = () => {
        axios.get(UrlApi() + 'get_master_filter')
            .then(res => {
                setMasterFilter(res.data)
            })
    }

    const getDataActionReportFilter = () => {
        const datas = {
            "master_menu_id": parseInt(menuID)
        }
        axios.post(UrlApi() + 'get_master_filterreport', datas)
            .then(res => {
                setDataActionFilter(res.data)
            })
    }

    const getDataActionmenuRole = () => {
        let dataUser = props.dataUser ? props.dataUser[0] : []
        if (dataMenuActions.length > 0) {
            var actionmas = {
                "menuID": menuID,
                "menuName": menuName,
                "back_date_active": dataMenuActions[0]['role_group_menu_back_date_active'],
                "datamenu": dataMenu,
                "dataFilterReport": dataActionFilter,
                "filterReport": []
            };
            dataMenuActions.map((item, idx) => {
                actionmas[item.master_menu_action_id] = item.role_group_menu_action_active
            })
            setActionsRole([actionmas])
        }else if (dataUser.flag_system == false && masterActions.length > 0) {
            var actionmas = {
                "menuID": menuID,
                "menuName": menuName,
                "back_date_active": false,
                "datamenu": dataMenu,
                "dataFilterReport": dataActionFilter,
                "filterReport": []
            };
            masterActions.map((item, idx) => {
                actionmas[item.master_menu_action_id] = false
            })
            setActionsRole([actionmas])
        }
    }

    const getDataFileterReportActions = () => {
        if (masterFilters.length > 0 && dataActionFilter.length > 0) {
            var filterReports = {}
            masterFilters.map((item, idx) => {
                let findIdx = _.findIndex(dataActionFilter, { master_filter_id: item.master_filter_id })
                if (findIdx >= 0) {
                    filterReports[item.master_filter_id] = true
                } else {
                    filterReports[item.master_filter_id] = false
                }
            })
            actionRole[0].filterReport.push(filterReports)
            setDataAction(actionRole)
        } else {
            setDataAction(actionRole)
        }
    }

    return (<></>);
}

export default ActionMenu;