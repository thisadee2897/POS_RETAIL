import { Alert } from "reactstrap";
import React,{useState} from "react";
import './Alert.css';

function AlertError({isOpen, messages, openAlert, onAninationEnd}){
    return(
        <>
            <div className={isOpen ? "alert-open" : "alert-close"}>
                <Alert color="danger" isOpen={isOpen} toggle={()=>openAlert()}  onAnimationEnd={()=>onAninationEnd()}>{messages}</Alert>
            </div>
        </>
    );
}

export default AlertError;