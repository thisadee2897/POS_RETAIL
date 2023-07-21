import React, { useEffect, memo, useState, useContext } from 'react';
import { Badge } from 'react-bootstrap';
import Chip from '@mui/material/Chip';
import DataContextBranchData from "../../DataContext/DataContextBranchData";

const BadgeComponents = (props) => {
    const BranchData = useContext(DataContextBranchData);
    const [datas, setDatas] = useState(props.databadge)

    useEffect(() => {
        getDatabadge()
    },[props])

    const getDatabadge = () => {
        let datas = props.databadge;
        if (datas) {
            return datas.map((item, idx) => {
                return (<>
                    
                    {' '}<Chip style={{ fontFamily: "Kanit", fontSize: "0.7vw" }}
                        label={item.label} size="small" variant="outlined" />
                    {' '}
                </>
                )
            })
        } 
    }

    return (<div>
        {getDatabadge()}
     
    </div>
    )
}

export default (BadgeComponents);