import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useEffect } from 'react';
import './SelectAutocomplete.css';


function SelectAutocomplete({ options, onChange, style, values, onInputChange }) {
    return (
        <>
            <Autocomplete
                onChange={(event, newValue)=>{
                    options.map((item, index)=>{
                        if (item.value === newValue) {
                            onChange(item.id, newValue)

                        }
                    })
                }}
                onInputChange={(event, newInputValue)=>onInputChange(event, newInputValue)}
                value={values}
                noOptionsText="ไม่พบข้อมูล"
                options={options.map((option) => option.value)}
                renderInput={(params) =><TextField
                                            {...params} 
                                            label="--เลือก--" 
                                            size="small" 
                                            InputLabelProps={{style: {fontFamily: 'Kanit'}}}
                                        />
                            }
                style={style}
            />
        </>
    );
}

export default SelectAutocomplete;