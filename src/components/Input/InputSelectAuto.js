import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { useEffect } from 'react';

function InputSelectAuto({ option, onChange, id_key, value, disabled, value_key, style, defaultValue, className }) {
    const [valueSelect, setValueSelect] = useState({})
    const [valueDefalut, setValueDefault] = useState({})

    useEffect(() => {
        setValueDefault({ [value_key]: "--เลือก--" })
    }, [value_key])

    const onChangeAutoComplete = (e, values) => {
        if (values) {
            setValueSelect(values)
            onChange(values)
        } else {
            setValueDefault({ [value_key]: "--เลือก--" })
        }
    }

    return (
        <>
            <Autocomplete
                style={{ background: "white", borderColor: "white", borderRadius: "10px", width: "100%" }}
                size="small"
                onChange={(e, values) => onChangeAutoComplete(e, values)}
                id={id_key}
                value={valueSelect[value_key] ? valueSelect : defaultValue[value_key] ? defaultValue : valueDefalut }
                getOptionLabel={(option) => option[value_key]}
                sx={{ width: 300 }}
                options={option}
                sx={{ width: 300 }}
                label={ false}
                renderInput={(params) =>
                    <TextField size="small" style={style} label={false} {...params} />}
            />
        </>
    );
}

export default InputSelectAuto;