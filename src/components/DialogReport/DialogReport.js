import React, { useState, useContext } from "react";
import { useEffect } from "react";
import Select from 'react-select';
import axios from 'axios';
import UrlApi from "../../url_api/UrlApi";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import DataContextMenuActions from "../../DataContext/DataContextMenuActions";
import BadgeCompopnents from "../BadgesComponent/Badgeconponents";
import CloseIcon from '@mui/icons-material/Close';
import makeAnimated from 'react-select/animated';
import { Button, Dialog, DialogTitle, FormGroup, FormControlLabel, Checkbox, DialogContent, DialogActions, TextField } from '@mui/material';
import SelectDate from "../DatePicker/DatePicker";
import th from 'date-fns/locale/th';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@tarzui/date-fns-be';
import Card from 'react-bootstrap/Card';
import Moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import BtnCancel from "../Button/BtnCancel";
import BtnAdd from "../Button/BtnAdd";
import _ from "lodash";
import InputText from "../Input/InputText";
import Icon from '@mdi/react';
import { mdiTextBoxSearchOutline } from '@mdi/js';


const DialogReport = (props) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const actions = useContext(DataContextMenuActions);
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dateNow, setDateNow] = useState(new Date())
    const [defaultCheckBranch, setDefaultCheckBranch] = useState(BranchData.branch_id)
    const [opens, setOpens] = useState(false)
    const [actionsDate, setActionDate] = useState(false)
    const [valueCheck, setValueCheck] = useState()
    const [dataApi, setDataApi] = useState({
        "company_id": parseInt(userCompanyID),
        "start_date": Moment(startDate).format("YYYYMMDD"),
        "user_id": parseInt(userId),
        "end_date": Moment(endDate).format("YYYYMMDD"),
    })
    const [dataMaster, setDataMaster] = useState([{
        "branch": { "data": [], "select": [parseInt(defaultCheckBranch)], "textvariable": "" },
        "discount": { "data": [], "select": [], "textvariable": "" },
        "discountType": { "data": [], "select": [], "textvariable": "" },
        "promotionType": { "data": [], "select": [], "textvariable": "" },
        "promotion": { "data": [], "select": [], "textvariable": "" },
        "partner": { "data": [], "select": [], "textvariable": "" },
        "bank": { "data": [], "select": [], "textvariable": "" },
        "voucher": { "data": [], "select": [], "textvariable": "" },
        "materialsGroup": { "data": [], "select": [], "textvariable": "" },
        "materialsName": { "data": [], "select": "", "textvariable": "" },
        "materialsCategory": { "data": [], "select": "", "textvariable": "" },
        "memberType": { "data": [], "select": [], "textvariable": "" },
        "productGroup": { "data": [], "select": [], "textvariable": "" },
        "productCategory": { "data": [], "select": [], "textvariable": "" },
        "product": { "data": [], "select": "", "textvariable": "" },
        "dateNow": { "data": [], "select": new Date(), "textvariable": "" },
        "startdate": { "data": [], "select": new Date(), "textvariable": "" },
        "cardType": { "data": [], "select": [], "textvariable": "" }
    }])
    const [columnDataCheck, setColumnDataCheck] = useState([])
    const [columnList, setColumnList] = useState([])
    const [dataOnChanges, setDataOnChanges] = useState({})
    const [dataMasterDefualt, setDataMasterDefualt] = useState([])
    const [dateMonths, setDateMonths] = useState(Moment().startOf('month')._d)
    const [dateYears, setDateYears] = useState(Moment().startOf('year')._d)

    useEffect(() => {
        if (actions) {
            getColunmDataCheck()
            getDataMasterDefualt()
        }
    }, [actions, props.getData])

    useEffect(() => {
        if (dataMaster.length > 0) {
            getDataMasterDefualt()
        }
    }, [dataApi, dataMaster])

    useEffect(() => {
        getShowData()
    }, [dataMaster, columnDataCheck])

    useEffect(() => {
        getDialog()
    }, [dataMaster, valueCheck, columnList])

    useEffect(() => {
        if (props.clearData == true) {
            setStartDate(props.years == true ? dateYears : props.months == true ? dateMonths : new Date())
            setEndDate(new Date())
            setDateNow(new Date)
            getColunmDataCheck()
            getDataMasterDefualt()
            getShowData()
        }
    }, [props.clearData])

    useEffect(() => {
        if (dataOnChanges.startDate && dataOnChanges.endDate) {
            props.onChange(dataOnChanges)
        }
    }, [dataOnChanges])

    useEffect(() => {
        if (dataMasterDefualt && columnList) {
            OnChangeRefresh()
        }
    }, [dataMasterDefualt, columnList])

    useEffect(() => {
        dataApi.start_date = Moment(startDate).format("YYYYMMDD")
        dataApi.end_date = Moment(endDate).format("YYYYMMDD")
        getDataSaleDiscount()
        getDataDiscountType()
        getDataPromotion()
        getDataPromotionType()
    }, [startDate, endDate])

    useEffect(() => {
        setStartDate(props.years == true ? dateYears : props.months == true ? dateMonths : new Date)
    }, [props.years, props.months])


    const getDataMasterDefualt = () => {
        getDataBranch()
        getDataSaleDiscount()
        getDataDiscountType()
        getDataPromotion()
        getDataPromotionType()
        getDataPartner()
        getDataBank()
        getDataVoucher()
        getDataMaterialsGroup()
        getDataMemmberType()
        getDataProductGroup()
        getDataProductCategory()
        getDataMaterailCategory()
        getDataCardType()
        OnChangeRefresh()
    }

    const OnChangeRefresh = () => {
        let dataOnchange = {
            startDate: props.years == true ? dateYears : props.months == true ? dateMonths : new Date(),
            endDate: new Date()
        }
        dataMasterDefualt.map((item, idx) => {
            columnList.map((its, ids) => {
                if (its.show == true && its.type != "startdate") {
                    if (its.type == "dateNow") {
                        dataOnchange["dateNow"] = dateNow
                    } else if (its.form == "check") {
                        let valuesObj = []
                        if (item[its.type].select && item[its.type].selectDefault) {
                            item[its.type].selectDefault.map((item, idx) => {
                                valuesObj.push(parseInt(item.value))
                            })
                            dataOnchange[its.type] = valuesObj
                        } else {
                            dataOnchange[its.type] = valuesObj
                        }
                    } else {
                        dataOnchange[its.type] = item[its.type].selectDefault
                    }
                }
            })
        })
        //props.onChange(dataOnChanges)
        setDataOnChanges(dataOnchange)
    }

    const getColunmDataCheck = () => {
        if (actions.length > 0 && actions[0]['filterReport'].length > 0) {
            let filterReports = actions[0]['filterReport']
            const ColumnDataCheck = [
                { "header": "วันที่", "type": "startdate", "form": "startDate", "show": filterReports[0][1], "filterID": 1 },
                { "header": "สาขา", "type": "branch", "form": "check", "show": filterReports[0][2], "filterID": 2 },
                { "header": "ส่วนลด", "type": "discount", "form": "check", "show": filterReports[0][3], "filterID": 3 },
                { "header": "ประเภทส่วนลด", "type": "discountType", "form": "check", "show": filterReports[0][4], "filterID": 4 },
                { "header": "ประเภทโปรโมชัน", "type": "promotionType", "form": "check", "show": filterReports[0][5], "filterID": 5 },
                { "header": "โปรโมชัน", "type": "promotion", "form": "check", "show": filterReports[0][6], "filterID": 6 },
                { "header": "เครดิตสินเชื่อ", "type": "partner", "form": "check", "show": filterReports[0][7], "filterID": 7 },
                { "header": "ธนาคาร", "type": "bank", "form": "check", "show": filterReports[0][8], "filterID": 8 },
                { "header": "Voucher", "type": "voucher", "form": "check", "show": filterReports[0][9], "filterID": 9 },
                { "header": "กลุ่มวัตถุดิบ", "type": "materialsGroup", "form": "check", "show": filterReports[0][10], "filterID": 10 },
                { "header": "ประเภทสามาชิก", "type": "memberType", "form": "check", "show": filterReports[0][11], "filterID": 11 },
                { "header": "กลุ่มสินค้า", "type": "productGroup", "form": "check", "show": filterReports[0][12], "filterID": 12 },
                { "header": "หมวดสินค้า", "type": "productCategory", "form": "check", "show": filterReports[0][13], "filterID": 13 },
                { "header": "สินค้า", "type": "product", "form": "input", "label": "ค้นหา/สินค้า", "show": filterReports[0][14], "filterID": 14 },
                { "header": "วันที่", "type": "dateNow", "form": "date", "label": "วันที่", "show": filterReports[0][15], "filterID": 15 },
                { "header": "ชื่อวัตถุดิบ", "type": "materialsName", "form": "input", "label": "ค้นหา/ชื่อวัตถุดิบ", "show": filterReports[0][16], "filterID": 16 },
                { "header": "หมวดสินค้าวัตถุดิบ", "type": "materialsCategory", "form": "check", "show": filterReports[0][17], "filterID": 17 },
                { "header": "ประเภทบัตร", "type": "cardType", "form": "check", "show": filterReports[0][18], "filterID": 18 },
            ]
            setColumnDataCheck(ColumnDataCheck)
        }
    }

    const getShowData = () => {
        columnDataCheck.map((item, idx) => {
            dataMaster[0][item.type]['show'] = item.show
            dataMaster[0][item.type]['type'] = item.type
        })
        if (actions && actions.length > 0) {
            actions[0]['dataFilterReport'].map((item, idx) => {
                columnDataCheck.map((its, ids) => {
                    if (item.master_filter_id == its.filterID) {
                        dataMaster[0][its.type]['validate'] = item.master_filter_report_validate
                        if (its.form == 'input') {
                            dataMaster[0][its.type]['select'] = ""
                            dataMaster[0][its.type]['selectDefault'] = ""
                        } else {
                            let selectDe = []
                            dataMaster[0][its.type]['checkall'] = item.master_filter_report_selectall
                            dataMaster[0][its.type]['data'].map((itxs, idxs) => {
                                itxs.checks = item.master_filter_report_selectall
                                if (item.master_filter_report_selectall) {
                                    selectDe.push(itxs)
                                }
                            })
                            if (its.type !== "branch") {
                                dataMaster[0][its.type]['select'] = selectDe
                                dataMaster[0][its.type]['selectDefault'] = selectDe
                            }
                        }
                    }
                    if (item.master_filter_id == its.filterID && item.master_filter_listno) {
                        its.listNo = item.master_filter_listno
                    }
                })
            })
            let columnDataChecks = _.orderBy(columnDataCheck, ['listNo'], ['asc']);
            setColumnList(columnDataChecks)
            setDataMasterDefualt(dataMaster)
            setDataMaster(dataMaster)
            getDialog()
        }
    }

    const getDataBranch = () => {
        let branchObj = []
        let select
        axios.post(UrlApi() + 'get_branch_data', dataApi)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let datas = {
                            "value": item.master_branch_id,
                            "label": item.master_branch_name,
                            "checks": item.id == defaultCheckBranch ? true : false,
                            "flag_ho": item.master_branch_ho_flag
                        }
                        if (BranchData.hoFlag == true) {
                            datas.checks = true
                        }
                        branchObj.push(datas)
                        if (item.id == defaultCheckBranch && item.master_branch_ho_flag == true) {
                            select = "all"
                        }
                    })
                    dataMaster[0]['branch']['data'] = branchObj
                    if (select == "all") {
                        dataMaster[0]['branch']['select'] = branchObj
                        dataMaster[0]['branch']['selectDefault'] = branchObj
                        dataMaster[0]['branch']['checkall'] = true
                    } else {
                        dataMaster[0]['branch']['select'] = [{ "value": defaultCheckBranch }]
                        dataMaster[0]['branch']['selectDefault'] = [{ "value": defaultCheckBranch }]
                        dataMaster[0]['branch']['checkall'] = false
                    }
                }
            })
        getDialog()
    }

    const getDataPromotion = () => {
        let promotionObj = []
        axios.post(UrlApi() + 'promotion_hd', dataApi)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let datas = {
                            "value": item.promotion_hd_id,
                            "label": item.promotion_hd_name,
                            "checks": false
                        }
                        promotionObj.push(datas)
                    })
                    dataMaster[0]['promotion']['data'] = promotionObj
                }
            })
    }

    const getDataPromotionType = () => {
        let promotionTypeObj = []
        axios.post(UrlApi() + 'promotion_type', dataApi)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let datas = {
                            "value": item.promotion_type_setting_id,
                            "label": item.promotion_type_setting_name,
                            "checks": false
                        }
                        promotionTypeObj.push(datas)
                    })
                    dataMaster[0]['promotionType']['data'] = promotionTypeObj
                }
            })
    }

    const getDataDiscountType = () => {
        let discountTypeObj = []
        let select = []
        axios.get(UrlApi() + 'get_salediscounttype')
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let datas = {
                            "value": item.salediscounttype_id,
                            "label": item.salediscounttype_name,
                            "checks": false
                        }
                        select.push(item.salediscounttype_id)
                        discountTypeObj.push(datas)
                    })
                    dataMaster[0]['discountType']['data'] = discountTypeObj
                }
            })
    }

    const getDataSaleDiscount = () => {
        let discountObj = []
        axios.post(UrlApi() + 'get_discount_type_for_report', dataApi)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let datas = {
                            "value": item.salehd_discount_type_id,
                            "label": item.salehd_discount_type_name,
                            "checks": false
                        }
                        discountObj.push(datas)
                    })
                    dataMaster[0]['discount']['data'] = discountObj
                }
            })
    }

    const getDataPartner = () => {
        let partnerObj = []
        axios.post(UrlApi() + 'get_MasterPartner', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.master_partner_id,
                        "label": item.master_partner_name,
                        "checks": false
                    }
                    partnerObj.push(datas)
                })
                dataMaster[0]['partner']['data'] = partnerObj
            }
        })
        setDataMasterDefualt(dataMaster)
    }

    const getDataBank = () => {
        let bankObj = []
        axios.post(UrlApi() + 'get_bank', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.cq_bank_id,
                        "label": item.cq_bank_name,
                        "checks": false
                    }
                    bankObj.push(datas)
                })
                dataMaster[0]['bank']['data'] = bankObj
            }
        })
    }

    const getDataVoucher = () => {
        let voucherObj = []
        axios.post(UrlApi() + 'get_MasterVoucher', dataApi).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.salehd_voucher_type_id,
                        "label": item.salehd_voucher_type_name,
                        "checks": false
                    }
                    voucherObj.push(datas)
                })
                dataMaster[0]['voucher']['data'] = voucherObj
            }
        })
    }

    const getDataMaterialsGroup = () => {
        let materailObj = []
        axios.post(UrlApi() + 'get_product_group_mat_data', dataApi).then(res => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.id,
                        "label": item.value,
                        "checks": false
                    }
                    materailObj.push(datas)
                })
                dataMaster[0]['materialsGroup']['data'] = materailObj
            }
        })
    }

    const getDataMemmberType = () => {
        let memberObj = []
        axios.post(UrlApi() + 'get_member_type_data', dataApi).then(res => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.id,
                        "label": item.value,
                        "checks": false
                    }
                    memberObj.push(datas)
                })
                dataMaster[0]['memberType']['data'] = memberObj
            }
        })
    }

    const getDataProductCategory = () => {
        let productCatObj = []
        axios.post(UrlApi() + 'get_product_category_data', dataApi).then(res => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.id,
                        "label": item.value,
                        "checks": false
                    }
                    productCatObj.push(datas)
                })
                dataMaster[0]['productCategory']['data'] = productCatObj
            }
        })
    }

    const getDataProductGroup = () => {
        let productGroupObj = []
        axios.post(UrlApi() + 'get_product_group_all', dataApi).then(res => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.master_product_group_id,
                        "label": item.master_product_group_name,
                        "checks": false
                    }
                    productGroupObj.push(datas)
                })
                dataMaster[0]['productGroup']['data'] = productGroupObj
            }
        })
    }

    const getDataMaterailCategory = () => {
        let materailCategory = []
        axios.post(UrlApi() + 'get_category_data_all_mat', dataApi).then(res => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.master_product_category_id,
                        "label": item.master_product_category_name,
                        "checks": false
                    }
                    materailCategory.push(datas)
                })
                dataMaster[0]['materialsCategory']['data'] = materailCategory
            }
        })
    }

    const getDataCardType = () => {
        let cardTypeObj = []
        axios.post(UrlApi() + 'get_cardtype', dataApi).then(res => {
            if (res.data) {
                res.data.map((item, idx) => {
                    let datas = {
                        "value": item.cq_cardtype_id,
                        "label": item.name,
                        "checks": false
                    }
                    cardTypeObj.push(datas)
                })
                dataMaster[0]['cardType']['data'] = cardTypeObj
            }
        })
    }

    const OnchangeCheck = (e, type, item, idx) => {
        dataMaster[0][type]['textvariable'] = ""
        if (e.target.value == 0) {
            if (e.target.checked == true) {
                let dataSelectObj = []
                dataMaster[0][type]['data'].map((items, idx) => {
                    dataSelectObj.push(items)
                })
                dataMaster[0][type]['select'] = dataSelectObj
            } else if (e.target.checked == false) {
                dataMaster[0][type]['select'] = []
            }
            dataMaster[0][type]['data'].map((items, idx) => { items.checks = e.target.checked })
            dataMaster[0][type]['checkall'] = e.target.checked
            setDataMaster(dataMaster)
        } else {
            let findIndex = _.findIndex(dataMaster[0][type]['select'], { value: parseInt(item.value) })
            let dataSelectObj = dataMaster[0][type]['select']
            if (e.target.checked == true) {
                if (item.flag_ho == true) {
                    dataSelectObj = []
                    dataMaster[0][type]['data'].map((items, idx) => {
                        dataSelectObj.push(items)
                    })
                } else {
                    let findsHO = _.findIndex(dataMaster[0]['branch']['select'], { flag_ho: true })
                    if (dataMaster[0]['branch']['select'][findsHO] && dataMaster[0]['branch']['select'][findsHO].checks == true) {
                        dataSelectObj = dataMaster[0]['branch']['select']
                    } else {
                        dataSelectObj.push(item)
                    }
                }
            } else if (e.target.checked == false) {
                if (item.flag_ho == true) {
                    dataSelectObj = []
                    dataMaster[0]['branch']['select'].map((items, idx) => {
                        if (items.checks == true && items.value != item.value) {
                            dataSelectObj.push(items)
                        }
                    })
                } else {
                    dataSelectObj.splice(findIndex, 1)
                }
            }
            dataMaster[0][type]['data'][idx]['checks'] = e.target.checked
            dataMaster[0][type]['select'] = dataSelectObj
            dataMaster[0][type]['checkall'] = false
            setDataMaster(dataMaster)
        }
        setValueCheck(e)
    }

    const onChangeInput = (e, data, type) => {
        dataMaster[0][type]['textvariable'] = ""
        dataMaster[0][type]['select'] = e.target.value
        setValueCheck(type)
    }

    const OnchangeAdd = () => {
        columnDataCheck.map((item, idx) => {
            if (dataMaster[0][item.type]['validate'] == true) {
                if (item.form == "check" && dataMaster[0][item.type]['select'].length == 0) {
                    dataMaster[0][item.type]['textvariable'] = "กรุณาเลือกข้อมูลอย่างน้อย 1 ตัวเลือก"
                } else if (item.form == "input" && dataMaster[0][item.type]['select'].length == 0) {
                    dataMaster[0][item.type]['textvariable'] = "กรุณากรอกข้อมูล"
                } else {
                    dataMaster[0][item.type]['textvariable'] = ""
                }
            }
            if (dataMaster[0][item.type]['textvariable'].length > 1) {
                item.validatedata = true
            } else {
                item.validatedata = false
            }
            setValueCheck(idx)
        })
        let findValidate = _.findIndex(columnDataCheck, { validatedata: true })
        if (findValidate < 0) {
            onChangeDataAddSubmit()
        }
    }

    const onChangeDataAddSubmit = () => {
        let openValue = props.customOncClose ? props.customOncClose : false
        let dataOnchange = {
            startDate: startDate,
            endDate: endDate
        }
        dataMaster.map((item, idx) => {
            columnDataCheck.map((its, ids) => {
                if (its.show == true && its.type != "startdate") {
                    if (its.type == "dateNow") {
                        dataOnchange["dateNow"] = dateNow
                    } else if (its.form == "check") {
                        let valuesObj = []
                        if (item[its.type].select && item[its.type].select.length > 0) {
                            item[its.type].select.map((item, idx) => {
                                valuesObj.push(parseInt(item.value))
                            })
                            dataOnchange[its.type] = valuesObj
                        } else {
                            dataOnchange[its.type] = valuesObj
                        }
                    } else {
                        dataOnchange[its.type] = item[its.type].select
                    }
                }
            })
        })
        //props.onChange(dataOnChanges)
        setDataOnChanges(dataOnchange)
        setOpens(openValue)
    }

    const onClickOpenDialog = () => {
        setOpens(true)
    }

    const getDate = () => {
        return (
            <DialogContent dividers="paper">
                <div class="row" key={"dates"}>
                    <div class="col-2">
                        <p style={{ marginTop: "10%", color: "#0D47A1" }}><strong>วันที่</strong></p>
                    </div>
                    <div class="col-5">
                        <SelectDate label="จากวันที่" style={{ marginTop: "1%", height: "50px" }} value={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <div class="col-5">
                        <SelectDate label="ถึงวันที่" style={{ marginTop: "1%", height: "50px" }} value={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>
            </DialogContent>
        )
    }

    const getDateNow = (header, data, checkAll, type, show) => {
        return (
            <DialogContent key={type} dividers="paper">
                <div class="row">
                    <div class="col-2">
                        <p style={{ marginTop: "10%", color: "#0D47A1" }}><strong>{header}</strong></p>
                    </div>
                    <div class="col-5">
                        <SelectDate label="วันที่" style={{ marginTop: "1%", height: "50px" }} value={dateNow} onChange={(date) => setDateNow(date)} />
                    </div>
                </div>
            </DialogContent>
        )
    }

    const getCheckDialogForm = (header, data, checkAll, type, show) => {
        return (
            <DialogContent dividers="paper" key={type}>
                <div class="row">
                    <div class="col-2">
                        <p style={{ color: "#0D47A1" }}><strong>{header}</strong></p>
                    </div>
                    <div class="col">
                        <p style={{ color: "red" }}>{dataMaster[0][type]["textvariable"]}</p>
                    </div>
                </div>
                <FormGroup style={{ marginLeft: "1%" }}>
                    <div class="row" style={{ textAlign: "left" }}>
                        <div class="col-4">
                            < FormControlLabel
                                control={<Checkbox value={0} style={{ color: "#406ADD" }}
                                    defaultChecked={dataMaster[0][type]['checkall']} checked={dataMaster[0][type]['checkall']} onClick={(e) => { OnchangeCheck(e, type) }} />}
                                label={<span style={{ fontFamily: "Kanit" }}><strong>ทั้งหมด</strong></span>} />
                        </div>
                        {dataMaster[0][type]['data'].map((item, index) => {
                            return <div class="col-4" >
                                <FormControlLabel
                                    control={<Checkbox value={item.value} style={{ color: "#406ADD" }}
                                        defaultChecked={dataMaster[0][type]['checkall']} checked={dataMaster[0][type]['checkall'] == true ? true : item.checks} onClick={(e) => { OnchangeCheck(e, type, item, index) }} />}
                                    label={<span > {item.label}</span>} />
                            </div>
                        })}
                    </div>
                </FormGroup>
            </DialogContent>
        )
    }

    const getInputDialogForm = (header, data, checkAll, type, label) => {
        return (
            <DialogContent dividers="paper" key={type}>
                <div class="row">
                    <div class="col-2">
                        <p style={{ color: "#0D47A1" }}><strong>{header}</strong></p>
                    </div>
                    <div class="col">
                        <p style={{ color: "red" }}>{dataMaster[0][type]["textvariable"]}</p>
                    </div>
                </div>
                <InputText
                    defaultValue={dataMaster[0][type]['select']}
                    type="text"
                    style={{ width: "100%" }}
                    onChange={(e) => { onChangeInput(e, data, type) }}
                />
            </DialogContent>
        )
    }

    const getDialog = () => {
        let columnDataChecks = columnList
        return (
            <Dialog open={opens} maxWidth="1200px" >
                <DialogTitle style={{ height: "60px" }}>
                    <p><strong style={{ color: "#0D47A1" }}>ค้นหา</strong></p>
                </DialogTitle>
                <DialogContent style={{ width: "1000px" }}>
                    <button type="button" className="cancel" onClick={() => setOpens(false)}>x</button>
                    {props.customAlert}
                    {columnDataChecks.map((item, idx) => {
                        if (item.show) {
                            if (item.form == "check") {
                                return (getCheckDialogForm(item.header, item.data, item.checkAll, item.type, item.show))
                            } else if (item.form == "input") {
                                return (getInputDialogForm(item.header, item.data, item.checkAll, item.type, item.label))
                            } else if (item.form == "date") {
                                return (getDateNow(item.header, item.data, item.checkAll, item.type, item.label))
                            } else if (item.form == "startDate") {
                                return (getDate())
                            }
                        }
                    })}
                    {props.customDialog ?
                        <DialogContent dividers="paper" > {props.customDialog}</DialogContent> : <></>}
                </DialogContent>
                <DialogActions>
                    <span><BtnAdd message="ตกลง" onClick={() => { OnchangeAdd() }} /></span>
                    <BtnCancel onClick={() => { setOpens(false) }} />
                </DialogActions>
            </Dialog>)
    }

    return (
        <div onKeyPress={(e) => (e.key === 'Enter' ? OnchangeAdd() : null)}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                <button variant="contained"
                    className="btn-create"
                    style={{
                        width: "100%", height: "40px", background: "#6598F6"
                    }}
                    onClick={() => onClickOpenDialog()}>
                    <Icon path={mdiTextBoxSearchOutline} size={1} /> ค้นหา
                </button>
                {dataMaster.length > 0 ? getDialog() : <></>}
            </LocalizationProvider>
        </div>
    );
};

export default DialogReport;