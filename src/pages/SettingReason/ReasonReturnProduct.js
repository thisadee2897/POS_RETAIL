import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import InputText from "../../components/Input/InputText";
import DataTable from '../../components/Datatable/Datatables';
import BtnAdd from "../../components/Button/BtnAdd";
import BtnEdit from "../../components/Button/BtnEdit";
import Moment from 'moment';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AlertError from "../../components/Alert/AlertError";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertWarning from "../../components/Alert/AlertWarning";
import Loading from "../../components/Loading/Loading";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import * as SiIcons from 'react-icons/si';
import '../../components/CSS/report.css';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import ReasonMaster from './ReasonMaster'


const ReasonReturnProduct = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const [dataReason, setDataReason] = useState([])
    const [dataEdit, setDataEdit] = useState({})
    const [dataAdd, setDataAdd] = useState({})
    const [openDialog, setOpenDialog] = useState(false)
    const columnsdata = ['ลำดับ', 'เหตุผลการคืนสินค้า', 'สถานะการใช้งาน','เปิด']

    useEffect(() => {
        getDataReasonAll()
    }, [])

    useEffect(() => {
        if (dataAdd.name != undefined) {
            AddDataReason()
        }
    }, [dataAdd])

    useEffect(() => {
        if (dataEdit.returnproducthd_reason_id != undefined) {
            EditDataReason()
        }
    }, [dataEdit])

    useEffect(() => {
        getReasonMaster()
    }, [dataReason])

    const colName = ["เหตุผล", "สาถนะการใช้งาน"]

    const getDataReasonAll = () => {
        let dataAPI = {
            "company_id": parseInt(userCompanyID),
        }
        axios.post(UrlApi() + 'get_returnproducthd_reason_all', dataAPI)
            .then(res => {
                if (res.data) {
                    setDataReason([])
                    res.data.map((item, idx) => {
                        item.row_num  = idx +1
                        item.name = item.returnproducthd_reason_name
                        item.status = item.returnproducthd_reason_active
                        item.status_name = item.returnproducthd_reason_active == true ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน'
                    })
                    setDataReason(res.data)
                }
            })
    }

    const AddDataReason = () => {
        let dataAPI = {
            'name': dataAdd.name,
            'status': dataAdd.status,
            "company_id": parseInt(userCompanyID),
        }
        axios.post(UrlApi() + 'add_returnproducthd_reason', dataAPI)
            .then(res => {
                if (res.data) {
                    getDataReasonAll()
                }
            })
    }

    const EditDataReason = () => {
        let dataAPI = {
            'id':dataEdit.returnproducthd_reason_id,
            'name': dataEdit.name,
            'status': dataEdit.status,
        }
        axios.post(UrlApi() + 'update_returnproducthd_reason', dataAPI)
            .then(res => {
                if (res.data) {
                    getDataReasonAll()
                }
            })
    }

    const getReasonMaster = () => {
        return (<ReasonMaster dataReason={dataReason} colName={colName} columnsdata={columnsdata}
            onChangeDataAdd={(e) => setDataAdd(e)} onChangeDataEdit={(e) => setDataEdit(e)} />)
    }

    return (<>
        { getReasonMaster()}

    </>)
}
export default memo(ReasonReturnProduct);