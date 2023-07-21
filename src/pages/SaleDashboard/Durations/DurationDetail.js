import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import Moment from 'moment';
import { useLocation, useParams } from 'react-router-dom';
import DataTable from '../../../components/Datatable/Datatables';
import Barcharts from "../../../components/Chart/Barcharts";
import { Link } from "react-router-dom";
import UrlApi from "../../../url_api/UrlApi";
import DataContext from "../../../DataContext/DataContext";
import '../../../components/CSS/report.css';

const DurationDetail = () => {
    const userData = useContext(DataContext);
    const [dataReport, setDataReport] = useState([])
    const [dataChart, setDataChart] = useState([])
    const [branchID, setBranchID] = useState()
    const [branchName, setBranchName] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [propsset, setPropsSet] = useState([])
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const location = useLocation();

    const columnsdata = [
        {
            name:'ยอดขาย' ,
            selector: row => <p className="text_tb">{row.time_range}</p>,
            sortable: false,

        },
        {
            name: 'ยอดขายสุทธิ',
            selector: row => <p className="text_tb"> {numFormat.format(row.salehd_netamnt)}</p>,
            width: "160px",
            sortable: false,
            right:true

        },
    ]

    useEffect(() => {
        location.state.map((item, idx) => {
            if (item.branchID) {
                setBranchName(item.branchName)
                setBranchID(item.branchID)
                setEndDate(item.end_date)
                setStartDate(item.start_date)
                getDatadetail(item.branchID, item.endDate)
            }
        })
    }, [])

    useEffect(() => {
        if (dataReport.length > 0) {
            setDataReport(dataReport)
            TBDetail()
        }
    }, [dataReport])




    const getDatadetail = (br, en) => {
        const brID = Number(br);
        var dates = new Date()
        var dateNow = Moment(dates).format("YYYY-MM-DD")
        var enDate = Moment(en).format("YYYY-MM-DD")
        const datas = {
            company_id: parseInt(userData[0]['master_company_id']),
            branch_id: brID,
            date: dateNow,
            end_date: enDate,
            db_name: "erpdb"

        }
        axios.post(UrlApi() + 'duration_detail', datas)
            .then(res => {
                if (res.data) {
                    setDataChart(res.data)
                    setDataReport(res.data)

                }
            })

    }
    const getBarchart = () => {
        return (<div style={{ marginTop: "1%", marginLeft: "8%", width:"80%" }}>
            <Barcharts data={dataChart} vertical={true} datakeyY="time_range" datakey="salehd_netamnt" titles="ยอดขายสุทธิ">
            </Barcharts></div>)
    }

    const TBDetail = () => {
        return (<div style={{ overflow: 'auto', marginLeft: "2%", marginRight: "2%", marginTop:"1%" }}>
            <DataTable
                responsive
                fixedHeader
                columns={columnsdata}
                data={dataReport}
            />
        </div>)
    }

    const getDate = () => {
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        return (<p  className="text"><strong> {strDate} </strong>ถึง <strong> {enDate}</strong> </p>)
    }

    return (
        <div>
            <p className="textH">รายละเอียด <strong>{branchName}</strong></p>
            {getDate()}
            {getBarchart()}
            {TBDetail()}
        </div>
    );
}

export default DurationDetail;
