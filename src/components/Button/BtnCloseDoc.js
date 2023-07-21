import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import { Button } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';


function BtnCancelDoc({ onClick, message, icons, style, id, disabled }) {
    const actions = useContext(DataContextMenuActions);

    useEffect(() => {
        getBtn()
    }, [actions])

    const getBtn = () => {
        return (<>
            {
                actions != undefined && actions.length > 0 ?
                    actions[0][4] == true ?
                        <Button variant="contained"
                            className="btn-add"
                            style={{ width: "100%", height: "40px", background: "#1976D2" }}
                            type="button"
                            onClick={() => onClick()}
                            id={id}
                            disabled={disabled}
                        ><TaskIcon /> ปิดเอกสาร
                        </Button>
                        : <></>
                    : <></>
            }</>)

    }
    return (
        <>
            {/*getBtn()*/}
            <button variant="contained"
                className="btn-add"
                style={{ width: "100%", height: "40px", background: "#6598F6" }}
                type="button"
                onClick={() => onClick()}
                id={id}
                disabled={disabled}
            ><TaskIcon /> ปิดเอกสาร
            </button>
        </>
    );
}


export default BtnCancelDoc;
