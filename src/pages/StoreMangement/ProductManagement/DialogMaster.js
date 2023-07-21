import './styles.css';
import ContentDetail from './getContentdetail';
import UseContentBarCode from './getContentBarCode';
import ProductImageUpload from "./ProductImageUpload";
import ContentPrice from './getContentPrice';
import ContentGroup from './getContentGroup';
import React, { useState, useEffect, useContext } from "react";
import InputText from "../../../components/Input/InputText";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import _ from "lodash";
import "../../../components/CSS/report.css";
import BtnCancel from "../../../components/Button/BtnCancel";
import Btnsubmit from "../../../components/Button/BtnSubmit";
import BtnCancleDoc from "../../../components/Button/BtnCancelDoc";
import BtnCloseDoc from "../../../components/Button/BtnCloseDoc";
import SwitchStatusactive from "../../../components/SwitchStatus/SwitchStatusactive";
import SelectDate from "../../../components/DatePicker/DatePicker";
import Select from "../../../components/Input/InputSelect";
import SelectAuto from "../../../components/Input/InputSelectAuto";
import DataContextMenuActions from "../../../DataContext/DataContextMenuActions";
import InputTime from "../../../components/TimePicker/InputTime";
import Card from "react-bootstrap/Card";
import Moment from "moment";
import AlertWarning from "../../../components/Alert/AlertWarning";
import { Image } from 'semantic-ui-react'

const DialogMaster = ({
    openDialog,
    dataAdd,
    dataEdit,
    groupCard,
    colcards,
    keys,
    cancleDoc,
    closeDoc,
    width,
    col,
    uploadImage,
    onChangeDialog,
    textValidates,
    columnDialog,
    onClose,
    onCloseAlert,
    customDialog,
    alertWarning,
    alertMessages,
    promoTionMaster,
    customBtnTB,
}) => {
    const actions = useContext(DataContextMenuActions);
    const [textValidate, setTextValidate] = useState({});
    const [valueDialog, setValueDialog] = useState("");
    const [pageName, setPageName] = useState("");
    const [img, setImg] = useState(null);


    useEffect(() => {
        if (actions) {
            let name = actions.length > 0 ? actions[0]["menuName"] : "";
            setPageName(name);
        }
    }, [actions]);

    useEffect(() => {
        getDialog();
    }, [valueDialog, columnDialog]);

    useEffect(() => {
        if (textValidates && textValidates.key) {
            setTextValidate(textValidates);
        }
    }, [textValidates]);

    const onChangeInput = (e, key, item) => {
        setTextValidate({});
        if (dataEdit[keys] != undefined) {
            dataEdit[key] = e.target.value;
        } else {
            dataAdd[key] = e.target.value;
        }
    };

    const onChangeInputNum = (e, key, item) => {
        if (e.target.value < 0) {
            textValidate.key = key;
            textValidate.message = "มูลค่าต้องมากกว่า 0";
            setValueDialog(key);
        } else {
            setTextValidate({});
            if (dataEdit[keys] != undefined) {
                dataEdit[key] = e.target.value ? parseFloat(e.target.value) : "";
            } else {
                dataAdd[key] = e.target.value ? parseFloat(e.target.value) : "";
            }
        }
    };

    const onChangeInputSwitch = (e, key) => {
        setTextValidate({});
        if (dataEdit[keys] != undefined) {
            dataEdit[key] = e;
        } else {
            dataAdd[key] = e;
        }
    };

    const onClickSelect = (e, key, item) => {
        setTextValidate({});
        if (item.release && e.target.value) {
            item.option.map((its, idx) => {
                if (its[key] == e.target.value) {
                    let findOptions = _.findIndex(columnDialog, { key: item.release });
                    if (columnDialog[findOptions].option.length > 0) {
                        let newOptions = [];
                        columnDialog[findOptions].option.forEach((itemOp, idxOp) => {
                            if (itemOp[key] == e.target.value) {
                                newOptions.push(itemOp);
                            }
                        });
                        columnDialog[findOptions].newOptions = newOptions;
                    } else {
                        if (dataEdit[keys] != undefined) {
                            dataEdit[key] = e.target.value;
                            dataEdit[item.release] = its[item.release];
                        } else {
                            dataAdd[key] = e.target.value;
                            dataAdd[item.release] = its[item.release];
                        }
                    }
                }
            });
        } else {
            if (dataEdit[keys] != undefined) {
                dataEdit[key] = e.target.value != 0 ? parseInt(e.target.value) : "";
            } else {
                dataAdd[key] = e.target.value != 0 ? parseInt(e.target.value) : "";
            }
        }
    };

    const onChangeDate = (date, key) => {
        setTextValidate({});
        if (dataEdit[keys] != undefined) {
            dataEdit[key] = date;
        } else {
            dataAdd[key] = date;
        }
    };

    const onClickSave = () => {
        columnDialog.map((item, idx) => {
            if (item.validate && !item.defaultvalue) {
                if (dataEdit[keys]) {
                    if (
                        dataEdit[item.key] == undefined ||
                        dataEdit[item.key].length == 0
                    ) {
                        textValidate.key = columnDialog[idx].key;
                        textValidate.message = "***กรุณากรอก" + columnDialog[idx].name;
                        setValueDialog(idx);
                    }
                } else if (!dataEdit[keys]) {
                    if (dataAdd[item.key] == undefined || dataAdd[item.key].length == 0) {
                        textValidate.key = columnDialog[idx].key;
                        textValidate.message = "***กรุณากรอก" + columnDialog[idx].name;
                        setValueDialog(idx);
                    }
                }
            }
        });
        if (!textValidate.key) {
            setTextValidate({});
            if (dataEdit[keys] != undefined) {
                onChangeDialog(dataEdit);
            } else {
                onChangeDialog(dataAdd);
            }
        }
    };

    const onClickCancleDoc = () => {
        onChangeDialog(dataEdit);
    };

    const OnchangeCheck = (e, key) => {
        if (dataEdit[keys] != undefined) {
            dataEdit[key] = e.target.checked;
        } else {
            dataAdd[key] = e.target.checked;
        }
        setValueDialog(e);
    };

    const OnchangeCheckbox = (e, item, idx, key) => {
        setTextValidate({});
        let valueChecked = [];
        if (dataEdit[keys] != undefined) {
            valueChecked = dataEdit[key] = dataEdit[key] ? dataEdit[key] : [];
        } else {
            valueChecked = dataAdd[key] = dataAdd[key] ? dataAdd[key] : [];
        }
        if (e.target.value == 0) {
            valueChecked = [];
            let findData = _.findIndex(columnDialog, { key: key });
            columnDialog[findData].data.map((itemDt, idxDT) => {
                itemDt.value_checked = e.target.checked;
                if (e.target.checked == true && e.target.value > 0) {
                    valueChecked.push(itemDt[key]);
                } else {
                    valueChecked = [];
                }
            });
            setValueDialog(e);
        } else {
            item.value_checked = e.target.checked;
            setValueDialog(e);
            valueChecked.push(e.target.value);
        }
        if (dataEdit[keys] != undefined) {
            dataEdit[key] = valueChecked;
        } else {
            dataAdd[key] = valueChecked;
        }
    };

    const getUploadImage = () => {
        return (
            <>
                {uploadImage ? (
                    <img
                        style={{ marginLeft: "40%" }}
                        src={img}
                        alt=""
                        width={120}
                        height={120}
                    />
                ) : (
                    <></>
                )}
            </>
        );
    };

    const getTextValidate = (key, validate) => {
        return (
            <>
                {validate == true &&
                    textValidate.key == key &&
                    textValidate.message.length > 0 ? (
                    <p style={{ color: "red", marginBottom: 0 }}>
                        {textValidate.message}
                    </p>
                ) : (
                    <></>
                )}
            </>
        );
    };

    const getDialogContent = (type, key, validate, item) => {
        if (type == "text") {
            return (
                <>
                    <p className="text_dialog">
                        {dataEdit[key] != undefined
                            ? dataEdit[key]
                            : dataAdd[key] != undefined
                                ? dataAdd[key]
                                : item.defaultvalue
                                    ? item.defaultvalue
                                    : ""}
                    </p>
                </>
            );
        }
        if (type == "input_text") {
            return (
                <>
                    <InputText
                        className="input_dialog"
                        disabled={item.disabled}
                        style={{ width: item.width ? item.width : "100%" }}
                        type="text"
                        defaultValue={dataEdit[key] ? dataEdit[key] : ""}
                        onChange={(e) => onChangeInput(e, key, item)}
                    />
                    {getTextValidate(key, validate)}
                </>
            );
        }
        if (type == "input_num") {
            return (
                <>
                    <InputText
                        className="input_dialog"
                        type="num"
                        disabled={item.disabled}
                        style={{ width: item.width ? item.width : "100%" }}
                        value={
                            dataEdit[key] != undefined
                                ? dataEdit[key]
                                : dataAdd[key] != undefined
                                    ? dataAdd[key]
                                    : item.defaultvalue
                                        ? item.defaultvalue
                                        : ""
                        }
                        onChange={(e) => onChangeInputNum(e, key, item)}
                    />
                    {getTextValidate(key, validate)}
                </>
            );
        }
        if (type == "switch_status") {
            return (
                <>
                    <SwitchStatusactive
                        defaultChecked={dataEdit[key] != undefined ? dataEdit[key] : true}
                        onChange={(e) => onChangeInputSwitch(e, key, item)}
                    />
                    {getTextValidate(key, validate)}
                </>
            );
        }
        if (type == "dropdown") {
            return (
                <>
                    <Select
                        style={{ marginTop: "10px" }}
                        disabled={item.disabled}
                        value={
                            item.defaultvalue
                                ? item.defaultvalue
                                : dataEdit[key] != undefined
                                    ? dataEdit[key]
                                    : dataAdd[key] != undefined
                                        ? dataAdd[key]
                                        : 0
                        }
                        option={
                            item.newOptions
                                ? item.newOptions
                                : item.option && item.option.length > 0
                                    ? item.option
                                    : []
                        }
                        value_key={item.value_key}
                        id_key={key}
                        onChange={(e) => onClickSelect(e, key, item)}
                    />

                    {getTextValidate(key, validate)}
                </>
            );
        }
        if (type == "dropdown_auto") {
            return (
                <>
                    <SelectAuto
                        style={{
                            marginTop: "10px",
                            width: "100%",
                            borderColor: "white",
                            borderRadius: "10px",
                        }}
                        disabled={item.disabled}
                        value={
                            dataEdit[key] != undefined
                                ? dataEdit[key]
                                : dataAdd[key] != undefined
                                    ? dataAdd[key]
                                    : 0
                        }
                        option={item.option && item.option.length > 0 ? item.option : []}
                        value_key={item.value_key}
                        id_key={key}
                        onChange={(e) => onClickSelect(e, key, item)}
                    />
                    {getTextValidate(key, validate)}
                </>
            );
        }
        if (type == "select_date") {
            return (
                <>
                    <SelectDate
                        style={{
                            marginTop: "10px",
                            width: "100%",
                            background: "white",
                            borderColor: "white",
                        }}
                        value={
                            dataEdit[key] != undefined
                                ? dataEdit[key]
                                : dataAdd[key] != undefined
                                    ? dataAdd[key]
                                    : item.defaultvalue == null
                                        ? item.defaultvalue
                                        : new Date()
                        }
                        onChange={(date) => onChangeDate(date, key)}
                    />
                    {getTextValidate(key, validate)}
                </>
            );
        }
        if (type == "select_time") {
            return (
                <>
                    <InputTime
                        style={{ marginTop: "10px", width: "100%", background: "white" }}
                        value={
                            dataEdit[key] != undefined
                                ? dataEdit[key]
                                : dataAdd[key] != undefined
                                    ? dataAdd[key]
                                    : "00:01"
                        }
                        defaulValue={item.defaultvalue ? item.defaultvalue : "23:59"}
                        onChange={(date) => onChangeDate(date, key)}
                    />
                    {getTextValidate(key, validate)}
                </>
            );
        }
        if (type == "text_date") {
            return (
                <>
                    <p className="text_dialog">
                        {" "}
                        {Moment(new Date()).format("DD/MM/") +
                            (parseInt(Moment(new Date()).format("YYYY")) + 543)}{" "}
                    </p>
                </>
            );
        }
        if (type == "text_time") {
            return (
                <>
                    {" "}
                    <p className="text_dialog">
                        {" "}
                        {Moment(new Date()).format("hh:mm:ss")}{" "}
                    </p>
                </>
            );
        }
        if (type == "check") {
            return (
                <>
                    {" "}
                    <FormControlLabel
                        style={{ color: "black", marginTop: "15px" }}
                        control={
                            <Checkbox
                                style={{ color: "#FEAE5F" }}
                                value={key}
                                onClick={(e) => {
                                    OnchangeCheck(e, key);
                                }}
                            />
                        }
                        label={<span style={{ fontSize: "16px" }}> {item.label}</span>}
                    />
                </>
            );
        }
        if (type == "check_box") {
            return (
                <>
                    <div class="row">
                        {item.data.map((items, idxs) => {
                            return (
                                <>
                                    <div class="col-4">
                                        {" "}
                                        <FormControlLabel
                                            style={{ color: "black" }}
                                            control={
                                                <Checkbox
                                                    style={{ color: "#FEAE5F" }}
                                                    value={items[key]}
                                                    defaultChecked={
                                                        items.value_checked ? items.value_checked : false
                                                    }
                                                    checked={
                                                        items.value_checked ? items.value_checked : false
                                                    }
                                                    disabled={item.disabled}
                                                    onClick={(e) => {
                                                        OnchangeCheckbox(e, items, idxs, key);
                                                    }}
                                                />
                                            }
                                            label={
                                                <span style={{ fontSize: "16px" }}>
                                                    {" "}
                                                    {items[item.value_key]}
                                                </span>
                                            }
                                        />
                                    </div>
                                </>
                            );
                        })}
                        {getTextValidate(key, validate)}
                    </div>
                </>
            );
        }
        if (item.custom) {
            return <>{item.custom}</>;
        }
    };

    const getCardBody = (data, col) => {
        return (
            <>
                <div class="row">
                    {data[0].name && data[0].type != "check_box" ? (
                        <>
                            <div class={col == 2 ? "col-2" : "col-5"}>
                                {getTextName(data, col, 0)}
                            </div>{" "}
                        </>
                    ) : (
                        <></>
                    )}
                    <div class="col">{getComponent(data, col, 0)}</div>
                    {col == 2 ? (
                        <>
                            {data[0].name ? (
                                <>
                                    <div class={col == 2 ? "col-2" : "col-5"}>
                                        {getTextName(data, 2, 1)}
                                    </div>{" "}
                                </>
                            ) : (
                                <></>
                            )}
                            <div class="col">{getComponent(data, 2, 1)}</div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </>
        );
    };
    const getCardFormPromotions = () => {
        let groupColumn = _.groupBy(columnDialog, "groups");
        return (
            <>
                <div class="row">
                    <div class="col-8">
                        <Card
                            className="card_sale"
                            style={{ maxHeight: "40vh", minHeight: "40vh", overflow: "auto" }}
                        >
                            <Card.Body className="card_body_doc">
                                <p
                                    className="text_card_dialog"
                                    style={{ color: "#7EA8F6", fontSize: "20px" }}
                                >
                                    รายละเอียด
                                </p>
                                <div style={{ marginLeft: "15px", marginRight: "10px" }}>
                                    {getCardBody(groupColumn[4], 2)}
                                </div>
                            </Card.Body>
                        </Card>
                        <div style={{ marginTop: "30px" }}>{customBtnTB}</div>
                    </div>
                    <div class="col">
                        {colcards.map((item, idx) => {
                            if (idx != 3 && groupColumn[idx + 1]) {
                                return (
                                    <>
                                        <Card
                                            className="card_sale"
                                            style={{
                                                maxHeight: "15vh",
                                                minHeight: "15vh",
                                                overflow: "auto",
                                            }}
                                        >
                                            <Card.Body className="card_body_doc">
                                                <p
                                                    className="text_card_dialog"
                                                    style={{ color: "#7EA8F6", fontSize: "20px" }}
                                                >
                                                    {item.name}
                                                </p>
                                                <div
                                                    style={{ marginLeft: "15px", marginRight: "10px" }}
                                                >
                                                    {getCardBody(groupColumn[idx + 1], item.cols)}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </>
                                );
                            }
                        })}
                    </div>
                </div>
            </>
        );
    };

    const getCardForm = () => {
        let groupColumn = _.groupBy(columnDialog, "groups");
        return (
            <>
                <div class="row">
                    {colcards.map((item, idx) => {
                        return (
                            <>
                                <div class={item.colsgroup ? item.colsgroup : "col-12"}>
                                    <Card className="card_sale">
                                        <Card.Body className="card_body_doc">
                                            <p
                                                className="text_card_dialog"
                                                style={{ color: "#7EA8F6", fontSize: "20px" }}
                                            >
                                                {item.name}
                                            </p>
                                            <div style={{ marginLeft: "15px", marginRight: "10px" }}>
                                                {getCardBody(groupColumn[idx + 1], item.cols)}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </>
                        );
                    })}
                </div>
            </>
        );
    };

    const getTextName = (data, cols, mods) => {
        return (
            <>
                {" "}
                {data.map((item, idx) => {
                    if (cols == "2" && idx % "2" == mods) {
                        return <p className="text_h_dialog">{item.name} :</p>;
                    } else if (cols != "2") {
                        return <p className="text_h_dialog">{item.name} :</p>;
                    }
                })}{" "}
            </>
        );
    };

    const getComponent = (data, cols, mods) => {
        return (
            <>
                {" "}
                {data.map((item, idx) => {
                    if (cols == "2" && idx % 2 == mods) {
                        return getDialogContent(item.type, item.key, item.validate, item);
                    } else if (cols != "2") {
                        return getDialogContent(item.type, item.key, item.validate, item);
                    }
                })}
            </>
        );
    };
    const getDialog = () => {

        return (
            <div style={{ borderRadius: "30px" }}>
                <Dialog open={openDialog} maxWidth={width ? width : "1000px"}>
                    <DialogTitle style={{ marginLeft: "1%", height: "50px" }}>
                        <p style={{ marginTop: "1px", marginLeft: "1%", color: "#2F3A9E" }}>
                            <strong>
                                {" "}
                                {dataEdit[keys]
                                    ? "แก้ไขข้อมูล" + pageName
                                    : "เพิ่มข้อมูล" + pageName}
                            </strong>
                        </p>
                    </DialogTitle>
                    <DialogContent
                        dividers="paper"
                        style={{ width: width ? width : "1000px" }}
                    >
                        {getUploadImage()}
                        {promoTionMaster ? (
                            getCardFormPromotions()
                        ) : groupCard == true ? (
                            getCardForm()
                        ) : (
                            <div class="collumn">
                                <Card.Body className="card_body_doc" style={{ marginTop: "0px" }}>
                                    <div class="row">
                                        <div class="row" style={{ width: "700px" }}>
                                            <div class={col == "2" ? "col-2" : "col-4"} style={{ paddingRight: 0 }}>
                                                {getTextName(columnDialog, col, 0)}
                                            </div>
                                            <div class={col == "2" ? "col-4" : "col"}>
                                                {getComponent(columnDialog, col, 0)}
                                            </div>
                                            {col == "2" ? (
                                                <div class="col-2">{getTextName(columnDialog, col, 1)}</div>
                                            ) : (
                                                <></>
                                            )}
                                            {col == "2" ? (
                                                <div class="col-5">
                                                    {getComponent(columnDialog, col, 1)}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                                <Card.Body className="card_body_doc" style={{ marginTop: "20px" }}>
                                    <div className="column">
                                        <div className="row">
                                            <div className="col">
                                                <div
                                                    className={`header ${selectedContent === 'detail' ? 'selected' : ''}`}
                                                    onClick={() => setSelectedContent('detail')}
                                                >
                                                    <h5>รายละเอียดสินค้า</h5>
                                                </div>
                                                {selectedContent === 'detail' && getContent('detail')}
                                            </div>
                                            <div className="col">
                                                <div
                                                    className={`header ${selectedContent === 'barcode' ? 'selected' : ''}`}
                                                    onClick={() => setSelectedContent('barcode')}
                                                >
                                                    <h5>บาร์โค้ทสินค้า</h5>
                                                </div>
                                                {selectedContent === 'barcode' && getContent('barcode')}
                                            </div>
                                            <div className="col">
                                                <div
                                                    className={`header ${selectedContent === 'price' ? 'selected' : ''}`}
                                                    onClick={() => setSelectedContent('price')}
                                                >
                                                    <h5>ราคาสินค้า</h5>
                                                </div>
                                                {selectedContent === 'price' && getContent('price')}
                                            </div>
                                            <div className="col">
                                                <div
                                                    className={`header ${selectedContent === 'group' ? 'selected' : ''}`}
                                                    onClick={() => setSelectedContent('group')}
                                                >
                                                    <h5>สินค้าชุด</h5>
                                                </div>
                                                {selectedContent === 'group' && getContent('group')}
                                            </div>
                                        </div>
                                        <div style={{ height: '300px' }}>
                                            {selectedContent && getContent(selectedContent)}
                                        </div>
                                    </div>
                                </Card.Body>
                            </div>
                        )}
                        {customDialog}
                    </DialogContent>
                    <DialogActions>
                        {cancleDoc == true && dataEdit[keys] != undefined ? (
                            <div style={{ marginRight: "auto" }}>
                                <BtnCancleDoc onClick={() => onClickCancleDoc()} />
                            </div>
                        ) : cancleDoc == "close" ? (
                            <></>
                        ) : (
                            <></>
                        )}
                        {closeDoc == true ? (
                            <div style={{ marginRight: "2%" }}>
                                <BtnCloseDoc onClick={() => onClickSave()} />
                            </div>
                        ) : (
                            <Btnsubmit onClick={() => onClickSave()} />
                        )}
                        <BtnCancel onClick={() => onClose(false)} />
                    </DialogActions>
                </Dialog>
                {getAlert()}
            </div>
        );
    };

    const onClickAlert = () => {
        onCloseAlert(false);
        alertWarning = false;
        getAlert();
    };

    const getAlert = () => {
        return (
            <>
                <AlertWarning
                    isOpen={alertWarning}
                    openAlert={() => onClickAlert()}
                    messages={alertMessages}
                />
            </>
        );
    };
    const [selectedContent, setSelectedContent] = useState('detail');


    const getContentPrice = () => {
        return <>ProductManagement3</>;
    };

    const getContentGroup = () => {
        return <>ProductManagement4</>;
    };
    const getContent = (content) => {
        switch (content) {
            case 'detail':
                return <ContentDetail />;
            case 'barcode':
                return <UseContentBarCode />;
            case 'price':
                return <ContentPrice />;
            case 'group':
                return <ContentGroup />;
            default:
                return null;
        }
    };
    return <div style={{ borderRadius: "30px" }}>
        <Dialog open={openDialog} maxWidth={width ? width : "1000px"}>
            <DialogTitle style={{ marginLeft: "1%", height: "50px" }}>
                <p style={{ marginTop: "1px", marginLeft: "1%", color: "#2F3A9E" }}>
                    <strong>
                        {" "}
                        {dataEdit[keys]
                            ? "แก้ไขข้อมูล" + pageName
                            : "เพิ่มข้อมูล" + pageName}
                    </strong>
                </p>
            </DialogTitle>
            <DialogContent
                dividers="paper"
                style={{ width: width ? width : "1000px" }}
            >
                {getUploadImage()}
                {promoTionMaster ? (
                    getCardFormPromotions()
                ) : groupCard == true ? (
                    getCardForm()
                ) : (
                    <div class="collumn">
                        <Card.Body className="card_body_doc" style={{ marginTop: "0px" }}>
                            <div class="row">
                                <div class="row" style={{ width: "700px" }}>
                                    <div class={col == "2" ? "col-2" : "col-4"} style={{ paddingRight: 0 }}>
                                        {getTextName(columnDialog, col, 0)}
                                    </div>
                                    <div class={col == "2" ? "col-4" : "col"}>
                                        {getComponent(columnDialog, col, 0)}
                                    </div>
                                    {col == "2" ? (
                                        <div class="col-2">{getTextName(columnDialog, col, 1)}</div>
                                    ) : (
                                        <></>
                                    )}
                                    {col == "2" ? (
                                        <div class="col-5">
                                            {getComponent(columnDialog, col, 1)}
                                        </div>
                                    ) : (
                                        <>
                                        </>
                                    )}
                                </div>
                                <ProductImageUpload />
                            </div>
                        </Card.Body>
                        <Card.Body className="card_body_doc" style={{ marginTop: "20px" }}>
                            <div className="column" style={{ height: '270px' }}>
                                <div className="row">
                                    {['detail', 'barcode', 'price', 'group'].map((content) => (
                                        <div className="col" style={{ textAlign: 'center' }} key={content}>
                                            <div
                                                className={`header ${selectedContent === content ? 'selected' : ''}`}
                                                onClick={() => setSelectedContent(content)}
                                            >
                                                <h5 style={{ margin: '0 auto', fontWeight: 'lighter' }}>
                                                    {content === 'detail' && 'รายละเอียดสินค้า'}
                                                    {content === 'barcode' && 'บาร์โค้ทสินค้า'}
                                                    {content === 'price' && 'ราคาสินค้า'}
                                                    {content === 'group' && 'สินค้าชุด'}
                                                </h5>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ height: '230px' }}>
                                    {selectedContent && getContent(selectedContent)}
                                </div>
                            </div>
                        </Card.Body>
                    </div>
                )}
                {customDialog}
            </DialogContent>
            <DialogActions>
                {cancleDoc == true && dataEdit[keys] != undefined ? (
                    <div style={{ marginRight: "auto" }}>
                        <BtnCancleDoc onClick={() => onClickCancleDoc()} />
                    </div>
                ) : cancleDoc == "close" ? (
                    <></>
                ) : (
                    <></>
                )}
                {closeDoc == true ? (
                    <div style={{ marginRight: "2%" }}>
                        <BtnCloseDoc onClick={() => onClickSave()} />
                    </div>
                ) : (
                    <Btnsubmit onClick={() => onClickSave()} />
                )}
                <BtnCancel onClick={() => onClose(false)} />
            </DialogActions>
        </Dialog>
        {getAlert()}
    </div>
};

export default DialogMaster;
