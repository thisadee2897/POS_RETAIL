import React, { useState, useContext, useEffect } from 'react';
import "../../../components/CSS/report.css";
// import DataTable from './Datatables2';
import DataTable from 'react-data-table-component';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputText from "../../../components/Input/InputText";
import Select from "../../../components/Input/InputSelect";
import Switch from '@mui/material/Switch';
import styled from '@mui/material/styles/styled';
import DataContext from "../../../DataContext/DataContext";
import { getUnit } from '@mui/material/styles/cssUtils';
import UrlApi from "../../../url_api/UrlApi";
import axios from 'axios';
const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    // marginLeft: 40,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#44DBAE' : '#74E0C0',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#74E0C0',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#D2D2D2' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));
const UseContentBarCode = ({ onContentBarCodeDataChange, keyDetailData, dataBarCode, setDataBarCode, DataProuct, DataDetail }) => {
    const userData = useContext(DataContext);
    const [isSellEnabled, setIsSellEnabled] = useState(true);
    const [companyId] = useState(userData[0].master_company_id)
    const product_id = useState(userData[0].master_product_id)
    const [getType, setGetType] = useState([]);
    const [getUnit, SetDataUnit] = useState([]);
    const handleSubmit = () => {
        keyDetailData.master_product_id = product_id
        keyDetailData.barcode = dataBarCode.barcode
        keyDetailData.master_product_barcode_billname = dataBarCode.name_bil
        keyDetailData.master_warehouse_type_id = dataBarCode.type_id
        keyDetailData.master_product_barcode_unitid = dataBarCode.unit_id
        keyDetailData.master_company_id = companyId
        keyDetailData.master_product_barcode_activeflag = dataBarCode.status
        onContentBarCodeDataChange(keyDetailData)
    };
    // console.log(DataProuct)
    // console.log(DataDetail)
    // console.log(getType)
    const handleAddData = () => {
        let data = [...dataBarCode]
        data.push({
            list_no: data.length + 1,
            status: false,
            barcode: DataProuct.master_product_code,
            name_bil: DataProuct.master_product_name_bill,
            type_id: DataDetail.master_product_type_id,
            unit_id: DataProuct.master_product_unit_id,
            ratio: "",
        })
        setDataBarCode(data)
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getTypeApi = getType !== "" && axios.post(UrlApi() + 'get_type_product_management', { "company_id": companyId });
                const getUnitApi = getUnit !== "" && axios.post(UrlApi() + 'get_product_unit_management', { "company_id": companyId });
                const [typeResponse, unitResponse] = await Promise.all([getTypeApi, getUnitApi]);
                const modifiedTypeData = typeResponse.data.filter(item => item.master_product_type_active === true).map((item, idx) => ({ ...item, row_num: idx + 1 }));
                const modifiedUnitData = unitResponse.data.filter(item => item.master_product_unit_active === true).map((item, idx) => ({ ...item, row_num: idx + 1 }));
                setGetType(modifiedTypeData);
                SetDataUnit(modifiedUnitData);
            } catch (error) {
                console.error("Error while fetching data:", error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
    }, [dataBarCode, getUnit,getType]);
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            width: "67px",
            sortable: false,
            center: true,
        },
        {
            name: 'สถานะ',
            selector: (row, idx) => <FormControlLabel
                style={{ paddingLeft: "3px", marginTop: "0px" }}
                control={<IOSSwitch sx={{ m: 1 }}
                    defaultChecked
                />}
                value={row.status}
                onChange={(e) => {
                    let update = [...dataBarCode]
                    update[idx].status = e.target.value
                    setDataBarCode(update)
                    console.log(row)
                }}
            />,
            width: "75px",
            sortable: false,
            center: true,
        },
        {
            name: 'barcode',
            selector: (row, idx) => <InputText
                className="input_dialog"
                style={{ width: "100%", height: "25px", fontSize: "13px", center: "true", marginBottom: "5px", marginTop: "5px" }}
                type_id="text"
                defaultValue={""}
                value={row.barcode}
                onChange={(e) => {
                    let update = [...dataBarCode]
                    update[idx].barcode = e.target.value
                    setDataBarCode(update)
                    console.log(row)
                }}
            />,
            sortable: false,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ชื่อในการออกบิล',
            selector: (row) => row.name_bil,
            sortable: false,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ประเภทสินค้า',
            // selector: row => row.type_id,
            selector: (row) => {
                const selectedType = getType.find((type) => parseInt(type.master_product_type_id) === parseInt(row.type_id));
                const unitName = selectedType ? selectedType.master_product_type_name : '-';
                return unitName;

            },
            center: true,
            sortable: false,
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
            width:"90px",
            sortable: false,
            center: true,
        },
        {
            name: 'อัตราส่วน',
            selector: (row, idx) => <InputText
                className="input_dialog"
                style={{ width: "100%", height: "25px", fontSize: "13px", marginBottom: "5px", marginTop: "5px" }}
                type_id="text"
                defaultValue={""}
                value={row.ratio}
                onChange={(e) => {
                    let update = [...dataBarCode]
                    update[idx].ratio = e.target.value
                    setDataBarCode(update)
                    console.log(row)
                }}
            />,
            sortable: false,
            center: true,
        },
    ];

    return (
        <div >
            <div className='row' style={{ display: 'flex', justifyContent: 'flex-end', marginRight: "0px", marginBottom: "2px" }}>
                {/* <button className="submit-button"
                    onClick={handleAddData}>
                    เพิ่ม
                </button> */}
                <button className="submit-button2"
                    onClick={handleAddData}>
                    <i className="fas fa-barcode"></i> สร้างจากรหัสสินค้าหลัก
                </button>

            </div>
            <div style={{ height: "30px" }}>
                <DataTable columns={columnData} data={dataBarCode}
                    noDataComponent={<p style={{ fontSize: '14px', marginTop: '10px' }}>ไม่พบข้อมูล</p>}
                    fixedHeaderScrollHeight="218px"
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
                            }
                        }
                    }} />
            </div>
        </div>
    );
};

export default UseContentBarCode;
