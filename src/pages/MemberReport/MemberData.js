import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import UrlApi from "../../url_api/UrlApi";
import Loading from "../../components/Loading/Loading";
import DataContext from "../../DataContext/DataContext";
import Swithstatus from "../../components/SwitchStatus/Switchstatus";
import HeaderReport from "../../components/HeaderReport/HeaderReport";
import moment from "moment";
import MaterialTable from 'material-table';


function MemberData() {
  //รายงานข้อมูลสมาชิก
  const userData = useContext(DataContext);
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(50);
  const [memberTypeId, setMemberTypeId] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [memberTypeData, setMemberTypeData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndStartDate] = useState(new Date());

  // const tableIcons = {
  //   Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  //   Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  //   Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  //   Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  //   DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  //   Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  //   Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  //   Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  //   FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  //   LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  //   NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  //   PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  //   ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  //   Search: forwardRef((props, ref) => <Searching {...props} ref={ref} />),
  //   SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  //   ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  //   ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  // };

  const columns = [
    {
      name: "ลำดับ",
      selector: (row) => row.row_num,
      sortable: true,
      width: "60px",
    },
    {
      name: "รหัสสมาชิก",
      selector: (row) => row.arcustomer_code,
      sortable: true,
      width: "10rem",
      wrap: true,
    },
    {
      name: "คำนำหน้า",
      selector: (row) => row.master_title_name,
      sortable: true,
      width: "4rem",
    },
    {
      name: "ชื่อสมาชิก",
      selector: (row) => row.name,
      sortable: true,
      width: "10rem",
      wrap: true,
    },
    {
      name: "กลุ่มลูกค้า",
      selector: (row) => row.arcustomer_group_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "ประเภทลูกค้า",
      selector: (row) => row.master_person_type_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "เบอร์โทร",
      selector: (row) => row.arcustomer_addr_tel,
      sortable: true,
    },
    {
      name: "ที่อยู่",
      selector: (row) => row.arcustomer_addr,
      sortable: true,
      wrap: true,
    },
    {
      name: "ตำบล",
      selector: (row) => row.master_addr_district_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "อำเภอ",
      selector: (row) => row.master_addr_prefecture_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "จังหวัด",
      selector: (row) => row.master_addr_province_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "รหัสไปรษณีย์",
      selector: (row) => row.master_addr_postcode_code,
      sortable: true,
    },
    {
      name: "สถานะการใช้งาน",
      selector: (row) => (
        <>
          <Swithstatus value={row.arcustomer_active} />
        </>
      ),
      sortable: true,
    },
  ];

  const columnsdatas = [
    {
      title: "ลำดับ",
      field: "row_num",
    },
    {
      title: "รหัสสมาชิก",
      field: "arcustomer_code",
    },
    {
      title: "คำนำหน้า",
      field: "master_title_name",

    },
    {
      title: "ชื่อสมาชิก",
      field: "name",
    },
    {
      title: "กลุ่มลูกค้า",
      field: "arcustomer_group_name",
    },
    {
      title: "ประเภทลูกค้า",
      field: "master_person_type_name",
    },
    {
      title: "รหัสลูกค้า",
      field: "arcustomer_code",
    },
    {
      title: "เบอร์โทร",
      field: "arcustomer_addr_tel",
    },
    {
      title: "ที่อยู่",
      field: "arcustomer_addr",
    },
    {
      title: "ตำบล",
      field: "master_addr_district_name",
    },
    {
      title: "อำเภอ",
      field: "master_addr_prefecture_name",
    },
    {
      title: "จังหวัด",
      field: "master_addr_province_name",
    },
    {
      title: "รหัสไปรษณีย์",
      field: "master_addr_postcode_code",
    },
  ];

  const columnExport = [
    { header: "ลำดับ", selector: "row_num" },
    { header: "รหัสสมาชิก", selector: "arcustomer_code" },
    { header: "ชื่อลูกค้า", selector: "name" },
    { header: "กลุ่มลูกค้า", selector: "arcustomer_group_name" },
    { header: "ประเภทลูกค้า", selector: "master_person_type_name" },
    { header: "เบอร์โทร", selector: "arcustomer_addr_tel" },
    { header: "ที่อยู่", selector: "arcustomer_addr" },
    { header: "ตำบล", selector: "master_addr_district_name" },
    { header: "อำเภอ", selector: "master_addr_prefecture_name" },
    { header: "จังหวัด", selector: "master_addr_province_name" },
    { header: "รหัสไปรษณีย์", selector: "master_addr_postcode_code" },
    { header: "สถานะการใช้งาน", selector: "arcustomer_active_name" },
  ];

  async function fetchMemberData(offset, per_page) {
    const data = {
      offset: offset,
      per_page: per_page,
      member_type_id: memberTypeId ? memberTypeId : [],
      company_id: userData[0].master_company_id,
      start_date: moment(startDate).format("YYYYMMDD"),
      end_date: moment(endDate).format("YYYYMMDD"),
    };
    setLoading(true);
    await axios.post(UrlApi() + "get_member_data", data).then((res) => {
      res.data.data.map((item, index) => {
        item.arcustomer_active_name = item.arcustomer_active
          ? "เปิดการใช้งาน"
          : "ปิดการใช้งาน";
      });
      setMemberData(res.data.data);
      setTotalRows(res.data.total);
      setLoading(false);
    });
  }

  const handlePageChange = (page) => {
    fetchMemberData((page - 1) * perPage, perPage, "", memberTypeId);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchMemberData((page - 1) * newPerPage, newPerPage, "", memberTypeId);
  };

  useEffect(() => {
    fetchMemberData(offset, perPage);
  }, [startDate, endDate, memberTypeId]);

  const filteredItems = memberData.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !==
      -1
  );

 

  function BasicFiltering() {
    return (
      <div style={{marginRight: '1%'}}>
        <MaterialTable
          title=""
          columns={columnsdatas}
          data={memberData}        
          options={{
            filtering: true,
            exportButton: true,
            headerStyle:{background: '#0064B0', color: 'white'},
            maxBodyHeight: "60vh",
            pageSizeOptions: [50, 100, 150,200],
            pageSize: 50,
            backgroundColor: "red"
          }}
        />
      </div>
     
    )
  }

  return (
    <>
      {
        <HeaderReport
          //------------------------------------------------------- ปุ่มรีเฟรช
          onClickRefresh={() => {}}
          //------------------------------------------------------- ปุ่ม เงื่อนไขการค้นหา
          onClickSearch={(data) => {
            setStartDate(data.startDate);
            setEndStartDate(data.endDate);
            setMemberTypeId(data.memberType);
          }}
          //------------------------------------------------------- ปุ่ม ExportExcel
          data={memberData}
          columns={columnExport}
          //------------------------------------------------------- เเถบ filter ข้อมูล
          onChange={(e) => setFilterText(e.target.value)}
          value={filterText}
        />
      }
      {BasicFiltering()}
      {/* <div style={{ marginRight: "1%" }}>
        <DataTable
          fixedHeader={true}
          columns={columns}
          data={filteredItems}
          noDataComponent={
            <p className="header" style={{ marginTop: "10px" }}>
              ไม่พบข้อมูล
            </p>
          }
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          progressPending={false}
          paginationPerPage="50"
          paginationRowsPerPageOptions={[50, 100, 150, 200]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
        />
      </div> */}
      {loading && <Loading />}
    </>
  );
}

export default MemberData;
