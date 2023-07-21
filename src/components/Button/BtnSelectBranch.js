import React from "react";
import './Button.css';

function BtnSelectBranch({ onClick, message, icon, style, id, disabled }) {
    return (
        <>
            <button
                style={style}
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

export default BtnSelectBranch