import React,{useState, useEffect, useRef} from "react";
import './Input.css';
import Switch from "react-switch";

function InputSwitch({ statusCheck, onChange, id, styleText, style, disabled, className}){
    return (
        <>
            <div className={className ? className : "switch"} style={style}>
                <span>{<Switch
                        disabled={disabled}
                        onChange={(e)=>onChange(e)} 
                        checked={statusCheck} 
                        id={id}
                        />
                      }
                </span>
                <label style={styleText} className="show-status">{statusCheck ? "เปิด" : "ปิด"}</label>
                
                
           </div>
        </>

    );
}

export default InputSwitch;