import { React, useState, useEffect, useContext } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import axios from 'axios';
import Moment from 'moment';
import DataTable from '../../../components/Datatable/Datatables';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import DataContext from "../../../DataContext/DataContext"
import UrlApi from "../../../url_api/UrlApi";
import '../../../components/CSS/report.css';

const RealtimeOrder = () => {
    const userData = useContext(DataContext);
    const [dataReport, setDataReport] = useState([])
    const [branchID, setBranchID] = useState()
    const [branchName, setBranchName] = useState()
    const [endDate, setEndDate] = useState()
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const location = useLocation();

    const columnsdata = [
        {
            name: 'โต๊ะ',
            selector: row => row.master_table_name,
            sortable: false,

        },
        {
            name: 'เวลา',
            selector: row => row.savetime,
            sortable: false,

        },
        {
            name:'เลขที่ออเดอร์' ,
            selector: row => row.orderhd_docuno,
            sortable: false,
            width: "300px",

        },
        {
            name: 'มูลค่าออเดอร์',
            cell: row => <div>{row.orderhd_netamnt == 0 ?
                <span>{row.orderhd_netamnt}
                    <IconButton>
                        <KeyboardArrowRighttIcon />
                    </IconButton></span> :
                <span>{row.orderhd_netamnt}
                    <Link to="sub" state={[{
                        'orderhd_id': row.orderhd_id,
                        'order_code': row.orderhd_docuno
                    }]}>
                        <IconButton>
                            <KeyboardArrowRighttIcon color="info" />
                        </IconButton></Link></span>
            }
            </div>,
            width: "160px",
            sortable: false,
            right: true
        },
    ]
    useEffect(() => {
        location.state.map((item, idx) => {
            if (item.branchID) {
                setBranchID(item.branchID)
                setBranchName(item.branchName)
                setEndDate(item.endDate)
                getDatadetail(item.branchID, item.startDate, item.endDate)
            }
        })
    }, [])

    useEffect(() => {
        if (dataReport.length > 0) {
            setDataReport(dataReport)
            TBDetail()
        }
    }, [dataReport])

    const getDatadetail = (br,st, en) => {
        var dates = new Date()
        var stDate = Moment(st).format("YYYY-MM-DD")
        var enDate = Moment(en).format("YYYY-MM-DD")
        const datas = {
            company_id: parseInt(userData[0]['master_company_id']),
            branch_id:[parseInt(br)],
            date: stDate,
            end_date: enDate,
            db_name: "erpdb"

        }
        axios.post(UrlApi() + 'realtime_order', datas)
            .then(res => {
                if (res.data) {
                    res.data.map((item, idx) => {
                        var nf = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 })
                        item.orderhd_netamnt = nf.format(item.orderhd_netamnt)
                        item.savetime = Moment(dates).format("h:mm:ss")
                    })
                    setDataReport(res.data)
                }
            })

    }

    const TBDetail = () => {
        return (
            <div>
                <p className="textH" > ออเดอร์ที่ยังไม่ปิดบิล : {branchName} </p>
                <div style={{ marginLeft: "2%", marginRight: "2%", marginTop: "1%" }}>
                    <DataTable
                        fixedHeader
                        responsive={true}
                        columns={columnsdata}
                        data={dataReport}
                    /></div>
            </div>
        )
    }

    return (
        <div>
            {TBDetail()}
        </div>
    );
}

export default RealtimeOrder;
