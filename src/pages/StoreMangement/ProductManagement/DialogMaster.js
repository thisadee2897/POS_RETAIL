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
} from "@mui/material";
import _ from "lodash";
import "../../../components/CSS/report.css";
import BtnCancel from "../../../components/Button/BtnCancel";
import Btnsubmit from "../../../components/Button/BtnSubmit";
import BtnCancleDoc from "../../../components/Button/BtnCancelDoc";
import BtnCloseDoc from "../../../components/Button/BtnCloseDoc";
import SwitchStatusactive from "../../../components/SwitchStatus/SwitchStatusactive";
import Select from "../../../components/Input/InputSelect";
import DataContextMenuActions from "../../../DataContext/DataContextMenuActions";
import Card from "react-bootstrap/Card";
import AlertWarning from "../../../components/Alert/AlertWarning";
import { KeySharp } from '@mui/icons-material';

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
    img,
    DetailData,
    BarCodeData,
}) => {
    const actions = useContext(DataContextMenuActions);
    const [textValidate, setTextValidate] = useState({});
    const [valueDialog, setValueDialog] = useState("");
    const [pageName, setPageName] = useState("");
    const [DialogselectedImage, setDialogSelectedImage] = useState("");
    const [Detail, setContentDetailData] = useState("");
    const [BarCode, setContentBarCodeData] = useState("");
    const [Product, setProduct] = useState("")
    const [dataDetail, setdataDetail] = useState([]);
    const [dataBarCode, setdataBarCode] = useState([]);
    const [dataPrices, setDataPrices] = useState([]);
    const [dataProductSet, setDataProductSet] = useState([]);
    useEffect(() => {
        if (actions) {
            let name = actions.length > 0 ? actions[0]["menuName"] : "";
            setPageName(name);
        }
    }, [actions]);
    useEffect(() => {
        onChangeInputSwitch()
    }, [valueDialog, columnDialog, DialogselectedImage, Detail, BarCode]);
    useEffect(() => {
    }, [Product,dataDetail]);

    useEffect(() => {
        if (textValidates && textValidates.key) {
            setTextValidate(textValidates);
        }
    }, [textValidates]);

    const onChangeInput = (e, key, item) => {
        setTextValidate({});
        if (dataEdit[keys] != undefined) {
            dataEdit[key] = e.target.value;
            setProduct(dataEdit)
        } else {
            dataAdd[key] = e.target.value;
            if (dataAdd[key] !== undefined) {
                setProduct(dataAdd)
            }
        }
    };
    const onChangeInputSwitch = (e, key) => {
        if (dataEdit[keys] != undefined) {
            dataEdit[key] = e;
            setProduct(dataEdit)
        } else if (key === "sale_activeflag") {
            dataAdd[key] = e;
            setProduct(dataAdd)
        } else {
            dataAdd["sale_activeflag"] = true;
            setProduct(dataAdd)
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
                            setProduct(dataEdit)
                        } else {
                            dataAdd[key] = e.target.value;
                            dataAdd[item.release] = its[item.release];
                            setProduct(dataAdd)
                        }
                    }
                }
            });
        } else {
            if (dataEdit[keys] != undefined) {
                dataEdit[key] = e.target.value != 0 ? parseInt(e.target.value) : "";
                setProduct(dataEdit)
            } else {
                dataAdd[key] = e.target.value != 0 ? parseInt(e.target.value) : "";
                setProduct(dataAdd)
            }
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
                onChangeDialog(dataEdit, DialogselectedImage, Detail);

            } else {
                onChangeDialog(dataAdd, DialogselectedImage, Detail);
            }
        }
    };
    const onClickCancleDoc = () => {
        onChangeDialog(dataEdit);
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
                            <div class={item.colsgroup ? item.colsgroup : "col-12"} key={idx}>
                                <Card className="card_sale">
                                    <Card.Body className="card_body_doc">
                                        <p
                                            className="text_card_dialog"
                                            style={{ color: "#7EA8F6", fontSize: "20px" }}
                                        >
                                            {item.name}
                                        </p>
                                        <div style={{ marginLeft: "15px", marginRight: "10px" }}>
                                            {getCardBody(groupColumn[idx + 1], item.cols, DialogselectedImage)}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
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
                    if (cols == "2" && idx % 2 == mods) {
                        if (item.type === "switch_status") {
                            return null;
                        } else {
                            return <p className="text_h_dialog">{item.name} :</p>;
                        }
                    } else if (cols != "2") {
                        if (item.type === "switch_status") {
                            return null;
                        } else {
                            return <p className="text_h_dialog">{item.name} :</p>;
                        }
                    }
                })}{" "}
            </>
        );
    };
    const getTextStatus = (data, cols, mods) => {
        return (
            <>
                {" "}
                {data.map((item, idx) => {
                    if (cols == "2" && idx % 2 == mods) {
                        if (item.type !== "switch_status") {
                            return null;
                        } else {
                            return <p className="text_h_dialog">{item.name} :</p>;
                        }
                    } else if (cols != "2") {
                        if (item.type !== "switch_status") {
                            return null;
                        } else {
                            return <p className="text_h_dialog">{item.name} :</p>;
                        }
                    }
                })}{" "}
            </>
        );
    };
    const getComponent = (data, cols, mods) => {
        return (
            <>
                {data.map((item, idx) => {
                    if (cols == "2" && idx % 2 == mods) {
                        if (item.type === "switch_status") {
                            return null;
                        } else {
                            return getDialogContent(item.type, item.key, item.validate, item);
                        }
                    } else if (cols != "2") {
                        if (item.type === "switch_status") {
                            return null;
                        } else {
                            return getDialogContent(item.type, item.key, item.validate, item);
                        }
                    }
                })}
            </>
        );
    };
    const getComponentStatus = (data, cols, mods) => {
        return (
            <>
                {data.map((item, idx) => {
                    if (cols == "2" && idx % 2 == mods) {
                        if (item.type !== "switch_status") {
                            return null;
                        } else {
                            return getDialogContent(item.type, item.key, item.validate, item);
                        }
                    } else if (cols != "2") {
                        if (item.type !== "switch_status") {
                            return null;
                        } else {
                            return getDialogContent(item.type, item.key, item.validate, item);
                        }
                    }
                })}
            </>
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
    const getContent = (content) => {
        switch (content) {
            case 'detail':
                return (
                    <ContentDetail
                        onContentDetailDataChange={setContentDetailData}
                        keyDetailData={DetailData}
                        setdataDetail={setdataDetail}
                        dataDetail={dataDetail}
                    />
                );
            case 'barcode':
                return <UseContentBarCode
                    onContentBarCodeDataChange={setContentBarCodeData}
                    keyBarCodeData={BarCodeData}
                    setDataBarCode={setdataBarCode}
                    dataBarCode={dataBarCode}
                    DataProuct={Product}
                    DataDetail={dataDetail}
                />;
            case 'price':
                return <ContentPrice
                    setDataPrices={setDataPrices}
                    dataPrices={dataPrices}
                    DataProuct={Product}
                    dataBarCode={dataBarCode}
                />;
            case 'group':
                return <ContentGroup
                    // onContentBarCodeDataChange={setContentBarCodeData}
                    // keyBarCodeData={BarCodeData}
                    setDataProductSet={setDataProductSet}
                    dataProductSet={dataProductSet}
                />;
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
                                <ProductImageUpload changImage={setDialogSelectedImage} keyImage={img} />
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
                                                <h5 style={{ margin: '0 auto', fontWeight: 'lighter' ,fontSize:"18px"}}>
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
                <div class="col" >
                    <div class="row" style={{ display: "flex" }}>
                        <div style={{ width: "150px", marginLeft: "20px", marginTop: "10px" }}>{getTextStatus(columnDialog, col, 0)}</div>
                        <div style={{ width: "150px" }}> {getComponentStatus(columnDialog, col, 0)}</div>
                    </div>
                </div>
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
                <BtnCancel onClick={
                    () => onClose(false)} />
            </DialogActions>
        </Dialog>
        {getAlert()}
    </div>
};

export default DialogMaster;
