import { Alert } from "reactstrap";
import React,{useEffect, useState} from "react";
import './Alert.css';
import $ from 'jquery';

function AlertSuccess({ isOpen, messages, openAlert, style }) {

    useEffect(() => {
        if (isOpen == true) {
            setTimeout(() => {
                isOpen = false
                getAlert()
            }, 1500);
        }
    }, [isOpen])

    const getAlert = () => {
        return (
            <div className={isOpen == true? "alert-open" : "alert-close"} style={style} id={"alert-success"}>
                <Alert color="success" isOpen={isOpen} toggle={() => openAlert(isOpen)}  >
                    {messages}</Alert>
            </div>
            )
    }
    return (
        <>
           {getAlert()}
        </>
    );
}

export default AlertSuccess;