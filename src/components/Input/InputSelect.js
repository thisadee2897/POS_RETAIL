import { React, useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function InputSelect({ option, onChange, id, id_key, value, disabled, value_key, style, defaultValue, className }) {
    const dataoptions = option;
    return (
        <>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <select
                        className="input-select"
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