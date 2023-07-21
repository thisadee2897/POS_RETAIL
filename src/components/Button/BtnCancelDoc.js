import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import { Button } from '@mui/material';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import Icon from '@mdi/react';
import { mdiFileCancelOutline } from '@mdi/js';

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
                        <></>
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
            ><Icon path={mdiFileCancelOutline} size={1} style={{ marginRight:"5px" }} />
            ยกเลิกเอกสาร
        </button>
        </>
    );
}


export default BtnCancelDoc;
