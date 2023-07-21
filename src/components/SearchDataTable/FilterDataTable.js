import React from "react";
import InputText from "../Input/InputText"
import SearchIcon from "@mui/icons-material/Search";
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';


function FilterDataTable({ placeholder, value, onChange, style, onKeyPress, defaultValue, onClear, header }) {
    return (<div class="row" style={{ marginLeft:"5px", display: "flex", width: "350px", whitespace: "nowrap" }}>
        <InputText
            style={{ width: "300px" }}
            type="text"
            value={value}
            onChange={(e) => onChange(e)}
            onKeyPress={(e) => onKeyPress(e)}
            placeholder="ค้นหา"
        />
        <IconButton style={{
            background: "#6598F6", color: "white", height: "40px", marginLeft: "-40px",
            borderRadius: "10px", textAlign: "center", width: "50px"
        }} >
            <SearchIcon style={{ fontSize: "26px", }} />
        </IconButton>
    </div>);
}

export default FilterDataTable;