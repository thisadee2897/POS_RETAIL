import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from 'react-bootstrap/Card';

const SwitchstON = styled((props) => (

    < Switch style={{ marginTop: 2, marginLeft: 10, marginBottom:"0ox" }} focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 124,
    height: 28,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        left: 70,
        margin: 1,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: 'white',
            '& + .MuiSwitch-track': {
                backgroundColor: '#74E0C0',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 1,
            },
        },

    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 24,
        height: 24,
    },
    '& .MuiSwitch-track': {
        borderRadius: 24 / 2,
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 400,
        }),
    },
    "&:before, &:after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 16,
        height: 16
    },
    "&:before": {
        content: '"เปิดการใช้งาน"',
        color: "white",
        backgroundColor: '#74E0C0',
        width:100,
        fontSize: "14px",
        left: 12,
        top: 12,
    },


}));

const SwitchstOFF = styled((props) => (
    < Switch style={{ marginTop: 2 }}  focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 124,
    height: 28,
    padding: 0,

    '& .MuiSwitch-switchBase': {
        padding: 0,
        left: 6,
        top: 1,
        margin: 1,
        transitionDuration: '300ms',
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 24 / 2,
        opacity: 1,
        backgroundColor: "#CCCCCC",
        transition: theme.transitions.create(['background-color'], {
            duration: 800,
        }),
    },
    "&:before, &:after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 16,
        height: 16
    },
    "&:after": {
        content: '"ปิดการใช้งาน"',
        color: "black",
        fontSize: "14px",
        width: 100,
        left: 35,
        top: 10,
    },

}));
const Switchstatus = (props) => {
    const [status, setStatus] = useState(props.defaultChecked)

    useEffect(() => {
       // getSwich()
    }, [status])

    const onClickSwich = (e) => {
        props.onChange(e.target.checked)
        setStatus(e.target.checked)
    }

    const getSwich = () => {
        return (<FormGroup className={props.className ? props.className :  "switch_dialog"}>
            {status == true ?
                <FormControlLabel  
                    control={<SwitchstON sx={{ m: 2 }} defaultChecked={status} onClick={(e) => onClickSwich(e)} />}
                />: <FormControlLabel
                    control={<SwitchstOFF  sx={{ m: 2 }} defaultChecked={status} onClick={(e) => onClickSwich(e)} />}
                />
            }
        </FormGroup>)
    }

    return (<>
        {getSwich()}
    </>
    );
}

export default Switchstatus;