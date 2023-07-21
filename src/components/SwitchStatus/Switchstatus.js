import * as React from 'react';
import Chip from '@mui/material/Chip';



const Switchstatus = (props) => {
    const active = { backgroundColor: "#74E0C0 ", color: "white", borderRadius: "10px",height:"28px",width:"160px" }
    const disible = { backgroundColor: "#7C7D93", color: "white", borderRadius: "10px", height: "28px", width: "160px" }
    const cancle = { backgroundColor: "#FEAE5F", color: "white", borderRadius: "10px", height: "28px", width: "160px" }
    const disible_black = { backgroundColor: "#333333", color: "white", borderRadius: "10px", height: "28px", width: "160px" }
    return (<>
        {props.value == true ?
            <Chip style={ active } label="เปิดการใช้งาน"/>
            : props.value == false ? 
                <Chip style={disible} label="ปิดการใช้งาน" />:
        props.type == "success" ? <>
                    <Chip style={active} label={props.message} />
        </>
          : props.type == "cancle" ?
                        <Chip style={cancle} label={props.message} />
                        : props.type == "close" ? <>
                            <Chip style={disible} label={props.message} />
                        </> : props.type == "disible_black" ? <>
                            <Chip style={disible_black} label={props.message} />
                        </> :
                        
                    <></>}
        </>
    );
}

export default Switchstatus;