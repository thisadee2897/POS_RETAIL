import { React, useEffect, useContext } from "react";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Icon from '@mdi/react';
import { mdiDeleteForever } from '@mdi/js';

function BtnDelete({ onClick, style, disabled, fontSize, id}) {
    const actions = useContext(DataContextMenuActions);

    useEffect(() => {
        getBtn()
    }, [actions])

    const getBtn = () => {
        return (<>
            {
                // actions != undefined && actions.length > 0 ?
                //     actions[0][8] == true ?
                        <button variant="contained"
                            className="btn-add"
                            style={{ width: "100%", height: "30px", background: "#FD6F88" }}
                            type="button"
                            onClick={() => onClick()}
                            id={id}
                            disabled={disabled}
                        ><Icon path={mdiDeleteForever} size={1} />
                        </button>
                    //     : <></>
                    // : <></>
            }</>)
    }

    return (
        <span>
            {getBtn()}
        </span>
    );
}

export default BtnDelete;
