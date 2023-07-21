import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import DataContext from "../../DataContext/DataContext";
import DataTable from '../../components/Datatable/Datatables';
import moment from 'moment';
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css';
import DataContextBranchData from "../../DataContext/DataContextBranchData";

import HeaderReport from "../../components/HeaderReport/HeaderReport";

const StockReport_New = () => {
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false)
    const [dataReportStock, setReportStock] = useState([])
    const userData = useContext(DataContext);
    const branchData = useContext(DataContextBranchData);
    const [branchSelectedID, setBranchSelectedID] = useState(branchData.branch_id)
    const [branchSelectedName, setBranchSelectedName] = useState(branchData.branch_name)
    // const [bankListID, setBankListID] = useState([])
    // const [bankListIDs, setBankListIDs] = useState([])
    // const [bankCheck, setbankCheck] = useState([])
    const [branchListID, setBranchListID] = useState([])
    //const [branchListIDs, setBranchListIDs] = useState([])
    const [branchCheck, setBranchCheck] = useState([])
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const [branchID, setBranchID] = useState(branchData['branch_id'])
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id'])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [hoFlag, setHoFlag] = useState(localStorage.getItem('hoFlag'))
    const [searchText, setSearchText] = useState("")
    const [productGroupCheck, setProductGroupCheck] = useState([])
    const [productGroupListID, setProductGroupTypeListID] = useState([])
    const [productCatCheck, setProductCatCheck] = useState([])
    const [productCatListID, setProductCatTypeListID] = useState([])
    //const numFormat = new Intl.NumberFormat('en-thai', { style: 'decimal' })
    const deciFormat = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 })
    const [dataConditions, setDataConditions] = useState([])
    const [dataReportSearch, setDataReportSearch] = useState([])

    const [defaultDate, setDefaultDate] = useState(false)

    useEffect(() => {
        if (dataConditions.branch) {
            getStockCardBalanceData()
        }
    }, [dataConditions])

    const columnData = [
        {
            name: 'ลำดับ',
            selector: row => row.no,
            //width: "80px",
            sortable: true,
            width: '4vw',
        },
        {
            name: 'รหัสสาขา',
            selector: row => row.master_branch_code,
            sortable: true,
        },
        {
            name: 'สาขา',
            selector: row => row.master_branch_name,
            sortable: true,
        },
        {
            name: 'รหัสสินค้า',
            selector: row => row.master_product_code,
            //width: "180px",
            sortable: true
        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.master_product_name,
            //width: "180px",
            sortable: true
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.master_product_unit_name,
            //width: "180px",
            sortable: true
        },
        {
            name: 'กลุ่มสินค้า',
            selector: row => row.master_product_group_name,
            //width: "180px",
            sortable: true
        },
        {
            name: 'หมวดสินค้า',
            selector: row => row.master_product_category_name,
            //width: "180px",
            sortable: true
        },
        {
            name: 'คงเหลือ',
            selector: row => row.balance,
            sortable: true,
            //right: true
        },
    ]

    let _Balance_Quantity = 0;
    function sumQuantity(e) {
        dataReportStock.map((item) => {
            let _itemData = item[e].replace(',','');
            _Balance_Quantity += parseFloat(_itemData);
            
            return _Balance_Quantity;
        });
        return deciFormat.format(_Balance_Quantity.toFixed(2));
    }

    const footer = {
        master_product_category_name: "รวม",
        balance: sumQuantity("balance"),
    };


    async function getStockCardBalanceData() {
        if (dataConditions.branch) 
        {
            const data =
            {
                master_company_id: parseInt(userData[0]['master_company_id']),
                master_branch_id: dataConditions.branch.length > 0 ? dataConditions.branch : [branchID],
                master_product_group_id: dataConditions.productGroup.length > 0 ? dataConditions.productGroup : [0],
                master_product_catagory_id: dataConditions.productCategory.length > 0 ? dataConditions.productCategory : [0],
                start_date: moment(dataConditions.startDate).format("YYYYMMDD"),
                end_date: moment(dataConditions.endDate).format("YYYYMMDD"),
                search_productname: dataConditions.product ? dataConditions.product :"",
            }
    console.log(data);
            setLoading(true);
            await axios.post(UrlApi() + 'report_stockcard_balance_new', data).then((res) => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        item.no = idx + 1
                        item.balance  = deciFormat.format(item.balance)
                    })
                    setDefaultDate(false);
                    setReportStock(res.data);
                    setDataReportSearch(res.data);
                    setLoading(false);
                }
            });
        }
        
    }
    const filteredItems = dataReportStock.filter(
        item => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1
    );

    const customStyles = {
        headCells: {
            style: {
                background: '#0064B0',
                color: "white",
                fontSize: "1.8vh",
            },
        },
    };

    const columnExport = [
        { "header": "รหัสสาขา", "selector": "master_branch_code" },
        { "header": "สาขา", "selector": "master_branch_name" },
        { "header": "รหัสสินค้า", "selector": "master_product_code" },
        { "header": "ชื่อสินค้า", "selector": "master_product_name" },
        { "header": "หน่วยนับ", "selector": "master_product_unit_name" },
        { "header": "กลุ่มสินค้า", "selector": "master_product_group_name" },
        { "header": "หมวดสินค้า", "selector": "master_product_category_name" },
        { "header": "คงเหลือ", "selector": "balance" },
    ]

    const getDataTable = () => {
        return (
            <div style={{ height: '80vh', overflow: 'auto', marginTop: "1%", marginRight: "1%" }}>
                    <DataTable
                        noHeader={true}
                        fixedHeader={false}
                        columns={columnData}
                        data={filteredItems}
                        noDataComponent={<p style={{ fontSize: '1.8vh', marginTop: '10px' }}>ไม่พบข้อมูล</p>}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationPerPage="40"
                        paginationRowsPerPageOptions={[50, 100, 200, 500]}
                        footer={footer}
                        customStyles={customStyles}
                    />
            </div>
        )
    }

    const OnchangeSearch = (e) => {
        if (e.target.value) {
            setFilterText(e.target.value)
            let filterText1 = (e.target.value).trim()
            const filteredItems = dataReportSearch.filter((item) =>
                JSON.stringify(item).indexOf(filterText1) !== -1)
            if (filteredItems.length == 0) {
                setReportStock([])
            } else {
                filteredItems.map((item, idx) => { item.row_num = idx + 1 })
                setReportStock(filteredItems)
            }
        } else {
            setFilterText()
        }
    }

    const onChangeDialog = (data) => {
        setDefaultDate(false)
        setDataConditions(data)
    }

    const getDialogReport = () => {
        return (
            <HeaderReport
                onClickSearch={(e) => onChangeDialog(e)} //ข้อมูลจาก Dialog
                data={dataReportStock}  
                columns={columnExport}
                onChange={(e) => OnchangeSearch(e)}
                value={filterText} />)
    }

    return (
        <div>
            {getDialogReport()}
            {getDataTable()}
        </div>
    );
    
}
export default StockReport_New