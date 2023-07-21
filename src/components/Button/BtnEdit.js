import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import * as AiIcons from 'react-icons/ai';
import './Button.css';
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Icon from '@mdi/react';
import { mdiPencilPlusOutline } from '@mdi/js'


function BtnEdit({ onClick, style }) {
    const actions = useContext(DataContextMenuActions);

    useEffect(() => {
        getBtn()
    }, [actions])

    const getBtn = () => {
        return (<>
            {
                actions != undefined && actions.length > 0 ?
                    actions[0][2] == true ?
                        <button style={style} type="button" onClick={() => onClick()} className="btn-edit">{<AiIcons.AiFillEdit />}</button>
                        : <></>
                    : <></>
            }</>)

    }
    return (
        <span>
            {/*getBtn()*/}
            <IconButton color="primary" aria-label="upload picture" component="label"  onClick={() => onClick()}>
                <Icon path={mdiPencilPlusOutline} size={1} style={{ color:"#666666"}}/>
            </IconButton>
        </span>
    );
}

export default BtnEdit;

