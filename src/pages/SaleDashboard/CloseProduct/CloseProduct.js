import { React, useState, useEffect, useContext, memo } from "react";
import { IconButton } from '@mui/material'
import axios from 'axios';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import { Link } from "react-router-dom";
import BtnAdd from "../../../components/Button/BtnAdd";
import Barcharts from "../../../components/Chart/Barcharts";
import DialogBranch from "../../../components/DialogBranch/DialogBranch";
import BadgeCompopnents from "../../../components/BadgesComponent/Badgeconponents";
import DataTable from '../../../components/Datatable/Datatables';
import Loading from "../../../components/Loading/Loading";
import UrlApi from "../../../url_api/UrlApi";
import _ from "lodash";
import '../../../components/CSS/report.css';

const CLoseProduct = () => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [dataReport, setDataReport] = useState([]);
    const [databranch, setDataBranch] = useState([])
    const [dataSum, setDataSum] = useState([])
    const [defaulDate, setDefaulDate] = useState(false)
    const [brancID, setBranchID] = useState([])
    const [brancIDs, setBranchIDs] = useState([])
    const [brancIDDefual, setbrancIDDefual] = useState([])
    const [databadge, setDataBadge] = useState([])
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const [loading, setLoading] = useState(false)

    const columnsdata = [
        {
            name:'สาขา',
            selector: row => row.master_branch_name,
            sortable: false,

        },
        {
            name: 'จำนวนที่ปิด',
            cell: row =>
                <div>{row.count_barcode == 0 ?
                    <span>{row.count_barcode}
                        <IconButton>
                            <KeyboardArrowRighttIcon />
                        </IconButton></span> :
                    <span>{row.count_barcode}
                        <Link to="detail" state={[{
                            'branchID': row.master_branch_id
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
        getData()
        getDataBranch()
    }, [])

    useEffect(() => {
        if (brancIDDefual.length > 0 && defaulDate == false) {
            getDataFromBranch()
        } else {
            getData()
        }
    }, [defaulDate])

    useEffect(() => {
        getDataTable()
        getBarchart()
    }, [dataReport])

    const getDataBranch = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "user_id": userId

        }
        axios.post(UrlApi() + 'get_branch_data', datas)
            .then(res => {
                if (res.data) {
                    setDataBranch(res.data)
                }
            })
    }

    const getData = () => {
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "db_name": "erpdb",
            "branch_id": parseInt(BranchData.branch_id),
            "user_id": userId
        }
        axios.post(UrlApi() +  'closed_products_count', datas)
            .then(res => {
                if (res.data) {
                    setDataReport(res.data)
                    setDataSum(res.data)
                    sumData()
                }
            })
    }

    const getDataFromBranch = () => {
        setLoading(true);
        if (brancIDs.length > 0 || brancIDDefual.length > 0) {
            if (brancIDs.length > 0) {
                setbrancIDDefual(brancIDs)
                setDataBadge(brancIDs)
            } else {
                setDataBadge(brancIDDefual)
            }
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "db_name": "erpdb",
                "branch_id": brancIDs.length > 0 ? brancIDs : brancIDDefual,
                "user_id": userId
            }
            axios.post(UrlApi() + 'closed_products_count', datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)                      
                        setDataSum(res.data)
                        sumData()

                    }
                    setLoading(false);
                })
            getDataTable()
        } else {
            getData()
        }
    }

    const sumData = () => {
        dataSum.map((item, idx) => {
            item.count_barcode = parseInt(item.count_barcode);
        })
        var sum_count_barcode = _.sumBy(dataSum, 'count_barcode');
        var nf = new Intl.NumberFormat();
        return (<div class="row" style={{ marginLeft: "1%", marginBottom: "5%", marginTop: "1%" }}>
            <div class="col">
                <p className="text_H"><strong>รวม</strong></p>
            </div>
            <div class="col">
                <p style={{ marginLeft: "38%" }} className="textH_tc">{nf.format(sum_count_barcode)}</p>
            </div>
        </div>)
    }

    const getBarchart = () => {
        return (<div style={{ marginLeft: "10%", marginTop: "1%", width:"80%" }}>
            <Barcharts data={dataReport} datakeyX="master_branch_prefix" datakey="count_barcode" titles="จำนวนที่ปิด">
            </Barcharts>
        </div>)
    }

    const getDateDefual = () => {
        setBranchID([])
        setbrancIDDefual([])
        setDataReport([])
        getDataBranch()
        getDialogBranchs()
        getData()
    }

    const getDialogBranchs = () => {
        return (<div style={{ width:"120%" }}>
            < DialogBranch onChangeBranchValue={(e) => { onChangeDialog(e) }} branchsDataID={brancID} />
        </div>)
    }

    const onChangeDialog = (datas) => {
        if (datas) {
            datas.map((item, idx) => {
                if (item.checks == true) {
                    setBranchIDs([])
                    brancIDs.push(item.value)
                }
                getDataFromBranch()
            })
            if (brancIDs.length == 0) {
                setDataBadge([])
                getData()
            }
        } else {
            setBranchIDs([])
            setBranchID([])
            setbrancIDDefual([])
            getData()
        }
    }

    const getDataTable = () => {
        return (<div style={{ marginLeft: "2%", marginRight: "2%", marginTop: "1%" }}>
            <DataTable
                fixedHeader
                responsive={true}
                columns={columnsdata}
                data={dataReport}
            />
            {sumData()}
        </div>)
    }

    const getBadge = () => {
        let datasbadge = []
        databranch.map((item, idx) => {
            databadge.map((its, ids) => {
                if (its == item.id) {
                    let datas = {
                        "label": item.value,
                        "value": item.id
                    }
                    datasbadge.push(datas)
                }
            })
        })
        return (<div>
            <BadgeCompopnents databadge={datasbadge} />
        </div>)
    }

    return (
        <div>
            <p className="textH">การวิเคราะห์ปิดรายการสินค้า</p>
             <div class="row" style={{ marginLeft: "42%", marginRight: "20%"}}>
            <div class="col-2">
                {getDialogBranchs()}
            </div>
            <div class="col-2" >
                <BtnAdd style={{ width:"120%" }} onClick={getDateDefual} message="รีเฟรช" >รีเฟรช</BtnAdd>
            </div>
        </div>
        <div style={{ marginLeft: "40%" }}>{getBadge()}</div>
        <div style={{ height: '80vh', overflow: 'auto' }}> {getBarchart()}
            {getDataTable()}
        </div>
            {loading && <Loading style={{ left: '47%', left: '46%' }} />}
        </div>
    );
}

export default memo(CLoseProduct);
