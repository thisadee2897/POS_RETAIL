import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import React, { useState, useEffect } from "react";
import './Alert.css';

function AlertWarning({ isOpen, messages, openAlert, onAninationEnd, style }) {

    return (
        <>
           <div className={isOpen ? "alert-open" : "alert-close"} id="alert-warning" style={style}>
                <Alert  severity="warning"
                    isOpen={isOpen}
                    onClose={() => openAlert()}>
                    <AlertTitle>แจ้งเตือน</AlertTitle>
                    {messages}
                </Alert>
            </div>
        </>
    );
}

export default AlertWarning;