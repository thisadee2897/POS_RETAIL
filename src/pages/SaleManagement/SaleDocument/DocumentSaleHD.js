
import { React, useState, useEffect, useContext, useMemo, memo } from "react";
import DataTable from '../../../components/Datatable/Datatables';
import Moment from 'moment';
import _ from "lodash";
import '../../../components/CSS/report.css';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import FilterDataTable from "../../../components/SearchDataTable/FilterDataTable";
import Swithstatus from "../../../components/SwitchStatus/Switchstatus"
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import DateRange from "../../../components/DatePicker/DateRange";
import DataContextMenuActions from "../../../DataContext/DataContextMenuActions";
import { useLocation } from "react-router-dom";
import UrlApi from "../../../url_api/UrlApi";
import axios from 'axios';
import HeaderPage from "../../../components/HeaderPage/HeaderPage";


const DocumentSaleHD = () => {
    const actions = useContext(DataContextMenuActions);
    const location = useLocation();
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [dataDocument, setDataDocument] = useState([])
    const [dataDocumentSearch, setDataDocumentSearch] = useState([])
    const [valueInput, setValueInput] = useState()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [defaulDate, setDefaulDate] = useState(false)
    const [saleCredit, setSaleCredit] = useState(false)


    const columndata = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: true,
            width: "100px"
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => <span> {row.salehd_docuno}
                <Link to="view" state={[{
                    "salehd_id": row.salehd_id,
                    "status": row.salehd_status_id,
                    "doc_type": saleCredit == true ? 'credit' : 'cash',
                    "printtax": row.salehd_print_taxinvoice_name.length > 3 ? false : true
                }]}>
                    <IconButton>
                        <KeyboardArrowRighttIcon color="info" />
                    </IconButton></Link></span>,
            sortable: true,
            width: "220px"
        },
        {
            name: 'วันที่',
            selector: row => row.dates,
            sortable: true,
            center:true,
        },
        {
            name: 'เวลาบันทึก',
            selector: row => row.save_time,
            sortable: true,
            center:true,
        },
        {
            name: 'มูลค่าสุทธิ',
            selector: row => {
                let netAmount = row.salehd_netamnt;
                if (!isNaN(netAmount) && !isNaN(parseFloat(netAmount))) {
                    netAmount = parseFloat(netAmount).toFixed(2);
                    let parts = netAmount.toString().split(".");
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return <div style={{ textAlign: 'right' }}>{parts.join(".")}</div>;
                } else {
                    return <div style={{ textAlign: 'right' }}>{row.salehd_netamnt}</div>;
                }
            },
            sortable: true,
            right: true,
        },
        {
            name: 'ประเภทการชำระ',
            selector: row => row.payment_type,
            sortable: true,
            center:true,
        },
        {
            name: 'สาขา',
            selector: row => row.master_branch_name,
            sortable: true,
        },
        {
            name: 'รหัสลูกค้า',
            selector: row => row.arcustomer_code,
            sortable: true,
        },
        {
            name: 'ออกใบกำกับภาษี',
            selector: row => row.salehd_print_taxinvoice_name,
            sortable: true,
        },
        {
            name: 'สถานะ',
            selector: row => row.salehd_status_id == 1 ?
                <Swithstatus type="success" message={row.salehd_status_name} /> :
                row.salehd_status_id == 2 ?
                    <Swithstatus type="cancle" message={row.salehd_status_name} /> :
                    row.salehd_status_id == 4 ?
                        <Swithstatus type="disible_black" message={row.salehd_status_name} /> :
                        <Swithstatus type="close" message={row.salehd_status_name} />
            ,

            sortable: true,
        },
    ]


    useEffect(() => {
        if (location.pathname == '/main/document/sale-credit') {
            setSaleCredit(true)
        } else {
            setSaleCredit(false)
        }
    }, [location.pathname, actions]);

    useEffect(() => {
        getDataDocumentHD()
    }, [])

    useEffect(() => {
        getDataDocumentHD()
    }, [startDate, endDate])

    const getDataDocumentHD = () => {
        var strDate = Moment(startDate).format("YYYYMMDD")
        var enDate = Moment(endDate).format("YYYYMMDD")
        const dataAPI = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "branch_id": BranchData[0].master_branch_id,
            "doc_date": strDate,
            "doc_type": saleCredit == true ? 9 : 8
        }
        console.log(dataAPI)
        axios.post(UrlApi() + 'get_salehd_transections', dataAPI)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let y = parseInt(Moment(item.salehd_docudate).format("YYYY")) + 543
                        item.dates = Moment(item.salehd_docudate).format("DD/MM/") + y
                    })
                    setDataDocumentSearch(res.data)
                    setDataDocument(res.data)
                    console.log(res.data)
                }

            })
    }

    const getSearchInput = () => {
        return (<div style={{ marginLeft: "1%", marginRight: "1%", }}>
            <FilterDataTable value={valueInput} onChange={(e) => { OnchangeSearch(e) }} placeholder="ค้นหา" />
        </div>
        )
    }

    const OnchangeSearch = (e) => {
        if (e.target.value) {
            setValueInput(e.target.value)
            let filterText = (e.target.value).trim()
            const filteredItems = dataDocumentSearch.filter((item) =>
                JSON.stringify(item).indexOf(filterText) !== -1)
            if (filteredItems.length <= 0) {
                setDataDocument([])

            } else {
                filteredItems.map((item, idx) => { item.row_num = idx + 1 })
                setDataDocument(filteredItems)
            }
        } else {
            setValueInput()
            getDataDocumentHD()
        }
    }

    const getDate = () => {
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        return (<p className="text"><strong> {strDate} </strong>ถึง <strong> {enDate}</strong> </p>)
    }

    const getDataRange = () => {
        return (<DateRange style={{ marginLeft: "10%", width: "90%" }}
            handleStart={(d) => { setStartDate(d) }} handleEnd={(d) => { setEndDate(d) }} defauldates={defaulDate} >
        </DateRange>)
    }

    const getDataTable = () => {
        dataDocument.map((item, idx) => {
            item.row_num = idx + 1
        })
        return (<>
            <DataTable
                fixedHeader
                columns={columndata}
                data={dataDocument}
                defaultSortAsc={false}
                pagination
                paginationRowsPerPageOptions={[50, 100, 150, 200,]}
                noDataComponent={<p style={{ fontSize: '1vw', marginTop: '10px' }}>ไม่พบข้อมูล</p>}
            />
        </>)
    }

    return (<div style={{ background: "#F2F2F2" }}>
        <HeaderPage flagMaster={false} />
        <div class="row" style={{ marginLeft: "1%", marginTop: "1%" }}>
            <div class="col-3">
                {getDataRange()}
            </div>
            <div class="col-3">
                {getSearchInput()}
            </div>
        </div>
        <div style={{ marginTop: "1%" }}> {getDataTable()}</div>
    </div>)


}

export default memo(DocumentSaleHD);