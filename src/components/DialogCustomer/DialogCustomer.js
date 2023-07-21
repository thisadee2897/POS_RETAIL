import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import DataTable from '../../components/Datatable/Datatables';
import { Collapse, FilledInput, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio } from '@mui/material';
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import DataContext from "../../DataContext/DataContext";
import UrlApi from "../../url_api/UrlApi";
import BtnAdd from "../../components/Button/BtnAdd";
import _ from "lodash";
import FilterDataTable from "../../components/SearchDataTable/FilterDataTable";
import BtnCancel from "../../components/Button/BtnCancel";
import Btnsubmit from "../Button/BtnSubmit";
import BtnConfirm from "../../components/Button/BtnConfirm";
import SearchDialog from "../../components/SearchDialog/SearchDialog";
import Swithstatus from "../../components/SwitchStatus/Switchstatus"

const DialogCustomer = ({ openDialog, onClick, onClose, datadefault }) => {
    const userData = useContext(DataContext)
    const [searchText, setSearchText] = useState("")
    const [dataCustomerDefault, setDataCustomerDefault] = useState([])
    const [dataCustomer, setDataCustomer] = useState([])
    const [dataSearch, setDataSearch] = useState([])
    const  dataAPI = {
        "company_id": parseInt(userData[0]['master_company_id']),
    }

    useEffect(() => {
        getDataCustomer()
        getDataCustomerDefault()
    }, [])

    useEffect(() => {
        getDataDefault()
    }, [datadefault])

    const columnsdataCustomer = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '60px'
        },
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}>< FormControlLabel style={{ color: "black" }}
                control={
                    <Radio defaultValue={row.defalutcus_active} checked={row.defalutcus_active}
                        disabled={!row.arcustomer_active}
                        value={row.arcustomer_id}
                        onClick={(e) => { OnchangeCheckCustomer(e, row) }}
                    />} /> </div>
            ,
            sortable: true,
            width: '80px'
        },
        {
            name: 'สถานะ',
            selector: row => <><Swithstatus value={row.arcustomer_active} /></>,
            width: '150px',
        },
        {
            name: 'รหัสลูกค้า',
            selector: row => row.arcustomer_code,
            sortable: true,
            width: '150px'
        },
        {
            name: 'กลุ่มลูกค้า',
            selector: row => row.arcustomer_group_name,
            sortable: true,
            width: '150px'
        },
        {
            name: 'ประเภทสมาชิก',
            selector: row => row.master_member_type_name,
            sortable: true,
            width: '150px'
        },
        {
            name: 'เลขประจำตัวผู้เสียภาษี',
            selector: row => row.arcustomer_taxid,
            sortable: true,
            width: '200px'
        },
        {
            name: 'คำนำหน้า',
            selector: row => row.master_member_type_name,
            sortable: true,
            width: '150px'
        },
        {
            name: 'ชื่อ (TH)',
            selector: row => row.arcustomer_name,
            sortable: true,
            width: '150px'
        },
        {
            name: 'ชื่อ (ENG)',
            selector: row => row.arcustomer_name_eng,
            sortable: true,
            width: '200px'
        },
        {
            name: 'วันเครดิต',
            selector: row => row.arcustomer_creditday,
            sortable: true,
            width: '150px'
        },
        {
            name: 'ประเภทบุคคล',
            selector: row => row.master_person_type_name,
            sortable: true,
            width: '150px'
        },
        {
            name: 'ประเภทใน/ต่างประเทศ',
            selector: row => row.master_person_country_type_name,
            sortable: true,
            width: '300px'
        },
        {
            name: 'ที่อยู่',
            selector: row => row.address_name,
            sortable: true,
            width: '350px',
        },
        {
            name: 'เบอร์โทรศัพท์',
            selector: row => row.arcustomer_addr_tel,
            sortable: true,
             width: '150px'
        },
    ]

    const getDataCustomerDefault = () => {
        axios.post(UrlApi() + 'getdata_customer_default', dataAPI)
            .then(res => {
                if (res.data.length > 0) {
                    res.data.map((item, idx) => {
                        item.arcustomer_addrs = item.arcustomer_addr ? item.arcustomer_addr : ''
                        item.master_addr_district_names = item.master_addr_district_name ? item.master_addr_district_name : ''
                        item.master_addr_prefecture_names = item.master_addr_prefecture_name ? item.master_addr_prefecture_name : ''
                        item.master_addr_province_names = item.master_addr_province_name ? item.master_addr_province_name : ''
                        item.master_addr_postcode_codes = item.master_addr_postcode_code ? item.master_addr_postcode_code : ''
                        item.address_name = item.arcustomer_addrs + ' ' + item.master_addr_district_names + ' ' +
                            item.master_addr_prefecture_names + ' ' + item.master_addr_province_names + '' +
                            item.master_addr_postcode_codes
                    })
                    onClick(res.data)
                    setDataCustomerDefault(res.data)
                }
            })
    }

    const getDataCustomer = () => {
        dataAPI.filter_text =  searchText
        axios.post(UrlApi() + 'filter_customer_data', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.arcustomer_addrs = item.arcustomer_addr ? item.arcustomer_addr : ''
                        item.master_addr_district_names = item.master_addr_district_name ? item.master_addr_district_name : ''
                        item.master_addr_prefecture_names = item.master_addr_prefecture_name ? item.master_addr_prefecture_name : ''
                        item.master_addr_province_names = item.master_addr_province_name ? item.master_addr_province_name : ''
                        item.master_addr_postcode_codes = item.master_addr_postcode_code ? item.master_addr_postcode_code : ''
                        item.address_name = item.arcustomer_addrs + ' ' + item.master_addr_district_names + ' ' +
                            item.master_addr_prefecture_names + ' ' + item.master_addr_province_names + '' +
                            item.master_addr_postcode_codes
                        item.defalutcus_active =
                            dataCustomerDefault.length > 0 ?
                                dataCustomerDefault[0]['arcustomer_id'] == item.arcustomer_id ? true : false
                                : false
                    })
                    setDataCustomer(res.data)
                    setDataSearch(res.data)
                }
            })
    }

    const OnchangeCheckCustomer = (e, row) => {
        onClick([row])
        onClose(false)
    }

    const getDataDefault = () => {
        if (datadefault.length > 0) {
            dataCustomer.map((item, idx) => {
                item.defalutcus_active =datadefault.length > 0 ? datadefault[0].arcustomer_id == item.arcustomer_id ? true : false  : false
            })
        }
    }

    const getfilterCustomer = () => {
        return (
            <SearchDialog
                open={true}
                searchText={searchText}
                onChangeSearchText={(e) => { setSearchText(e) }}
                title={'ค้นหา'}
                subTitle={'รหัสลูกค้า / เลขประจำตัวผู้เสียภาษี / ชื่อ - สกุล / เบอร์โทรศัพท์ / กลุ่มลูกค้า'}
            />
        )
    }

    const getDialog = () => {
        return (<Dialog open={openDialog} maxWidth="600px" >
            <DialogTitle > <p>ข้อมูลลูกค้า</p>   </DialogTitle>
            <DialogContent dividers='paper'>
                <button type="button" className="cancel" onClick={() => onClose(false)}>x</button>
                {getfilterCustomer()}
                <div style={{ marginTop: "1%" }}>
                    <DataTable
                        columns={columnsdataCustomer}
                        data={dataCustomer}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => { onClose(false) }} />
            </DialogActions>
        </Dialog>)

    }

    return (<>{getDialog()}</>)
}

export default memo(DialogCustomer);