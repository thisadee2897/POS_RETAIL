import React, { useState, useEffect, useContext } from 'react';
import "../../../components/CSS/report.css";
import InputText from "../../../components/Input/InputText";
import DataTable from 'react-data-table-component';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import Select from "../../../components/Input/InputSelect";
import UrlApi from "../../../url_api/UrlApi";
import axios from 'axios';
import { Segment, Dropdown, Checkbox } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
const ContentPrice = ({ setDataPrices, dataPrices, DataProuct, dataBarCode }) => {
    const userData = useContext(DataContext);
    const [companyId] = useState(userData[0].master_company_id)
    const branchData = useContext(DataContextBranchData);
    const [branchID, setBranchID] = useState(branchData['branch_id'])
    const [userId, setUserId] = useState(userData[0].user_login_id)
    const [productType, setProductType] = useState('');
    const [getBrance, setGetBrance] = useState([]);
    const [getBarCode, setGetDataBarCode] = useState([])
    const [price1, setPrice1] = useState('');
    const [price2, setPrice2] = useState('');
    const [price3, setPrice3] = useState('');
    const [price4, setPrice4] = useState('');
    const [price5, setPrice5] = useState('');
    const [brance, setBrance] = useState([]);
    const [getUnit, SetDataUnit] = useState([]);
    const [getPrice, SetDataPrice] = useState([]);
    const [highlightedRow, setHighlightedRow] = useState(null);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedBranchesName, setSelectedBranchesName] = useState([]);
    const [selectedBarcodes, setSelectedBarcodes] = useState('');
    const [changPrice, setChangePrice] = useState('');
    const [filteredDataCount, setFilteredDataCount] = useState(0);
    const masterBranchIds = getBrance.map(branch => branch.master_branch_id);


    const formatNumberWithCommas = (number) => {
        return number.toLocaleString();
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getBranceApi = getBrance !== "" && axios.post(UrlApi() + 'get_branch_data', { "company_id": companyId, "user_id": userId });
                const getUnitApi = getUnit !== "" && axios.post(UrlApi() + 'get_product_unit_management', { "company_id": companyId });
                // const getPriceApi = getPrice !== "" && axios.post(UrlApi() + 'get_product_unit_management', { "company_id": companyId, "branch_id": branchID });
                const [branceResponse, unitResponse] = await Promise.all([getBranceApi, getUnitApi]);
                const modifiedUnitData = unitResponse.data.filter(item => item.master_product_unit_active === true).map((item, idx) => ({ ...item, row_num: idx + 1 }));
                SetDataUnit(modifiedUnitData);
                // const modifiedBrance = branceResponse.data.filter(item => item.master_product_type_active === true).map((item, idx) => ({ ...item, row_num: idx + 1 }));
                setGetBrance(branceResponse.data);
                // SetDataPrice(priceResponse.data);
            } catch (error) {
                console.error("Error while fetching data:", error);
            }
        };
        fetchData();
    }, [selectedBranches]);
    const handleSubmit = () => {
        const latestListNo = dataPrices.reduce((maxListNo, item) => Math.max(maxListNo, item.list_no), 0);
        const existingListNos = dataPrices.map(item => item.list_no);
        const newItems = selectedBranches.map((selectedBranchId, index) => {
            const selectedBranch = getBrance.find(branch => branch.master_branch_id === selectedBranchId);
            const newListNo = parseInt(latestListNo + index + 1);
            if (!existingListNos.includes(newListNo)) {
                return {
                    list_no: newListNo,
                    brane: selectedBranch.master_branch_name,
                    barcode: selectedBarcodes,
                    unit_id: DataProuct.master_product_unit_id,
                    price1: price1,
                    price2: price2,
                    price3: price3,
                    price4: price4,
                    price5: price5,
                }
            } else {
                return null;
            }
        }).filter(item => item !== null);
        setDataPrices([...newItems, ...dataPrices]);
        setHighlightedRow(newItems.map(item => item.list_no));
        setTimeout(() => {
            setHighlightedRow(null);
        }, 3000);
        setChangePrice('')
        setSelectedBranches([])
        setSelectedBranchesName([])
        setSelectedBarcodes('')
        setProductType('')
    };
    const handleUpdateSubmit = () => {
        const updatedDataPrices = dataPrices.map(item => {
            if (selectedBranches.includes(item.brane)) {
                const newPrice1 = productType === 'ราคา1' ? changPrice : item.price1;
                const newPrice2 = productType === 'ราคา2' ? changPrice : item.price2;
                const newPrice3 = productType === 'ราคา3' ? changPrice : item.price3;
                const newPrice4 = productType === 'ราคา4' ? changPrice : item.price4;
                const newPrice5 = productType === 'ราคา5' ? changPrice : item.price5;

                return {
                    ...item,
                    price1: newPrice1,
                    price2: newPrice2,
                    price3: newPrice3,
                    price4: newPrice4,
                    price5: newPrice5,
                };
            }
            return item;
        });

        setDataPrices(updatedDataPrices);
        setHighlightedRow(selectedBranches);
        setTimeout(() => {
            setHighlightedRow([]);
        }, 3000);

        setChangePrice('');
        setSelectedBranches([]);
        setSelectedBranchesName([]);
        setSelectedBarcodes('');
        setProductType('');
    };

    useEffect(() => {
        if (selectedBranchesName === []) {
            setSelectedBarcodes('')
        }
        console.log(masterBranchIds)
        console.log(selectedBranchesName)
        setPrice1(productType === 'ราคา1' ? changPrice : '');
        setPrice2(productType === 'ราคา2' ? changPrice : '');
        setPrice3(productType === 'ราคา3' ? changPrice : '');
        setPrice4(productType === 'ราคา4' ? changPrice : '');
        setPrice5(productType === 'ราคา5' ? changPrice : '');
        setFilteredDataCount(filteredDataPrices.length)
    }, [filteredDataCount, selectedBranchesName, masterBranchIds, dataPrices, selectedBranches, highlightedRow, getPrice, dataBarCode, price1, price2, price3, price4, price5, changPrice, productType, getBarCode, selectedBarcodes])
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            width: "65.5px",
            sortable: false,
            center: true,
        },
        {
            name: 'สาขา',
            selector: row => row.brane,
            sortable: false,
            center: true,
        },
        {
            name: 'barcode',
            selector: row => row.barcode,
            sortable: false,
            center: true,
            width: "110px",
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'หน่วยนับ',
            selector: (row) => {
                const selectedUnit = getUnit.find((unit) => parseInt(unit.master_product_unit_id) === parseInt(row.unit_id));
                const unitName = selectedUnit ? selectedUnit.master_product_unit_name : '-';
                return unitName;
            },
            sortable: false,
            center: true,
            width: "85px",
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ราคา1',
            selector: (row, idx) => <InputText
                className="input_dialog"
                style={{ width: "100%", height: "25px", fontSize: "13px", textAlign: "right", marginBottom: "5px", marginTop: "5px" }}
                type="text"
                defaultValue={""}
                value={row.price1}
                onChange={(e) => {
                    let update = [...dataPrices]
                    update[idx].price1 = e.target.value
                    setDataPrices(update)
                }}
            />,
            sortable: false,
            width: "103px",
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ราคา2',
            selector: (row, idx) => <InputText
                className="input_dialog"
                style={{ width: "100%", height: "25px", fontSize: "13px", textAlign: "right", marginBottom: "5px", marginTop: "5px" }}
                type="text"
                defaultValue={""}
                value={row.price2}
                onChange={(e) => {
                    let update = [...dataPrices]
                    update[idx].price2 = e.target.value
                    setDataPrices(update)
                }}
            />,
            sortable: false,
            center: true,
            width: "103px",
            center: true,
        },
        {
            name: 'ราคา3',
            selector: (row, idx) => {
                const formattedValue = formatNumberWithCommas(row.price3); // รูปแบบที่มีคอมม่าแบ่งหลักพัน
                return (<InputText
                    className="input_dialog"
                    style={{ width: "100%", height: "25px", fontSize: "13px", textAlign: "right", marginBottom: "5px", marginTop: "5px" }}
                    type="text"
                    defaultValue={""}
                    value={row.price3}
                    onChange={(e) => {
                        let update = [...dataPrices];
                        const priceValue = parseFloat(e.target.value);
                        if (!isNaN(priceValue)) {
                            update[idx].price3 = priceValue;
                        } else {
                            update[idx].price3 = 0;
                        }
                        setDataPrices(update);
                    }}
                // onChange={(e) => {
                //     let update = [...dataPrices]
                //     update[idx].price3 = e.target.value
                //     setDataPrices(update)
                // }}
                />);
            },
            sortable: false,
            width: "103px",
            center: true,
        },
        {
            name: 'ราคา4',
            selector: (row, idx) => <InputText
                className="input_dialog"
                style={{ width: "100%", height: "25px", fontSize: "13px", textAlign: "right", marginBottom: "5px", marginTop: "5px" }}
                type="text"
                defaultValue={""}
                value={row.price4}
                onChange={(e) => {
                    let update = [...dataPrices]
                    update[idx].price4 = e.target.value
                    setDataPrices(update)
                }}
            />,
            sortable: false,
            width: "103px",
            center: true,
        },
        {
            name: 'ราคา5',
            selector: (row, idx) => <InputText
                className="input_dialog"
                style={{ width: "100%", height: "25px", fontSize: "13px", textAlign: "right", marginBottom: "5px", marginTop: "5px" }}
                type="text"
                defaultValue={""}
                value={row.price5}
                onChange={(e) => {
                    let update = [...dataPrices]
                    update[idx].price5 = e.target.value
                    setDataPrices(update)
                }}
            />,
            sortable: false,
            width: "103px",
            center: true,
        },
    ];
    const toggleSelection = (e, { label, checked }) => {
        const selectedBranchId = getBrance.find(branch => branch.master_branch_name === label).master_branch_id;
        const selectedBranchName = label;
        let updatedSelectedBranchesName;
        let updatedSelectedBranches;
        if (checked) {
            updatedSelectedBranches = [...selectedBranches, selectedBranchId];
            updatedSelectedBranchesName = [...selectedBranchesName, selectedBranchName];
        } else {
            updatedSelectedBranches = selectedBranches.filter(id => id !== selectedBranchId);
            updatedSelectedBranchesName = selectedBranchesName.filter(name => name !== selectedBranchName);
        }
        setSelectedBranches(updatedSelectedBranches);
        setSelectedBranchesName(updatedSelectedBranchesName);
    };
    const handlePriceChange = (e) => {
        setChangePrice(e.target.value);
    };
    const filteredDataPrices = (selectedBranchesName.length === 0 && selectedBarcodes === '')
        ? dataPrices
        : (selectedBranchesName.length != 0 && selectedBarcodes === ''
            ? dataPrices.filter(row => selectedBranchesName.includes(row.brane))
            : dataPrices.filter(row => selectedBranchesName.includes(row.brane) && row.barcode === selectedBarcodes)
        );
    return (
        <div style={{ marginTop: "0px" }}>
            <div className='row' style={{ height: "40px" }}>
                <p className="ths" style={{ marginTop: "10px" }}>{"สาขา"} : </p>
                <div className="กรอบเลือก"
                    style={{ width: "15%", marginTop: "7px", fontSize: 15, height: "25px" }}>
                    <Dropdown key={selectedBranches.length} item simple text={`${selectedBranches.length} รายการ`} icon={null} style={{ width: "100%", textAlign: "center", color: "black" }}>
                        <Dropdown.Menu>
                            {getBrance.map(({ master_branch_id, master_branch_name }) => (
                                <Dropdown.Item key={master_branch_id}>
                                    <Checkbox
                                        className="dropdown-checkbox"
                                        label={master_branch_name}
                                        onChange={toggleSelection}
                                        defaultChecked={selectedBranches.includes(master_branch_id)} />
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <p className="ths">{"barcode"} :</p>
                <select
                    className="กรอบเลือก"
                    // key={selectedBranches}
                    style={{ width: "15%", marginTop: "7px", fontSize: 15, height: "25px" }}
                    disabled={selectedBranches.length === 0}
                    onChange={(e) => setSelectedBarcodes(e.target.value)}
                >
                    <option value="" className="default-option">เลือก</option>
                    {dataBarCode.map(item => (<option
                        key={item.barcode}
                        value={item.barcode}
                    >
                        {item.barcode}
                    </option>))}
                </select>
                <p className="ths">{"ราคา"} :</p>
                <select
                    key={productType === ''}
                    className="กรอบเลือก"
                    style={{ width: "15%", marginTop: "7px", fontSize: 15, height: "25px" }}
                    value={productType}
                    disabled={selectedBarcodes === "" || filteredDataPrices.length === 0}
                    onChange={(e) => { setProductType(e.target.value); setChangePrice(''); }}
                >
                    <option value="" className="default-option">เลือก</option>
                    <option value="ราคา1">ราคา1 (ลูกค้าทั่วไป)</option>
                    <option value="ราคา2">ราคา2 (Food Delivery)</option>
                    <option value="ราคา3">ราคา3 (สมาชิก)</option>
                    <option value="ราคา4">ราคา4</option>
                    <option value="ราคา5">ราคา5</option>
                </select>
                <p className="ths" >{"มูลค่า"} :</p>
                <InputText
                    key={productType}
                    className="input_dialog"
                    style={{ width: "15%", height: "25px", fontSize: "13px", marginBottom: "5px", marginTop: "5px" }}
                    type="text"
                    disabled={productType === ""}
                    defaultValue={changPrice}
                    onChange={handlePriceChange}
                />
                <button className="submit-button"
                    onClick={filteredDataCount === 0 ? handleSubmit : handleUpdateSubmit}>
                    <i className="material-icons" style={{ fontSize: '16px', marginRight: '8px', paddingTop: "5px" }}>check_circle</i>
                    {filteredDataCount === 0 ? 'เพิ่ม' : 'อัพเดต'}
                </button>
            </div>
            <DataTable
                columns={columnData}
                data={filteredDataPrices}
                noDataComponent={<p style={{ fontSize: '14px', marginTop: '10px' }}>ไม่พบข้อมูล</p>}
                fixedHeaderScrollHeight="216px"
                fixedHeader={true}
                customStyles={{
                    fixedHeader: true,
                    headCells: {
                        style: {
                            paddingTop: '1px',
                            background: '#6598F6',
                            color: "white",
                            fontSize: "14px",
                            // height: "30px",
                            whiteSpace: 'nowrap'
                        },
                    },
                    rows: {
                        style: {
                            backgroundColor: '#F2f2f2',
                            fontSize: "12px",
                            fontWeight: "normal",
                        },
                    },
                }
                } />
        </div>
    );
};

export default ContentPrice;
