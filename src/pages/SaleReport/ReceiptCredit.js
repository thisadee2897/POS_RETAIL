import { React, useState, useEffect, useContext, useMemo } from "react";
import axios from 'axios';
import UrlApi from "../../url_api/UrlApi";
import DataContext from "../../DataContext/DataContext";
import DataContextBranchData from "../../DataContext/DataContextBranchData";
import moment from 'moment';
import DataTable from "react-data-table-component-footer";
import FilterDataTable from "../../components/SearchDataTable/FilterDataTable";
import _ from 'lodash'

function ReceiptCredit() {
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
    const [cardTypeListID, setcardTypeListID] = useState([]) //
    const [cardTypeCheck, setCardTypeCheck] = useState([])//
    const [branchListID, setBranchListID] = useState([]) //
    const [branchCheck, setBranchCheck] = useState([])//
    const [userCompanyID, setUserCompanyID] = useState(userData[0]['master_company_id']);
    const [branchID, setBranchID] = useState(branchData['branch_id'])
    const [userLoginID, setUserLoginID] = useState(userData[0]['user_login_id'])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dataExport, setDataExport] = useState([])
    const [hoFlag, setHoFlag] = useState(localStorage.getItem('hoFlag'))
    const [dateNow, setDateNow] = useState(new Date())
    const [branchCode, setBranchCode] = useState()

    const deciFormat = new Intl.NumberFormat('en-thai', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    useEffect(() => {
        getCardType()
        getBranchData()
    }, [])

    useEffect(() => {
        if (cardTypeListID.length > 0 && branchListID.length > 0) {
            getReceiveCreditCard()
        }
    }, [cardTypeListID.length, branchListID.length])

    useEffect(() => {
        if (cardTypeListID.length > 0 && branchListID.length > 0) {
            getReceiveCreditCard()
        }
    }, [startDate, endDate])

    useEffect(() => {
        if (cardTypeListID.length > 0 && branchListID.length > 0) {
            getReceiveCreditCard()
        }
    }, [cardTypeListID, branchListID])

    useEffect(() => {
        exportExcells()
    }, [receiveData])

    const columnData = [
        {
            name: "ลำดับ",
            selector: row => row.row_num,
            sortable: true,
            width: '4vw'
        },
        {
            name: "สาขา",
            selector: row => row.master_branch_name,
            sortable: true,
            wrap: true,
            width: '8vw'
        },
        {
            name: "วันที่",
            selector: row => row.salehd_docudate,
            sortable: true,
            width: '6.8vw'
        },
        {
            name: "เลขที่เอขสาร",
            selector: row => row.salehd_docuno,
            sortable: true,
            width: '11vw'
        },
        {
            name: "ชื่อธนาคาร",
            selector: row => row.cq_bank_name,
            sortable: true,
            width: '8vw'
        },
        {
            name: "ประเภทบัตร",
            selector: row => row.cq_cardtype_name,
            sortable: true,
            width: '8vw'
        },
        {
            name: "จำนวนเงิน",
            selector: row => row.cheq_cheqdata_rec_amount,
            sortable: true,
            right: true,
            width: '7vw'
        },
        {
            name: "ค่าบริการ",
            selector: row => row.cheq_cheqdata_rec_bankfeeamnt,
            sortable: true,
            right: true,
            width: '7vw'
        },
        {
            name: "รวม",
            selector: row => row.cheq_cheqdata_rec_totalamnt,
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
        let _OrderHD_Netamnt = 0;
        receiveData.map((item) => {
            let _itemData = item[e].replace(',', '');
            _OrderHD_Netamnt += parseFloat(_itemData);

            return _OrderHD_Netamnt;
        });
        return deciFormat.format(_OrderHD_Netamnt.toFixed(2));
    }

    const footer = {
        cq_cardtype_name: "รวม",
        cheq_cheqdata_rec_amount: sumValue('cheq_cheqdata_rec_amount'),
        cheq_cheqdata_rec_bankfeeamnt: sumValue('cheq_cheqdata_rec_bankfeeamnt'),
        cheq_cheqdata_rec_totalamnt: sumValue('cheq_cheqdata_rec_totalamnt'),
    };

    async function getCardType() {
        const data =
        {
            company_id: userCompanyID,
        }
        setLoading(true);
        await axios.post(UrlApi() + 'get_cardtype', data).then((res) => {
            if (res.data) {
                if (cardTypeCheck.length == 0 && cardTypeListID.length == 0) {
                    res.data.map((item, idx) => {
                        item.row_num = idx + 1
                        let datas = {
                            "id": item.cq_cardtype_id.toString(),
                            "name": item.name,
                            "isChecked": true
                        }
                        cardTypeCheck.push(datas)
                        cardTypeListID.push(item.cq_cardtype_id);
                    })
                }
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
                if (branchCheck.length == 0 && branchListID.length == 0) {
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
                }

                setLoading(false);
            }
        });
    }

    async function getReceiveCreditCard() {
        const data =
        {
            company_id: userCompanyID,
            branch_id: branchListID,
            card_type_id: cardTypeListID,
            start_date: startDate,
            end_date: endDate
        }
        setLoading(true);
        await axios.post(UrlApi() + 'get_receiveby_credit', data).then((res) => {
            if (res.data) {
                res.data.map((item, idx) => {
                    item.row_num = idx + 1
                    item.cheq_cheqdata_rec_amount = deciFormat.format(item.cheq_cheqdata_rec_amount)
                    item.cheq_cheqdata_rec_bankfeeamnt = deciFormat.format(item.cheq_cheqdata_rec_bankfeeamnt)
                    item.cheq_cheqdata_rec_totalamnt = deciFormat.format(item.cheq_cheqdata_rec_totalamnt)
                })
                setReceiveData(res.data);
                setLoading(false);
            }
        });
    }

    const getDate = () => {
        const Str_y = parseInt(moment(startDate).format("YYYY")) + 543
        const End_y = parseInt(moment(endDate).format("YYYY")) + 543
        const strDate = moment(startDate).format("DD/MM/") + Str_y
        const enDate = moment(endDate).format("DD/MM/") + End_y
        return (<div><strong> {strDate} </strong> ถึง <strong> {enDate} </strong></div>)
    }

   
    const subHeaderComponent = useMemo(() => {
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

    // const handlePageChange = page => {
    //     getReceiveCreditCard((page - 1) * perPage, perPage, "",);
    // };

    // const handlePerRowsChange = async (newPerPage, page) => {
    //     setPerPage(newPerPage);
    //     getReceiveCreditCard((page - 1) * newPerPage, newPerPage, "",);
    // };


    const refreshPage = () => {
        getCardType()
        getBranchData()
        setStartDate(new Date())
        setEndDate(new Date())
    }

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
            ["ชื่อสาขา", "วันที่", "เลขที่เอกสาร", "ชื่อธนาคาร", "ประเภทบัตร", "จำนวนเงิน", "ค่าบริการ", "รวม", "ผู้บันทึก"],
        ];
        receiveData.map((item, idx) => {
            datas = [
                item.master_branch_name,
                item.salehd_docudate,
                item.salehd_docuno,
                item.cq_bank_name,
                item.cq_cardtype_name,
                item.cheq_cheqdata_rec_amount,
                item.cheq_cheqdata_rec_bankfeeamnt,
                item.cheq_cheqdata_rec_totalamnt,
                item.fullname
            ]
            sumAmount += parseFloat(item.cheq_cheqdata_rec_amount.replace(',', ''));
            feeAmount += parseFloat(item.cheq_cheqdata_rec_bankfeeamnt.replace(',', ''));
            totalAmount += parseFloat(item.cheq_cheqdata_rec_totalamnt.replace(',', ''));
            csvData.push(datas)
        })
        let sumTB = ["", "", "", "", "", deciFormat.format(sumAmount.toFixed(2)), deciFormat.format(feeAmount.toFixed(2)), deciFormat.format(totalAmount.toFixed(2)), ""];
        csvData.push(sumTB)
        setDataExport(csvData)
    }

    const getDataTable = () => {
        return (
            <DataTable
                noHeader
                fixedHeader={true}
                columns={columnData}
                data={filteredItems}
                noDataComponent={<p style={{ fontSize: '1.8vh', marginTop: '10px' }}>ไม่พบข้อมูล</p>}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage="10"
                paginationRowsPerPageOptions={[10, 50, 100, 200]}
                footer={footer}
                highlightOnHover
                customStyles={customStyles}
            // onChangeRowsPerPage={handlePerRowsChange}
            // onChangePage={handlePageChange}
            />
        )
    }

    return (
        <><p className="textH">รายงานการรับชำระบัตรเครดิต</p>

            {getDataTable()}
        </>
    )
}

export default ReceiptCredit