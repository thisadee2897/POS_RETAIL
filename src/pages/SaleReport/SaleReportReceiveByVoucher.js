import { React, useState, useEffect, useContext, useMemo } from "react";
import axios from 'axios';
import UrlApi from "../../url_api/UrlApi";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import '../../components/CSS/report.css';

function SaleReportReceiveByVoucher() {
    const [defaulDate, setDefaulDate] = useState(false)
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false)
    const [receiveData, setReceiveData] = useState([])
    const [offset, setOffset] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const userData = useContext(DataContext);
    const branchData = useContext(DataContextBranchData);
    const [branchSelectedID, setBranchSelectedID] = useState(branchData.branch_id)
    const [branchSelectedName, setBranchSelectedName] = useState(branchData.branch_name)
    const [voucherTypeListID, setVoucherTypeListID] = useState([])
    const [voucherTypeListIDs, setVoucherTypeListIDs] = useState([])
    const [voucherTypeCheck, setVoucherTypeCheck] = useState([])
    const [branchListID, setBranchListID] = useState([])
    const [branchListIDs, setBranchListIDs] = useState([])
    const [branchCheck, setBranchCheck] = useState([])
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const [branchID, setBranchID] = useState(branchData['branch_id'])
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id'])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [hoFlag, setHoFlag] = useState(localStorage.getItem('hoFlag'))

    useEffect(() => {
        getCardType()
        getBranchData()
    }, [])

    useEffect(() => {
        if (voucherTypeListID.length > 0 && branchListID.length > 0) {
            getReceiveVoucher()
        }
    }, [voucherTypeListID.length, branchListID.length])

    useEffect(() => {
        if (voucherTypeListID.length > 0 && branchListID.length > 0) {
            getReceiveVoucher()
        }
    }, [startDate, endDate])

    useEffect(() => {
        if (voucherTypeListID.length > 0 && branchListID.length > 0) {
            getReceiveVoucher()
        }
    }, [branchListID, voucherTypeListID])

    useEffect(() => {

    }, [startDate, endDate])

    const columnData = [
        {
            name: "ลำดับ",
            selector: row => row.row_num,
            sortable: true,
            width: '4vw'
        },
        {
            name: "รหัสสาขา",
            selector: row => row.master_branch_code,
            sortable: true,
            width: '8vw'
        },
        {
            name: "ชื่อสาขา",
            selector: row => row.master_branch_name,
            sortable: true,
            width: '8vw'
        },
        {
            name: "วันที่",
            selector: row => row.salehd_docudate,
            sortable: true,
            width: '10vw'
        },
        {
            name: "เลขที่เอกสาร",
            selector: row => row.salehd_docuno,
            sortable: true,
            width: '11vw'
        },
        {
            name: "ชื่อ Voucher",
            selector: row => row.salehd_voucher_type_name,
            sortable: true,
            width: '11vw'
        },
        {
            name: "เลขที่ Voucher",
            selector: row => row.salevoucher_docuno,
            sortable: true,
            width: '11vw'
        },
        {
            name: "จำนวนเงิน",
            selector: row => row.voucher_totalamnt,
            sortable: true,
            right: true,
            width: '7vw'
        },
        {
            name: "ผู้บันทึก",
            selector: row => row.fullname,
            sortable: true
        }

    ];

    function sumValue(e) {
        let x = 0;
        receiveData.map((item) => {
            x += parseFloat(item[e]);
            return x;
        });
        return x;
    }

    const footer = {
        salevoucher_docuno: "รวม",
        voucher_totalamnt: sumValue('voucher_totalamnt').toFixed(2),
    };

    async function getCardType() {
        const data =
        {
            company_id: userCompanyID,
        }
        setLoading(true);
        await axios.post(UrlApi() + 'get_MasterVoucher', data).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    let datas = {
                        "id": item.salehd_voucher_type_id,
                        "salehd_voucher_type_name": item.salehd_voucher_type_name,
                        "isChecked": true
                    }
                    voucherTypeCheck.push(datas)
                    voucherTypeListID.push(item.salehd_voucher_type_id);
                })
                setLoading(false);
            }
        });
    }

    async function getBranchData() {
        const data =
        {
            company_id: userCompanyID,
            user_id: userLoginID
        }
        setLoading(true);
        await axios.post(UrlApi() + 'get_choose_branch_data', data).then((res) => {
            if (res.data) {
                if (hoFlag == 'true') {
                    res.data.map((item, idx) => {
                        item.row_num = idx + 1
                        let datas = {
                            "id": item.master_branch_id,
                            "branch_name": item.master_branch_name,
                            "isChecked": true
                        }
                        branchCheck.push(datas)
                        branchListID.push(item.master_branch_id)
                    })
                } else {
                    let datas = {
                        "id": branchSelectedID,
                        "branch_name": branchSelectedName,
                        "isChecked": true
                    }
                    branchCheck.push(datas)
                    branchListID.push(branchSelectedID)
                }
                setLoading(false);
            }
        });
    }

    async function getReceiveVoucher() {
        const data =
        {
            company_id: userCompanyID,
            branch_id: branchListID,
            salehd_voucher_type_id: voucherTypeListID,
            start_date: startDate,
            end_date: endDate
        }
        setLoading(true);
        await axios.post(UrlApi() + 'report_ReceivebyVoucher', data).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                })
                setReceiveData(res.data);
                setLoading(false);
            }
        });
    }



    const refreshPage = () => {
        getCardType()
        getBranchData()
        setStartDate(new Date())
        setEndDate(new Date())
    }
    return (
        <>
            <div style={{ textAlign: 'center', marginTop: '10px' }}> <p className="textH">รายงานการรับชำระ Voucher</p> </div>
           
        </>
    )
}

export default SaleReportReceiveByVoucher