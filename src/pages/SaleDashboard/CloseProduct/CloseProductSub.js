import { React, useState, useEffect, useContext } from "react"
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import DataContext from "../../../DataContext/DataContext";
import DataTable from '../../../components/Datatable/Datatables';
import UrlApi from "../../../url_api/UrlApi";
import '../../../components/CSS/report.css';

const CloseProductSub = () => {
    const userData = useContext(DataContext);
    const [dataReport, setDataReport] = useState([])
    const [branchID, setBranchID] = useState()
    const [branchName, setbranchName] = useState()
    const location = useLocation();

    const columnsdata = [
        {
            name:'Barcode' ,
            selector: row => row.barcode,
            sortable: false,

        },
        {
            name:'ชื่อสินค้' ,
            selector: row => row.master_product_name,
            sortable: false,

        },
        {
             name:'ราคา',
            selector: row => row.master_product_price1,
            width: "100px",
            sortable: false,
            right:true
        }
    ]

    useEffect(() => {
        location.state.map((item, idx) => {
            if (item.branchID) {
                setBranchID(item.branchID)
                getDatadetail(item.branchID)
            }
        })
    }, [])

    useEffect(() => {
        if (dataReport.length > 0) {
            setDataReport(dataReport)
            TBDetail()
        }
    }, [dataReport])

    const getDatadetail = (br) => {
        const brID = Number(br);
        var dates = new Date()
        const datas = {
            company_id: parseInt(userData[0]['master_company_id']),
            branch_id: brID,
            db_name: "erpdb"
        }
        axios.post(UrlApi() + '/closed_products', datas)
            .then(res => {
                var nf = new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 })
                if (res.data) {
                    setbranchName(res.data[0].master_branch_name)
                    setDataReport(res.data)
                    res.data.map((item, idx) => {
                        item.master_product_price1 = nf.format(item.master_product_price1)
                    })
                }
            })

    }

    const TBDetail = () => {
        return (<div ><p className="textH">สาขาที่ปิดขาย : {branchName}</p>
            <div style={{ marginLeft: "2%", marginRight: "2%", marginTop:"1%" }}>
                <DataTable
                    responsive
                    fixedHeader
                    columns={columnsdata}
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

export default CloseProductSub;
