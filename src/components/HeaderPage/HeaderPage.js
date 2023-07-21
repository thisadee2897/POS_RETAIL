import BtnCreate from "../Button/BtnCreate";
import Exportexcel from "../ExportExcel/Exportexcel";
import FilterDataTable from "../SearchDataTable/FilterDataTable";
import { React, useState, useEffect, useContext, useMemo, memo } from "react";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import Card from 'react-bootstrap/Card';


function HeaderPage(props) {
    const actions = useContext(DataContextMenuActions);
    const [reportName, setReportName] = useState("")

    useEffect(() => {
        if (actions) {
            getReportName()
        }
    }, [actions])


    useEffect(() => {
        getExportExcell()
    }, [reportName, actions, props.data])


    const getReportName = () => {
        let name = actions.length > 0 ? actions[0]['menuName'] : ""
        setReportName(name)
    }

    const getExportExcell = () => {
        return <Exportexcel data={props.data} header={reportName} filename={reportName + '.csv'} 
        />
    }

    return (
        <>
            <div className="card_head" style={{ marginLeft: "1%", marginRight: "1%", marginTop: "10px" }}>
                <p style={{ color: "#2F3A9E", marginTop: "5px" }}>{actions.length > 0 && actions[0]['datamenu'].length > 0 ?
                    actions[0]['datamenu'][0]['master_form_module_name'] + ' / ' + reportName : reportName}</p>
            </div>
            <Card style={{
                height: "60px",width:"100%", backgroundColor: "#F2F2F2", borderRadius: "10px", borderColor: "white",
                marginBottom: "0px", marginLeft: "5px", marginRight: "5px", marginTop: "10px", whiteSpace: "nowrap"
            }}>
               <div className="d-flex justify-content-between align-items-center" style={{ marginLeft: "10px", marginTop: "5px", whiteSpace: "nowrap" }}>
                    <div className="d-flex align-items-center" style={{ display: "flex", marginLeft: "5px", whiteSpace: "nowrap"}}>
                        {props.flagMasterCreate == false ? <></> :
                            <BtnCreate onClick={() => props.onClick()} />
                        }
                        <FilterDataTable
                            header
                            value={props.value}
                            onChange={(e) => props.onChange(e)}
                            placeholder="ค้นหา"
                        />
                    </div>
                    {getExportExcell()}
                   
                </div>
            </Card>
        </>
    );
}

export default HeaderPage;