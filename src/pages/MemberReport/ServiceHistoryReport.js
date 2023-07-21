import {
  React,
  useState,
  useEffect,
  useContext,

} from "react";
import axios from "axios";
import DataContext from "../../DataContext/DataContext";
import Moment from "moment";
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import "../../components/CSS/report.css";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import HeaderReport from "../../components/HeaderReport/HeaderReport";
import Datatable from "../../components/Datatable/Datatables";


const ServiceHistoryReport = () => {
  //รายงานประวัติการเข้าใช้บริการ
  const userData = useContext(DataContext);
  const BranchData = useContext(DataContextBranchData);
  const [numFormat, setnumFormat] = useState(
    new Intl.NumberFormat("en-thai", {
      style: "decimal",
      minimumFractionDigits: 2,
    })
  );
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
  const [brancIDDefual, setbrancIDDefual] = useState(BranchData.branch_id);
  const [branchCode, setBranchCode] = useState();
  const [userId, setUserId] = useState(userData[0].user_login_id);
  const [defaulDate, setDefaulDate] = useState(false);
  const [userBranchID, setUserBranchID] = useState(
    userData[0]["master_branch_id"]
  );
  const [dataSum, setDataSum] = useState([]);
  const [valueInput, setValueInput] = useState();
  const [showFilterColumn, setShowFilterColumn] = useState(false);


  const columnsdata = [
    {
      name: "ลำดับ",
      selector: (row) => row.no,
      width: "60px",
      sortable: true,
    },
    {
      name: "จำนวนครั้งที่เข้าใช้บริการ",
      selector: (row) => row.count_doc,
      sortable: true,
      width: "60px",
    },
    {
      name: "รหัสสาขา",
      selector: (row) => row.master_branch_code,
      sortable: true,
      wrap: true,
    },
    {
      name: "ชื่อสาขา",
      selector: (row) => row.master_branch_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "วันที่ขาย",
      selector: (row) => row.salehd_docudate,
      sortable: true,
    },
    {
      name: "เวลา",
      selector: (row) => row.salehd_savetime,
      sortable: true,
    },
    {
      name: "เลขที่เอกสาร",
      selector: (row) => row.salehd_docuno,
      sortable: true,
      width: "10rem",
      wrap: true,
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
      name: "ยอดขาย",
      selector: (row) => row.salehd_sumgoodamnt,
      sortable: true,
    },
    {
      name: "ส่วนลด",
      selector: (row) => row.salehd_discountamnt,
      sortable: true,
    },
    {
      name: "มูลค่าสุทธิ",
      selector: (row) => row.salehd_netamnt,
      sortable: true,
    },
    {
      name: "คะแนนก่อนหน้านี้",
      selector: (row) => row.collect_points_balance,
      sortable: true,
    },
    {
      name: "คะแนนที่ได้",
      selector: (row) => row.collect_points,
      sortable: true,
    },
  ];

  const cellStyle = {
    whiteSpace: 'nowrap',
  };

  const columns = [
    {
      title: "ลำดับ",
      field: "no",
      cellStyle: cellStyle,
      filtering: false
    },
    {
      title: "จำนวนครั้งที่เข้าใช้บริการ",
      field: "count_doc",
    },
    {
      title: "รหัสสาขา",
      field: "master_branch_code",
      cellStyle: cellStyle,
    },
    {
      title: "ชื่อสาขา",
      field: "master_branch_name",
      cellStyle: cellStyle,
    },
    {
      title: "วันที่ขาย",
      field: "salehd_docudate",
      cellStyle: cellStyle,
    },
    {
      title: "เวลา",
      field: "salehd_savetime",
      cellStyle: cellStyle,
    },
    {
      title: "เลขที่เอกสาร",
      field: "salehd_docuno",
      cellStyle: cellStyle,
    },
    {
      title: "รหัสลูกค้า",
      field: "arcustomer_code",
      cellStyle: cellStyle,
    },
    {
      title: "ชื่อลูกค้า",
      field: "arcustomer_name",
      cellStyle: cellStyle,
    },
    {
      title: "ยอดขาย",
      field: "salehd_sumgoodamnt",
      cellStyle: cellStyle,
    },
    {
      title: "ส่วนลด",
      field: "salehd_discountamnt",
      cellStyle: cellStyle,
    },
    {
      title: "มูลค่าสุทธิ",
      field: "salehd_netamnt",
      cellStyle: cellStyle,
    },
    {
      title: "คะแนนก่อนหน้านี้",
      field: "collect_points_balance",
      cellStyle: cellStyle,
    },
    {
      title: "คะแนนที่ได้",
      field: "collect_points",
      cellStyle: cellStyle,
    },
    // {
    //   title: "เปิด",
    //   render: (data)=><>{<BtnEdit onClick={() => {
    //   }} />}</>
    // },
  ];



  const columnExport = [
    { header: "ลำดับ", selector: "no" },
    { header: "จำนวนครั้งที่เข้าใช้บริการ", selector: "count_doc" },
    { header: "รหัสสาขา", selector: "master_branch_code" },
    { header: "ชื่อสาขา", selector: "master_branch_name" },
    { header: "วันที่ขาย", selector: "salehd_docudate" },
    { header: "เวลา", selector: "salehd_savetime" },
    { header: "เลขที่เอกสาร", selector: "salehd_docuno" },
    { header: "รหัสลูกค้า", selector: "arcustomer_code" },
    { header: "ชื่อลูกค้า", selector: "arcustomer_name" },
    { header: "ยอดขาย", selector: "salehd_sumgoodamnt" },
    { header: "ส่วนลด", selector: "salehd_discountamnt" },
    { header: "มูลค่าสุทธิ", selector: "salehd_netamnt" },
    { header: "คะแนนก่อนหน้านี้", selector: "collect_points_balance" },
    { header: "คะแนนที่ได้", selector: "collect_points" },
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
    arcustomer_name: "รวม",
    salehd_sumgoodamnt: numFormat.format(sumValue("salehd_sumgoodamnt")),
    salehd_discountamnt: numFormat.format(sumValue("salehd_discountamnt")),
    salehd_netamnt: numFormat.format(sumValue("salehd_netamnt")),
    collect_points_balance: numFormat.format(
      sumValue("collect_points_balance")
    ),
    collect_points: numFormat.format(sumValue("collect_points")),
  };

  useEffect(() => {
    fetcServiceHistoryData();
  }, [startDate, endDate]);

  // useEffect(() => {
  //     exportExcells()
  // }, [dataReport])

  const OnchangeSearch = (e) => {
    if (e.target.value) {
      setValueInput(e.target.value);
      let filterText = e.target.value.trim();
      const filteredItems = dataSearch.filter(
        (item) => JSON.stringify(item).indexOf(filterText) !== -1
      );
      if (filteredItems.length <= 0) {
        let redatas = [];
        let datas = {
          master_branch_code: "ไม่พบข้อมูล",
          master_branch_name: "ไม่พบข้อมูล",
          product_quantity: "0",
        };
        redatas.push(datas);
        redatas.map((item, idx) => {
          item.no = idx + 1;
        });
        setDataReport(redatas);
        getDataTable();
        setDataSum([]);
        sumData();
      } else {
        filteredItems.map((item, idx) => {
          item.row_num = idx + 1;
        });
        setDataReport(filteredItems);
        getDataTable();
        setDataSum(filteredItems);
        sumData();
      }
    } else {
      fetcServiceHistoryData();
    }
  };

  const fetcServiceHistoryData = () => {
    setValueInput("");
    var strDate = Moment(startDate).format("YYYY-MM-DD");
    var enDate = Moment(endDate).format("YYYY-MM-DD");
    const datas = {
      company_id: parseInt(userData[0]["master_company_id"]),
      start_date: strDate,
      end_date: enDate,
      branch_id: brancIDDefual,
      user_id: userId,
    };
    axios.post(UrlApi() + "get_service_history_data", datas).then((res) => {
      res.data.map((item, idx) => {
        item.no = idx + 1;
      });
      setDefaulDate(false);
      setDataSum(res.data);
      setDataSearch(res.data);
      setDataReport(res.data);
      sumData();
    });
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
    setValueInput("");
  };

  const getDataTable = () => {
    return (
      <div style={{ marginRight: "1%" }}>
        <Datatable
          fixedHeader
          columns={columnsdata}
          data={dataReport}
          striped
          defaultSortAsc={false}
          footer={footer}
          dense
        />
      </div>
    );
  };

  const sumData = () => {
    if (dataSum.length > 0) {
      dataSum.map((item, idx) => {
        item.product_netamnt = item.product_netamnt;
      });
      var product_netamnt = _.sumBy(dataSum, "product_netamnt");
      return (
        <div class="row" style={{ marginLeft: "45%" }}>
          <div class="col-1">
            <p className="text_ts">
              <strong>รวม</strong>
            </p>
          </div>
          <div class="col-1">
            <p className="text_ts_right">{numFormat.format(product_netamnt)}</p>
          </div>
        </div>
      );
    }
  };

  // const exportExcells = () => {
  //     let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
  //     let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
  //     let Now_y = parseInt(Moment(dateNow).format("YYYY")) + 543
  //     var strDate = Moment(startDate).format("DD/MM/") + Str_y
  //     var enDate = Moment(endDate).format("DD/MM/") + End_y
  //     var dNow = Moment(dateNow).format("DD/MM/") + Now_y
  //     var TNow = Moment(dateNow).format("HH:mm")
  //     let datas = []
  //     var branchs = branchCode ? branchCode : ""
  //     const csvData = [
  //         ["", "", , ""],
  //         ["", "", "", "รายงานประวัติการเข้าใช้บริการ"],
  //         ["", "", , "จากวันที่ " + strDate + " ถึง " + enDate],
  //         ["", "พิมพ์วันที่ " + dNow + " เวลา " + TNow,],
  //         ["ลำดับ", "จำนวนครั้งที่เข้าใช้บริการ", "รหัสสาขา", "ชื่อสาขา", "วันที่ขาย", "เวลา", "เลขที่เอกสาร", "รหัสลูกค้า", "ชื่อลูกค้า", "ยอดขาย", "ส่วนลด", "มูลค่าสุทธิ", "คะแนนก่อนหน้านี้", "คะแนนที่ได้"],
  //     ];
  //     dataReport.map((item, idx) => {
  //         datas = [
  //             idx + 1,
  //             item.count_doc,
  //             item.master_branch_code,
  //             item.master_branch_name,
  //             item.salehd_docudate,
  //             item.salehd_savetime,
  //             item.salehd_docuno,
  //             item.arcustomer_code,
  //             item.arcustomer_name,
  //             numFormat.format(item.salehd_sumgoodamnt),
  //             numFormat.format(item.salehd_discountamnt),
  //             numFormat.format(item.salehd_netamnt),
  //             item.collect_points_balance,
  //             item.collect_points,

  //         ]
  //         csvData.push(datas)
  //     })
  //     setDataExport(csvData)
  // }

  const getHeaderReport = () => {
    return (
      <>
          <HeaderReport
              //------------------------------------------------------- ปุ่มรีเฟรช
              onClickRefresh={() => {
                getDateDefual();
              }}
              //------------------------------------------------------- ปุ่ม เงื่อนไขการค้นหา
              onClickSearch={(data) => {
                setbrancIDDefual(data.branch);
                setStartDate(data.startDate);
                setEndDate(data.endDate);
              }}
              
              //------------------------------------------------------- ปุ่ม ค้นหาตามคอลัมน์
              onClickFilter={()=>setShowFilterColumn(!showFilterColumn)}
    
              //------------------------------------------------------- ปุ่ม ExportExcel
              data={dataReport}
              columns={columnExport}
              //------------------------------------------------------- เเถบ filter ข้อมูล
              onChange={(e) => OnchangeSearch(e)}
              value={valueInput}
            />
      </>
    );
  }


  function getTable() {
    return (
      <div style={{marginRight: '1%'}}>
        <Datatable
          title=""
          columns={columns}
          data={dataReport}
          filtering={showFilterColumn}
          footerData={[footer]}
          width='100vw'
        />
        </div>
    )
  }

  return (
    <>
      {getHeaderReport()}
      {getTable()}
    </>
  );
};

export default ServiceHistoryReport;
