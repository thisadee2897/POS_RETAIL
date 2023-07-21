import { React, useState, useEffect, useContext } from "react";
import axios from 'axios';
import DataTable from '../../components/Datatable/Datatables';
import BtnEdit from "../../components/Button/BtnEdit";
import BtnDelete from "../../components/Button/BtnDelete";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertWarning from "../../components/Alert/AlertWarning";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css';
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import PromotionMaster from "./PromotionMaster";
import HeaderPage from "../../components/HeaderPage/HeaderPage";


const ProductSet = () => {
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId, setCompanyId] = useState(userData[0].master_company_id)
    const [branchId, setbranchId] = useState(BranchData[0].master_branch_id)
    const [dataMaster, setDataMaster] = useState([])
    const [valueFilter, setValueFilter] = useState("")
    const [openDialogPromotion, setOpenDialogPromotion] = useState(false)
    const [alertMessages, setAlertMessages] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [addValue, setAddValue] = useState(false)
    const [getDataMaster, setGetDataMaster] = useState(false)

    const onClickSaveDataPromotion = (data) => {
        if (data.promotion_hd_id) {
            let dataCancel = {
                "promotionHD_id": parseInt(data.promotion_hd_id),
                "cancel_emp_id": parseInt(userData[0].emp_employeemasterid)
            }
            axios.post(UrlApi() + 'cancel_promotion', dataCancel).then((res) => {
                if (res.data ) {
                    setAlertMessages("ยกเลิกโปรสำเร็จสำเร็จ")
                    setAlertSuccess(true)
                    setOpenDialogPromotion(false)
                    setGetDataMaster(true)
                }
            })
        } else {
            let dataAPI = data
            console.log(dataAPI,"dataADD")
             axios.post(UrlApi() + 'add_promotion_data', dataAPI).then((res) => {
                 if (res.data && res.data[0].fn_insert_promotion_data) {
                     setAlertMessages("เพิ่มข้อมูลสำเร็จ")
                     setAlertSuccess(true)
                     setOpenDialogPromotion(false)
                     setGetDataMaster(true)
                 }
             })
        }
    
    }


    const onChangeFilterTable = (e) => {

    }

    const onClickAddData = () => {
        setGetDataMaster(false)
        setAddValue(true)
        setOpenDialogPromotion(true)
    }

    const getAlert = () => {
        return (<><AlertSuccess isOpen={alertSuccess} openAlert={() => setAlertSuccess(false)} messages={alertMessages} />
          </>)
    }

    const getDialogPromotiomMaster = () => {
        return (
            <PromotionMaster
                addData={addValue}
                promotion_type_id={1}
                promotion_setting_id={1}
                product
                product_set
                pro_begin
                pro_end
                pro_every
                pro_discount
                discount_type
                discount_value
                item_flag
                width="1630px"
                getData={getDataMaster}
                open={openDialogPromotion}
                onClose={(e) => setOpenDialogPromotion(e)}
                onAdd={(e) => setAddValue(e)}
                onChangePromotion={ (e)=>onClickSaveDataPromotion(e)}
        />)
    }

    const columnExport =[]

    return (<>
        <HeaderPage
            onChange={(e) => onChangeFilterTable(e)}
            value={valueFilter}
            onClick={() => onClickAddData()}
            data={dataMaster}
            columns={columnExport}
        />
        {getAlert()}
        {getDialogPromotiomMaster()}

    </>)
}

export default ProductSet
