import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BtnCloseDialog = ({ onClick}) => {
    return (<>
        <IconButton
            aria-label="close"
            onClick={onClick}
            sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
            }}
        >
            <CloseIcon />
        </IconButton>
        
        </>)
}

export default BtnCloseDialog;
