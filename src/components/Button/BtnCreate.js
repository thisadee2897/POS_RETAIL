import { React, useEffect, useContext } from "react";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import Icon from '@mdi/react';
import { mdiNotePlusOutline } from '@mdi/js';

function BtnCreate({ onClick, message, icons, style, id, disabled }) {
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
                            className="btn-create"
                            style={style ? style : { width: "100px", height: "40px" }}
                            type="button"
                            onClick={() => onClick()}
                            id={id}
                            disabled={disabled}
                        ><span style={{ marginRight: "5px" }}><Icon path={mdiNotePlusOutline} size={1} /></span>
                            สร้าง
                        </button>
                        : <></>
                    : <></>
            }</>)
    }
    return (
        <>
            {/*getBtn()*/}
            <button variant="contained"
                className="btn-create"
                style={style ? style : { paddingRight:"10px",  width: "100px", height: "40px", background: "#74E0C0" }}
                type="button"
                onClick={() => onClick()}
                id={id}
                disabled={disabled}
            ><span style={{ marginRight: "5px" }}><Icon path={mdiNotePlusOutline} size={1} /></span>
                สร้าง
            </button>
        </>
    );
}


export default BtnCreate;
