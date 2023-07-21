import { React, useState, useEffect, useContext, useMemo } from "react";
import axios from 'axios';
import UrlApi from "../../url_api/UrlApi";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import moment from 'moment';
import FilterDataTable from "../../components/SearchDataTable/FilterDataTable";

function ReceiveTransfer() {
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false)
    const [receiveData, setReceiveData] = useState([])
    // const [offset, setOffset] = useState(0);
    // const [perPage, setPerPage] = useState(50);

    const userData = useContext(DataContext);
    const branchData = useContext(DataContextBranchData);
    const [branchSelectedID, setBranchSelectedID] = useState(branchData.branch_id)
    const [branchSelectedName, setBranchSelectedName] = useState(branchData.branch_name)
    const [bankListID, setBankListID] = useState([])
    const [bankListIDs, setBankListIDs] = useState([])
    const [bankCheck, setbankCheck] = useState([])
    const [branchListID, setBranchListID] = useState([])
    const [branchListIDs, setBranchListIDs] = useState([])
    const [branchCheck, setBranchCheck] = useState([])
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const [branchID, setBranchID] = useState(branchData['branch_id'])
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id'])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [hoFlag, setHoFlag] = useState(localStorage.getItem('hoFlag'))
    const [dateNow, setDateNow] = useState(new Date())
    const [dataExport, setDataExport] = useState([])

    const formatter = new Intl.NumberFormat('en', {
        style: 'decimal',
        // signDisplay: 'always', //เพิ่มเครื่องหมายหน้าตัวเลข
        useGrouping: true,
        notation: 'compact'
    })

    const numFormat = new Intl.NumberFormat('en-thai', { style: 'decimal' })
    const deciFormat = new Intl.NumberFormat('en-thai', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    useEffect(() => {
        getBannk()
        getBranchData()
    }, [])

    useEffect(() => {
        if (bankListID.length > 0 && branchListID.length > 0) {
            getReceivebyTransfer()
        }
    }, [bankListID.length, branchListID.length])

    useEffect(() => {
        if (bankListID.length > 0 && branchListID.length > 0) {
            getReceivebyTransfer()
        }
    }, [startDate, endDate])

    useEffect(() => {
        if (bankListID.length > 0 && branchListID.length > 0) {
            getReceivebyTransfer()
        }
    }, [branchListID, bankListID])

    useEffect(() => {
        exportExcells()
    }, [receiveData])

    const columnData = [
        {
            name: "ลำดับ",
            selector: row => row.listno,
            sortable: true,
            width: '4vw'
        },
        {
            name: "สาขา",
            selector: row => row.master_branch_name,
            sortable: true,
        },
        {
            name: "วันที่",
            selector: row => row.salehd_docudate,
            sortable: true,
            width: "7vw"
        },
        {
            name: "เลขที่เอขสาร",
            selector: row => row.salehd_docuno,
            sortable: true,

        },
        {
            name: "ชื่อธนาคาร",
            selector: row => row.cq_bank_name,
            sortable: true,

        },
        {
            name: "จำนวนเงิน",
            selector: row => row.transfer_totalamnt,
            sortable: true,
            width: '8vw',
            right: true
        },
        {
            name: "ผู้บันทึก",
            selector: row => row.fullname,
            sortable: true
        }
    ];

    function sumValue(e) {
        let _OrderHD_Netamnt = 0;
        receiveData.map((item) => {
            let _itemData = item[e].replace(',', '');
            _OrderHD_Netamnt += parseFloat(_itemData);

            return _OrderHD_Netamnt;
        });
        return deciFormat.format(_OrderHD_Netamnt.toFixed(2));
    }

    const footer = {
        cq_bank_name: "รวม",
        transfer_totalamnt: sumValue('transfer_totalamnt')
    };

    async function getBannk() {
        const data =
        {
            company_id: userCompanyID,
        }
        setLoading(true);
        await axios.post(UrlApi() + 'get_bank', data).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    let datas = {
                        "id": item.cq_bank_id,
                        "name": item.cq_bank_name,
                        "isChecked": true
                    }
                    bankCheck.push(datas)
                    bankListID.push(item.cq_bank_id);
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
                            "name": item.master_branch_name,
                            "isChecked": true
                        }
                        branchCheck.push(datas)
                        branchListID.push(item.master_branch_id)
                    })
                } else {
                    let datas = {
                        "id": branchSelectedID,
                        "name": branchSelectedName,
                        "isChecked": true
                    }
                    branchCheck.push(datas)
                    branchListID.push(branchSelectedID)
                }
                setLoading(false);
            }
        });
    }

    async function getReceivebyTransfer() {
        const data =
        {
            company_id: userCompanyID,
            branch_id: branchListID,
            bank_id: bankListID,
            start_date: startDate,
            end_date: endDate
        }
        setLoading(true);
        await axios.post(UrlApi() + 'get_receiveby_transfer', data).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    item.transfer_totalamnt = deciFormat.format(item.transfer_totalamnt)
                })
                setReceiveData(res.data)
                setLoading(false);
            }
        });
    }

    const getDate = () => {
        const Str_y = parseInt(moment(startDate).format("YYYY")) + 543
        const End_y = parseInt(moment(endDate).format("YYYY")) + 543
        const strDate = moment(startDate).format("DD/MM/") + Str_y
        const enDate = moment(endDate).format("DD/MM/") + End_y

        return (<div><p>
            <strong> {strDate} </strong> ถึง <strong> {enDate} </strong></p></div>)
    }

    const getSearchComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <FilterDataTable
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onClear={handleClear}
                placeholder="ค้นหา"
            />
        );
    }, [filterText, resetPaginationToggle]);

    const filteredItems = receiveData.filter(
        item => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1
    );

    const customStyles = {
        headCells: {
            style: {
                background: '#0064B0',
                color: "white",
                fontSize: "1.8vh",
            },
        },
    };



    const exportExcells = () => {
        let Str_y = parseInt(moment(startDate).format("YYYY")) + 543
        let End_y = parseInt(moment(endDate).format("YYYY")) + 543
        let Now_y = parseInt(moment(dateNow).format("YYYY")) + 543
        var strDate = moment(startDate).format("DD/MM/") + Str_y
        var enDate = moment(endDate).format("DD/MM/") + End_y
        var dNow = moment(dateNow).format("DD/MM/") + Now_y
        var TNow = moment(dateNow).format("h:mm")
        let datas = []
        let sumAmount = 0
        let feeAmount = 0
        let totalAmount = 0
        const csvData = [
            ["", "", , ""],
            ["", "", "", "รายงานสรุปขาย (ตามรายการสินค้า)"],
            ["", "", , "จากวันที่ " + strDate + " ถึง " + enDate],
            ["", "พิมพ์วันที่ " + dNow + " เวลา " + TNow,],
            ["ชื่อสาขา", "วันที่", "เลขที่เอกสาร", "ชื่อธนาคาร", "จำนวนเงิน", "ผู้บันทึก"],
        ];
        receiveData.map((item, idx) => {
            datas = [
                item.master_branch_name,
                item.salehd_docudate,
                item.salehd_docuno,
                item.cq_bank_name,
                item.transfer_totalamnt,
                item.fullname
            ]
            totalAmount += parseFloat(item.transfer_totalamnt.replace(',', ''));
            csvData.push(datas)
        })
        let sumTB = ["", "", "", "รวม", deciFormat.format(totalAmount.toFixed(2)), ""];
        csvData.push(sumTB)
        setDataExport(csvData)
    }

    return (
        <>
            <div style={{ textAlign: 'center', marginTop: '10px' }}> <p className="textH">รายงานการรับชำระเงินโอน</p> </div>
       
        </>
    )
}

export default ReceiveTransfer