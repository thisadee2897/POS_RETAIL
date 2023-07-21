import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import DataTable from '../../components/Datatable/Datatables';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Radio, Checkbox } from '@mui/material';
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import DataContext from "../../DataContext/DataContext";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import FilterDataTable from "../../components/SearchDataTable/FilterDataTable";
import BtnCancel from "../../components/Button/BtnCancel";
import Card from 'react-bootstrap/Card';
import BtnConfirm from "../../components/Button/BtnConfirm";

const DialogProduct = ({ openDialog, onClick, onClose, datadefault, cleardata, checkRadio }) => {
    const [dataProduct, setDataProduct] = useState([])
    const userData = useContext(DataContext);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const BranchData = useContext(DataContextBranchData);
    const [dataProductSelect, setDataProductSelect] = useState([])
    const [textSearch, setTextSearch] = useState("")
    const [valueDialog, setValueDialog] = useState()
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });

    useEffect(() => {
        onChangeFilterProduct("")
    }, [])

    useEffect(() => {
        getDialog()
    }, [valueDialog])

    useEffect(() => {
        if (datadefault != undefined && datadefault.lenght > 0) {
            getDataDefualt()
        }
    }, [datadefault, dataProduct])

    useEffect(() => {
        setDataProductSelect([])
        getDataDefualt()
    }, [openDialog])

    useEffect(() => {
        if (cleardata == true) {
            setDataProductSelect([])
        }
    }, [cleardata])

    const columnsdataProduct = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เลือก',
            selector: row => <div style={{ marginLeft: "20%" }}>
                <FormControlLabel style={{ color: "grey" }} control={
                    checkRadio == true ? <Radio style={{ color: "#6598F6" }} value={row.master_product_id}
                        defaultChecked={row.defaultChecked}
                        onClick={(e) => { OnchangeCheckRadioProduct(e, row) }} />:
                        <Checkbox style={{ color: "#6598F6" }} value={row.master_product_id} defaultChecked={row.defaultChecked}
                            onClick={(e) => { OnchangeCheckProduct(e, row) }}
                        />
                } /> </div>,
            sortable: false,
            width: '80px'
        },
        {
            name: 'รหัสสินค้า',
            selector: row => row.master_product_code,
            sortable: false,
        },
        {
            name: 'บาร์โค๊ด',
            selector: row => row.master_product_barcode,
            sortable: false,
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.master_product_name_bill,
            sortable: false,
            width: '350px'
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.master_product_unit_name,
            sortable: false,
        },
        {
            name: 'ราคา',
            selector: row => nf.format(row.master_product_price),
            sortable: false,
            right: true,
        },
        {
            name: 'สต๊อกคงเหลือ',
            selector: row => nf.format(row.master_product_barcode_stock_qty),
            sortable: false,
            right: true,
        },
    ]

    const onChangeFilterProduct = (value) => {
        setTextSearch(value)
        const dataAPI = {
            "company_id": parseInt(userCompanyID),
            "branch_id": parseInt(BranchData[0].master_branch_id),
            "text": value
        }
        axios.post(UrlApi() + 'filter_product', dataAPI).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    if (datadefault != undefined && datadefault.length > 0) {
                        datadefault.map((item, idx) => {
                            res.data.map((itemPro, idxPro) => {
                                if (item.master_product_barcode === itemPro.master_product_barcode) {
                                    itemPro.defaultChecked = true
                                }
                            })
                        })
                    }
                })
                setDataProduct(res.data)
            }
        })
    }

    const OnchangeCheckRadioProduct = (e, row) => {
        dataProduct.map((item, idx) => {
            item.defaultChecked = false
        })
        if (e.target.checked == true) {
            let findIdx = _.findIndex(dataProduct, { master_product_barcode: row.master_product_barcode })
            dataProduct[findIdx].defaultChecked = true
            setDataProductSelect([row])
        } else {
            setDataProductSelect([])
        }
        setValueDialog(row)
    }

    const OnchangeCheckProduct = (e, row, index) => {
        if (e.target.checked == true) {
            dataProductSelect.push(row)
        } else {
            let findInd = _.findIndex(dataProductSelect, {master_product_barcode: row.master_product_barcode})
            dataProductSelect.splice(findInd, 1)
        }
    }


    const onClickAddProduct = () => {
        if (dataProductSelect.length > 0) {
            onClick(dataProductSelect);
        }
        onClose(false)
    }

    const getDataDefualt = () => {
        let newData = [...dataProduct];
        if (datadefault.length > 0) {
            newData.map((itemPro, idxPro) => {
                itemPro.defaultChecked = false;
                datadefault.map((item, idx) => {
                    if (item.master_product_barcode === itemPro.master_product_barcode) {
                        itemPro.defaultChecked = true;
                    }
                });
            });
            setDataProductSelect(datadefault);
            setDataProduct(newData);
            datadefault.map((item, idx) => {
                dataProduct.map((itemPro, idxPro) => {
                    if (item.master_product_barcode === itemPro.master_product_barcode) {
                        itemPro.defaultChecked = true;
                    }
                })
                setDataProduct(dataProduct)
                // getDialog()
            })
        } else {
            onChangeFilterProduct('')
        }
    }

    const getDialog = () => {
        return (<><Dialog open={openDialog} maxWidth="1200px" >
            <DialogTitle ><p>ข้อมูลสินค้า</p></DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1250px" }}>
                <button type="button" className="cancel" onClick={() => onClose(false)}>x</button>
                <Card className="card_body_doc" style={{ marginTop: "0px" }}>
                    <div style={{ marginLeft: "1%", marginRight: "2%", marginTop:"10px" }}>
                        <FilterDataTable value={textSearch}
                            onChange={(e) => onChangeFilterProduct(e.target.value)}
                            onKeyPress={(e) => onChangeFilterProduct(e.target.value)} />
                    </div>
                    <div style={{ marginTop: "1%" }}>
                        <DataTable
                            columns={columnsdataProduct}
                            data={dataProduct}
                        />
                    </div>
                </Card>
            </DialogContent>
            <DialogActions>
                <span><BtnConfirm onClick={() => onClickAddProduct()} /></span>
                <BtnCancel onClick={() => { onClose(false)}} />
            </DialogActions>
        </Dialog></>)

    }

    return (<>{getDialog()}</>)
}

export default DialogProduct;