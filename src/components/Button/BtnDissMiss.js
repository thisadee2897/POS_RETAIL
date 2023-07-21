import React from "react";
import './Button.css';

function BtnDissMiss({ onClick, message, icon, style, id, disabled }) {
    return (
        <>
            <button
                style={{ background: "#b80000" }}
                type="button"
                onClick={() => onClick()}
                id={id}
                className="btn-add"
                disabled={disabled}>
                {icon} {message}
            </button>
        </>
    );
}


export default BtnDissMiss;
