import { React, useState, useEffect, useContext} from "react"
import { IconButton } from '@mui/material'
import axios from 'axios';
import Moment from 'moment';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import { useLocation, useParams } from 'react-router-dom';
import DataTable from '../../../components/Datatable/Datatables';
import DataContext from "../../../DataContext/DataContext";
import { Link } from "react-router-dom";
import UrlApi from "../../../url_api/UrlApi";
import '../../../components/CSS/report.css';

const CreditDetail = () => {
    const userData = useContext(DataContext);
    const [dataReport, setDataReport] = useState([])
    const [branchID, setBranchID] = useState()
    const [branchName, setBranchName] = useState()
    const [endDate, setEndDate] = useState()
    const [userId, setUserId] = useState(userData[0].user_login_id)
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const location = useLocation();

    const columnsdata = [
        {
            name: 'เลขที่บิล',
            selector: row => row.salehd_docuno,
            sortable: false,
            width: "240px",

        },
        {
            name: 'ลูกค้า',
            selector: row => row.salehd_arcustomer_name,
            sortable: false,

        },
        {
             name: 'โต๊ะ',
            selector: row => row.master_table_name,
            sortable: false,

        },
        {
             name: 'มูลค่าบิลขาย',
            cell: row =>
                <div>{row.salehd_netamnt == 0 ?
                    <span>{numFormat.format(row.salehd_netamnt)}
                        <IconButton>
                            <KeyboardArrowRighttIcon />
                        </IconButton></span> :
                    <span>{numFormat.format(row.salehd_netamnt)}
                        <Link to={{ pathname: "/main/bill/detail/sub", }} state={[{
                            'salehd_docuno': row.salehd_docuno,
                            'salehdId': row.salehd_id,
                            'salehd_discountamnt': row.salehd_discountamnt
                        }]}>
                            <IconButton>
                                <KeyboardArrowRighttIcon color="info" />
                            </IconButton></Link></span>
                }
                </div>,
            width: "160px",
            sortable: false,

        },

    ]

    useEffect(() => {
        location.state.map((item, idx) => {
                setBranchID(item.branchID)
                setBranchName(item.branchName)
                setEndDate(item.endDate)
                getDatadetail(item)
            
        })
    }, [])

    useEffect(() => {
        if (dataReport.length > 0) {
            setDataReport(dataReport)
            TBDetail()
        }
    }, [dataReport])

    const getDatadetail = (item) => {
        var str = Moment(item.startDate).format("YYYY-MM-DD")
        var en = Moment(item.endDate).format("YYYY-MM-DD")
        const datas = {
            company_id: parseInt(userData[0]['master_company_id']),
            branch_id: item.branchID,
            start_date : str,
            end_date: en,
            cqbankbook_id: item.bankbookID,
            db_name: "erpdb",
            user_id: userId

        }
        console.log(datas)
        axios.post(UrlApi() + 'payment_creditcard_detail', datas)
            .then(res => {
                if (res.data) {
                    setDataReport(res.data)
                }
            })
    }

    const TBDetail = () => {
        return (<><div style={{ marginLeft: "10%", marginRight: "10%" }}>
              <p className="textH">รายละเอียดบัตรเครดิต : <strong>{branchName}</strong></p>
                 </div>
            <div style={{ marginLeft: "2%", marginRight: "2%", marginTop: "1%" }}>
                <DataTable
                    responsive
                    fixedHeader
                    columns={columnsdata}
                    data={dataReport}
            />
            </div></>)
    }

    return (
        <div>
            {TBDetail()}
        </div>
    );
}

export default CreditDetail;
