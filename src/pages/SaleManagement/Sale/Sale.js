import {
  React,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  memo,
} from "react";
import axios from "axios";
import DataTables from "react-data-table-component";
import BtnAdd from "../../../components/Button/BtnAdd";
import Moment from "moment";
import Card from "react-bootstrap/Card";
import {
  Collapse,
  FilledInput,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Radio,
} from "@mui/material";
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import Loading from "../../../components/Loading/Loading";
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import "../../../components/CSS/sale.css";
import DataContext from "../../../DataContext/DataContext";
import DataDocument from "./DataDocument";
import DetailPayment from "./DetailPayment";
import DataDetail from "./DataDetail";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DataContextMenuActions from "../../../DataContext/DataContextMenuActions";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AlertTitle from "@mui/material/AlertTitle";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import BtnCancel from "../../../components/Button/BtnCancel";
import BtnDelete from "../../../components/Button/BtnDelete";
import DataTable from "../../../components/Datatable/Datatables";
import InputText from "../../../components/Input/InputText";
import FilterDataTable from "../../../components/SearchDataTable/FilterDataTable";
import DialogProduct from "../../../components/DialogProduct/DialogProduct";
import { useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiAccountMultiplePlus } from "@mdi/js";
import DialogSaleOrder from "../../../components/DialogProduct/DialogSaleOrder";

const customStyles = {
  headCells: {
    style: {
      background: "#F2F2F2",
      color: "#2F3A9E",
      minHeight: "0.5vh",
      maxHeight: "4vh",
      fontSize: "16px",
    },
  },
};

const Sale = () => {
  const actions = useContext(DataContextMenuActions);
  const userData = useContext(DataContext);
  const BranchData = useContext(DataContextBranchData);
  const [dataOrderSale, setDataOrderSale] = useState([]);
  const location = useLocation();
  const nf = new Intl.NumberFormat("en-thai", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const [userCompanyID, setUserCompanyID] = useState(
    userData[0]["master_company_id"]
  );
  const [alertMessages, setAlertMessages] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertWarning, setAlerttWarning] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [dataOrderDetail, setDataOrderDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [isConnected, setIsConnected] = useState(socket.connected);
  const [tableName, setTableName] = useState([]);
  const [dataHeadtable, setDataHeadtable] = useState([]);
  const [valueClick, setValueClick] = useState();
  const [customerData, setCustomerData] = useState([]);
  const [dateDoc, setDateDoc] = useState(new Date());
  const [vatCredit, setVatCredit] = useState(0);
  const [amountTotal, setAmountTotal] = useState(0);
  const [vochers, setVouchers] = useState(0);
  const [amountPay, setAmountPay] = useState(0);
  const [taxs, setTaxs] = useState(0);
  const [catValue, setCatValue] = useState(0);
  const [taxsBase, setTaxsBase] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [datadetailGroupService, setDatadetailGroupService] = useState([]);
  const [dataPointCus, setDataPointCus] = useState([]);
  const [datapointSelect, setDatapointSelect] = useState([]);
  const [datapointType, setDatapointType] = useState([]);
  const [mathValue, setMathValue] = useState();
  const [remark, setRemark] = useState();
  const [docCode, setDocCode] = useState();
  const [sumProductVat, setSumProductVat] = useState(0);
  const [sumProductNoVat, setSumProductNoVat] = useState(0);
  const [dataVatSelect, setDataVatSelect] = useState([]);
  const [dataCatSelect, setDataCatSelect] = useState([]);
  const [dataVoucherSelect, setDataVoucherSelect] = useState([]);
  const [dataDiscountSelect, setDataDiscountSelect] = useState([]);
  const [sumService, setSumService] = useState(0);
  const [sumServiceTake, setSumServiceTake] = useState(0);
  const [clearDatavalue, setClearDatavalue] = useState(false);
  const [saveValue, setSaveValue] = useState(false);
  const [startDate, setSatartDate] = useState(new Date());
  const [alertCall, setAlertCall] = useState(false);
  const [heights, setHeights] = useState("5vh");
  const [valueChange, setValueChange] = useState();
  const [valueText, setValueText] = useState("");
  const [dialogProduct, setDialogProduct] = useState(false);
  const [openDialogSaleOrder, setOpenDialogSaleOrder] = useState(false);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataProductSelect, setDataProductSelect] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [dataOrderProduct, setDatOrderProduct] = useState([]);
  const [dataDepositSelect, setDataDepositSelect] = useState([]);
  const [flagOrder, setFlagOrder] = useState(false);
  const [flagPayment, setFlagPayment] = useState(true);
  const [print, setPrint] = useState(false);
  const [printTax, setPrintTax] = useState(false);
  const [save, setSave] = useState(false);
  const [creditDay, setCreditDay] = useState();
  const [creditDate, setCreditDate] = useState();
  const [saleOrderSelect, setSaleOrderSelect] = useState([]);
  const [saleOrderDetail, setSaleOrderDetail] = useState([]);

  const columnsOrderDetail = [
    {
      name: "ลำดับ",
      selector: (row, idx) => idx + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Barcode",
      selector: (row) => row.saledt_master_product_barcode_code,
      sortable: true,
    },
    {
      name: "ชื่อสินค้า",
      selector: (row) => row.saledt_master_product_billname,
      sortable: true,
    },
    {
      name: "หน่วยนับ",
      selector: (row) => row.saledt_master_product_barcode_unitname,
      sortable: true,
    },
    {
      name: "จำนวน",
      selector: (row, idx) => (
        <InputText
          style={{ width: "70%", borderColor: "#2F3A9E", borderRadius: "5px" }}
          type="number"
          defaultValue={row.saledt_qty}
          onChange={(e) => onChangeQtyProduct(e, row, idx)}
        />
      ),
      sortable: true,
      // right: true,
    },
    {
      name: "ราคา/หน่วย",
      selector: (row) => nf.format(row.saledt_saleprice),
      sortable: true,
    },
    {
      name: "ส่วนลด",
      selector: (row) => nf.format(row.saledt_discount_amnt),
      sortable: true,
      right: true,
    },
    {
      name: "มูลค่าต่อรายการ",
      selector: (row) => nf.format(row.saledt_netamnt),
      sortable: true,
      width: "220px",
      right: true,
    },
    {
      name: "คิดภาษี",
      selector: (row) =>
        row.saledt_vatflag == true ? (
          <CheckIcon color="success" />
        ) : (
          <ClearIcon color="disabled" />
        ),
      sortable: true,
    },
    {
      selector: (row, idx) => (
        <BtnDelete
          style={{ height: "70%" }}
          onClick={(row) => onClickdeleteOrder(row, idx)}
        />
      ),
      sortable: true,
      right: true,
    },
  ];

  const columnsOrder = [
    {
      name: "ใบสั่งขาย",
      selector: (row) => row.orderhd_docuno,
      sortable: true,
    },
  ];

  const columnsSaleOrderDetail = [
    {
      name: "ลำดับ",
      selector: (row, idx) => idx + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Barcode",
      selector: (row) => row.saledt_master_product_barcode_code,
      sortable: true,
    },
    {
      name: "ชื่อสินค้า",
      selector: (row) => row.saledt_master_product_billname,
      sortable: true,
    },
    {
      name: "หน่วยนับ",
      selector: (row) => row.saledt_master_product_barcode_unitname,
      sortable: true,
    },
    {
      name: "จำนวน",
      selector: (row) => row.saledt_qty,
      sortable: true,
      right: true,
    },
    // {
    //   name: "จำนวน",
    //   selector: (row, idx) => (
    //     <InputText
    //       style={{ width: "70%", borderColor: "#2F3A9E", borderRadius: "5px" }}
    //       type="number"
    //       defaultValue={row.orderdt_qty}
    //       onChange={(e) => onChangeQtyProduct(e, row, idx)}
    //     />
    //   ),
    //   sortable: true,
    //   right: true,
    // },
    {
      name: "ราคา/หน่วย",
      selector: (row) => nf.format(row.saledt_saleprice),
      sortable: true,
      right: true,
    },
    {
      name: "ส่วนลด",
      selector: (row) => nf.format(row.saledt_discount_amnt),
      sortable: true,
      right: true,
    },
    {
      name: "มูลค่าต่อรายการ",
      selector: (row) => nf.format(row.saledt_netamnt),
      sortable: true,
      right: true,
    },
    {
      name: "คิดภาษี",
      selector: (row) =>
        row.saledt_vatflag == true ? (
          <CheckIcon color="success" />
        ) : (
          <ClearIcon color="disabled" />
        ),
      sortable: true,
    },
    {
      selector: (row, idx) => (
        <BtnDelete
          style={{ height: "70%" }}
          onClick={() => onClickdeleteOrderInSaleOrder(row, idx)}
        />
      ),
      sortable: true,
      right: true,
    },
  ];

  useEffect(() => {
    setClearDatavalue(true);
    if (location.pathname == "/main/sale-credit") {
      setFlagPayment(false);
    } else {
      setFlagPayment(true);
    }
  }, [location.pathname, actions]);

  useEffect(() => {
    onChangeFilterProduct("");
  }, []);

  useEffect(() => {
    if (customerData) {
      getPaymentDetail();
      getDataDetail();
    }
  }, [customerData]);

  useEffect(() => {
    if (vatCredit) {
      getDataDetail();
    }
  }, [vatCredit]);

  useEffect(() => {
    getDataDetail();
  }, [dataOrderDetail, clearDatavalue]);

  useEffect(() => {
    if (dateDoc) {
      getDataOrderforSale();
      getPaymentDetail();
    }
  }, [dateDoc]);

  useEffect(() => {
    getPaymentDetail();
  }, [
    vochers,
    mathValue,
    dataCatSelect,
    clearDatavalue,
    amountPay,
    print,
    printTax,
    save,
  ]);

  useEffect(() => {
    if (saveValue == true) {
      setClearDatavalue(true);
    }
  }, [saveValue]);

  useEffect(() => {
    if (clearDatavalue == true) {
      ClearData();
    }
  }, [clearDatavalue]);

  useEffect(() => {
    getDataTableOrderTB();
  }, [dataOrderDetail, valueChange, valueText]);

  useEffect(() => {
    getPaymentDetail();
    if (print == true) {
      setPrint(false);
    }
    if (printTax == true) {
      setPrintTax(false);
    }
    if (save == true) {
      setSave(false);
    }
  }, [print, printTax, save]);

  const getDataOrderforSale = () => {
    let dataAPI = {
      company_id: parseInt(userCompanyID),
      branch_id: BranchData[0].master_branch_id,
      docdate: Moment(dateDoc).format("YYYYMMDD"),
    };
    axios
      .post(UrlApi() + "get_select_sale_transection_resale", dataAPI)
      .then((res) => {
        if (res.data.length > 0) {
          setFlagOrder(true);
          res.data.map((item, idx) => {
            item.activeclick = false;
            item.defaultExpanded = false;
          });
          let groupdatas = _.groupBy(res.data, "salehd_docuno");
          setDataOrderSale(groupdatas);
          getTableName(res.data);
          setSaveValue(false);
          setClearDatavalue(false);
        } else {
          setFlagOrder(false);
        }
      });
  };

  const getTableName = (datas) => {
    if (datas.length > 0) {
      datas.map((item, idx) => {
        if (tableName.length > 0) {
          tableName.map((its, isx) => {
            let findTable = _.findIndex(datas, { salehd_docuno: its.names });
            if (findTable >= 0) {
              datas[findTable]["activeclick"] = true;
            }
          });
        }
      });
      let datasname = [];
      let groupdatas = _.groupBy(datas, "orderhd_docuno");
      datas.map((item, idx) => {
        if (datasname.length > 0) {
          let finIndex = _.findIndex(datasname, {
            orderhd_docuno: item.orderhd_docuno,
          });
          if (finIndex < 0) {
            datasname.push(item);
          }
        } else if (groupdatas[item.orderhd_docuno]) {
          datasname.push(item);
        }
      });
      setTableData(datasname);
    }
  };

  const onClickAddProduct = () => {
    if (customerData.length < 1) {
      setAlertMessages("กรุณาเลือกกลุ่มลูกค้า");
      setAlerttWarning(true);
    } else {
      setDataProductSelect([]);
      setDialogProduct(true);
    }
  };

  const onClickdeleteOrder = (row, idx) => {
    let newData = [...dataOrderDetail];
    newData.splice(idx, 1);
    setDataOrderDetail(newData);
    setValueChange(idx);
  };

  const OnchangeCheckProduct = (data) => {
    data.forEach((item, idx) => {
      dataProductSelect.push(item);
    });
    onClickConfirmAddProduct();
  };

  const onClickdeleteOrderInSaleOrder = (row, idx) => {
   let newData = [...saleOrderDetail];
   newData.map((item)=>{
      if(item.orderdt.length > 1){
        item.orderdt.map((items, index)=>{
          if(items.saledt_orderdt_id === row.saledt_orderdt_id){
            dataOrderDetail.map((detail, idx)=>{
               if(detail.saledt_orderdt_id === row.saledt_orderdt_id){
                  dataOrderDetail.splice(idx, 1);
               }
            });
            item.orderdt.splice(index, 1);
          }
        });
      }
    });
    setSaleOrderDetail(newData);
  };

  const onChangeQtyProduct = (e, row, idx) => {
    if (e.target.value >= 0 && e.target.value !== "") {
      dataOrderDetail[idx]["saledt_qty"] = parseInt(e.target.value);
      dataOrderDetail[idx]["saledt_netamnt"] =
      parseInt(row.saledt_saleprice) * parseInt(e.target.value);
      setDataOrderDetail(dataOrderDetail);
      //setDataProductSelect(dataOrderDetail)
      getDataOrderFromProductSelect();
    } else {
      setAlertMessages("กรุณากรอกจำนวนให้ถูกต้อง");
      setAlerttWarning(true);
    }
  };

  const getDataOrderFromProductSelect = () => {
    let productBar = [];
    let dataAPI = {
      company_id: parseInt(userCompanyID),
      branch_id: BranchData[0].master_branch_id,
      customer_id: parseInt(customerData[0]["arcustomer_id"]),
      docdate: Moment(dateDoc).format("YYYYMMDD"),
    };
    dataOrderDetail.map((item, idx) => {
      let dataBarcode = {
        product_barcode_id: parseInt(item.saledt_master_product_barcode_id),
        barcode: item.saledt_master_product_barcode_code,
        qty: parseInt(item.saledt_qty),
        price: parseInt(item.saledt_saleprice),
        netamnt: parseInt(item.saledt_netamnt),
      };
      productBar.push(dataBarcode);
    });
    dataAPI.product_barcode = productBar;
    axios
      .post(UrlApi() + "get_product_barcode_for_sale_all", dataAPI)
      .then((res) => {
        if (res.data.length > 0) {
          setDataOrderDetail(res.data);
        }
      });
  };

  const onClickConfirmAddProduct = () => {
    if (customerData.length < 1) {
      setAlertMessages("กรุณาเลือกกลุ่มลูกค้า");
      setAlerttWarning(true);
    } else {
      let productBar = [];
      let dataAPI = {
        company_id: parseInt(userCompanyID),
        branch_id: BranchData[0].master_branch_id,
        customer_id: parseInt(customerData[0]["arcustomer_id"]),
        docdate: Moment(dateDoc).format("YYYYMMDD"),
      };

      dataProductSelect.map((item, idx) => {
        let dataBarcode = {
          product_barcode_id: item.master_product_barcode_id,
          barcode: item.master_product_barcode,
          qty: item.saledt_qty ? parseInt(item.saledt_qty) : 1,
          price: parseInt(item.master_product_price),
          netamnt:
            parseInt(item.master_product_price) *
            parseInt(item.saledt_qty ? parseInt(item.saledt_qty) : 1),
        };
        productBar.push(dataBarcode);
      });
      dataAPI.product_barcode = productBar;
      axios
        .post(UrlApi() + "get_product_barcode_for_sale_all", dataAPI)
        .then((res) => {
          if (res.data.length > 0) {
            res.data.map((item) => {
              dataOrderDetail.push(item);
            });
            setValueChange(res.data);
            setAlerttWarning(false);
            setValueText("");
          } else {
            setAlertMessages("ไม่พบข้อมูลนี้ในระบบ");
            setAlerttWarning(true);
          }
        });
    }
  };

  const onChangeAddOrder = (e) => {
    if (customerData.length < 1) {
      setAlertMessages("กรุณาเลือกกลุ่มลูกค้า");
      setAlerttWarning(true);
    } else {
      if (e.target.value.length > 0) {
        let dataAPI = {
          company_id: parseInt(userCompanyID),
          branch_id: BranchData[0].master_branch_id,
          barcode: e.target.value.trim(),
          customer_id: parseInt(customerData[0]["arcustomer_id"]),
          docdate: Moment(dateDoc).format("YYYYMMDD"),
          qty: 1,
        };
        axios
          .post(UrlApi() + "get_product_barcode_for_sale", dataAPI)
          .then((res) => {
            if (res.data.length > 0) {
              dataOrderDetail.push(res.data[0]);
              getDataOrderFromProductSelect();
              setValueText("");
              setValueChange(e);
            } else {
              setAlertMessages("ไม่พบข้อมูลสินค้านี้ในระบบ");
              setAlerttWarning(true);
              setValueText("");
              setValueChange(e);
            }
          });
        getInputTextBarcode();
        setAlerttWarning(false);
      }
    }
  };

  const onChangeFilterProduct = (value) => {
    setTextSearch(value);
    let dataAPI = {
      company_id: parseInt(userCompanyID),
      branch_id: BranchData[0].master_branch_id,
      text: value,
    };
    axios.post(UrlApi() + "filter_product", dataAPI).then((res) => {
      if (res.data) {
        res.data.map((item, idx) => {
          item.saledt_qty = 1;
        });
        setDataProduct(res.data);
      }
    });
  };

  const updateOrderStatus = (id, sta) => {
    let datas = {
      order_id: parseInt(id),
      status: parseInt(sta),
    };
    axios.post(UrlApi() + "update_orderstatus", datas).then((res) => {
      // console.log(res);
    });
  };

  const getSaleOrderDetail = (orderhId) => {
    const data = {
      company_id: parseInt(userCompanyID),
      branch_id: BranchData[0].master_branch_id,
      orderh_id: orderhId.length > 0 ? orderhId : [0],
    };
    axios.post(UrlApi() + "get_sale_order_detail", data).then((res) => {
      setSaleOrderDetail(res.data);
      res.data.map((item)=>{
        item.orderdt.map((items)=>{
          dataOrderDetail.push(items)
        })
      });
    });
  };


  const getDatasOrderdertailForCus = () => {
    if (dataHeadtable.length > 0) {
      let datasOrders = [];
      let order_hd = [];
      dataHeadtable.map((item, idx) => {
        order_hd.push(parseInt(item.orderhd_id));
      });
      let datas = {
        company_id: parseInt(userCompanyID),
        branch_id: BranchData[0].master_branch_id,
        orderh_id: order_hd,
        customer_id: parseInt(customerData[0]["arcustomer_id"]),
        docdate: Moment(dateDoc).format("YYYYMMDD"),
      };
      setLoading(true);
      axios.post(UrlApi() + "getsaledt_master_product", datas).then((res) => {
        if (res.data) {
          res.data.map((its, ids) => {
            datasOrders.push(its);
          });
        }
        let groupdatas = _.groupBy(
          datasOrders,
          "master_order_location_type_id"
        );
        setDatadetailGroupService(groupdatas);
        setValueClick("");
      });
      setDataOrderDetail(datasOrders);
      setLoading(false);
    }
  };

  const ClearData = () => {
    getDataDetail();
    setSaleOrderSelect([]);
    setSaleOrderDetail([]);
    getDataDocument();
    setTableData([]);
    setTableName([]);
    setDataOrder([]);
    setTableData([]);
    setDataHeadtable([]);
    setDataProductSelect([]);
    setDataOrderDetail([]);
    setAmountPay(0);
    setDataOrder([]);
    setDataVatSelect([]);
    setDataHeadtable([]);
    setDataCatSelect([]);
    setDatapointSelect([]);
    setDataDiscountSelect([]);
    setTableName([]);
    setValueText("");
    setTextSearch("");
    setClearDatavalue(false);
    setSaveValue(false);
  };

  const onClickClear = () => {
    setClearDatavalue(true);
    setSatartDate(new Date());
    ClearData();
  };

  const onClickTable = (name, data, status) => {
    if (customerData.length > 0) {
      let finIndex = _.findIndex(tableData, {
        salehd_docuno: data.salehd_docuno,
      });
      tableData[finIndex]["activeclick"] = !tableData[finIndex]["activeclick"];
      if (status == 1 && data.activeclick == true) {
        let findTB = _.findIndex(tableName, { salehd_docuno: name });
        if (findTB < 0) {
          tableName.push({ salehd_docuno: data.salehd_docuno });
        }
        updateOrderStatus(data.salehd_id, 2);
        setValueClick(name);
        let datasname = [];
        let groupdatas = _.groupBy(dataOrderSale[name], "orderhd_docuno");
        groupdatas[data.orderhd_docuno].map((item, idx) => {
          dataHeadtable.push(item);
        });
        setDataOrder(dataHeadtable);
        getDatasOrderdertailForCus();
      } else {
        updateOrderStatus(data.salehd_id, 1);
        let findTB = _.findIndex(tableName, {
          salehd_docuno: data.salehd_docuno,
        });
        tableName.splice(findTB, 1);
        let findOrder = _.findIndex(dataOrder, {
          salehd_docuno: data.salehd_docuno,
        });
        dataOrder.splice(findOrder, 1);
        let findOrderDetail = _.findIndex(dataOrderDetail, {
          saledt_orderhd_docuno: data.orderhd_docuno,
        });
        dataOrderDetail.splice(findOrderDetail, 1);
        setDataOrder(dataHeadtable);
        if (dataHeadtable.length == 0) {
          setDataOrderDetail([]);
          ClearData();
          getDataOrderforSale();
        }
        getDatasOrderdertailForCus();
      }
    } else {
      setAlertMessages("กรุณาเลือกลูกค้า");
      setAlerttWarning(true);
    }
  };

  const getInputTextBarcode = () => {
    return (
      <InputText
        type="text"
        style={{ height: "3vh", fontSize: "16px", width: "130%" }}
        defaultValue={valueText}
        value={valueText}
        autoFocus
        disabled={saleOrderSelect.length > 0 ? true : false}
        onKeyPress={(e) => (e.key === "Enter" ? onChangeAddOrder(e) : null)}
        onChange={(e) => setValueText(e.target.value)}
      />
    );
  };

  const ExpandTableSubOrder = (row) => {
  
    return (
      <div style={{ marginLeft: "2%", marginBottom: "5%" }}>
        <DataTables
          customStyles={customStyles}
          data={row.orderdt}
          columns={columnsSaleOrderDetail}
        />
      </div>
    );
  };

  const getDataTableOrderTB = () => {
    return (
      <Card
        className="card_sale"
        style={{ minHeight: "32vh", maxHeight: "46vh", marginTop: "1%" }}
      >
        <div className="card_head">
          <p className="textH_Left">รายละเอียดการขาย</p>
        </div>
        <Card.Body className="card_body_doc">
          <div
            style={{ minHeight: "30vh", maxHeight: "45vh", overflow: "auto" }}
          >
            <div class="row">
              <div class="col-2">{getInputTextBarcode()}</div>
              <div class="col-1">
                <BtnAdd
                  style={{
                    height: "3.2vh",
                    width: "100%",
                    backgroundColor: saleOrderSelect.length > 0 ? "gray" : "#74E0C0" ,
                  }}
                  disabled={saleOrderSelect.length > 0 ? true : false}
                  message="สินค้า"
                  onClick={() => onClickAddProduct()}
                  icons={<ZoomInIcon style={{ fontSize: "25px" }} />}
                />
              </div>
              <div class="col-1">
                <BtnAdd
                  style={{
                    height: "3.2vh",
                    width: "120%",
                    backgroundColor: "#FEAE5F",
                  }}
                  message="ล้างข้อมูล"
                  onClick={() => onClickClear()}
                />
              </div>
            </div>
            {
              dataOrderDetail.length > 0 && saleOrderSelect.length === 0 &&
                <div style={{ marginTop: "10px"}}>
                <DataTables
                  striped
                  dense
                  customStyles={customStyles}
                  data={dataOrderDetail}
                  columns={columnsOrderDetail}
                />
              </div> 
            }
            {
              saleOrderDetail.length > 0  &&
              <div
                style={{  marginTop: "10px", height: '30rem'}}
                >
                <DataTables
                  customStyles={customStyles}
                  data={saleOrderDetail}
                  columns={columnsOrder}
                  expandableRows
                  noDataComponent={
                    <p style={{ fontSize: "1vw", marginTop: "10px" }}>
                      ไม่พบข้อมูล
                    </p>
                  }
                  expandableRowExpanded={(row) => true}
                  expandableRowsComponent={(row) =>
                    ExpandTableSubOrder(row.data)
                  }
                />
            </div> 
            }
          </div>
        </Card.Body>
      </Card>
    );
  };

  const onCLickHeight = () => {
    if (heights == "5vh") {
      setHeights("50vh");
    } else {
      setHeights("5vh");
    }
  };

  const getDialogProduct = () => {
    return (
      <DialogProduct
        datadefault={[]}
        cleardata={clearDatavalue}
        onClose={(e) => setDialogProduct(e)}
        openDialog={dialogProduct}
        onClick={(data) => OnchangeCheckProduct(data)}
      />
    );
  };

  const getDialogSaleOrder = () => {
    return (
      <DialogSaleOrder
        customerData={customerData}
        datadefault={saleOrderSelect}
        cleardata={clearDatavalue}
        onClose={(e) => setOpenDialogSaleOrder(e)}
        openDialog={openDialogSaleOrder}
        onClick={(data) => {
            let orderhd_id = [];
            data.map((item)=>{
              orderhd_id.push(parseInt(item.orderhd_id));
            });
            if(data.length === 0){
              setDataOrderDetail([]);
            }
            setSaleOrderSelect(data);
            getSaleOrderDetail(orderhd_id); 
        }}
      />
    );
  };

  const getAlertCall = () => {
    return (
      <Collapse in={alertCall}>
        <div
          style={{
            marginLeft: "70%",
            marginTop: "1%",
            marginRight: "5%",
            zIndex: 1,
            position: "absolute",
          }}
        >
          <Stack sx={{ width: "120%" }} spacing={2}>
            <Alert
              style={{
                border: "2px",
                borderStyle: "solid",
                borderColor: "#FCC963",
                height: heights,
              }}
              severity="warning"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setAlertCall(false)}
                >
                  รับทราบ{" "}
                </Button>
              }
            >
              <AlertTitle>
                <strong>เรียกพนักงาน</strong>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => onCLickHeight()}
                >
                  (ดูเพิ่มเติม){" "}
                </Button>
              </AlertTitle>
            </Alert>
          </Stack>
        </div>
      </Collapse>
    );
  };

  const getDataDocument = () => {
    return (
      <>
        <DataDocument
          tableNames={tableName}
          onChangecustomers={(e) => {setCustomerData(e)}}
          onChangeDatedoc={(e) => setDateDoc(e)}
          onChangeRemark={(e) => {setRemark(e)}}
          onChangeDoccode={(e) => setDocCode(e)}
          dataOrderDetail={dataOrderDetail}
          saleOrderSelect={saleOrderSelect}
          dataOrder={dataOrder}
          startDate={startDate}
          clearDatavalue={clearDatavalue}
          flagPayment={flagPayment}
          setOpenDialogSaleOrder={setOpenDialogSaleOrder}
        />
      </>
    );
  };

  const getDataDetail = () => {
    return (
      <>
        <DataDetail
          customersData={customerData}
          vatsCredit={vatCredit}
          datadetailGroups={datadetailGroupService}
          dataOrderdetails={dataOrderDetail}
          onChangeVoucher={(e) => setVouchers(e)}
          onchangeAmount={(e) => {
            setAmountPay(e)
          }}
          onChagePoints={(e) => setDataPointCus(e)}
          onChagePointSelect={(e) => setDatapointSelect(e)}
          onChangePointType={(e) => setDatapointType(e)}
          onChangeTaxsBase={(e) => setTaxsBase(e)}
          onChangeTaxs={(e) => setTaxs(e)}
          onChangeDiscount={(e) => setDiscount(e)}
          onChageMathvalue={(e) => setMathValue(e)}
          onChangeAmountTotals={(e) => setAmountTotal(e)}
          onChageSumProvat={(e) => setSumProductVat(e)}
          onChageSumProNovat={(e) => setSumProductNoVat(e)}
          onChangeDataVatSelect={(e) => setDataVatSelect(e)}
          onChangeDataDiscountSelect={(e) => setDataDiscountSelect(e)}
          onChangeDataVoucherSelect={(e) => setDataVoucherSelect(e)}
          onChangeDataCatSelect={(e) => setDataCatSelect(e)}
          onChangeCat={(e) => setCatValue(e)}
          onChangeServiceTake={(e) => setSumServiceTake(e)}
          onChangeService={(e) => setSumService(e)}
          clearDatavalue={clearDatavalue}
          onChangeDepositSelect={(e) => setDataDepositSelect(e)}
          flagPayment={flagPayment}
          onChangeCreditDay={(e) => setCreditDay(e)}
          onChangeCreditDate={(e) => setCreditDate(e)}
          onClickPrint={(e) => setPrint(e)}
          onClickPrintTax={(e) => setPrintTax(e)}
          onClickSave={(e) => setSave(e)}
        />
      </>
    );
  };

  const getPaymentDetail = () => {
    return (
      <>
        <DetailPayment
          customersData={customerData}
          datesDoc={dateDoc}
          tableName={tableName}
          datapointCus={dataPointCus}
          datapointSelect={datapointSelect}
          datapointType={datapointType}
          onChangeVatredit={(e) => setVatCredit(e)}
          discount={discount}
          docCode={docCode}
          remark={remark}
          amountTotals={amountPay}
          vouchersValue={vochers}
          amountTotal={amountTotal}
          mathValue={mathValue}
          taxs={taxs}
          taxsBase={taxsBase}
          sumProductNoVat={sumProductNoVat}
          sumProductVat={sumProductVat}
          dataCatSelect={dataCatSelect}
          dataVatSelect={dataVatSelect}
          dataVoucherSelect={dataVoucherSelect}
          dataDiscountSelect={dataDiscountSelect}
          catValue={catValue}
          sumService={sumService}
          sumServiceTake={sumServiceTake}
          dataOrderdetails={dataOrderDetail}
          cleardata={clearDatavalue}
          onChangeSave={(e) => setSaveValue(e)}
          dataOrder={dataOrder}
          startDate={startDate}
          dataDepositSelect={dataDepositSelect}
          flagPayment={flagPayment}
          print={print}
          printTax={printTax}
          save={save}
          creditDay={creditDay}
          creditDate={creditDate}
        />
      </>
    );
  };

  const getAlert = () => {
    return (
      <>
        <div style={{ marginRight: "30px" }}>
          <AlertSuccess
            isOpen={alertSuccess}
            openAlert={() => setAlertSuccess(false)}
            messages={alertMessages}
          />
          <AlertWarning
            isOpen={alertWarning}
            openAlert={() => setAlerttWarning(false)}
            messages={alertMessages}
          />
        </div>
      </>
    );
  };

  return (
    <div style={{ marginRight: "1%", marginLeft: "1%", marginTop: "10px" }}>
      {getAlertCall()}
      {getDialogProduct()}
      {getDialogSaleOrder()}
      {loading && <Loading style={{ left: "47%", left: "46%" }} />}
      <div>
        <div class="row">
          {getAlert()}
          <div class={flagPayment == true ? "col-9" : "col-12"}>
            {getDataDocument()}
            {getDataTableOrderTB()}
            {getDataDetail()}
          </div>
          <div class="col-3">{getPaymentDetail()}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(Sale);
