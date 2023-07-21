import React, { useState } from "react";
import './SidebarStyle/SubMenu.css';
import { Link, NavLink } from "react-router-dom";
import { useEffect, useContext } from "react";
import *  as MaterailIcon from '@mui/icons-material';
import DataContext from "../../DataContext/DataContext";

function SubMenu(props) {
    const userData = useContext(DataContext);
    const [subnav, setSubnav] = useState(props.openSub);

    useEffect(() => {

    }, [userData])

    useEffect(() => {
        setSubnav(props.openSub)
    }, [props.openSub])

    function showSubnav() {
        setSubnav(!subnav);
    }

    return (
        <>
            <Link className={subnav ? "menu-active" : "menu"} to="#" onClick={showSubnav}>
                <div className="row" style={{ marginTop:"10px" }}>
                    <div className="col-2">
                        {props.item.icon}
                    </div>
                    <div className="col">
                       <span>{props.item.title}</span>
                    </div>
                </div>
                <div>
                    {subnav
                        ? props.item.iconsOpened
                        : props.item.iconClosed
                    }
                </div>
            </Link>
            {subnav && props.item.subNav.map((item, index) => {
                return (
                    <NavLink className="sub-menu"
                        onClick={() => props.onchangeSubmenuData([item])}
                        state={[{
                            "menu_id": item.master_menu_id,
                            "menu_name": item.title,
                            "user_id": userData[0].user_login_id
                        }]}
                        to={item.pathdefault ? item.pathdefault : item.path}
                        key={index}
                        id={item.master_form_module_id} 
                    >
                    {item.icon} 
                    <span>{item.title}</span>
                </NavLink>
                );
            })}
        </>
    );
}

export default SubMenu;