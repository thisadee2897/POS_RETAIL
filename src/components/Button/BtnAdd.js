import { React, useEffect, useContext } from "react";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Button } from '@mui/material';

function BtnAdd({ onClick, message, icons, style, id, disabled }) {
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
                            style={style ? style : { width: "100%", height: "40px", background: "#6598F6" }}
                            type="button"
                            onClick={() => onClick()}
                            id={id}
                            disabled={disabled}
                        ><span style={{ marginRight: "5px" }}>{icons}</span>
                            {message}
                        </button>
                        : <></>
                    : <></>
            }</>)
    }
    return (
        <>
            {/*getBtn()*/}
            <button variant="contained"
                className="btn-add"
                style={style ? style :{ width: "100%", height: "40px", background: "#6598F6" }}
                type="button"
                onClick={() => onClick()}
                id={id}
                disabled={disabled}
            ><span style={{ marginRight: "5px" }}>{icons}</span>
                    {message}
            </button>
        </>
    );
}


export default BtnAdd;
