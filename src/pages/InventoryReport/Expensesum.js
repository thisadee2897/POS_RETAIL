import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import DataContext from "../../DataContext/DataContext";
import DataTable from '../../components/Datatable/Datatables';
import UrlApi from "../../url_api/UrlApi";
import _ from "lodash";
import '../../components/CSS/report.css'
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import moment from "moment/moment";
import HeaderReport from "../../components/HeaderReport/HeaderReport";

const ExpenseSum = () => {
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false)
    const [dataReportExpanse, setReportExpanse] = useState([])
    const userData = useContext(DataContext);
    const branchData = useContext(DataContextBranchData);
    const [branchSelectedID, setBranchSelectedID] = useState(branchData.branch_id)
    const [branchSelectedName, setBranchSelectedName] = useState(branchData.branch_name)
    const [bankListID, setBankListID] = useState([])
    const [bankListIDs, setBankListIDs] = useState([])
    const [bankCheck, setbankCheck] = useState([])
    const [branchListID, setBranchListID] = useState([])
    const [branchListIDs, setBranchListIDs] = useState([])
    const [branchCheck, setBranchCheck] = useState([])
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const [branchID, setBranchID] = useState(branchData['branch_id'])
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id'])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [hoFlag, setHoFlag] = useState(localStorage.getItem('hoFlag'))
    const [dataConditions, setDataConditions] = useState([])
    const [dataReportSearch, setDataReportSearch] = useState([])
    const numFormat = new Intl.NumberFormat('en-thai', { style: 'decimal' })
    const deciFormat = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 })
    const [defaultDate, setDefaultDate] = useState(false)

    useEffect(() => {
        if (dataConditions.branch) {
            getExpenseHDData()
        }
    }, [dataConditions])

   

    const columnData = [
        {
            name: 'ลำดับ',
            selector: row => row.no,
            width: "80px",
            sortable: true,
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
            name: 'วันที่เอกสาร',
            selector: row => row.expense_hd_docudate,
            sortable: true,
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => row.expense_hd_docuno,
            width: "180px",
            sortable: true
        },
        {
            name: 'มูลค่า',
            selector: row => row.expense_hd_amount,
            width: "180px",
            sortable: true,
        },
        {
            name: 'บันทึกโดย',
            selector: row => row.fullname,
            sortable: true,
            footer: '120',
            right: true,
        },
        {
            name: 'สถานะ',
            selector: row => row.expense_status_name,
            right: true,
            sortable: true,

        },
        {
            name: 'หมายเหตุ',
            selector: row => row.expense_hd_remark,
            right: true,
            sortable: true,
        },

    ]

    let _Expense_HD_Amount = 0;
    function sumAmount(e) {
        dataReportExpanse.map((item) => {
            let _itemData = item[e].replace(',','');
            _Expense_HD_Amount += parseFloat(_itemData);
            
            return _Expense_HD_Amount;
        });
        return deciFormat.format(_Expense_HD_Amount.toFixed(2));
    }

    const footer = {
        expense_hd_docuno: "รวม",
        expense_hd_amount: sumAmount("expense_hd_amount"),
    };

    
    async function getExpenseHDData() {
        if (dataConditions.branch) 
        {
            const data =
            {
                company_id: parseInt(userData[0]['master_company_id']),
                branch_id: dataConditions.branch.length > 0 ? dataConditions.branch : [branchID],
                start_date: moment(dataConditions.startDate).format("YYYYMMDD"),
                end_date: moment(dataConditions.endDate).format("YYYYMMDD"),
            }
            setLoading(true);
            await axios.post(UrlApi() + 'report_expense_hd', data).then((res) => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let y = parseInt(moment(item.expense_hd_docudate).format("YYYY")) + 543
    
                        item.no = idx + 1
                        item.expense_hd_docudate = moment(item.expense_hd_docudate).format("DD/MM/") + y
                        item.expense_hd_amount  = deciFormat.format(item.expense_hd_amount)
                    })
                    setDefaultDate(false);
                    setReportExpanse(res.data);
                    setDataReportSearch(res.data);
                    setLoading(false);
                }
            });
        }
        
    }

    const filteredItems = dataReportExpanse.filter(
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
        { "header": "วันที่เอกสาร", "selector": "expense_hd_docudate" },
        { "header": "เลขที่เอกสาร", "selector": "expense_hd_docuno" },
        { "header": "มูลค่า", "selector": "expense_hd_amount" },
        { "header": "บันทึกโดย", "selector": "fullname" },
        { "header": "สถานะ", "selector": "expense_status_name" },
        { "header": "หมายเหตุ", "selector": "expense_hd_remark" },
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
                setReportExpanse([])
            } else {
                filteredItems.map((item, idx) => { item.row_num = idx + 1 })
                setReportExpanse(filteredItems)
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
                data={dataReportExpanse}  
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

export default memo(ExpenseSum);
