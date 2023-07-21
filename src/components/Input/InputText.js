import React from "react";
import './Input.css';

function InputText({ type, disabled, placeholder, value, id, onChange, required, maxLength,
    min, style, name, defaultValue, className, onKeyDown, onKeyPress }) {
    
    return (
        <>
            <input className={className ? className : `input-text`}
                onKeyPress={onKeyPress}
                   onKeyDown={onKeyDown}
                   type={type}  
                   disabled={disabled} 
                   placeholder={placeholder}
                   value={value}
                   defaultValue={defaultValue}
                   onChange={(e)=>onChange(e)}
                   required={required}
                   maxLength={maxLength}
                   min={type === "number" ? "0" : ""}
                   style={style}
                   id={id}
                   name={name}
            />
        </>
    );
}

export default InputText;