import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UrlApi from '../../url_api/UrlApi';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import "datatables.net-dt/css/jquery.dataTables.min.css"
import NavBar from "../../components/Navbar/Navbar";
import SidebarNoneActive from '../../components/Sidebar/SidebarNoneActive';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Outlet } from "react-router-dom";
import { useLocation, useParams } from 'react-router-dom';
import ActionMenu from "../../components/ActionMenu/ActionMenu";
import { encode, decode } from 'string-encode-decode'
import base64 from 'react-native-base64'
import PathRouter from "../../PathRouter/PathRouter";

const MainSetting = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const location = useLocation();
    const [branchData, setBranchData] = useState([])
    const [userID, setUserID] = useState(queryParams.get('u_id'))
    const [dataUser, setDataUser] = useState([])
    const [flageMenu,setFlagmenu]= useState(false)
    const [dropShow, setDropShow] = useState(false)
    const [sidebarActive, setSidebarActive] = useState(false)
    const [dataMenuSubselect, setDataMenuSubselect] = useState([])
    const [dataAction, setDataAction] = useState([])
   

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        if (userData === null) {
            window.location = `${PathRouter()}/login`;
        }else{
            setDataUser(userData);
        }
        // if (location.state) {
        //     location.state.map((item, idx) => {
        //         if (item.dataBranchSelect) {
        //             localStorage.setItem("branchSelect", JSON.stringify(item.dataBranchSelect[0]))
        //             localStorage.setItem("user_id", item.user_id)
        //             setBranchData(item.dataBranchSelect)
        //         }
        //         setUserID(item.user_id)
        //     })
        // }
    }, [])


    // useEffect(() => {
    //     if (userID > 0) {
    //         getDataUser()
    //     } else {
    //         window.location = `${PathRouter()}/login`
    //     }
    // }, [userID])

    useEffect(() => {
        getDataContact()
    }, [flageMenu, branchData])

    useEffect(() => {
        if (dataUser.length > 0) {
            getMenuAction()
        }
    }, [dataUser])

    // const getDataUser = () => {
    //     let dataAPI = { "user_id": userID }
    //     axios.post(UrlApi() + 'get_user_login', dataAPI)
    //         .then(res => {
    //             if (res.data) {
    //                 setDataUser(res.data)
    //             }
    //         })
    // }

  

    const getMenuAction = () => {
        return (<ActionMenu menuSelect={dataMenuSubselect} onChangeDataaction={(e) => setDataAction(e)} dataUser={dataUser}/>)
    }

    const getDataContact = () => {
        return (<DataContext.Provider value={dataUser}>
            <DataContextBranchData.Provider value={branchData}>
                <DataContextMenuActions.Provider value={dataAction}>
                <Outlet />
                </DataContextMenuActions.Provider>
            </DataContextBranchData.Provider>
        </DataContext.Provider >)
    }


    return (<>
        {dataUser.length > 0  ? getMenuAction(): <></>}
        {dataUser.length > 0 ? getDataContact() : <></>}
        </>
    );
}

export default MainSetting;