import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import DataTable from '../../../components/Datatable/Datatables';
import { useLocation } from 'react-router-dom';
import DataContext from "../../../DataContext/DataContext";
import UrlApi from "../../../url_api/UrlApi";
import '../../../components/CSS/report.css';

const RealtimeOrderSub = () => {
    const userData = useContext(DataContext);
    const [dataReport, setDataReport] = useState([])
    const [orderCode, setOrderCode] = useState()
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const location = useLocation();

    const columnsdata = [
        {
            name:'รหัสสินค้า',
            selector: row => row.master_product_code,
            sortable: false,

        },
        {
            name: 'ชื่อสินค้า',
            selector: row => row.orderdt_master_product_billname,
            sortable: false,

        },
        {
             name: 'ราคา',
            selector: row => row.orderdt_netamnt,
            width: "100px",
            sortable: false,
            right:true

        },
    ]

    useEffect(() => {
        location.state.map((item, idx) => {
            if (item.orderhd_id) {
                setOrderCode(item.order_code)
                getDatadetail(item.orderhd_id)
            }
        })
    }, [])

    useEffect(() => {
        if (dataReport.length > 0) {
            setDataReport(dataReport)
            TBDetail()
        }
    }, [dataReport])

    const getDatadetail = (order) => {
        const orID = Number(order);
        const datas = {
            orderhd_id: order,
            db_name: "erpdb"
        }
        axios.post(UrlApi() + 'realtime_order_sub', datas)
            .then(res => {
                if (res.data) {
                    setDataReport(res.data)
                    res.data.map((item, idx) => {
                        var nf = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 })
                        item.orderdt_netamnt = nf.format(item.orderdt_netamnt);
                    })
                }
            })
    }

    const TBDetail = () => {
        return (
            <div style={{ marginTop: "1%" }}>
                <p className="textH"> ออเดอร์ {orderCode} </p>
                <div style={{ marginLeft: "2%", marginRight: "2%", marginTop: "1%" }}>
                    <DataTable
                        responsive
                        fixedHeader
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

export default RealtimeOrderSub;
