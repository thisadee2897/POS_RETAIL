import MaskedInput from "react-text-mask";
import './InputTime.css'

function InputTime({label, value, onChange, disabled, style}){
    return (
        <>
            <MaskedInput
                style={style}
                className="input-time"
                disabled={disabled}
                onChange={onChange}
                value={value}                                                                                                                     
                mask={[
                    /[0-5]/,
                    /\d/,    
                    ":",
                    /[0-5]/,
                    /\d/,                                         
                ]}
                placeholder="ชั่วโมง : นาที"
            />
        </>
    );
}

export default InputTime;