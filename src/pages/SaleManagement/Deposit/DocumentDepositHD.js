import { React, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
import axios from 'axios';
import DataTable from '../../../components/Datatable/Datatables';
import Moment from 'moment';
import UrlApi from "../../../url_api/UrlApi";
import * as SiIcons from 'react-icons/si';
import _ from "lodash";
import '../../../components/CSS/report.css';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import FilterDataTable from "../../../components/SearchDataTable/FilterDataTable";
import Swithstatus from "../../../components/SwitchStatus/Switchstatus";
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import DateRange from "../../../components/DatePicker/DateRange";
import HeaderPage from "../../../components/HeaderPage/HeaderPage";


const DocumentDepositHD = () => {
    const userData = useContext(DataContext);
    const nf = new Intl.NumberFormat('en-thai', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2, });
    const BranchData = useContext(DataContextBranchData);
    const [dataDocument, setDataDocument] = useState([])
    const [dataDocumentSearch, setDataDocumentSearch] = useState([])
    const [valueInput, setValueInput] = useState()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [defaulDate, setDefaulDate] = useState(false)

    const columndata = [
        {
            name: 'ลำดับ',
            selector: row => row.row_num,
            sortable: true,
            width: "100px"
        },
        {
            name: 'เลขที่เอกสาร',
            selector: row => <span> {row.deposithd_docuno}
                <Link to="view" state={[{
                    "deposithd_id": row.deposithd_id,
                    "status": row.deposithd_status_id,
                    "printtax": row.salehd_print_taxinvoice_name ? false : true,
                    "cusname": row.deposithd_arcustomer_name
                }]}>
                    <IconButton>
                        <KeyboardArrowRighttIcon color="info"  />
                    </IconButton></Link></span>,
            sortable: true,
            width:"220px"
        },
        {
            name: 'วันที่',
            selector: row => row.dates,
            sortable: true,
        },
        {
            name: 'เวลาบันทึก',
            selector: row => row.save_time,
            sortable: true,
        },
        {
            name: 'จำนวนเงิน',
            selector: row => nf.format(row.deposithd_netamnt),
            sortable: true,
        },
        {
            name: 'ชำระโดย',
            selector: row => row.deposithd_arcustomer_name,
            sortable: true,
        },
        {
            name: 'จำนวนเงินคงเหลือ',
            selector: row => nf.format(row.deposithd_balance_amnt),
            sortable: true,
        },
        {
            name: 'สถานะ',
            selector: row => row.deposithd_status_id == 1 ?
                <Swithstatus type="success" message={row.deposithd_status_name} /> :
                row.deposithd_status_id == 4 ?
                    <Swithstatus type="cancle" message={row.deposithd_status_name} /> :
                    row.deposithd_status_id == 2 ?
                        <Swithstatus type="success" message={row.deposithd_status_name} /> :
                        <Swithstatus type="success" message={row.deposithd_status_name} />
            ,
            sortable: true,
        },
    ]

    useEffect(() => {
        getDataDocumentHD()
    }, [])

    useEffect(() => {
        getDataDocumentHD()
    }, [startDate, endDate])

    const getDataDocumentHD = () => {
        var strDate = Moment(startDate).format("YYYYMMDD")
        var enDate = Moment(endDate).format("YYYYMMDD")
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "branch_id": BranchData[0].master_branch_id,
            "save_time": Date.now(),
            "start_date": strDate,
            "end_date": enDate,
        }
        axios.post(UrlApi() + 'get_deposit_transections', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        let y = parseInt(Moment(item.deposithd_docudate).format("YYYY")) + 543
                        item.dates = Moment(item.deposithd_docudate).format("DD/MM/") + y
                        console.log(res.data)
                    })
                    setDataDocumentSearch(res.data)
                    setDataDocument(res.data)
                }

            })
    }

    const getSearchInput = () => {
        return (<div style={{ marginLeft: "1%" }}>
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
            item.row_num = idx +1
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
        <div style={{ marginTop:"1%" }}> {getDataTable()} </div>
    </div>)


}

export default memo(DocumentDepositHD);