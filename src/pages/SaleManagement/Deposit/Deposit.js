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
import InputText from "../../../components/Input/InputText";
import InputSwitch from "../../../components/Input/InputSwitch";
import DataTables from "react-data-table-component";
import DataTable from "../../../components/Datatable/Datatables";
import SelectDate from "../../../components/DatePicker/DatePicker";
import BtnAdd from "../../../components/Button/BtnAdd";
import BtnEdit from "../../../components/Button/BtnEdit";
import BtnCancel from "../../../components/Button/BtnCancel";
import BtnCancelDoc from "../../../components/Button/BtnCancelDoc";
import BtnDelete from "../../../components/Button/BtnDelete";
import Btnsubmit from "../../../components/Button/BtnSubmit";
import Moment from "moment";
import Card from "react-bootstrap/Card";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Radio,
} from "@mui/material";
import AlertError from "../../../components/Alert/AlertError";
import AlertSuccess from "../../../components/Alert/AlertSuccess";
import AlertWarning from "../../../components/Alert/AlertWarning";
import Loading from "../../../components/Loading/Loading";
import InputSelect from "../../../components/Input/InputSelect";
import Search from "@mui/icons-material/Search";
import UrlApi from "../../../url_api/UrlApi";
import * as SiIcons from "react-icons/si";
import _ from "lodash";
import "../../../components/CSS/report.css";
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import Swithstatus from "../../../components/SwitchStatus/Switchstatus";
import th from "date-fns/locale/th";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@tarzui/date-fns-be";
import DatePicker, { registerLocale } from "react-datepicker";
import PathRouter from "../../../PathRouter/PathRouter";
import * as AiIcons from "react-icons/ai";
import SearchDialog from "../../../components/SearchDialog/SearchDialog";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import HistoryIcon from "@mui/icons-material/History";
import Icon from "@mdi/react";
import {
  mdiAccountMultiplePlusOutline,
  mdiContentSaveCheckOutline,
} from "@mdi/js";

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

const Deposit = () => {
  const userData = useContext(DataContext);
  const BranchData = useContext(DataContextBranchData);
  const [userCompanyID, setUserCompanyID] = useState(
    userData[0]["master_company_id"]
  );
  const nf = new Intl.NumberFormat("en-thai", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const [alertMessages, setAlertMessages] = useState("");
  const [dateUse, setDateUse] = useState(new Date());
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertWarning, setAlerttWarning] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogProduct, setOpenDialogProduct] = useState(false);
  const [dataCheck, setDataCheck] = useState([]);
  const [openDialogCredit, setOpenDialogCredit] = useState(false);
  const [openDialogCreditVat, setOpenDialogCreditVat] = useState(false);
  const [openDialogbookBank, setOpenDialogbookbank] = useState(false);
  const [openDialogTranfer, setOpenDialogTranfer] = useState(false);
  const [openDialogCusdetail, setOpenDialogCusdetail] = useState(false);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [dataCustomerTax, setDataCustomerTax] = useState([]);
  const [dataCustomerDefault, setDataCustomerDefault] = useState([]);
  const [dataservice, setDataService] = useState([]);
  const [dataProductDepos, setDataProductDepos] = useState([]);
  const [dataProductDeposSelect, setDataProductDeposSelect] = useState([]);
  const [dataDeposit, setDataDeposit] = useState([]);
  const [dataBookbank, setDataBookbank] = useState([]);
  const [dataBookbankCredit, setDataBookbankCredit] = useState([]);
  const [dataTranfer, setDataTranfer] = useState([]);
  const [dataCredit, setDataCredit] = useState([]);
  const [dataCardType, setDataCardType] = useState([]);
  const [dataCusPrint, setDataCusPrint] = useState([]);
  const [rateVatvalue, setRateVatvalue] = useState(0);
  const [taxBase, setTaxBase] = useState(0);
  const [taxs, setTaxs] = useState(0);
  const [vatCredit, setVatCredit] = useState(0);
  const [totalPriceDeposit, setTotalPriceDeposit] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [paymentValues, setPaymentValues] = useState(0);
  const [valueSumTranfer, setValueSumTranfer] = useState(0);
  const [valueSumCredit, setValueSumCredit] = useState(0);
  const [valueSumCreditNoVat, setValueSumCreditNoVat] = useState(0);
  const [currValue, setcurrValue] = useState(0);
  const [cashBack, setCashBack] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [printsLange, setPrintLange] = useState(0);
  const [printsName, setPrintName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [vateName, setVateName] = useState("");
  const [codeDoc, setCodeDoc] = useState("");
  const [vateID, setVateID] = useState("");
  const [remark, setRemark] = useState("");
  const [valueCredit, setValueCredit] = useState();
  const [valueCheck, setValueCheck] = useState();
  const [valueDelete, setValueDelete] = useState();
  const [Mathsvalue, setMathsvalue] = useState();
  const [valueTranfer, setValueTranfer] = useState();
  const [valuedelete, setValuedatlete] = useState();
  const [valueSumCurr, setValueSumCurr] = useState();
  const [disabledCredit, setDisabledCredit] = useState(false);
  const [disibleBtnAdd, setDisibleBtnAdd] = useState(false);
  const [checkCredit, setCheckCredit] = useState(false);
  const [checkTaxPrint, setCheckTaxPrint] = useState(false);
  const [disible, setDisible] = useState(false);

  const columnsdata = [
    {
      name: "ลำดับ",
      selector: (row) => row.row_num,
      sortable: false,
      width: "80px",
    },
    {
      name: "เลือก",
      selector: (row) => (
        <div style={{ marginLeft: "20%" }}>
          <FormControlLabel
            style={{ color: "black" }}
            control={
              <Radio
                defaultValue={row.defalutcus_active}
                checked={row.defalutcus_active}
                disabled={!row.arcustomer_active}
                value={row.arcustomer_id}
                onClick={(e) => {
                  OnchangeCheckCustomer(e, row);
                }}
              />
            }
          />{" "}
        </div>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "สถานะการใช้งาน",
      selector: (row) => (
        <>
          <Swithstatus value={row.arcustomer_active} />
        </>
      ),
      width: "150px",
    },
    {
      name: "รหัสลูกค้า",
      selector: (row) => row.arcustomer_code,
      sortable: true,
    },
    {
      name: "กลุ่มลูกค้า",
      selector: (row) => row.arcustomer_group_name,
      sortable: true,
    },
    {
      name: "ประเภทสมาชิก",
      selector: (row) => row.master_member_type_name,
      sortable: true,
    },
    {
      name: "เลขประจำตัวผู้เสียภาษี",
      selector: (row) => row.arcustomer_taxid,
      sortable: true,
    },
    {
      name: "คำนำหน้า",
      selector: (row) => row.master_title_name,
      sortable: true,
    },
    {
      name: "ชื่อ",
      selector: (row) => row.arcustomer_name,
      sortable: true,
      width: "350px",
    },
    {
      name: "ชื่อภาษาอังกฤษ",
      selector: (row) => row.arcustomer_name_eng,
      sortable: true,
    },
    {
      name: "จำนวนวันเครดิต",
      selector: (row) => row.arcustomer_creditday,
      sortable: true,
    },
    {
      name: "ประเภทบุคคล",
      selector: (row) => row.master_person_type_name,
      sortable: true,
    },
    {
      name: "ประเภทใน/ต่างประเทศ",
      selector: (row) => row.master_person_country_type_name,
      sortable: true,
    },
    {
      name: "ที่อยู่",
      selector: (row) => row.address_name,
      sortable: true,
      width: "350px",
    },
    {
      name: "เบอร์โทรศัพท์",
      selector: (row) => row.arcustomer_addr_tel,
      sortable: true,
    },
    {
      name: "แฟกซ์",
      selector: (row) => row.arcustomer_addr_fax,
      sortable: true,
    },
  ];

  const columnsdataproduct = [
    {
      name: "เลือก",
      selector: (row) => (
        <div style={{ marginLeft: "20%" }}>
          <FormControlLabel
            style={{ color: "black" }}
            control={
              <Checkbox
                style={{ color: "#6598F6" }}
                value={row.master_product_id}
                defaultChecked={row.defualt_check}
                checked={row.defualt_check}
                onClick={(e) => {
                  OnchangeCheckProduct(e, row);
                }}
              />
            }
          />{" "}
        </div>
      ),
      sortable: true,
      width: "90px",
    },
    {
      name: "Barcode",
      selector: (row) => row.master_product_code,
      sortable: true,
    },
    {
      name: "ชื่อ",
      selector: (row) => row.master_product_name_bill,
      sortable: true,
    },
    {
      name: "หน่วย",
      selector: (row) => row.master_product_barcode_unitname,
      sortable: true,
    },
    {
      name: "ชื่อใบแจ้งหนี้",
      selector: (row) => row.master_product_invoice_name,
      sortable: true,
    },
  ];

  const columnsdataDeposit = [
    {
      name: "ลำดับ",
      selector: (row, idx) => idx + 1,
      width: "70px",
    },
    {
      name: "Barcode",
      selector: (row) => row.master_product_code,
      sortable: true,
      width: "120px",
    },
    {
      name: "ชื่อ",
      selector: (row) => row.master_product_name_bill,
      sortable: true,
      width: "150px",
    },
    // {
    //   name: "ชื่อใบแจ้งหนี้",
    //   selector: (row) => row.master_product_invoice_name,
    //   sortable: true,
    //   width: "160px"
    // },
    {
      name: "จำนวน/หน่วย",
      selector: (row) => (
        <InputText
          style={{ height: "96%", minwidth: "60%", borderColor: "grey" }}
          type="number"
          value={row.depositdt_qty}
          onChange={(e) => onChangeText(e, row, "amount")}
        />
      ),
      sortable: true,
      width: "160px",
    },
    {
      name: "หน่วย",
      selector: (row) => row.master_product_barcode_unitname,
      sortable: true,
    },
    {
      name: "ราคา",
      selector: (row) => (
        <div style={{ textAlign: "right" }}>
          <InputText
            style={{ height: "96%", minWidth: "60%", borderColor: "grey" }}
            type="number"
            value={row.depositdt_saleprice > 0 ? row.depositdt_saleprice : ""}
            onChange={(e) => onChangeText(e, row, "price")}
          />
        </div>
      ),
      sortable: true,
    },
    {
      name: "มูลค่าสุทธิ",
      selector: (row) => (
        <div style={{ textAlign: "right" }}>
          {nf.format(row.depositdt_netamnt)}
        </div>
      ),
      sortable: true,
      width: "120px",
    },
    {
      selector: (row) => (
        <div style={{ textAlign: "right" }}>
          <BtnDelete onClick={() => onClickDeleteDeposit(row)} />
        </div>
      ),
    },
  ];

  const columnsdatabookbank = [
    {
      name: "เลือก",
      selector: (row) => (
        <div style={{ marginLeft: "20%" }}>
          <FormControlLabel
            style={{ color: "black" }}
            control={
              <Checkbox
                value={row.cq_bankbook_id}
                onClick={(e) => {
                  OnchangeCheckBookbank(e, row);
                }}
              />
            }
          />{" "}
        </div>
      ),
      sortable: true,
    },
    {
      name: "ลำดับ",
      selector: (row) => row.row_no,
      sortable: false,
      width: "80px",
    },
    {
      name: "บัญชีธนาคาร",
      selector: (row) => row.cq_bankbook_no,
      sortable: true,
    },
    {
      name: "ธนาคาร",
      selector: (row) => row.cq_bank_name,
      sortable: true,
    },
    {
      name: "ชื่อบัญชี",
      selector: (row) => row.cq_bankbook_name,
      sortable: true,
    },
  ];

  const columnbankTranfer = [
    {
      name: "ลำดับ",
      selector: (row) => row.row_num,
      sortable: false,
      width: "80px",
    },
    {
      name: "บัญชีธนาคาร",
      selector: (row) => row.cq_bankbook_no,
      sortable: true,
    },
    {
      name: "ธนาคาร",
      selector: (row) => row.cq_bank_name,
      sortable: true,
    },
    {
      name: "ชื่อบัญชี",
      selector: (row) => row.cq_bankbook_name,
      sortable: true,
    },
    {
      name: "มูลค่าเงินโอนที่ได้รับ",
      selector: (row) => (
        <InputText
          defaultValue={row.amount_tranfer}
          type="number"
          onChange={(e) => onChangevalueTanfer(e, row.cq_bankbook_id, row)}
        />
      ),
      sortable: true,
      width: "260px",
    },
    {
      selector: (row) => (
        <BtnDelete
          onClick={() => {
            OnchangeDeleteBookbank(row);
          }}
        />
      ),
      sortable: true,
      width: "130px",
    },
  ];

  const columnbankCredit = [
    {
      name: "ลำดับ",
      selector: (row) => row.row_num,
      sortable: false,
      width: "80px",
    },
    {
      name: "บัญชีธนาคาร",
      selector: (row) => row.cq_bankbook_no,
      sortable: true,
    },
    {
      name: "ธนาคาร",
      selector: (row) => row.cq_bank_name,
      sortable: true,
    },
    {
      name: "ชื่อบัญชี",
      selector: (row) => row.cq_bankbook_name,
      sortable: true,
      width: "200px",
    },
    {
      name: "ประเภทการชาร์ท",
      selector: (row, index) => (
        <InputSelect
          defaultValue={parseInt(row.cq_cardtype_id)}
          value={parseInt(row.cq_cardtype_id)}
          option={dataCardType}
          onChange={(e) => onClickSelectCardType(e, row, index)}
        />
      ),
      width: "200px",
      sortable: true,
    },
    {
      name: "เลขบัตร (4 หลักสุดท้าย)",
      selector: (row, index) => (
        <InputText
          type="number"
          defaultValue={row.number_credit}
          onChange={(e) => onChangeNumberCredit(e, row, index)}
        />
      ),
      width: "300px",
      sortable: true,
    },
    {
      name: "มูลค่า",
      selector: (row, index) => (
        <InputText
          type="number"
          defaultValue={row.amount_credits}
          onChange={(e) => onChangeAmountCredit(e, row, index)}
        />
      ),
      sortable: true,
    },
    {
      name: "Rate (%)",
      selector: (row) => row.cq_cardtype_bankfee,
      sortable: true,
    },
    {
      name: "ค่าธรรมเนียม",
      selector: (row) => row.vat_credit,
      sortable: true,
    },
    {
      name: "ยอดรวมตัดบัตร",
      selector: (row) => nf.format(row.sum_credit),
      sortable: true,
    },
    {
      name: "หมายเหตุ",
      selector: (row) => (
        <InputText
          type="text"
          defaultValue={row.remark}
          onChange={(e) => onChangeRmarkCredit(e, row)}
        />
      ),
      sortable: true,
    },
    {
      selector: (row) => (
        <BtnDelete
          onClick={() => {
            OnchangeDeleteBookbank(row);
          }}
        />
      ),
      sortable: true,
      width: "130px",
    },
  ];

  useEffect(() => {
    getDocCode();
    getDataServiccharge();
    getDataCustomer();
    getDataProductDeposit();
    getDataVat();
    getDataBranchRounding();
    getDataBookbankCredit();
    getDataBookbank();
    getDataCardType();
  }, []);

  useEffect(() => {
    getDialogProductDepos();
  }, [valueCheck]);

  useEffect(() => {
    getDataTableOrderTB();
  }, [valueDelete]);

  useEffect(() => {
    getValueAmount();
  }, [totalPriceDeposit, vatCredit, paymentValues]);

  useEffect(() => {
    getDataBookbankCredit();
    getDataBookbank();
  }, [paymentValues, valueSumCredit]);

  useEffect(() => {
    getCashback();
    getCurrValue();
  }, [
    totalPayment,
    paymentValues,
    valueSumCurr,
    valueSumTranfer,
    valueSumCreditNoVat,
    vatCredit,
  ]);

  useEffect(() => {
    getDataCustomer();
  }, [searchText]);

  useEffect(() => {
    if (alertSuccess == true) {
      setTimeout(() => {
        setAlertSuccess(false);
      }, 2000);
    }
  }, [alertSuccess]);

  const getDataBranchRounding = () => {
    let datas = {
      company_id: parseInt(userCompanyID),
      branch_id: BranchData[0].master_branch_id,
    };
    axios.post(UrlApi() + "getbranch_rounding", datas).then((res) => {
      if (res.data.length > 0) {
        setMathsvalue(res.data[0]["master_rounding_id"]);
      }
    });
  };

  const getDocCode = () => {
    let datas = {
      company_id: parseInt(userCompanyID),
      branch_id: BranchData[0].master_branch_id,
      doc_date: Moment(new Date()).format("YYYYMMDD"),
    };
    axios.post(UrlApi() + "get_deposit_codeDoc", datas).then((res) => {
      if (res.data) {
        setCodeDoc(res.data[0]["fn_generate_deposithd_docuno"]);
      }
    });
  };

  const getDataCustomer = () => {
    let datas = {
      company_id: parseInt(userData[0]["master_company_id"]),
      filter_text: searchText,
    };
    axios.post(UrlApi() + "filter_customer_data", datas).then((res) => {
      if (res.data) {
        res.data.map((item, idx) => {
          item.name = item.arcustomer_name;
          item.row_num = idx + 1;
          item.arcustomer_addrs = item.arcustomer_addr
            ? item.arcustomer_addr
            : "";
          item.master_addr_district_names = item.master_addr_district_name
            ? item.master_addr_district_name
            : "";
          item.master_addr_prefecture_names = item.master_addr_prefecture_name
            ? item.master_addr_prefecture_name
            : "";
          item.master_addr_province_names = item.master_addr_province_name
            ? item.master_addr_province_name
            : "";
          item.master_addr_postcode_codes = item.master_addr_postcode_code
            ? item.master_addr_postcode_code
            : "";
          item.address_name =
            item.arcustomer_addrs +
            " " +
            item.master_addr_district_names +
            " " +
            item.master_addr_prefecture_names +
            " " +
            item.master_addr_province_names +
            "" +
            item.master_addr_postcode_codes;
          item.defalutcus_active =
            dataCustomerDefault.length > 0
              ? dataCustomerDefault[0]["arcustomer_id"] == item.arcustomer_id
                ? true
                : false
              : false;
        });
        setDataCustomer(res.data);
        setDataCustomerTax(res.data);
      }
    });
  };

  const getDataVat = () => {
    const datas = {
      company_id: parseInt(userCompanyID),
      branch_id: BranchData[0].master_branch_id,
    };
    axios.post(UrlApi() + "getdata_vat", datas).then((res) => {
      if (res.data) {
        let vatName = res.data[0]["master_vat_group_name"];
        let vatRate = res.data[0]["master_vat_rate"];
        let vatid = res.data[0]["master_vat_group_id"];
        setRateVatvalue(vatRate);
        setVateName(vatName);
        setVateID(vatid);
      }
    });
  };

  const getDataServiccharge = () => {
    let datas = {
      company_id: parseInt(userCompanyID),
      branch_id: BranchData[0].master_branch_id,
    };
    axios.post(UrlApi() + "getservice_charge", datas).then((res) => {
      if (res.data) {
        setDataService(res.data);
      }
    });
  };

  const getDataProductDeposit = () => {
    let datas = {
      company_id: parseInt(userCompanyID),
    };
    axios.post(UrlApi() + "get_product_deposit", datas).then((res) => {
      if (res.data) {
        res.data.map((item, idx) => {
          item.defualt_check = false;
          item.depositdt_saleprice = 0;
          item.depositdt_qty = 1;
          item.depositdt_netamnt = 0;
        });
        setDataProductDepos(res.data);
      }
    });
  };

  const getDataCardType = () => {
    const datas = {
      company_id: parseInt(userData[0]["master_company_id"]),
    };
    axios.post(UrlApi() + "get_cardtype_data", datas).then((res) => {
      if (res.data) {
        res.data.map((item, iidx) => {
          item.charge_max_amnt = item.charge_max_amnt;
          item.cq_cardtype_bankfee = item.cq_cardtype_bankfee;
          item.id = item.cq_cardtype_id;
          item.value = item.cq_cardtype_name;
        });
        setDataCardType(res.data);
      }
    });
  };

  const getDataBookbank = () => {
    const datas = {
      company_id: parseInt(userData[0]["master_company_id"]),
    };
    axios.post(UrlApi() + "getdata_bookbanktranfer", datas).then((res) => {
      if (res.data) {
        let datas = [];
        res.data.map((item, idx) => {
          item.row_no = idx + 1;
          item.default_check = false;
          if (item.cq_bankbook_default_active == true) {
            item.amount_tranfer = parseFloat(paymentValues);
            datas.push(item);
          }
          item.amount_tranfer = parseFloat(paymentValues);
        });
        setDataBookbank(res.data);
        if (valueSumTranfer < 1) {
          setDataTranfer(datas);
        }
      }
    });
  };

  const getDataBookbankCredit = () => {
    const datas = {
      company_id: parseInt(userData[0]["master_company_id"]),
    };
    axios.post(UrlApi() + "getdata_bookbankcredit", datas).then((res) => {
      if (res.data) {
        let datas = [];
        res.data.map((item, idx) => {
          item.row_no = idx + 1;
          item.remark = "";
          item.sum_credit = 0;
          item.default_check = item.cq_bankbook_default_active;
          if (item.cq_bankbook_default_creditcard_active == true) {
            item.default_check = false;
            item.amount_credit = parseFloat(paymentValues);
            item.amount_credits = parseFloat(paymentValues);
            datas.push(item);
          }
          item.amount_credits = parseFloat(paymentValues);
        });
        setDataBookbankCredit(res.data);
        if (valueSumCredit < 1) {
          setDataCredit(datas);
        }
      }
    });
  };

  const getValueMath = (value) => {
    if (value) {
      if (Mathsvalue == 1) {
        return Math.round(parseFloat(value.toFixed(1)));
      } else if (Mathsvalue == 2) {
        return Math.round(value);
      } else if (Mathsvalue == 3) {
        return Math.floor(value);
      } else if (Mathsvalue == 4) {
        return parseFloat(value.toFixed(2));
      }
    } else {
      return 0.0;
    }
  };

  const OnchangeCheckBookbank = (e, row) => {
    if (e.target.value && checkCredit == false) {
      let Checksdefault = _.findIndex(dataBookbank, {
        cq_bankbook_id: row.cq_bankbook_id,
      });
      dataBookbank[Checksdefault]["default_check"] = e.target.checked;
    } else if (e.target.value && checkCredit == true) {
      let Checksdefault = _.findIndex(dataBookbankCredit, {
        cq_bankbook_id: row.cq_bankbook_id,
      });
      dataBookbankCredit[Checksdefault]["default_check"] = e.target.checked;
    }
  };

  const onClickAddBookbank = () => {
    let datas = [];
    if (checkCredit == false) {
      dataBookbank.map((item, idx) => {
        if (item.default_check == true) {
          let datas = {
            amount_tranfer: item.amount_tranfer,
            cq_bank_id: item.cq_bank_id,
            cq_bank_name: item.cq_bank_name,
            cq_bankbook_code: item.cq_bankbook_code,
            cq_bankbook_default_active: item.cq_bankbook_default_active,
            cq_bankbook_id: item.cq_bankbook_id,
            cq_bankbook_name: item.cq_bankbook_name,
            cq_bankbook_no: item.cq_bankbook_no,
          };
          dataTranfer.push(datas);
        }
      });
      //setDataTranfer(datas)
      setOpenDialogbookbank(!openDialogbookBank);
    } else if (checkCredit == true) {
      dataBookbankCredit.map((item, idx) => {
        if (item.default_check == true) {
          let datas = {
            amount_credits: item.amount_credits,
            charge_max_amnt: item.charge_max_amnt,
            cq_bank_id: item.cq_bank_id,
            cq_bank_name: item.cq_bank_name,
            cq_bankbook_code: item.cq_bankbook_code,
            cq_bankbook_id: item.cq_bankbook_id,
            cq_bankbook_name: item.cq_bankbook_name,
            cq_bankbook_no: item.cq_bankbook_no,
            cq_cardtype_bankfee: item.cq_cardtype_bankfee,
            cq_cardtype_id: item.cq_cardtype_id,
            datedoc: item.datedocs,
            default_check: item.default_check,
            remark: item.remark,
            sum_credit: item.sum_credit,
            vat_credit: item.vat_credit,
          };
          dataCredit.push(datas);
        }
      });
      //setDataCredit(datas)
      setOpenDialogbookbank(!openDialogbookBank);
    }
    dataBookbank.map((item, idx) => {
      item.default_check = false;
    });
    setDataBookbank(dataBookbank);
  };

  const getdefaultCheck = () => {
    if (dataCheck.length > 0 && dataCustomer.length > 0) {
      let Checks = _.findIndex(dataCustomer, {
        arcustomer_id: dataCheck[0]["arcustomer_id"].toString(),
      });
      if (Checks >= 0) {
        dataCustomer[Checks]["defalutcus_active"] = true;
      }
      setDataCustomer(dataCustomer);
    }
  };

  const onChangeDateUse = (e) => {
    if (e < new Date()) {
      setAlertMessages("ไม่สามารถเลือกวันที่ใช้บริการย้อนหลังได้");
      setAlerttWarning(true);
    } else {
      setDateUse(e);
    }
  };

  const OpenDialog = () => {
    getdefaultCheck();
    setOpenDialog(true);
  };

  const OnchangeCheckCustomer = (e, row) => {
    dataCustomer.map((item, idx) => {
      item.defalutcus_active = false;
    });
    if (e.target.value) {
      setDataCheck([row]);
      setDataCusPrint([row]);
    }
    setOpenDialogCusdetail(true);
    getDataDocument();
  };

  const OnchangeCheckProduct = (e, row) => {
    let findIdx = _.findIndex(dataProductDepos, {
      master_product_id: row.master_product_id,
    });
    dataProductDepos[findIdx]["defualt_check"] = e.target.checked;
    if (e.target.checked == true) {
      dataProductDeposSelect.push(row);
    } else {
      let findIndex = _.findIndex(dataProductDeposSelect, {
        master_product_id: row.master_product_id,
      });
      dataProductDeposSelect.splice(findIndex, 1);
    }
    setValueCheck(row);
  };

  const onClickAddProduct = () => {
    setDataDeposit(dataProductDeposSelect);
    setOpenDialogProduct(false);
    getSumDeposit();
  };

  const onClickDeleteDeposit = (row) => {
    let findIndex = _.findIndex(dataDeposit, {
      master_product_id: row.master_product_id,
    });
    dataDeposit.splice(findIndex, 1);
    setValueDelete(row);
    getSumDeposit();
  };

  const onClickCancleProduct = () => {
    setOpenDialogProduct(false);
  };

  const onChangeText = (e, row, action) => {
    let findIndex = _.findIndex(dataDeposit, {
      master_product_id: row.master_product_id,
    });
    if (action == "price") {
      dataDeposit[findIndex]["depositdt_saleprice"] = e.target.value;
    } else {
      dataDeposit[findIndex]["depositdt_qty"] = parseInt(e.target.value);
    }
    dataDeposit[findIndex]["depositdt_netamnt"] =
      parseFloat(dataDeposit[findIndex]["depositdt_saleprice"]) *
      parseFloat(dataDeposit[findIndex]["depositdt_qty"]);
    getSumDeposit();
    setValueDelete(e);
  };

  const onChangevalueTanfer = (e, id, row) => {
    if (e.target.value < 0) {
      setAlertMessages("กรุณากรอกมูลค่าให้ถูกต้อง");
      setAlerttWarning(true);
      setDisibleBtnAdd(true);
    } else {
      let findData = _.findIndex(dataTranfer, { row_num: row.row_num });
      let findBank = _.findIndex(dataBookbank, { row_no: row.row_num });
      dataTranfer[findData]["amount_tranfer"] = e.target.value;
      dataBookbank[findBank]["amount_tranfer"] = e.target.value;
      setDisibleBtnAdd(false);
      setValueTranfer(e);
    }
  };

  const OnchangeDeleteBookbank = (row) => {
    if (checkCredit == false) {
      let findIndex = _.findIndex(dataTranfer, {
        cq_bankbook_id: row.cq_bankbook_id,
      });
      dataTranfer.splice(findIndex, 1);
      setValuedatlete(row);
      let Checksdefault = _.findIndex(dataBookbank, {
        cq_bankbook_id: row.cq_bankbook_id,
      });
      dataBookbank[Checksdefault]["default_check"] = false;
      var sumTranfer = _.sumBy(dataTranfer, "amount_tranfer");
      setValueSumTranfer(sumTranfer);
    } else if (checkCredit == true) {
      let findIndex = _.findIndex(dataCredit, {
        cq_bankbook_id: row.cq_bankbook_id,
      });
      dataCredit.splice(findIndex, 1);
      setValuedatlete(row);
      let Checksdefault = _.findIndex(dataBookbankCredit, {
        cq_bankbook_id: row.cq_bankbook_id,
      });
      dataBookbankCredit[Checksdefault]["default_check"] = false;
      getSumVatCredit();
    }
  };

  const getSumDeposit = () => {
    dataDeposit.map((item, idx) => {
      item.depositdt_saleprice = item.depositdt_saleprice
        ? parseFloat(item.depositdt_saleprice)
        : 0;
      item.depositdt_netamnt = parseFloat(item.depositdt_netamnt);
    });
    let SumPrice = _.sumBy(dataDeposit, "depositdt_saleprice,");
    let SumTotal = _.sumBy(dataDeposit, "depositdt_netamnt");
    setTotalPriceDeposit(SumTotal);
    setTotalOrder(SumTotal);
  };

  const getValueAmount = () => {
    let amountTotals = 0;
    let taxValue = 0;
    let taxs = 0;
    if (parseFloat(vatCredit) > 0) {
      setTotalPayment(getValueMath(totalPriceDeposit) + parseFloat(vatCredit));
      setPaymentValues(getValueMath(totalPriceDeposit) + parseFloat(vatCredit));
    } else {
      setTotalPayment(getValueMath(totalPriceDeposit));
      setPaymentValues(getValueMath(totalPriceDeposit));
    }

    let amount = parseFloat(totalPayment);
    if (vateID == 4) {
      taxValue =
        (parseFloat(amount) * parseFloat(rateVatvalue)) /
        (100 + parseFloat(rateVatvalue));
      taxs = parseFloat(amount) - parseFloat(taxValue);
      amountTotals = parseFloat(amount);
    } else if (vateID == 5) {
      taxValue = (parseFloat(amount) * parseFloat(rateVatvalue)) / 100;
      taxs = parseFloat(amount);
      amountTotals = parseFloat(amount) + parseFloat(taxValue);
    }
    setTaxs(taxValue);
    setTaxBase(taxs);
  };

  const onClickAddTranferData = () => {
    let findIndex = _.findIndex(dataTranfer, { amount_tranfer: "0" });
    if (findIndex >= 0) {
      setAlertMessages("กรุณากรอกจำนวนเงินให้มากกว่า 0");
      setAlerttWarning(true);
    }
    var sumTranfer = _.sumBy(dataTranfer, "amount_tranfer");
    setValueSumTranfer(sumTranfer);
    setOpenDialogTranfer(false);
  };

  const onClickAddCreditData = () => {
    let sumAmount = _.sumBy(dataCredit, "amount_credits");
    let sumVat = _.sumBy(dataCredit, "vat_credit");
    let sumCredit = parseFloat(sumAmount) + parseFloat(sumVat);
    setValueSumCreditNoVat(parseFloat(sumAmount));
    setValueSumCredit(parseFloat(sumCredit));
    setVatCredit(sumVat);
    setOpenDialogCredit(false);
  };

  const onClickSelectCardType = (e, row, idx) => {
    if (e.target.value) {
      setDisabledCredit(false);
      let findData = _.findIndex(dataCardType, {
        cq_cardtype_id: parseInt(e.target.value),
      });
      let findDatabank = idx;
      dataCredit[findDatabank]["charge_max_amnt"] = parseInt(
        dataCardType[findData]["charge_max_amnt"]
      );
      dataCredit[findDatabank]["cq_cardtype_bankfee"] =
        dataCardType[findData]["cq_cardtype_bankfee"];
      dataCredit[findDatabank]["cq_cardtype_id"] =
        dataCardType[findData]["cq_cardtype_id"];
      setDataCredit(dataCredit);
      if (
        parseInt(dataCredit[findDatabank]["amount_credits"]) <=
        parseInt(dataCredit[findDatabank]["charge_max_amnt"])
      ) {
        let vat_credit =
          (parseFloat(dataCredit[findDatabank]["amount_credits"]) *
            parseFloat(dataCredit[findDatabank]["cq_cardtype_bankfee"])) /
          100;
        dataCredit[findDatabank]["vat_credit"] = parseFloat(
          vat_credit.toFixed(2)
        );
        let amounts = dataCredit[findDatabank]["amount_credits"];
        dataCredit[findDatabank]["sum_credit"] =
          parseFloat(vat_credit.toFixed(2)) + parseFloat(amounts.toFixed(2));
        setValueCredit(e.target.value, row);
      } else if (
        parseInt(dataCredit[findDatabank]["amount_credits"]) >
        parseInt(dataCredit[findDatabank]["charge_max_amnt"])
      ) {
        //dataCredit[findData]['sum_credit'] = dataCredit[findData]['amount_credits']
        let amounts = dataCredit[findDatabank]["amount_credits"];
        dataCredit[findDatabank]["vat_credit"] = 0;
        dataCredit[findDatabank]["sum_credit"] = parseFloat(amounts.toFixed(2));
      }
      setDisabledCredit(false);
      setValueCredit(idx);
    } else {
      setDisabledCredit(true);
    }
  };

  const onChangeNumberCredit = (e, row, idx) => {
    if (e.target.value) {
      dataCredit.map((item, idx) => {
        if (
          item.cq_bank_id == row.cq_bank_id &&
          item.cq_cardtype_id == row.cq_cardtype_id
        ) {
          item.number_credit = e.target.value;
        }
      });
    }
  };

  const onChangeAmountCredit = (e, row, index) => {
    if (e.target.value < 0) {
      setAlertMessages("กรุณากรอกมูลค่าให้ถูกต้อง");
      setAlerttWarning(true);
      setDisabledCredit(true);
    } else {
      let findData = index;
      if (dataCredit[findData]["cq_cardtype_id"]) {
        dataCredit[findData]["amount_credits"] = e.target.value;
        if (
          parseInt(e.target.value) <=
          parseInt(dataCredit[findData]["charge_max_amnt"])
        ) {
          let vat_credit =
            (parseInt(e.target.value) *
              parseInt(dataCredit[findData]["cq_cardtype_bankfee"])) /
            100;
          dataCredit[findData]["vat_credit"] = vat_credit;
          let amounts = dataCredit[findData]["amount_credits"];
          dataCredit[findData]["sum_credit"] =
            parseFloat(amounts) + parseFloat(vat_credit);
          getSumVatCredit();
        } else {
          dataCredit[findData]["sum_credit"] =
            dataCredit[findData]["amount_credits"];
          dataCredit[findData]["vat_credit"] = 0;
          getSumVatCredit();
        }
        setDataCredit(dataCredit);
        setValueCredit(e.target.value, row);
      } else {
        setAlertMessages("กรุณาเลือกประเภทการชาร์ท");
        dataCredit[findData]["amount_credits"] = 0;
        setAlerttWarning(true);
        setDisabledCredit(true);
        setValueCredit(e.target.value, row);
      }
    }
  };

  const getSumVatCredit = () => {
    dataCredit.map((item, idx) => {
      item.amount_credits = item.amount_credits
        ? parseFloat(item.amount_credits)
        : 0;
      item.vat_credit = item.vat_credit ? parseFloat(item.vat_credit) : 0;
    });
    let sumamount = _.sumBy(dataCredit, "amount_credits");
    let sumVat = _.sumBy(dataCredit, "vat_credit");
    let sumCre = parseFloat(sumamount) + parseFloat(sumVat);
    setValueSumCredit(sumCre);
  };

  const onChangeRmarkCredit = (e, row) => {
    if (e.target.value) {
      let findData = _.findIndex(dataCredit, {
        cq_bankbook_id: row.cq_bankbook_id,
      });
      dataCredit[findData]["remark"] = e.target.value;
    }
  };

  const onChangeCurrency = (e) => {
    if (e.target.value < 0) {
      setAlertMessages("กรุณากรอก มูลค่าให้ถูกต้อง");
      setAlerttWarning(true);
      setDisibleBtnAdd(true);
    } else {
      if (e.target.value > 0) {
        setValueSumCurr(e.target.value);
      } else {
        setValueSumCurr(0);
      }
    }
  };

  const getCashback = () => {
    let totalSum = 0;
    let valueSumCurrs = valueSumCurr ? valueSumCurr : 0;
    totalSum =
      parseFloat(valueSumCurrs) +
      parseFloat(valueSumTranfer) +
      parseFloat(valueSumCredit);
    let difftotal;
    if (totalSum > 0) {
      if (parseFloat(totalPayment) < parseFloat(totalSum)) {
        difftotal = parseFloat(totalSum) - parseFloat(totalPayment);
        if (difftotal > 0) {
          setPaymentValues(0);
          setCashBack(difftotal);
        } else {
          let diffpay = parseFloat(totalPayment) - parseFloat(totalSum);
          setPaymentValues(diffpay);
          setCashBack(0);
        }
      } else if (parseFloat(totalPayment) > parseFloat(totalSum)) {
        difftotal = parseFloat(totalPayment) - parseFloat(totalSum);
        setCashBack(0);
        setPaymentValues(difftotal);
      } else if (parseFloat(totalPayment) == parseFloat(totalSum)) {
        setPaymentValues(0);
        setCashBack(0);
      }
    }
  };

  const getCurrValue = () => {
    let diff;
    let cashbacks;
    let valueSumCurrs = valueSumCurr ? valueSumCurr : 0;
    let totalSum = 0;
    totalSum =
      parseFloat(valueSumCurrs) +
      parseFloat(valueSumTranfer) +
      parseFloat(valueSumCredit);
    if (parseFloat(totalPayment) > parseFloat(totalSum)) {
      cashbacks = parseFloat(totalPayment) - parseFloat(totalSum);
    } else {
      cashbacks = parseFloat(totalSum) - parseFloat(totalPayment);
    }
    if (parseInt(valueSumCurr) == 0) {
      diff = 0;
    } else if (parseFloat(valueSumCurr) > parseFloat(cashbacks)) {
      diff = parseFloat(valueSumCurr) - parseFloat(cashbacks);
    } else {
      diff = 0;
    }
    setcurrValue(diff);
    getCashback();
  };

  const onClickClearData = () => {
    setValueSumCredit(0);
    setValueTranfer(0);
    setValueSumCurr(0);
    setCashBack(0);
    setTaxBase(0);
    setTaxs(0);
    setValueSumTranfer(0);
    setTotalOrder(0);
    setTotalPayment(0);
    setTotalPriceDeposit(0);
    setPaymentValues(0);
    setVatCredit(0);
    setDateUse(new Date());
    setDataDeposit([]);
    setDataProductDeposSelect([]);
    setDataCheck([]);
    setDataCredit([]);
    setDataTranfer([]);
    setRemark("");
    setPrintName("");
    setPrintLange();
    getDataProductDeposit();
    getDataBookbank();
    getDataBookbankCredit();
  };

  const onClickAddDeposit = () => {
    setDisible(true);
    if (dataCheck.length <= 0) {
      setAlertMessages("กรุณาเลือกกลุ่มลูกค้า");
      setAlerttWarning(true);
      setDisible(false);
    } else if (dataDeposit.length <= 0) {
      setAlertMessages("กรุณาเลือกรายการค่ามัดจำ");
      setAlerttWarning(true);
      setDisible(false);
    } else if (valueSumCurr > totalPayment) {
      setAlertMessages("มูลค่าเงินสดมากกว่ามูลค่าที่ต้องชำระ");
      setAlerttWarning(true);
      setDisible(false);
    } else {
      setDisible(true);
      let dataDepsitHds = [];
      let dataDepsitHd = {
        deposithd_docudate: Moment(new Date()).format("YYYYMMDD"),
        deposithd_docuno: codeDoc,
        deposithd_status_id: 1,
        deposithd_empemployeemasterid: parseInt(
          userData[0]["emp_employeemasterid"]
        ),
        deposithd_arcustomerid: dataCheck[0]["arcustomer_id"]
          ? parseInt(dataCheck[0]["arcustomer_id"])
          : null,
        deposithd_arcustomer_name: dataCheck[0]["arcustomer_name"]
          ? dataCheck[0]["arcustomer_name"]
          : null,
        deposithd_arcustomer_taxid: dataCheck[0]["arcustomer_taxid"]
          ? dataCheck[0]["arcustomer_taxid"]
          : null,
        deposithd_arcustomer_addr: dataCheck[0]["arcustomer_addr"]
          ? dataCheck[0]["arcustomer_addr"]
          : null,
        deposithd_arcustomer_addr_district_id: dataCheck[0][
          "arcustomer_addr_district_id"
        ]
          ? dataCheck[0]["arcustomer_addr_district_id"]
          : null,
        deposithd_arcustomer_addr_prefecture_id: dataCheck[0][
          "arcustomer_addr_prefecture_id"
        ]
          ? dataCheck[0]["arcustomer_addr_prefecture_id"]
          : null,
        deposithd_arcustomer_addr_province_id: dataCheck[0]["addr_province_id"]
          ? dataCheck[0]["addr_province_id"]
          : null,
        deposithd_arcustomer_addr_postcode_id: dataCheck[0]["addr_postcode_id"]
          ? dataCheck[0]["addr_postcode_id"]
          : null,
        deposithd_remark: remark,
        deposithd_vatgroup_id: vateID ? parseInt(vateID) : null,
        deposithd_vatrate: rateVatvalue ? parseInt(rateVatvalue) : 0,
        deposithd_totalexcludeamnt: totalPriceDeposit
          ? parseFloat(totalPriceDeposit.toFixed(2))
          : 0,
        deposithd_totalincludeamnt: totalPayment
          ? parseFloat(totalOrder.toFixed(2))
          : 0,
        deposithd_totalincludeamnt_afterdepositamnt: 0,
        deposithd_baseamnt: taxBase > 0 ? parseFloat(taxBase.toFixed(2)) : 0,
        deposithd_vatamnt: taxs > 0 ? parseFloat(taxs.toFixed(2)) : 0,
        deposithd_sumgoodamnt:
          totalPriceDeposit > 0 ? parseFloat(totalPriceDeposit.toFixed(2)) : 0,
        deposithd_discountamnt: 0,
        deposithd_netamnt:
          totalPayment > 0 ? parseFloat(totalPayment.toFixed(2)) : 0,
        deposithd_cashamnt:
          valueSumCurr > 0
            ? parseFloat(parseFloat(valueSumCurr).toFixed(2))
            : 0,
        deposithd_transferamnt:
          valueSumTranfer > 0 ? parseFloat(valueSumTranfer.toFixed(2)) : 0,
        deposithd_creditcardamnt:
          valueSumCredit > 0 ? parseFloat(valueSumCredit.toFixed(2)) : 0,
        master_branch_id: BranchData[0].master_branch_id,
        master_company_id: parseInt(userData[0]["master_company_id"]),
        deposithd_dateused: Moment(dateUse).format("YYYYMMDD"),
        deposithd_feeamnt: vatCredit > 0 ? parseFloat(vatCredit.toFixed(2)) : 0,
      };
      dataDepsitHds.push(dataDepsitHd);

      let dataDetails = [];
      dataDeposit.map((item, idx) => {
        let datas = {
          depositdt_listno: idx + 1,
          depositdt_master_product_id: parseInt(item.master_product_id),
          depositdt_master_product_billname: item.master_product_name_bill,
          depositdt_master_product_barcode_id: parseInt(
            item.master_product_barcode_id
          ),
          depositdt_master_product_barcode_unit_id: parseInt(
            item.master_product_barcode_unitid
          ),
          depositdt_qty: parseInt(item.depositdt_qty),
          depositdt_saleprice: parseFloat(
            parseFloat(item.depositdt_saleprice).toFixed(2)
          ),
          depositdt_discount_amnt: 0,
          depositdt_netamnt: parseFloat(
            parseFloat(item.depositdt_netamnt).toFixed(2)
          ),
          depositdt_barcode: item.barcode,
          depositdt_vatflag: item.vat_activeflag,
          depositdt_master_product_barcode_unitname:
            item.master_product_barcode_unitname,
          depositdt_acc_account_id: parseInt(item.acc_account_id),
          depositdt_master_product_invoice_id: parseInt(
            item.master_product_invoice_id
          ),
          depositdt_master_product_invoice_name:
            item.master_product_invoice_name,
          depositdt_master_product_invoice_code:
            item.master_product_invoice_code,
        };
        dataDetails.push(datas);
      });

      let datasTranfer = [];
      dataTranfer.map((item, idx) => {
        if (item.amount_tranfer > 0) {
          let datas = {
            bank_booktransfer_ref_listno: idx + 1,
            bank_booktransfer_ref_bankbook_id: parseInt(item.cq_bankbook_id),
            bank_booktransfer_ref_amnt: item.amount_tranfer
              ? parseFloat(item.amount_tranfer)
              : 0,
            bank_booktransfer_ref_bank_id: parseInt(item.cq_bank_id),
          };
          datasTranfer.push(datas);
        }
      });

      let dataCre = [];
      dataCredit.map((item, idx) => {
        if (item.cq_cardtype_id) {
          let datas = {
            cheq_cheqdata_rec_listno: idx + 1,
            cheq_cheqdata_rec_bankbook_id: parseInt(item.cq_bankbook_id),
            cheq_cheqdata_rec_cardtype_id: parseInt(item.cq_cardtype_id),
            cheq_cheqdata_rec_docudate: Moment(new Date()).format("YYYYMMDD"),
            cheq_cheqdata_rec_cardno: item.number_credit
              ? item.number_credit
              : null,
            cheq_cheqdata_rec_amount: item.amount_credits
              ? parseFloat(item.amount_credits)
              : 0,
            cheq_cheqdata_rec_bankfeerate: parseInt(item.cq_cardtype_bankfee),
            cheq_cheqdata_rec_bankfeeamnt: parseFloat(item.vat_credit),
            cheq_cheqdata_rec_netamount: item.sum_credit
              ? parseFloat(item.sum_credit)
              : 0,
            cheq_cheqdata_rec_remark: item.remark,
            cheq_cheqdata_rec_bank_id: parseInt(item.cq_bank_id),
          };
          dataCre.push(datas);
        }
      });

      let datasDoc = {
        depositHD: dataDepsitHds,
        depositDT: dataDetails,
        transfer: datasTranfer,
        creditcard: dataCre,
      };
      console.log(datasDoc);
      axios.post(UrlApi() + "add_deposit", datasDoc).then((res) => {
        if (res.data[0]["fn_insert_deposit"] == true) {
          setAlertMessages("สำเร็จ");
          setAlertSuccess(true);
          setDisible(false);
          onClickClearData();
        } else {
          setAlertMessages("ผิดพลาด");
          setAlerttWarning(true);
          setDisible(false);
        }
      });
    }
  };

  const onClickPrints = (e) => {
    setPrintName(e);
    if (e == "พิมพ์ไทย") {
      setPrintLange(1);
    } else {
      setPrintLange(2);
    }
    let findIdx = _.findIndex(dataCustomerTax, {
      arcustomer_id: dataCusPrint[0].arcustomer_id,
    });
    dataCustomerTax[findIdx]["defalutcus_active"] = true;
    setOpenDialogCusdetail(false);
    setOpenDialog(false);
  };

  const getTotalamount = () => {
    return (
      <div>
        <div class="row">
          <div class="col-6">
            <p>
              <strong>มูลค่าที่ต้องชำระ</strong>
            </p>
          </div>
          <div class="col-6">
            <p>{nf.format(paymentValues)}</p>
          </div>
        </div>
      </div>
    );
  };

  const getSumdataDeposit = () => {
    dataDeposit.map((item, idx) => {
      item.depositdt_saleprice = item.depositdt_saleprice
        ? parseFloat(item.depositdt_saleprice)
        : 0;
      item.depositdt_netamnt = item.depositdt_netamnt
        ? parseFloat(item.depositdt_netamnt)
        : 0;
    });
    let SumPrice = _.sumBy(dataDeposit, "depositdt_saleprice");
    let SumTotal = _.sumBy(dataDeposit, "depositdt_netamnt");
    return (
      <>
        <div class="row" style={{ marginLeft: "52%", marginTop: "1%" }}>
          <div class="col-2">
            <p>รวม</p>
          </div>
          <div class="col-3">
            <p>{nf.format(SumPrice)}</p>
          </div>
          <div class="col-3">
            <p>{nf.format(SumTotal)}</p>
          </div>
        </div>
      </>
    );
  };

  const getDataSummaryTranfer = () => {
    dataTranfer.map((item, idx) => {
      item.amount_tranfer = item.amount_tranfer
        ? parseFloat(item.amount_tranfer)
        : 0;
    });
    var sumTranfer = _.sumBy(dataTranfer, "amount_tranfer");
    return (
      <div style={{ marginTop: "5%", marginLeft: "45%" }}>
        <div class="row">
          <div class="col">
            <p>
              <strong>รวม</strong>
            </p>
          </div>
          <div class="col">
            <p>{nf.format(sumTranfer)}</p>
          </div>
        </div>
      </div>
    );
  };

  const getDataSummaryCredit = () => {
    dataCredit.map((item, idx) => {
      item.amount_credits = item.amount_credits
        ? parseFloat(item.amount_credits)
        : 0;
      item.vat_credit = item.vat_credit ? parseFloat(item.vat_credit) : 0;
    });
    let sumamount = _.sumBy(dataCredit, "amount_credits");
    let sumVat = _.sumBy(dataCredit, "vat_credit");
    let sumCredit = parseFloat(sumamount) + parseFloat(sumVat);
    return (
      <div style={{ marginTop: "1%", marginLeft: "50%" }}>
        <div class="row">
          <div class="col-2">
            <p>
              <strong>รวม</strong>
            </p>
          </div>
          <div class="col-4">
            <p>{nf.format(sumCredit)}</p>
          </div>
        </div>
      </div>
    );
  };

  const cusInput = () => {
    return (
      <i className="icon_date">
        <DateRangeIcon
          style={{
            fontSize: "25px",
            color: "white",
            position: "center",
            marginLeft: "10px",
          }}
        />
      </i>
    );
  };

  const getDataDocument = () => {
    let Dates = new Date();
    let datas = Moment(Dates).format("DD/MM/") + (parseInt(Dates.getFullYear()) + 543);
    let dateUses =
      Moment(dateUse).format("DD/MM/") + (dateUse.getFullYear() + 543);
    const containerStyle = {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: 10,
      display: 'inline-flex',
      flexWrap: 'wrap'
    };

    const itemStyle = {
      width: 245,
      height: 80,
      position: 'relative'
    };

    const boxStyle = {
      width: 245,
      height: 80,
      left: 0,
      top: 0,
      position: 'absolute',
      background: 'white',
      borderRadius: 10
    };

    const labelStyle = {
      width: 77.72,
      height: 23.03,
      left: 14.51,
      top: 13.33,
      position: 'absolute',
      color: 'black',
      fontSize: 16,
      fontWeight: '400',
      whiteSpace: 'nowrap'
    };

    const valueStyle = {

      height: 23.03,
      left: 14.51,
      top: 46.06,
      position: 'absolute',
      alignItems: 'flex-start',
      color: 'black',
      fontSize: 16,
      fontWeight: '400',
      whiteSpace: 'nowrap',
      textOverflow: "ellipsis"
    };
    return (
      <Card
        className="card_sale"
        style={{ minHeight: "22vh", fontSize: "16px" }}
      >
        <div className="card_head">
          <div class="row justify-content-between">
            <div class="col text-left">
              <p className="textH_Left">ข้อมูลเอกสารรับเงินมัดจำ</p>
            </div>
            <div class="col d-flex justify-content-end">
              <BtnAdd
                message="ดูประวัติเงินมัดจำ"
                style={{ height: "100%", width: "180px" }}
                icons={<HistoryIcon />}
                onClick={() =>
                  window.open(`${PathRouter()}/main/document/deposit`)
                }
              />
            </div>
          </div>
        </div>
        <Card.Body className="card_body_doc">
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
            <div style={containerStyle}>
              <div style={itemStyle}>
                <div style={boxStyle} />
                <div style={labelStyle}>วันที่เอกสาร</div>
                <div style={valueStyle}>{datas}{""}</div>
              </div>
              <div style={itemStyle}>
                <div style={boxStyle} />
                <div style={labelStyle}>เลขที่เอกสาร</div>
                <div style={valueStyle}>{codeDoc}</div>
              </div>
              <div style={itemStyle}>
                <div style={boxStyle} />
                <div style={labelStyle}>กลุ่มลูกค้า/ออกใบกำกับภาษี</div>
                <div style={{ ...valueStyle, textAlign: "left", textOverflow: "ellipsis", overflow: "hidden", width: 180 }}>{dataCheck.length > 0 ? dataCheck[0]["name"] : ""}</div>
                <BtnAdd
                  style={{
                    width: "40px",
                    height: "35px",
                    marginTop: "26px",
                    position: "absolute",
                    background: "#74E0C0",
                    bottom: 0,
                    right: 0,
                    marginBottom: "5px",
                    marginRight: "5px"
                  }}
                  onClick={() => {
                    OpenDialog();
                  }}
                  icons={
                    <Icon
                      path={mdiAccountMultiplePlusOutline}
                      style={{ fontSize: "14px" }}
                    />
                  }
                />
              </div>
              <div style={itemStyle}>
                <div style={boxStyle} />
                <div style={labelStyle}>รายละเอียดกลุ่มลูกค้า</div>
                <div style={{ ...valueStyle, textAlign: "left", textOverflow: "ellipsis", overflow: "hidden", width: 220 }}>{dataCheck.length > 0 ? dataCheck[0]["address_name"] : ""}</div>
              </div>
              <div style={itemStyle}>
                <div style={boxStyle} />
                <div style={labelStyle}>วันที่มาใช้บริการ</div>
                <div style={{ ...valueStyle, textAlign: "left", textOverflow: "ellipsis", overflow: "hidden", width: 200 }}>{dateUses}</div>
              </div>
              <div style={itemStyle}>
                <div style={boxStyle} />
                <div style={labelStyle}>ผู้บันทึกรายการ</div>
                <div style={{ ...valueStyle, textAlign: "left", textOverflow: "ellipsis", overflow: "hidden", width: 200 }}>{userData[0]["user_name"] +
                  ":" +
                  userData[0]["firstname"]}</div>
              </div>
              <div style={itemStyle}>
                <div style={boxStyle} />
                <div style={labelStyle}>หมายเหตุ</div>
                <InputText
                  type="text"
                  style={{
                    width: "100%",
                    height: "35px",
                    position: "absolute",
                    background: "#E5E5E5E2",
                    bottom: 0,
                    alignItems: "bottom-center"
                  }}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
          </LocalizationProvider>
        </Card.Body>
      </Card>
    );
  };

  const getDataTableOrderTB = () => {
    return (
      <Card
        className="card_sale"
        style={{
          minHeight: "38vh",
          maxHeight: "45vh",
          marginTop: "1%",
          fontSize: "16px",
        }}
      >
        <div className="card_head">
          <p className="textH_Left">รายละเอียดรายการเงินมัดจำ</p>
        </div>
        <Card.Body className="card_body_doc">
          <div class="row">
            <div class="col-2">
              <BtnAdd
                message="เพิ่มรายการ"
                style={{
                  height: "3.2vh",
                  width: "140px",
                  backgroundColor: "#74E0C0",
                }}
                icons={<ZoomInIcon />}
                onClick={() => setOpenDialogProduct(true)}
              />
            </div>
            <div class="col-2">
              <BtnAdd
                message="ล้างข้อมูล"
                style={{
                  height: "3.2vh",
                  width: "120px",
                  backgroundColor: "#FEAE5F",
                }}
                onClick={() => onClickClearData()}
              />
            </div>
          </div>
          <div
            style={{
              minHeight: "15vh",
              maxHeight: "20vh",
              overflow: "auto",
              marginTop: "1%",
            }}
          >
            <DataTables
              striped
              dense
              customStyles={customStyles}
              data={dataDeposit}
              columns={columnsdataDeposit}
            />
          </div>
          {/*dataDeposit.length > 0 ?  getSumdataDeposit() : <></>*/}
        </Card.Body>
      </Card>
    );
  };

  const getDataDetail = () => {
    return (
      <Card
        className="card_sale"
        style={{ height: "26vh", marginTop: "1%", fontSize: "16px" }}
      >
        <div className="card_head">
          {" "}
          <p className="textH_Left">รายละเอียดการคำนวณ</p>
        </div>
        <Card.Body className="card_body_doc">
          <div class="row">
            <div class="col-4">
              <p style={{ marginTop: "1%" }}>กลุ่มภาษี</p>
              <InputText
                type="text"
                style={{ height: "4vh" }}
                value={vateName}
                disabled
              />
            </div>
            <div class="col-4">
              <p style={{ marginTop: "1%" }}>รวมมูลค่าสินค้า</p>
              <InputText
                type="text"
                style={{ height: "4vh" }}
                value={nf.format(totalPriceDeposit)}
                disabled
              />
            </div>
            <div class="col-4">
              <p style={{ marginTop: "1%" }}>มูลค่าสุทธิ</p>
              <InputText
                type="text"
                style={{ height: "5vh" }}
                value={nf.format(totalPayment)}
                disabled
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const onCLickTranferbookbank = () => {
    setCheckCredit(false);
    setOpenDialogTranfer(true);
  };

  const onCLickCrditbookbank = () => {
    setCheckCredit(true);
    setOpenDialogCredit(true);
  };

  const getPaymentDetail = () => {
    return (
      <Card className="card_sale" style={{ height: "90vh" }}>
        <div className="card_head">
          <p className="textH_Left">รายละเอียดการชำระ</p>
        </div>
        <Card.Body className="card_body_doc">
          <Card
            clssName="card_payvalue"
            style={{ height: "5vh", textAlign: "center" }}
          >
            <div class="row ">
              <div class="col-7">
                <p
                  style={{
                    height: "5vh",
                    marginTop: "5%",
                    fontSize: "16px",
                    color: "#E74C3C",
                    whiteSpace: "nowrap",
                  }}
                >
                  {" "}
                  <strong>มูลค่าที่ต้องชำระ </strong>
                </p>
              </div>
              <div class="col">
                <p
                  style={{
                    height: "5vh",
                    marginTop: "5%",
                    fontSize: "1.2vw",
                    color: "#E74C3C",
                    whiteSpace: "nowrap",
                  }}
                >
                  <strong>{nf.format(paymentValues)} </strong>
                </p>
              </div>
            </div>
          </Card>
          <div class="row">
            <div class="col-2">
              <BtnAdd
                style={{
                  marginTop: "2vh",
                  width: "42%",
                  height: "6vh",
                  position: "absolute",
                }}
                onClick={() => onCLickTranferbookbank()}
                message="เงินโอน"
              />
              <BtnAdd
                style={{
                  marginTop: "10vh",
                  width: "42%",
                  height: "6vh",
                  position: "absolute",
                }}
                onClick={() => onCLickCrditbookbank()}
                message="บัตรเครดิต"
              />
              <Card
                className="card_btn_pay"
                style={{ marginTop: "18vh", width: "400%" }}
              >
                <p style={{ marginTop: "5%" }}>
                  <strong> เงินสด </strong>
                </p>
              </Card>
            </div>
            <div class="col-10">
              <InputText
                style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }}
                type="text"
                value={nf.format(valueSumTranfer)}
                disabled
              />
              <InputText
                style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }}
                type="text"
                value={nf.format(valueSumCredit)}
                disabled
              />
              <InputText
                style={{ marginTop: "2vh", height: "6vh", textAlign: "center" }}
                type="number"
                onChange={(e) => onChangeCurrency(e)}
                value={valueSumCurr > 0 ? valueSumCurr : ""}
              />
            </div>
          </div>
          <div>
            <div style={{ marginTop: "5%" }}>
              <BtnAdd
                style={{
                  height: "6vh",
                  marginTop: "1%",
                  width: "95%",
                  fontSize: "1vw",
                  marginLeft: "5%",
                }}
                message="บันทึก"
                onClick={() => onClickAddDeposit()}
                disabled={
                  paymentValues > 0 ? true : disible == true ? true : false
                }
                icons={<Icon path={mdiContentSaveCheckOutline} size={1} />}
              ></BtnAdd>
            </div>
            <p style={{ marginLeft: "25%", marginTop: "5%" }}>
              {"ออกใบกำกับภาษี" + " " + printsName}

            </p>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const onClickcancle = () => {
    setOpenDialog(false);
  };

  const filterComp = () => {
    return (
      <SearchDialog
        open={true}
        searchText={searchText}
        onChangeSearchText={(e) => {
          setSearchText(e);
        }}
        title={"ค้นหา"}
        subTitle={
          "รหัสลูกค้า / เลขประจำตัวผู้เสียภาษี / ชื่อ - สกุล / เบอร์โทรศัพท์ / กลุ่มลูกค้า / เลขที่ Corp Card"
        }
      />
    );
  };

  const getDialogCustomer = () => {
    return (
      <Dialog open={openDialog} maxWidth="600px">
        <DialogTitle>
          <p>ข้อมูลลูกค้า</p>
        </DialogTitle>
        <DialogContent dividers="paper">
          <p>*** หมายเหตุกลุ่มลูกค้าจำเป็นต้องมีเลขประจำตัวผู้เสียภาษี</p>
          <button
            type="button"
            className="cancel"
            onClick={() => setOpenDialog(!openDialog)}
          >
            x
          </button>
          {checkTaxPrint == true ? (
            <p>***หมายเหตุ ลูกค้าจำเป็นต้องมีเลขประจำตัวผู้เสียภาษี</p>
          ) : (
            <></>
          )}
          {filterComp()}
          <div style={{ marginTop: "1%" }}>
            <DataTable
              columns={columnsdata}
              data={checkTaxPrint == true ? dataCustomerTax : dataCustomer}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <BtnCancel
            onClick={() => {
              onClickcancle();
            }}
            message="ปิด"
          />
        </DialogActions>
      </Dialog>
    );
  };

  const getDialogCustomerDetail = () => {
    return (
      <Dialog open={openDialogCusdetail} maxWidth="600px">
        <DialogTitle>
          <p>ข้อมูลลูกค้า</p>
        </DialogTitle>
        <DialogContent dividers="paper" style={{ width: "800px" }}>
          <button
            type="button"
            className="cancel"
            onClick={() => setOpenDialogCusdetail(!openDialogCusdetail)}
          >
            x
          </button>
          <div class="row">
            <div class="col-4">
              <p>
                <strong>ผู้ซื้อ :</strong>
              </p>
              <p>
                <strong>ที่อยู่ :</strong>
              </p>
              <p>
                <strong>เบอร์โทรศัพท์ :</strong>
              </p>
              <p>
                <strong>เลขประจำตัวผู้เสียภาษี :</strong>
              </p>
            </div>
            {dataCusPrint.length > 0 ? (
              <div class="col">
                <p>{dataCusPrint[0]["name"]}</p>
                <p>{dataCusPrint[0]["address_name"]}</p>
                <p>{dataCusPrint[0]["arcustomer_addr_tel"]}</p>
                <p>{dataCusPrint[0]["arcustomer_taxid"]}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          {dataCusPrint.length > 0 ? (
            <>
              {dataCusPrint[0]["arcustomer_taxid"].length > 0 &&
                dataCusPrint[0]["arcustomer_taxid"] != 0 ? (
                <>
                  <BtnAdd
                    onClick={() => onClickPrints("พิมพ์ไทย")}
                    message="พิมพ์ไทย"
                  />
                  {/*<BtnAdd onClick={() => onClickPrints("พิมพ์อังกฤษ")} message="พิมพ์อังกฤษ" />*/}
                </>
              ) : (
                <BtnCancel
                  onClick={() => setOpenDialogCusdetail(!openDialogCusdetail)}
                ></BtnCancel>
              )}
            </>
          ) : (
            <></>
          )}
        </DialogActions>
        {getAlert()}
      </Dialog>
    );
  };

  const getDialogProductDepos = () => {
    return (
      <Dialog open={openDialogProduct} maxWidth="1000px">
        <DialogTitle style={{ width: "900px" }}>
          <p>ข้อมูลเงินมัดจำ</p>
        </DialogTitle>
        <DialogContent dividers="paper">
          <button
            type="button"
            className="cancel"
            onClick={() => setOpenDialogProduct(!openDialogProduct)}
          >
            x
          </button>
          <div style={{ marginTop: "1%" }}>
            <DataTable columns={columnsdataproduct} data={dataProductDepos} />
          </div>
        </DialogContent>
        <DialogActions>
          <Btnsubmit
            onClick={() => {
              onClickAddProduct();
            }}
          />
          <BtnCancel
            onClick={() => {
              onClickCancleProduct();
            }}
            message="ปิด"
          />
        </DialogActions>
      </Dialog>
    );
  };

  const getDialogCredit = () => {
    if (dataCredit.length > 0) {
      dataCredit.map((item, idx) => {
        item.row_num = idx + 1;
        item.default_check = false;
      });
    }
    return (
      <Dialog open={openDialogCredit} maxWidth="1000px">
        <DialogTitle>
          <p>รายละเอียดการชำระบัตรเครดิต</p>
        </DialogTitle>
        <DialogContent dividers="paper">
          <button
            type="button"
            className="cancel"
            onClick={() => setOpenDialogCredit(!openDialogCredit)}
          >
            x
          </button>
          <div>
            {getTotalamount()}
            <BtnAdd
              message="เพิ่มบัญชีธนาคาร"
              onClick={() => setOpenDialogbookbank(true)}
            />
            <DataTable columns={columnbankCredit} data={dataCredit} />
          </div>
          {getDataSummaryCredit()}
        </DialogContent>
        <DialogActions>
          <span>
            <Btnsubmit
              onClick={() => onClickAddCreditData()}
              message="เพิ่ม"
              disabled={disabledCredit}
            />
          </span>
          <BtnCancel
            onClick={() => setOpenDialogCredit(!openDialogCredit)}
            message="ปิด"
          />
        </DialogActions>
        {getAlert()}
      </Dialog>
    );
  };

  const getDialogTranfer = () => {
    if (dataTranfer.length > 0) {
      dataTranfer.map((item, idx) => {
        item.row_num = idx + 1;
        item.default_check = false;
      });
    }
    return (
      <Dialog open={openDialogTranfer} maxWidth="1000px">
        <DialogTitle>
          <p>รายละเอียดการชำระเงินโอน</p>
        </DialogTitle>
        <DialogContent dividers="paper">
          <button
            type="button"
            className="cancel"
            onClick={() => setOpenDialogTranfer(!openDialogTranfer)}
          >
            x
          </button>
          <div>
            {getTotalamount()}
            <BtnAdd
              message="เพิ่มบัญชีธนาคาร"
              onClick={() => setOpenDialogbookbank(true)}
            />
            <DataTable columns={columnbankTranfer} data={dataTranfer} />
            {getDataSummaryTranfer()}
          </div>
        </DialogContent>
        <DialogActions>
          <span>
            <Btnsubmit
              onClick={() => onClickAddTranferData()}
              message="เพิ่ม"
              disabled={disibleBtnAdd}
            />
          </span>
          <BtnCancel
            onClick={() => setOpenDialogTranfer(!openDialogTranfer)}
            message="ปิด"
          />
        </DialogActions>
        {getAlert()}
      </Dialog>
    );
  };

  const getDialogBookbank = () => {
    return (
      <Dialog open={openDialogbookBank} maxWidth="600px">
        <DialogTitle>
          <p>ข้อมูลธนาคาร</p>
        </DialogTitle>
        <DialogContent dividers="paper">
          <button
            type="button"
            className="cancel"
            onClick={() => setOpenDialogbookbank(!openDialogbookBank)}
          >
            x
          </button>
          <div>
            <DataTable
              columns={columnsdatabookbank}
              data={checkCredit ? dataBookbankCredit : dataBookbank}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <span>
            <Btnsubmit onClick={() => onClickAddBookbank()} message="เพิ่ม" />
          </span>
          <BtnCancel
            onClick={() => {
              setOpenDialogbookbank(!openDialogbookBank);
            }}
            message="ปิด"
          />
        </DialogActions>
        {getAlert()}
      </Dialog>
    );
  };

  const getAlert = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <>
      {getAlert()}
      {getDialogCustomer()}
      {getDialogCustomerDetail()}
      {getDialogProductDepos()}
      {getDialogBookbank()}
      {getDialogTranfer()}
      {getDialogCredit()}
      <div style={{ marginTop: "10px", marginLeft: "1%", marginRight: "1%" }}>
        <div class="row">
          <div class="col-9">
            {getDataDocument()}
            {getDataTableOrderTB()}
            {getDataDetail()}
          </div>
          <div class="col">{getPaymentDetail()}</div>
        </div>
      </div>
    </>
  );
};
//หน้าข้อมูลเอกสารรับเงินมัดจำ
export default memo(Deposit);
