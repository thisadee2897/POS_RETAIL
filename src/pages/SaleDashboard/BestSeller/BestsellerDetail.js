import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import Moment from 'moment';
import Barcharts from "../../../components/Chart/Barcharts";
import DataContext from "../../../DataContext/DataContext";
import { useLocation } from 'react-router-dom';
import DataTable from '../../../components/Datatable/Datatables';
import UrlApi from "../../../url_api/UrlApi";
import '../../../components/CSS/report.css';

const BestsellerDetail = () => {
    const userData = useContext(DataContext);
    const [dataReport, setDataReport] = useState([])
    const [dataChart, setDataChart] = useState([])
    const [branchID, setBranchID] = useState()
    const [branchName, setBranchName] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [propsset, setPropsSet] = useState([])
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const location = useLocation();

    const columnsdata = [
        {
            name: 'ลำดับ',
            selector: row => row.listno,
            sortable: false,

        },
        {
            name:'ชื่อสินค้า' ,
            selector: row => row.saledt_master_product_billname,
            width: "300px",
            sortable: false,

        },
        {
            name: 'จำนวน',
            selector: row => row.saledt_qty,
            sortable: false,

        },
        {
            name: 'มูลค่ารวม',
            selector: row => {numFormat.format(row.saledt_netamnt)},
            sortable: false,
            right:true

        }
    ]

    useEffect(() => {
        location.state.map((item, idx) => {
            if (item.branchID) {
                setBranchID(item.branchID)
                setBranchName(item.branchName)
                setStartDate(item.star_tDate)
                setEndDate(item.end_Date)
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

    useEffect(() => {
        getBarchart()
    }, [dataReport])

    const getDatadetail = (br, sr,en) => {
        var srDate = Moment(sr).format("YYYY-MM-DD")
        var enDate = Moment(en).format("YYYY-MM-DD")
        const datas = {
            company_id: parseInt(userData[0]['master_company_id']),
            branch_id: br,
            start_date: srDate,
            end_date: enDate,
            db_name: "erpdb",
            "user_id": userId

        }
        axios.post(UrlApi() + '/payment_best_seller_detail', datas)
            .then(res => {
                if (res.data) {
                    setDataChart(res.data)
                    setDataReport(res.data)
                }
            })
    }

    const getBarchart = () => {
        return (<div style={{ marginLeft: "8%", marginTop: "1%" ,width:"80%"}}>
            <Barcharts data={dataChart} datakeyY="saledt_master_product_billname" datakey="saledt_netamnt" titles="มูลค่ารวม"
                vertical={true} widthY={210}>
        </Barcharts> </div>)
    }

    const TBDetail = () => {
        return (<div style={{ marginLeft: "15%", marginRight: "15%", marginTop: "1%" }}>
            <DataTable
                responsive
                fixedHeader
                columns={columnsdata}
                data={dataReport}
            />
        </div>)
    }

    const getDate = () => {
        var strDate = Moment(startDate).format("DD-MM-YYYY")
        var enDate = Moment(endDate).format("DD-MM-YYYY")
        return (<p  className="text"><strong> {strDate} </strong>ถึง <strong> {enDate}</strong> </p>)
    }
    return (
        <div>  <p  className="textH">รายละเอียดสาขา <strong>{branchName}</strong></p>
            { getDate() }
            {getBarchart()}
            {TBDetail()}
        </div>
    );
}

export default BestsellerDetail;
