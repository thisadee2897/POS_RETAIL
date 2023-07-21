import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import InputText from "../../../components/Input/InputText";
import DataTable from '../../../components/Datatable/Datatables';
import BtnAdd from "../../../components/Button/BtnAdd";
import BtnCancel from "../../../components/Button/BtnCancel";
import Moment from 'moment';
import Card from 'react-bootstrap/Card';
import PathRouter from "../../../PathRouter/PathRouter";
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Radio, IconButton } from '@mui/material';
import * as AiIcons from 'react-icons/ai';
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import Swithstatus from "../../../components/SwitchStatus/Switchstatus"
import th from 'date-fns/locale/th';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import SearchDialog from "../../../components/SearchDialog/SearchDialog";
import HistoryIcon from '@mui/icons-material/History';
import DatePicker, { registerLocale } from "react-datepicker";
import DateRangeIcon from '@mui/icons-material/DateRange';
import Icon from '@mdi/react';
import { mdiAccountMultiplePlusOutline } from '@mdi/js';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { useLocation } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';


const DataDocument = (props) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const [dateDoc, setDateDoc] = useState(new Date());
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogSaleOrder, setOpenDialogSaleOrder] = useState(false)
    const [dataCustomer, setDataCustomer] = useState([])
    const [dataCustomerDefault, setDataCustomerDefault] = useState([])
    const [dataCheck, setDataCheck] = useState([])
    const [valueInput, setValueInput] = useState()
    const [dataSearch, setDataSearch] = useState([])
    const [dataSaleOrder, setDataSaleOrder] = useState([])
    const [remarks, setRemarks] = useState("")
    const [docCode, setDocCode] = useState("")
    const [searchText, setSearchText] = useState("")
    const dataAPI = {
        "company_id": parseInt(userData[0]['master_company_id']),
        "branch_id": BranchData[0].master_branch_id,
    }
    const columnsdata = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: false,
            width: '80px'
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
            width: '100px'
        },
        {
            name: 'สถานะการใช้งาน',
            selector: row => <><Swithstatus value={row.arcustomer_active} /></>,
            width: '150px',
        },
        {
            name: 'รหัสลูกค้า',
            selector: row => row.arcustomer_code,
            sortable: true,
        },
        {
            name: 'กลุ่มลูกค้า',
            selector: row => row.arcustomer_group_name,
            sortable: true,
        },
        {
            name: 'ประเภทสมาชิก',
            selector: row => row.master_member_type_name,
            sortable: true,
        },
        {
            name: 'เลขประจำตัวผู้เสียภาษี',
            selector: row => row.arcustomer_taxid,
            sortable: true,
        },
        {
            name: 'คำนำหน้า',
            selector: row => row.master_member_type_name,
            sortable: true,
        },
        {
            name: 'ชื่อ',
            selector: row => row.arcustomer_name,
            sortable: true,
            width: '350px',
        },
        {
            name: 'ชื่อภาษาอังกฤษ',
            selector: row => row.arcustomer_name_eng,
            sortable: true,
        },
        {
            name: 'จำนวนวันเครดิต',
            selector: row => row.arcustomer_creditday,
            sortable: true,
        },
        {
            name: 'ประเภทบุคคล',
            selector: row => row.master_person_type_name,
            sortable: true,
        },
        {
            name: 'ประเภทใน/ต่างประเทศ',
            selector: row => row.master_person_country_type_name,
            sortable: true,
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
        },
        {
            name: 'แฟกซ์',
            selector: row => row.arcustomer_addr_fax,
            sortable: true,
        },
    ]

    useEffect(() => {
        getDataCustomerDefault()
        getDataCustomer()
        getDataSaleOrder()
    }, [])

    useEffect(() => {
        if (props.flagPayment) {
            getDoccode()
        }
    }, [props.flagPayment])

    useEffect(() => {
        if (dataCustomerDefault.length > 0) {
            getDataCustomer()
        }
    }, [dataCustomerDefault])

    useEffect(() => {
        if (dateDoc) {
            props.onChangeDatedoc(dateDoc)
        }
    }, [dateDoc])

    useEffect(() => {
        if (dataCheck.length > 0)
            props.onChangecustomers(dataCheck)
    }, [dataCheck])

    useEffect(() => {
        props.onChangeRemark(remarks)
        props.onChangeDoccode(docCode)
    }, [remarks, docCode])

    useEffect(() => {
        getDoccode()
    }, [dateDoc])

    useEffect(() => {
        if (props.clearDatavalue == true) {
            ClearData()
        }
    }, [props.clearDatavalue])

    useEffect(() => {
        setDateDoc(props.startDate)
    }, [props.startDate])

    useEffect(() => {
        props.onChangeDatedoc(dateDoc)
    }, [dateDoc])

    useEffect(() => {
        getCustomeName()
        getDialogCustomer()
    }, [dataCheck])

    useEffect(() => {
        getDataCustomer()
    }, [searchText])

    const getDoccode = () => {
        let datas = {
            "company_id": parseInt(userCompanyID),
            "branch_id": parseInt(BranchData[0].master_branch_id),
            "doc_type": props.flagPayment == true ? 8 : 9,
            "doc_date": Moment(props.startDate).format("YYYYMMDD"),
        }
        axios.post(UrlApi() + 'get_document_code', datas)
            .then(res => {
                if (res.data) {
                    setDocCode(res.data[0]['fn_generate_salehd_docuno'])
                }
            })
    }

    const getDataCustomerDefault = () => {
        axios.post(UrlApi() + 'getdata_customer_default', dataAPI)
            .then(res => {
                if (res.data) {
                    setDataCustomerDefault(res.data)
                    res.data.map((item, idx) => {
                        item.arcustomer_addrs = item.arcustomer_addr ? item.arcustomer_addr : ""
                        item.master_addr_district_names = item.master_addr_district_name ? item.master_addr_district_name : ""
                        item.master_addr_prefecture_names = item.master_addr_prefecture_name ? item.master_addr_prefecture_name : ""
                        item.master_addr_province_names = item.master_addr_province_name ? item.master_addr_province_name : ""
                        item.master_addr_postcode_codes = item.master_addr_postcode_code ? item.master_addr_postcode_code : ""
                        item.address_name = item.arcustomer_addrs + "" + item.master_addr_district_names + "" +
                            item.master_addr_prefecture_names + "" + item.master_addr_province_names + "" +
                            item.master_addr_postcode_codes
                        item.name = item.arcustomer_name
                    })
                    setDataCheck(res.data)
                    props.onChangecustomers(res.data)
                }
            })
    }

    const getDataCustomer = () => {
        dataAPI.filter_text = searchText
        axios.post(UrlApi() + 'filter_customer_data', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.name = item.arcustomer_name
                        item.row_num = idx + 1
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

    const getDataSaleOrder = () => {
        /*axios.post(UrlApi() + 'get_orderhd_data', dataAPI)
            .then(res => {
                setDataSaleOrder(res.data)
            })*/
    }

    const ClearData = () => {
        setDataCheck(dataCustomerDefault)
        getDataCustomerDefault()
        setRemarks("")
        getDoccode()
    }

    const OnchangeCheckCustomer = (e, row) => {
        dataCustomer.map((item, idx) => { item.defalutcus_active = false })
        if (e.target.value) {
            setDataCheck([row])
        }
        getCustomeName()
        setOpenDialog(false)
        props.onChangecustomers(dataCheck)
    }

    const getdefaultCheck = () => {
        if (dataCheck.length > 0 && dataCustomer.length > 0) {
            let Checks = _.findIndex(dataCustomer, { arcustomer_id: dataCheck[0]['arcustomer_id'].toString() })
            if (Checks >= 0) {
                dataCustomer[Checks]['defalutcus_active'] = true
            }
            setDataCustomer(dataCustomer)
        }
    }

    const OpenDialog = () => {
        getdefaultCheck()
        // setDataCheck([])
        setOpenDialog(true)
    }

    const onClickcancle = () => {
        setOpenDialog(false)
    }

    const onClickSaleTransection = () => {
        if (props.flagPayment == true) {
            window.open(`${PathRouter()}/main/document/salehd`)
        } else {
            window.open(`${PathRouter()}/main/document/sale-credit`)
        }
    }

    const cusInput = () => {
        return (<i className="icon_date">
            <DateRangeIcon style={{ fontSize: "25px", color: "white", position: "center", marginLeft: "10px" }} /></i>
        )
    }

    const filterComp = () => {
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

    const getDialogCustomer = () => {
        return <Dialog open={openDialog} maxWidth="600px" >
            <DialogTitle >
                <p>ข้อมูลลูกค้า</p>
            </DialogTitle>
            <DialogContent dividers='paper'>
                <button type="button" className="cancel" onClick={() => setOpenDialog(!openDialog)}>x</button>
                {filterComp()}
                {/*getSearchInput()*/}
                <div style={{ marginTop: "1%" }}>
                    <DataTable
                        columns={columnsdata}
                        data={dataCustomer}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <BtnCancel onClick={() => { onClickcancle() }} message="ปิด" />
            </DialogActions>
        </Dialog>
    }
    const location = useLocation();
    const path = location.pathname;
    const getCustomeName = () => {
        let dateDocs = Moment(dateDoc).format('DD/MM/') + (parseInt(dateDoc.getFullYear()) + 543)
        return (
            <Card className="card_sale" style={{ maxHeight: "24vh", minHeight: "20vh", fontSize: "16px" }}>
                <div className="card_head" >
                    <div class="row">
                        <div class="col-9">
                            {path === "/main/sale-credit" && (
                                <p className="textH_Left">ข้อมูลเอกสาร - ขายเชื่อ</p>
                            )}
                            {path === "/main/sale" && (
                                <p className="textH_Left">ข้อมูลเอกสาร - การขาย</p>
                            )}
                        </div>
                        {/* <div class="col">
                            <BtnAdd message="ประวัติการขาย" style={{ width: "100%", height: "40px", background: "#6598F6"}}
                                onClick={() => onClickSaleTransection()} icons={<HistoryIcon />} />
                        </div> */}
                    </div>
                </div>
                <Card.Body className="card_body_doc" style={{ marginTop: "8px" }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                        <div class="row">
                            <div class="col-2">
                                <p className="text_sale">วันที่เอกสาร</p>
                                <InputText type="text" style={{ height: "3vh", width: "156%" }} value={dateDocs} />
                            </div>
                            <div class="col-1" >
                                <DatePicker
                                    locale="th"
                                    dateFormat="dd/MM/yyyy"
                                    customInput={cusInput()}
                                    selected={dateDoc}
                                    onChange={(date) => setDateDoc(date)}
                                />
                            </div>
                            <div class="col-3"  >
                                <p className="text_sale">เลขที่เอกสาร</p>
                                <InputText style={{ height: "3vh" }} type="text" value={docCode} disabled />
                            </div>
                            <div class="col-2">
                                <p className="text_sale">เลขที่เอกสารใบสั่งขาย</p>
                                <InputText type="text" style={{ height: "3vh", width: "150%" }} disabled />
                            </div>
                            <div class="col-1">
                                <BtnAdd 
                                    style={{ 
                                            marginLeft: "3%", 
                                            width: "4%", 
                                            height: "3.2vh", 
                                            marginTop: "26px", 
                                            position: "absolute", 
                                            background: props.dataOrderDetail.length > 0 && props.saleOrderSelect.length === 0 ? "gray" : "#74E0C0" 
                                        }}
                                    icons={<ZoomInIcon />}
                                    disabled={props.dataOrderDetail.length > 0 && props.saleOrderSelect.length === 0 ? true : false}
                                    onClick={()=>{
                                        props.setOpenDialogSaleOrder(true);
                                    }}
                                />
                            </div>
                            <div class="col-2" >
                                <p className="text_sale">กลุ่มลูกค้า</p>
                                {dataCheck.length > 0 ?
                                    <InputText type="text" style={{ width: "135%", height: "3vh" }}
                                        value={dataCheck[0]['name']} disabled />
                                    : <InputText style={{ width: "90%", height: "2vh" }} />
                                }
                            </div>
                            <div class="col-1">
                                <BtnAdd style={{ marginLeft: "3%", width: "4%", height: "3.2vh", marginTop: "26px", position: "absolute", background: "#74E0C0" }}
                                    onClick={() => { OpenDialog() }}
                                    icons={<GroupsIcon />} />
                            </div>
                            <div class="col-3">
                                <p className="text_sale" >ผู้บันทึก</p>
                                <InputText style={{ height: "3vh" }} type="text" value={userData[0]['user_name'] + ':' + userData[0]['firstname'] + ' ' + userData[0]['lastname']} disabled />
                            </div>
                            <div class="col-3">
                                <p className="text_sale">รายละเอียดกลุ่มลูกค้า</p>
                                {dataCheck.length > 0 ?
                                    <InputText type="text" style={{ height: "3vh" }}
                                        value={dataCheck[0]['address_name'] ? dataCheck[0]['address_name']
                                            : ''} disabled /> : <InputText style={{ height: "3vh" }} disabled />
                                }
                            </div>
                            <div class="col-3">
                                <p className="text_sale">หมายเหตุเอกสาร </p>
                                <InputText type="text" style={{ height: "3vh" }} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                            </div>
                        </div>
                    </LocalizationProvider>
                </Card.Body>
            </Card>)
    }

    return (<>
        {getCustomeName()}
        {getDialogCustomer()}
    </>
    )

}

export default memo(DataDocument);
