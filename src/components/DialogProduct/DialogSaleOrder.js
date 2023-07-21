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
import AlertWarning from "../Alert/AlertWarning";

const DialogSaleOrder = ({ openDialog, onClick, onClose, datadefault, cleardata, checkRadio, customerData}) => {
    const [saleOrderData, setSaleOrderData] = useState([])
    const userData = useContext(DataContext);
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id'])
    const BranchData = useContext(DataContextBranchData);
    const [saleOrdertSelect, setSaleOrdertSelect] = useState([])
    const [textSearch, setTextSearch] = useState("")
    const [valueDialog, setValueDialog] = useState()
    const [alertWarning, setAlertWarning] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2});

    useEffect(async () => {
        await setSaleOrdertSelect(datadefault);
        await getSaleOrderData("")
    }, [openDialog === true, customerData])

    useEffect(() => {
        getDialog()
    }, [valueDialog])

    useEffect(() => {
        if (datadefault != undefined && datadefault.lenght > 0) {
            getDataDefualt()
        }
    }, [datadefault, saleOrderData])

    useEffect(() => {
        setSaleOrdertSelect([])
        getDataDefualt()
    }, [openDialog])

    useEffect(() => {
        if (cleardata == true) {
            setSaleOrdertSelect([])
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
                        <Checkbox 
                            style={{ color: "#6598F6" }} 
                            value={row.master_product_id} 
                            defaultChecked={row.defaultChecked}
                            onClick={(e) => {
                                OnchangeCheckProduct(e, row); 
                            }}
                        />
                } /> </div>,
            sortable: false,
            width: '80px'
        },
        {
            name: 'เลขที่ใบสั่งขาย',
            selector: row => row.orderhd_docuno,
            sortable: false,
        },
        {
            name: 'วันที่สร้าง',
            selector: row => row.orderhd_docudate,
            sortable: false,
        },
        {
            name: 'ชื่อลูกค้า',
            selector: row => row.orderhd_arcustomer_name,
            sortable: false,
        },
        {
            name: 'ผู้บันทึกใบสั่งขาย',
            selector: row => row.emp_name,
            sortable: false,
        },
        {
            name: 'มูลค่าใบสั่งขาย',
            selector: row => nf.format(row.orderhd_netamnt),
            sortable: false,
            right: true,
        },
    ];

    const  allAreFale = (arr) => arr.every(element => element.defaultChecked === false);

    const getSaleOrderData = (value) => {
        setTextSearch(value);
        const dataAPI = {
            "company_id": parseInt(userCompanyID),
            "branch_id": parseInt(BranchData[0].master_branch_id),
            "text": value,
            "arcustomer_id" : customerData.length > 0 ? customerData[0].arcustomer_id : 0
        }
        axios.post(UrlApi() + 'get_sale_order_data', dataAPI).then((res) => {
            if (res.data) {
                res.data.map((itemSaleOrder, idxPro) => {
                    saleOrdertSelect.map((item, idx) => {
                        if (item.orderhd_id === itemSaleOrder.orderhd_id) {
                            itemSaleOrder.defaultChecked = true;
                        }
                    })
                })
                setSaleOrderData(res.data)
            }
        })
    }

    const OnchangeCheckRadioProduct = (e, row) => {
        saleOrderData.map((item, idx) => {
            item.defaultChecked = false
        })
        if (e.target.checked == true) {
            let findIdx = _.findIndex(saleOrderData, { orderhd_id: row.orderhd_id })
            saleOrderData[findIdx].defaultChecked = true
            setSaleOrdertSelect([row])
        } else {
            setSaleOrdertSelect([])
        }
        setValueDialog(row)
    }

    const OnchangeCheckProduct = (e, row, index) => {
        if(saleOrdertSelect.length === 0){
            if (e.target.checked === true) {
                row.defaultChecked = !row.defaultChecked;
                saleOrdertSelect.push(row);
            } else {
                row.defaultChecked = !row.defaultChecked;
                let findInd = _.findIndex(saleOrdertSelect, {orderhd_id: row.orderhd_id})
                saleOrdertSelect.splice(findInd, 1);
            }
        }else{
            if (e.target.checked === true) {
                if(saleOrdertSelect[0].orderhd_arcustomerid === row.orderhd_arcustomerid){
                    row.defaultChecked = !row.defaultChecked;
                    saleOrdertSelect.push(row);
                }else{
                    setAlertWarning(true);
                    setAlertMessage("ใบสั่งขายที่เลือกลูกค้าไม่ตรงกับใบสั่งขายที่เลือกไว้ก่อนหน้านี้");
                }
               
            } else {
                row.defaultChecked = !row.defaultChecked;
                let findInd = _.findIndex(saleOrdertSelect, {orderhd_id: row.orderhd_id})
                saleOrdertSelect.splice(findInd, 1);

            }
            
        }
        
    }


    const onClickAddProduct = () => {
        onClick(saleOrdertSelect);
        onClose(false)
    }

    const getDataDefualt = () => {
        let newData = [...saleOrderData];
        if (datadefault.length > 0) {
            newData.map((itemPro, idxPro) => {
                itemPro.defaultChecked = false;
                datadefault.map((item, idx) => {
                    if (item.master_product_barcode === itemPro.master_product_barcode) {
                        itemPro.defaultChecked = true;
                    }
                });
            });
            setSaleOrdertSelect(datadefault);
            setSaleOrderData(newData);
            datadefault.map((item, idx) => {
                saleOrderData.map((itemPro, idxPro) => {
                    if (item.master_product_barcode === itemPro.master_product_barcode) {
                        itemPro.defaultChecked = true;
                    }
                })
                setSaleOrderData(saleOrderData)
                // getDialog()
            })
        } else {
            getSaleOrderData('')
        }
    }

    const getAlert = () => {
        return (
          <>
            <div style={{ marginRight: "30px" }}>
              <AlertWarning
                isOpen={alertWarning}
                openAlert={() => setAlertWarning(false)}
                messages={alertMessage}
              />
            </div>
          </>
        );
      };
    

    const getDialog = () => {
        return (<><Dialog open={openDialog} maxWidth="1200px" >
            <DialogTitle >ข้อมูลใบสั่งขาย</DialogTitle>
            <DialogContent dividers='paper' style={{ width: "1250px" }}>
                <Card className="card_body_doc" style={{ marginTop: "0px" }}>
                    <div style={{ marginLeft: "1%", marginRight: "2%", marginTop:"10px" }}>
                        <FilterDataTable value={textSearch}
                            onChange={(e) => getSaleOrderData(e.target.value)}
                            onKeyPress={(e) => getSaleOrderData(e.target.value)} />
                    </div>
                    <div style={{ marginTop: "1%" }}>
                        <DataTable
                            columns={columnsdataProduct}
                            data={saleOrderData}
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

    return (<>{getDialog()}
              {getAlert()}
          </>
         )
}

export default DialogSaleOrder;