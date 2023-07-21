import React from "react";
import './Button.css';
import { Button } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function BtnCancel({ onClick, type, style }) {
    return (
        <span>
            <button 
                className="btn-add"
                style={{ width: "100%", height: "40px", background: "#FEAE5F" }}
                onClick={() => onClick()}
                className="btn-cancels"
            ><span style={{ marginRight: "5px" }}><DisabledByDefaultIcon style={{ marginRight: "5px" }} />ปิด</span>
            </button>
        </span>
    );
}

export default BtnCancel;