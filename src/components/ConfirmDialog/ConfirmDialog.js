import React from "react";
import './ConfirmDialog.css';

function ConfirmDialog({massage, onCancel, onConfirm}){
    return (
        <div className="confirm-dialog">
            <button type="button" className="cancel" onClick={()=>onCancel()}>x</button>
                <h6>{massage}</h6>
                <div className="btn">
                    <button type="button" className="btn-cancel" onClick={()=>onCancel()}>ยกเลิก</button>
                    <button type="button" className="btn-confirm" onClick={()=>onConfirm()}>ยืนยัน</button>
                </div>
        </div>
    );
}

export default ConfirmDialog;