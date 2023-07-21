import React, { useEffect, useState, useContext } from "react";
import './Main.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import ActionMenu from "../../components/ActionMenu/ActionMenu"
import NavBar from "../../components/Navbar/Navbar";
import axios from "axios";
import { Outlet } from "react-router-dom";
import PathRouter from "../../PathRouter/PathRouter";
import SidebarNoneActive from '../../components/Sidebar/SidebarNoneActive';
import { useLocation, useParams } from 'react-router-dom';
import UrlApi from "../../url_api/UrlApi";

const Main = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const [dataMenuSubselect, setDataMenuSubselect] = useState([])
    const location = useLocation();
    const [dataAction, setDataAction] = useState([])
    const [branchData, setBranchData] = useState([])
    const [flageMenu, setFlagmenu] = useState(false)
    const [dropShow, setDropShow] = useState(false)
    const [sidebarActive, setSidebarActive] = useState(true)
    const [dataBranch, setDataBranch] = useState([])
    const [dataUser, setDataUser] = useState([])
    const [userID, setUserID] = useState(0)

    useEffect(() => {
        if (localStorage.branchSelect) {
            setBranchData([JSON.parse(localStorage.branchSelect)])
        }
        if (localStorage.user_id) {
            setUserID(parseInt(localStorage.user_id))
            setFlagmenu(true)
        }
        if (location.state) {
            location.state.map((item, idx) => {
                if (item.dataBranchSelect) {
                    localStorage.setItem("branchSelect", JSON.stringify(item.dataBranchSelect[0]))
                    localStorage.setItem("user_id", item.user_id)
                    setBranchData(item.dataBranchSelect)
                }
                setUserID(item.user_id)
            })
            setFlagmenu(true)
        }
    }, [])

    useEffect(() => {
        if (userID > 0) {
            getDataUser()
        } else if (location.state && !location.state[0].user_id) {
            window.location = `${PathRouter()}/login`;
        }
    }, [userID])

    useEffect(() => {
        getMenuAction();
    }, [dataUser])

    useEffect(() => {
        getMain()
    }, [dataAction])

    const getDataUser = () => {
        let dataAPI = { "user_id": userID }
        axios.post(UrlApi() + 'get_user_login', dataAPI)
            .then(res => {
                if (res.data) {
                    setDataUser(res.data);
                }
            })
    }

    const getMenuAction = () => {
        return (<ActionMenu menuSelect={dataMenuSubselect} onChangeDataaction={(e) => {
            setDataAction(e);
        }} dataUser={dataUser} />)
    }


    const onClickMenu = (data) => {
        setSidebarActive(false)
        setDataMenuSubselect(data)
    }


    const onClickActiveSidebar = (e) => {
        setSidebarActive(e)
        getDataContact()
    }

    const getMain = () => {
   
        return (<>  {dataUser.length > 0 ? getMenuAction() : <></>}
            {dataUser.length > 0 ? getDataContact() : <></>}</>)
    }


    const getDataContact = () => {
        return (
            <DataContext.Provider value={dataUser}>
                <DataContextBranchData.Provider value={branchData}>
                    <DataContextMenuActions.Provider value={dataAction}>
                        <div className="main">
                            {flageMenu == false ? null : sidebarActive == false ?
                                <div><SidebarNoneActive
                                    sidebarActive={sidebarActive}
                                    onClickActive={(e) => onClickActiveSidebar(e)} />
                                </div> :
                                <div className="side-bar-content" style={{ display: 'block' }}>
                                    <Sidebar
                                        onchangemenuData={(e) => { onClickMenu(e) }}
                                        sidebarActive={sidebarActive}
                                        onClickActive={(e) => onClickActiveSidebar(e)}
                                        branchData={dataBranch}
                                    />
                                </div>
                            }
                            {flageMenu == true ?
                                <div className="main_page">
                                    <NavBar visible={true} branchData={dataBranch} dataUser={dataUser} />
                                    <div className={sidebarActive == true ? "content-page_active" : "content-page"}>
                                        <Outlet />
                                    </div>
                                </div>
                                : < div className="content-page">
                                    <Outlet />
                                </div>
                            }
                        </div>
                    </DataContextMenuActions.Provider>
                </DataContextBranchData.Provider>
            </DataContext.Provider>
        )

    }

    return (<>
        {getMain()}
    </>
    );
}

export default Main;