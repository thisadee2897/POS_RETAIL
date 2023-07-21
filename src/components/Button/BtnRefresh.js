import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import './Button.css';
import Icon from '@mdi/react';
import { mdiRefresh } from '@mdi/js';

function BtnRefresh({ onClick, message, icons, style, id, disabled }) {
    return (
        <>
            <button
                style={style}
                type="button"
                onClick={() => onClick()}
                id={id}
                className="btn-add"
                disabled={disabled}>
                <Icon path={mdiRefresh} size={1} style={{ marginRight: "10px" }}/> รีเฟรช
            </button>
        </>
    );
}


export default BtnRefresh;
