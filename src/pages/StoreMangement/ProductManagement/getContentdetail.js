import { React, useState, useEffect, useContext } from "react";
import "../../../components/CSS/report.css";
import UrlApi from "../../../url_api/UrlApi";
import axios from 'axios';
import DataContext from "../../../DataContext/DataContext";
import DataContextBranchData from "../../../DataContext/DataContextBranchData";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import styled from '@mui/material/styles/styled';
const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 70,
    height: 26,
    padding: 0,
    marginRight: 5,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(44px)',
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
        }, '&.Mui-disabled + .MuiSwitch-track': {
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
const ContentDetail = ({ onContentDetailDataChange, keyDetailData, setdataDetail, dataDetail }) => {
    const userData = useContext(DataContext);
    const BranchData = useContext(DataContextBranchData);
    const [companyId] = useState(userData[0].master_company_id)
    const [branchId] = useState(parseInt(BranchData[0].master_branch_id))
    const [brand, setProductBrand] = useState(keyDetailData.master_product_brand_id);
    const [category, setCategory] = useState(keyDetailData.master_product_category_id);
    const [vatBuy, setProductVatBuy] = useState(keyDetailData.master_vat_purchase_group_id);
    const [type, setProductType] = useState(keyDetailData.master_product_type_id);
    const [group, setProductGroup] = useState(keyDetailData.master_product_group_id);
    const [vatSale, setProductVatSale] = useState(keyDetailData.master_vat_group_id);
    const [getCategory, setGetCategory] = useState([]);
    const [getGroup, setGetGroup] = useState([]);
    const [getType, setGetType] = useState([]);
    const [getBrand, setGetBrand] = useState([]);
    const [getVat, setGetVat] = useState([]);
    const [isSellEnabled, setIsSellEnabled] = useState(dataDetail.master_product_sell_active);
    const [isPurchaseEnabled, setIsPurchaseEnabled] = useState(dataDetail.master_product_purchase_active);
    useEffect(() => {
        handleDropdownChange();
        console.log(dataDetail)
    }, [category, group, type, brand, vatBuy, vatSale, dataDetail, isSellEnabled, isPurchaseEnabled]);
    const handleSwitchChange = (event) => {
        const { name, checked } = event.target;
        if (name === "isSellEnabled") {
            setIsSellEnabled(checked);
        } else if (name === "isPurchaseEnabled") {
            setIsPurchaseEnabled(checked);
        }
    };
    const handleDropdownChange = () => {
        keyDetailData.master_product_category_id = category
        keyDetailData.master_product_group_id = group
        keyDetailData.master_product_type_id = type
        keyDetailData.master_product_brand_id = brand
        keyDetailData.master_vat_purchase_group_id = vatBuy
        keyDetailData.master_vat_group_id = vatSale
        keyDetailData.master_product_sell_active = isSellEnabled
        keyDetailData.master_product_purchase_active = isPurchaseEnabled
        onContentDetailDataChange(keyDetailData);
        setdataDetail(keyDetailData);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getCategoryApi = axios.post(UrlApi() + 'get_category_product_management_active', { "company_id": companyId, "branch_id": branchId });
                const getGroupApi = getGroup !== "" ? axios.post(UrlApi() + 'get_product_group_active', { "company_id": companyId, "category_id": category }) : Promise.resolve();
                const getTypeApi = getType !== "" && axios.post(UrlApi() + 'get_type_product_management', { "company_id": companyId });
                const getBrandApi = getBrand !== "" && axios.post(UrlApi() + 'get_master_product_brand', { "company_id": companyId });
                const getVatdApi = getVat !== "" && axios.post(UrlApi() + 'get_vat_group')
                const [categoryResponse, groupResponse, typeResponse, brandResponse, vatResponse] = await Promise.all([getCategoryApi, getGroupApi, getTypeApi, getBrandApi, getVatdApi]);
                setGetCategory(categoryResponse.data);
                if (getCategory !== "") {
                    setGetGroup(groupResponse.data);
                } else {
                    setGetGroup([]);
                }
                const modifiedTypeData = typeResponse.data.filter(item => item.master_product_type_active === true).map((item, idx) => ({ ...item, row_num: idx + 1 }));
                setGetType(modifiedTypeData);
                setGetBrand(brandResponse.data);
                setGetVat(vatResponse.data);
            } catch (error) {
                console.error("Error while fetching data:", error);
            }
        };
        fetchData();
    }, [category]);

    return (
        <div className="row" style={{ marginTop: "20px" }}>
            <div className="col" style={{ marginRight: "20px", marginLeft: "20px" }}>
                <div className='row' style={{ alignItems: 'center'}}>
                    <p className="text_h_dialog" style={{ width: "30%" ,marginTop:"12px" }}>{"หมวดสินค้า"} :</p>
                    <select
                        className="input_dialog"
                        style={{ width: "60%", marginTop: "0px" }}
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            if (e.target.value !== category) {
                                setProductGroup("");
                            }
                            handleDropdownChange();
                        }}
                    >
                        <option value="" className="default-option" style={{ color: 'lightgray', fontWeight: 'normal' }}>
                            - ว่าง-
                        </option>
                        {getCategory.map((item) => (
                            <option key={`productCategory-${item.master_product_category_id}`} value={item.master_product_category_id}>
                                {item.master_product_category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='row' style={{ alignItems: 'center'}}>
                    <p className="text_h_dialog" style={{ width: "30%",marginTop:"12px" }}>{"กลุ่มสินค้า"} :</p>
                    <select
                        className="input_dialog"
                        style={{ width: "60%", marginTop: "0px" }}
                        value={group}
                        disabled={category === ""}
                        onChange={(e) => {
                            setProductGroup(e.target.value);
                            handleDropdownChange();
                        }}
                    >
                        <option value="" className="default-option">- ว่าง-</option>
                        {getGroup.map((item) => (
                            <option key={`productCategory-${item.master_product_group_id}`} value={item.master_product_group_id}>
                                {item.master_product_group_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='row' style={{ alignItems: 'center',marginBottom:"10px" }}>
                    <p className="text_h_dialog" style={{ width: "30%",marginTop:"12px"  }}>{"ประเภทสินค้า"} :</p>
                    <select
                        className="input_dialog"
                        style={{ width: "60%", marginTop: "0px" }}
                        value={type}
                        onChange={(e) => {
                            setProductType(e.target.value);
                            handleDropdownChange();
                        }}
                    >
                        <option value="" className="default-option">- ว่าง-</option>
                        {getType.map((item) => {
                            return (
                                <option key={`type-${item.master_product_type_id}`} value={item.master_product_type_id}>
                                    {item.master_product_type_name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="col" style={{ marginRight: "20px" }}>
                <div className='row' style={{ alignItems: 'center'}}>
                    <p className="text_h_dialog" style={{ width: "30%" ,marginTop:"12px" }}>{"ยี่ห้อสินค้า"} :</p>
                    <select
                        className="input_dialog"
                        style={{ width: "60%", marginTop: "0px" }}
                        value={brand}
                        onChange={(e) => {
                            setProductBrand(e.target.value);
                            handleDropdownChange();
                        }}
                    >
                        <option value="" className="default-option">- ว่าง-</option>
                        {getBrand.map((item) => {
                            return (
                                <option key={`productBrand-${item.master_product_brand_id}`} value={item.master_product_brand_id}>
                                    {item.master_product_brand_name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className='row' style={{ alignItems: 'center' }}>
                    <p className="text_h_dialog" style={{ width: "30%",marginTop:"12px"  }}>{"กลุ่มภาษีซื้อ"} :</p>
                    <select
                        className="input_dialog"
                        style={{ width: "60%", marginTop: "0px" }}
                        value={vatBuy}
                        onChange={(e) => {
                            setProductVatBuy(e.target.value);
                            handleDropdownChange();
                        }}
                    >
                        <option value="" className="default-option">- ว่าง-</option>
                        {getVat.filter(item => item.master_vat_type_id === 1).map((item) => {
                            return (
                                <option key={`type-${item.master_vat_group_id}`} value={item.master_vat_group_id}>
                                    {item.master_vat_group_name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className='row' style={{ alignItems: 'center'}}>
                    <p className="text_h_dialog" style={{ width: "30%",marginTop:"12px"  }}>{"กลุ่มภาษีขาย"} :</p>
                    <select
                        className="input_dialog"
                        style={{ width: "60%", marginTop: "0px" }}
                        value={vatSale}s
                        onChange={(e) => {
                            setProductVatSale(e.target.value);
                            handleDropdownChange();
                        }}
                    >
                        <option value="" className="default-option">- ว่าง-</option>
                        {getVat.filter(item => item.master_vat_type_id === 2).map((item) => {
                            return (
                                <option key={`productCategory-${item.master_vat_group_id}`} value={item.master_vat_group_id}>
                                    {item.master_vat_group_name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div class="col" style={{ flexDirection: "column", marginTop: "10px" }}>
                    <FormControlLabel
                        control={
                            <IOSSwitch
                                name="isSellEnabled"
                                checked={isSellEnabled}
                                onChange={handleSwitchChange}
                            />
                        }
                        label="เปิดให้ขาย"
                        style={{ paddingLeft: "10px", marginTop: "10px" }}
                    />
                    <FormControlLabel
                        control={
                            <IOSSwitch
                                name="isPurchaseEnabled"
                                checked={isPurchaseEnabled}
                                onChange={handleSwitchChange}
                            />
                        }
                        label="เปิดให้ซื้อ"
                        style={{ paddingLeft: "50px", marginTop: "10px" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ContentDetail;
