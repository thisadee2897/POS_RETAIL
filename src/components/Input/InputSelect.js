import { React, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

function InputSelect({ option, onChange, id, id_key, value, disabled, value_key, style, defaultValue, className }) {
    const dataoptions = option;
    const [hasSelectedValue, setHasSelectedValue] = useState(false);

    useEffect(() => {
        if (value !== undefined || defaultValue !== undefined) {
            setHasSelectedValue(true);
        } else {
            setHasSelectedValue(false);
        }
    }, [value, defaultValue]);

    return (
        <>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <select
                        className={`input-select ${!hasSelectedValue ? "input-select-gray" : ""}`} // เพิ่มคลาส CSS เมื่อไม่มีค่าที่ถูกเลือก
                        label={false}
                        style={style}
                        size="small"
                        defaultValue={defaultValue}
                        onChange={(e) => onChange(e)}
                        id={id_key ? id_key : id}
                        disabled={disabled}>
                        <option
                            className="input-select"
                            key={0}
                            value={""}
                            selected={""}
                        >---เลือก---</option>
                        {
                            dataoptions.map((item, index) => {
                                return <option className="input-select"
                                    value={item[id_key]}
                                    key={index}
                                    selected={item[id_key] == value || item[id_key] == defaultValue ? "selected" : ""}>
                                    {item[value_key]}</option>
                            })
                        }
                    </select>
                </FormControl>
            </Box>
        </>
    );
}

export default InputSelect;
