import { React, useState, useEffect, useContext } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import axios from 'axios';
import Moment from 'moment';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import { useLocation, useParams } from 'react-router-dom';
import DataContext from "../../../DataContext/DataContext";
import { Link } from "react-router-dom";
import DataTable from '../../../components/Datatable/Datatables';
import UrlApi from "../../../url_api/UrlApi";
import '../../../components/CSS/report.css';

const DurationsByPayDetailSub = () => {
    const userData = useContext(DataContext);
    const [dataReport, setDataReport] = useState([])
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [branchID, setBranchID] = useState()
    const [namePage, setnamePage] = useState()
    const [types, setTypes] = useState()
    const [eatTypes, setEatTypes] = useState()
    const [branchName, setbranchName] = useState()
    const [userId, setUserId] = useState(userData[0].user_login_id)
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const location = useLocation();

    const columnsdataPay = [
        {
            name: 'เลขที่บิล',
            selector: row => row.salehd_docuno,
            sortable: false,

        },
        {
            name:'ลูกค้า',
            selector: row => row.salehd_arcustomer_name,
            sortable: false,

        },
        {
            name: 'โต๊ะ',
            selector: row => row.master_table_name,
            width: "200px",
            sortable: false,

        },
        {
            name:'มูลค่าบิล',
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


    const columnsdataCredit = [
        {
            name:'ประเภท',
            selector: row => <p className="text_tb">{row.cq_bankbook_no}</p>,
            sortable: false,

        },
        {
            name:'ยอดรวม' ,
            cell: row =>
                <div>{row.salehd_netamnt == 0 ?
                    <span>{numFormat.format(row.salehd_netamnt)}
                        <IconButton>
                            <KeyboardArrowRighttIcon />
                        </IconButton></span> :
                    <span>{numFormat.format(row.salehd_netamnt)}
                        <Link to={{ pathname: "/main/credit/detail", }} state={[{
                            'startDate': startDate,
                            'endDate': endDate,
                            'branchID': branchID,
                            'branchName': branchName,
                            'bankbookID': row.cq_bankbook_id
                           
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


    const columnsdataService = [
        {
            name:'Barcode' ,
            selector: row => <p className="text_tb">{row.saledt_master_product_barcode_code}</p>,
            sortable: false,

        },
        {
            name:'รายการค่าบริการ' ,
            selector: row => <p className="text_tb">{row.saledt_master_product_billname}</p>,
            sortable: false,

        },
        {
            name:'ค่าบริการ',
            cell: row => <p className="text_tb">{numFormat.format(row.saledt_netamnt)}</p>,
            width: "160px",
            sortable: false,
        },
    ]

    const columnsdataSit = [
        {
            name:'BarCode' ,
            selector: row => <p className="text_tb">{row.saledt_master_product_barcode_code}</p>,
            sortable: false,

        },
        {
            name:'ชื่อสินค้า' ,
            selector: row => <p className="text_tb">{row.saledt_master_product_billname}</p>,
            sortable: false,

        },
        {
            name:'ยอดรวม' ,
            cell: row => <p className="text_tb">{numFormat.format(row.saledt_netamnt)}</p>,
            width: "160px",
            sortable: false,
            right:true
        },

    ]

    useEffect(() => {
        location.state.map((item, idx) => {
            setbranchName(item.branch_name)
            setStartDate(item.start_date)
            setEndDate(item.end_date)
            setTypes(item.pay_type)
            setEatTypes(item.eating_type)
            setnamePage(item.name)
            setBranchID(item.branch_id)
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
        var strDate = Moment(item.start_date).format("YYYY-MM-DD")
        var enDate = Moment(item.end_date).format("YYYY-MM-DD")
        if (item.pay_type) {
            const datas = {
                start_date: strDate,
                end_date: enDate,
                company_id: parseInt(userData[0]['master_company_id']),
                user_id: userId,
                branch_id: item.branch_id,
                db_name: "erpdb",
                pay_type: item.pay_type
            }
            axios.post(UrlApi() + item.api, datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)

                    }
                })

        } else if (item.eating_type) {
            const datas = {
                start_date: strDate,
                end_date: enDate,
                company_id: parseInt(userData[0]['master_company_id']),
                user_id: userId,
                branch_id: item.branch_id,
                db_name: "erpdb",
                eating_type: item.eating_type
            }
            axios.post(UrlApi() + item.api, datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)

                    }
                })
        } else {
            const datas = {
                start_date: strDate,
                end_date: enDate,
                company_id: parseInt(userData[0]['master_company_id']),
                user_id: userId,
                branch_id: item.branch_id,
                db_name: "erpdb",
            }
            axios.post( UrlApi() + item.api, datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)

                    }
                })

        }
    }

    const TBDetail = () => {
        return (<div><p  className="textH">รายละเอียด{namePage} : <strong>{branchName}</strong></p>
            <div style={{ marginLeft: "2%", marginRight: "2%", marginTop: "3%" }}>
                <DataTable
                    columns={types == 3 ? columnsdataCredit : types ? columnsdataPay : eatTypes ? columnsdataSit : columnsdataService }
                    data={dataReport}
                /></div>
        </div>)
    }

    return (
        <div>
            {TBDetail()}
        </div>
    );
}

export default DurationsByPayDetailSub;
