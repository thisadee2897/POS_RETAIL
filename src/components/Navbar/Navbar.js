import './Navbar.css';
import * as AiIcons from 'react-icons/ai';
import { useState, useEffect, useContext } from 'react';
import DataContextBranchData from '../../DataContext/DataContextBranchData';
import DataContext from "../../DataContext/DataContext";
import * as ImIcons from 'react-icons/im';
import PathRouter from '../../PathRouter/PathRouter';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import FestivalIcon from '@mui/icons-material/Festival';
import Card from 'react-bootstrap/Card';
import { version } from '../Version/Version';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
// import Logo from './logo.jpg';
import Logo from './logo.png';

function NavBar(props) {
    const BranchData = useContext(DataContextBranchData);
    const userData = useContext(DataContext);
    const [userName, setUserName] = useState(userData[0].user_name)
    const [userFirstName, setUserFirstName] = useState(userData[0].firstname)
    const [userLastName, setUserLastName] = useState(userData[0].lastname)
    const [dropShow, setDropShow] = useState(false)


    return (
        <><div className="nav-bar">
                <div className='nav-bar-option'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img style={{ height: "40px", width: "40px" }} src={Logo} />
                    <div className="border_right" style={{ height: "30px", marginTop: "10px" }} />
                    <b style={{ color: 'white', fontSize: "16px", marginLeft: "10px", marginTop: "10px" }}>
                        {BranchData[0].master_branch_name}</b>
                 </div>
                <label style={{ color: 'white', fontSize: "16px" }}>{""}</label>
                    <div style={{display: 'flex'}}>
                        <label style={{ padding: '5px', fontSize: "1rem"}}>{version}</label>
                        <div style={{ marginRight: "10px", cursor: "pointer" }}>
                        <AccountCircleIcon fontSize="large" style={{ marginTop: "1%", color: 'white' }}
                                onClick={() => { setDropShow(!dropShow) }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Dropdown.Menu show={dropShow} style={{ width: "15%", position: 'fixed',right: '2%'}}>
                    <div>
                        <AccountCircleIcon fontSize="large" style={{ marginLeft: "40%", marginTop: "1%", color: '#6598F6' }} />
                        <p style={{ color: '#6598F6', fontWeight: 'bold', fontsize: "1vw", marginLeft: "35%" }}>
                            {userName}</p>
                        <p style={{ color: 'black', fontWeight: 'bold', fontsize: "1vw", marginLeft: "10%", textAlign: "center" }}>
                            {userFirstName} {' '} {userLastName}</p>
                    </div>
                    <Dropdown.Divider />
                    <div style={{ zIndex: 1 }}>
                        <Dropdown.Item
                            /*onClick={() => { window.location = `${PathRouter()}/page-set/change-pass?com_id=${userData[0].master_company_id}&u_id=${userData[0].user_login_id}` }}*/ >
                            <p style={{ color: 'black', fontWeight: 'bold', fontsize: "1vw", marginLeft: "30%" }}> เปลี่ยนรหัสผ่าน</p>
                        </Dropdown.Item>
                    </div>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                        onClick={() => { localStorage.removeItem('userDataBackend');window.location = `${PathRouter()}/login`; 
                        }} 
                        style={{ zIndex: 1 }}>
                        <p style={{ color: 'black', fontWeight: 'bold', fontsize: "1vw", marginLeft: "30%" }}>
                            <i>{<ImIcons.ImExit />}</i>
                            ออกจากระบบ</p></Dropdown.Item>
                </Dropdown.Menu>
            </div>
        </>
    );
}

export default NavBar;