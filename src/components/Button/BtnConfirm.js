import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import './Button.css';
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import { Button } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

function Btnsubmit({ onClick, type, disabled, style }) {
    const actions = useContext(DataContextMenuActions);

    useEffect(() => {
        getBtn()
    }, [actions])


    const getBtn = () => {
        return (<>
            {
               
                actions != undefined && actions.length > 0 ?
                    actions[0][1] == true ?
                        <button variant="contained"
                            className="btn-add"
                            style={{ width: "100%", height: "40px", background: "#74E0C0" }}
                            type={type}
                            onClick={() => onClick()}
                            // className={"btn-submit"}
                            disabled={disabled}
                        ><span style={{ marginRight: "5px" }}>
                                <CheckBoxIcon style={{ marginRight: "5px" }} /> ตกลง</span>
                        </button>
                        : <></>
                    : <></>
            }</>)

    }
    return (
        <span>
            {/*getBtn()*/}
            <button variant="contained"
                className="btn-add"
                style={{ width: "100%", height: "40px", background: "#74E0C0" }}
                type={type}
                onClick={() => onClick()}
                // className={"btn-submit"}
                disabled={disabled}
            ><span style={{ marginRight: "5px" }}>
                    <CheckBoxIcon style={{ marginRight: "5px" }} /> ตกลง</span>
            </button>
        </span>
    );
}

export default Btnsubmit;