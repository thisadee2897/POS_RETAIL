import React, { useState } from 'react';
import InputText from "../../../components/Input/InputText";
import "../../../components/CSS/report.css";
const ContentDetail = () => {
    const [saleProductCode, setSaleProductCode] = useState('');
    const [category, setCategory] = useState('');
    const [purchaseTaxGroup, setPurchaseTaxGroup] = useState('');
    const [productType, setProductType] = useState('');
    const [productGroup, setProductGroup] = useState('');
    const [salesTaxGroup, setSalesTaxGroup] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="row" style={{ marginTop: "20px" }}>
                <div className="col" style={{ marginRight: "20px", marginLeft: "20px" }}>
                    <div className='row' style={{ alignItems: 'center' }}>
                        <p className="text_h_dialog" style={{ width: "30%" }}>{"รหัสขายสินค้า"} :</p>
                        <select
                            className="input_dialog"
                            style={{ width: "60%", marginTop: "0px" }}
                            value={saleProductCode}
                            onChange={(e) => setSaleProductCode(e.target.value)}
                        >
                            <option value="" className="default-option">เลือกรหัสขายสินค้า</option>
                            {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                        </select>
                    </div>
                    <div className='row'>
                        <p className="text_h_dialog" style={{ width: "30%" }}>{"หมวดสินค้า"} :</p>
                        <select
                            className="input_dialog"
                            style={{ width: "60%", marginTop: "0px" }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="" className="default-option">เลือกหมวดสินค้า</option>
                            {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                        </select>
                    </div>
                    <div className='row'>
                        <p className="text_h_dialog" style={{ width: "30%" }}>{"กลุ่มภาษีซื้อ"} :</p>
                        <select
                            className="input_dialog"
                            style={{ width: "60%", marginTop: "0px" }}
                            value={purchaseTaxGroup}
                            onChange={(e) => setPurchaseTaxGroup(e.target.value)}
                        >
                            <option value="" className="default-option">เลือกกลุ่มภาษีซื้อ</option>
                            {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                        </select>
                    </div>
                </div>
                <div className="col" style={{ marginRight: "20px" }}>
                    <div className='row'>
                        <p className="text_h_dialog" style={{ width: "30%" }}>{"ประเภทสินค้า"} :</p>
                        <select
                            className="input_dialog"
                            style={{ width: "60%", marginTop: "0px" }}
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                        >
                            <option value="" className="default-option">เลือกประเภทสินค้า</option>
                            {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                        </select>
                    </div>
                    <div className='row'>
                        <p className="text_h_dialog" style={{ width: "30%" }}>{"กลุ่มสินค้า"} :</p>
                        <select
                            className="input_dialog"
                            style={{ width: "60%", marginTop: "0px" }}
                            value={productGroup}
                            onChange={(e) => setProductGroup(e.target.value)}
                        >
                            <option value="" className="default-option">เลือกกลุ่มสินค้า</option>
                            {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                        </select>
                    </div>
                    <div className='row'>
                        <p className="text_h_dialog" style={{ width: "30%" }}>{"กลุ่มภาษีขาย"} :</p>
                        <select
                            className="input_dialog"
                            style={{ width: "60%", marginTop: "0px" }}
                            value={salesTaxGroup}
                            onChange={(e) => setSalesTaxGroup(e.target.value)}
                        >
                            <option value="" className="default-option">เลือกกลุ่มภาษีขาย</option>
                            {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                        </select>
                    </div>
                </div>
            </div>
        </form>
    );

};

export default ContentDetail;
