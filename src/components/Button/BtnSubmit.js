import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import './Button.css';
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

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
                        <Button variant="contained"
                            className="btn-submit"
                            style={{ width: "100%", height: "40px", background: "#6598F6" }}
                            type={type}
                            onClick={() => onClick()}
                            className={"btn-submit"}
                            disabled={disabled}
                        ><SaveIcon style={{ marginRight: "5px" }} /> บันทึก
                        </Button>
                        : <></>
                    : <></>
            }</>)

    }
    return (
        <span>
            {/*getBtn()*/}
            <button variant="contained"
                className="btn-submit"
                style={{ width: "100%", height: "40px", background: "#6598F6" }}
                type={type}
                onClick={() => onClick()}
                className={"btn-submit"}
                disabled={disabled}
            ><SaveIcon style={{ marginRight: "5px" }} /> บันทึก
            </button>
        </span>
    );
}

export default Btnsubmit;