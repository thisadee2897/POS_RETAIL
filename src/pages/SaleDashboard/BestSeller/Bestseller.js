import { React, useState, useEffect, useContext, memo } from "react";
import { IconButton } from '@mui/material'
import axios from 'axios';
import KeyboardArrowRighttIcon from '@mui/icons-material/KeyboardArrowRight';
import DataTable from '../../../components/Datatable/Datatables';
import DataContext from "../../../DataContext/DataContext";
import BtnAdd from "../../../components/Button/BtnAdd";
import Barcharts from "../../../components/Chart/Barcharts";
import DateRange from "../../../components/DatePicker/DateRange";
import BadgeCompopnents from "../../../components/BadgesComponent/Badgeconponents";
import DialogBranch from "../../../components/DialogBranch/DialogBranch";
import { Link } from "react-router-dom";
import UrlApi from "../../../url_api/UrlApi";
import Moment from 'moment';
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import '../../../components/CSS/report.css';

const Bestseller = () => {
    const userData = useContext(DataContext);
    const branchData = useContext(DataContextBranchData);
    const [dataReport, setDataReport] = useState([])
    const [dataChart, setDataChart] = useState([])
    const [databranch, setDataBranch] = useState([])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [databadge, setDataBadge] = useState([])
    const [userId, setUserId] = useState(userData[0].user_login_id);
    const [defaulDate, setDefaulDate] = useState(false)
    const [brancID, setBranchID] = useState([])
    const [brancIDs, setBranchIDs] = useState([])
    const [brancIDDefual, setbrancIDDefual] = useState([])
    const [numFormat, setnumFormat] = useState(new Intl.NumberFormat('en-thai', { style: 'decimal', minimumFractionDigits: 2 }))
    const [loading, setLoading] = useState(false)
    const BranchData = useContext(DataContextBranchData);

    const columnsdata = [
        {
            name: 'สาขา',
            selector: row => row.master_branch_name,
            sortable: false,

        },
        {
            name: 'จำนวน',
            selector: row => row.saledt_qty,
            sortable: false,

        },
        {
            name: 'มูลค่ารวม',
            cell: row =>
                <div>{row.saledt_netamnt == 0 ?
                    <span>{numFormat.format(row.saledt_netamnt)}
                        <IconButton>
                            <KeyboardArrowRighttIcon />
                        </IconButton></span> :
                    <span>{numFormat.format(row.saledt_netamnt)}
                        <Link to="detail" state={[{
                            'branchID': row.master_branch_id,
                            'branchName': row.master_branch_name,
                            'startDate': startDate,
                            'endDate': endDate
                        }]}>
                            <IconButton>
                                <KeyboardArrowRighttIcon color="info" />
                            </IconButton></Link></span>
                }</div>,
            width: "200px",
            right: true,
            sortable: false,
        },
    ]

    useEffect(() => {
        getData()
        getDataChart()
        getDataBranch()
    }, [])

    useEffect(() => {
        getDataTable()
    }, [dataReport])

    useEffect(() => {
        getData()
    }, [defaulDate])

    useEffect(() => {
        if (brancIDDefual.length > 0 && defaulDate == false) {
            getDataFromBranch()
            getDataChart()
        } else {
            getData()
            getDataChart()
        }
    }, [startDate, endDate])

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
        var strDate = Moment(startDate).format("YYYY-MM-DD")
        var enDate = Moment(endDate).format("YYYY-MM-DD")
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "db_name": "erpdb",
            "branch_id": branchData[0].master_branch_id,
            "start_date": strDate,
            "end_date": enDate,
            "user_id": userId
        }
        axios.post(UrlApi() + 'payment_best_seller', datas)
            .then(res => {
                if (res.data) {
                    setDataReport(res.data)
                }
            })
        getDataTable()
    }

    const getDataFromBranch = () => {
        setLoading(true);
        console.log(brancIDs)
        if (brancIDs.length > 0 || brancIDDefual.length > 0) {
            var strDate = Moment(startDate).format("YYYY-MM-DD")
            var enDate = Moment(endDate).format("YYYY-MM-DD")
            if (brancIDs.length > 0) {
                setbrancIDDefual(brancIDs)
                setDataBadge(brancIDs)
            } else {
                setDataBadge(brancIDDefual)
            }
            const datas = {
                "company_id": parseInt(userData[0]['master_company_id']),
                "db_name": "erpdb",
                "branch_id": branchData[0].master_branch_id,
                "start_date": strDate,
                "end_date": enDate,
                "user_id": userId
            }
            axios.post(UrlApi() + 'payment_best_seller', datas)
                .then(res => {
                    if (res.data) {
                        setDataReport(res.data)
                    }
                    setLoading(false);
                })
            getDataTable()
        } else {
            getData()
        }

    }

    const getDataChart = () => {
        var strDate = Moment(startDate).format("YYYY-MM-DD")
        var enDate = Moment(endDate).format("YYYY-MM-DD")
        const datas = {
            "company_id": parseInt(userData[0]['master_company_id']),
            "branch_id": branchData[0].master_branch_id,
            "db_name": "erpdb",
            "start_date": strDate,
            "end_date": enDate,
            "user_id": userId
        }
        axios.post(UrlApi() + 'payment_best_seller_graph', datas)
            .then(res => {
                if (res.data) {
                    setDataChart(res.data)

                }
            })
        getBarchart()

    }

    const getDateDefual = () => {
        setDefaulDate(true)
        setStartDate(new Date())
        setEndDate(new Date())
        setBranchID([])
        setbrancIDDefual([])
        setDataReport([])
        getDataBranch()
        getDialogBranchs()
        getDataRange()
    }

    const onChangeDialog = (datas) => {
        // console.log(datas)
        if (datas) {
            datas.map((item, idx) => {
                if (item.checks == true) {
                    setBranchIDs([])
                    brancIDs.push(item.value)
                }
                getDataFromBranch()
                getDataChart()
            })
            if (brancIDs.length == 0) {
                setDataBadge([])
                getData()
                getDataChart()
            }
        } else {
            setBranchIDs([])
            setBranchID([])
            setbrancIDDefual([])
            setDataBadge([])
            //getData()
        }
    }

    const getBarchart = () => {
        return (<div style={{ marginLeft: "6%", marginTop: "3%", width: "80%" }}>
            <Barcharts data={dataChart} datakeyY="saledt_master_product_billname" titles="มูลค่ารวม"
                datakey="saledt_netamnt" vertical={true} widthY={210}>
            </Barcharts>
        </div>)
    }

    const getDate = () => {
        let Str_y = parseInt(Moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(Moment(endDate).format("YYYY")) + 543
        var strDate = Moment(startDate).format("DD/MM/") + Str_y
        var enDate = Moment(endDate).format("DD/MM/") + End_y
        return (<p className="text"> <strong> {strDate} </strong> ถึง <strong> {enDate} </strong> </p>)
    }

    const getDataTable = () => {
        return (<div style={{ marginLeft: "2%", marginRight: "2%", marginTop: "1%" }}>
            <DataTable
                responsive
                fixedHeader
                columns={columnsdata}
                data={dataReport}
            />
        </div>)
    }

    const getDataRange = () => {
        return (<DateRange style={{ marginTop: "1%", marginLeft: "10%", width: "90%" }}
            handleStart={(d) => { setStartDate(d) }} handleEnd={(d) => { setEndDate(d) }} defauldates={defaulDate} >
        </DateRange>)
    }

    const getDialogBranchs = () => {
        return (<div>
            < DialogBranch onChangeBranchValue={(e) => { onChangeDialog(e) }} branchsDataID={brancID} />
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
            <p className="textH">รายงานสินค้าขายดี 20 อันดับ</p>
            <div class="row" style={{ marginLeft: "30%", marginRight: "20%" }}>
                <div class="col-3" style={{ marginTop: "10px" }}>
                    {getDate()}
                </div>
                <div class="col-2"  >
                    {getDataRange()}
                </div>
                <div class="col-2">
                    {getDialogBranchs()}
                </div>
                <div class="col-2" >
                    <BtnAdd style={{ width: "90%" }} onClick={getDateDefual} message="รีเฟรช" >รีเฟรช</BtnAdd>
                </div>
            </div>
            <div style={{ marginLeft: "40%" }}>{getBadge()}</div>
            <div style={{ height: '80vh', overflow: 'auto' }}> {getBarchart()}
                {getDataTable()}</div>
        </div>
    );
}

export default memo(Bestseller);
