import {
  React,
  useState,
  useEffect,
  useContext,
  memo,
} from "react";
import axios from "axios";
import DataContext from "../../DataContext/DataContext";
import DateRange from "../../components/DatePicker/DateRange";
import DataTable from "../../components/Datatable/Datatables";
import Moment from "moment";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css';
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import HeaderReport from "../../components/HeaderReport/HeaderReport";

const CustomerPoint = () => {
  //รายงานคะแนนคงเหลือ
  const userData = useContext(DataContext);
  const BranchData = useContext(DataContextBranchData);
  const nf = new Intl.NumberFormat("en-thai", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [dataReport, setDataReport] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [databranch, setDataBranch] = useState([]);
  const [databadge, setDataBadge] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateNow, setDateNow] = useState(new Date());
  const [branchName, setBranchName] = useState();
  const [brancID, setBranchID] = useState([]);
  const [brancIDs, setBranchIDs] = useState([]);
  const [brancIDDefual, setbrancIDDefual] = useState([]);
  const [branchCode, setBranchCode] = useState();
  const [userId, setUserId] = useState(userData[0].user_login_id);
  const [defaulDate, setDefaulDate] = useState(false);
  const [userBranchID, setUserBranchID] = useState(
    userData[0]["master_branch_id"]
  );
  const [dataSum, setDataSum] = useState([]);
  const [valueInput, setValueInput] = useState();

  const columnsdata = [
    {
      name: "ลำดับ",
      selector: (row) => row.no,
      sortable: true,
      width: '60px'
    },
    {
      name: "รหัสลูกค้า",
      selector: (row) => row.arcustomer_code,
      sortable: true,
      wrap: true,
    },
    {
      name: "ชื่อลูกค้า",
      selector: (row) => row.arcustomer_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "เบอร์โทร",
      selector: (row) => row.arcustomer_addr_tel,
      sortable: true,
      wrap: true,
    },
    {
      name: "คะแนนที่ได้",
      selector: (row) => row.point_receive,
      sortable: true,
      wrap: true,
    },
    {
      name: "คะแนนที่ใช้",
      selector: (row) => row.point_spend,
      sortable: true,
      wrap: true,
    },
    {
      name: "คะแนนคงเหลือ",
      selector: (row) => row.point_remain,
      sortable: true,
      wrap: true,
    },
    {
      name: "วันที่มาใช้บริการล่าสุด",
      selector: (row) => row.salehd_docudate,
      sortable: true,
      wrap: true,
    },
  ];

  function sumValue(target) {
    let value = 0;
    dataReport.map((item) => {
      value += parseFloat(item[target]);
      return value;
    });
    return value;
  }

  const footer = {
    arcustomer_addr_tel: "รวม",
    point_receive: nf.format(sumValue("point_receive")),
    point_spend: nf.format(sumValue("point_spend")),
    point_remain: nf.format(sumValue("point_remain")),
  };

  useEffect(() => {
    getData();
  }, [startDate, endDate]);

  const OnchangeSearch = (e) => {
    if (e.target.value) {
      setValueInput(e.target.value);
      let filterText = e.target.value.trim();
      const filteredItems = dataSearch.filter(
        (item) => JSON.stringify(item).indexOf(filterText) !== -1
      );
      if (filteredItems.length <= 0) {
        setDataReport([]);
        getDataTable();
      } else {
        setDataReport(filteredItems);
        getDataTable();
      }
    } else {
      getData();
    }
  };

  const getData = async () => {
    setValueInput("");
    const datas = {
      company_id: parseInt(userData[0]["master_company_id"]),
      years: Moment(startDate).format("YYYY"),
      dates: Moment(startDate).format("YYYYMMDD"),
    };
    await axios.post(UrlApi() + "get_pointcus_report", datas).then((res) => {
      res.data.map((item, idx) => {
        let y = parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543;
        item.no = idx + 1;
        item.salehd_docudate = item.salehd_docudate
          ? Moment(item.salehd_docudate).format("DD/MM/") + y
          : "";
      });
      setDataReport(res.data);
      setDataExport(res.data);
      setDataSearch(res.data);
    });
    getDataTable();
  };

  const getDateDefual = () => {
    setDefaulDate(true);
    setBranchName();
    setStartDate(new Date());
    setEndDate(new Date());
    setBranchID([]);
    setbrancIDDefual([]);
    setDataReport([]);
    //getSearchInput()
    getDateRange();
    setValueInput("");
  };

  const getDataTable = () => {
    return (
      <div
        style={{
          marginRight: "1%",
        }}
      >
        <DataTable
          fixedHeader
          columns={columnsdata}
          data={dataReport}
          paginationPerPage="50"
          footer={footer}
          paginationRowsPerPageOptions={[50, 100, 150, 200]}
          pagination
          striped
          defaultSortAsc={false}
        />
      </div>
    );
  };

  const getDateRange = () => {
    return (
      <DateRange
        style={{ fontsize: "0.875", width: "120%" }}
        handleDate={(d) => {
          setStartDate(d);
        }}
      ></DateRange>
    );
  };

  const columnExport = [
    { header: "ลำดับ", selector: "no" },
    { header: "รหัสลูกค้า", selector: "arcustomer_code" },
    { header: "ชื่อลูกค้า", selector: "arcustomer_name" },
    { header: "เบอร์โทร", selector: "arcustomer_addr_tel" },
    { header: "คะแนนที่ได้", selector: "point_receive" },
    { header: "คะแนนที่ใช้", selector: "point_spend" },
    { header: "คะแนนคงเหลือ", selector: "point_remain" },
    { header: "วันที่มาใช้บริการล่าสุด", selector: "salehd_docudate" },
  ];

  const onChangeDialog = (data) => {
    setStartDate(data.dateNow);
  };

  return (
    <div>
      {
        <HeaderReport
          //------------------------------------------------------- ปุ่มรีเฟรช
          onClickRefresh={() => {
            getDateDefual();
          }}
          //------------------------------------------------------- ปุ่ม เงื่อนไขการค้นหา
          onClickSearch={(data) => {
            onChangeDialog(data);
          }}
          //------------------------------------------------------- ปุ่ม ExportExcel
          data={dataReport}
          columns={columnExport}
          //------------------------------------------------------- เเถบ filter ข้อมูล
          onChange={(e) => OnchangeSearch(e)}
          value={valueInput}
        />
      }

      {getDataTable()}
    </div>
  );
};

export default memo(CustomerPoint);
