import React, { useState } from 'react';
import "../../../components/CSS/report.css";
import DataTable from './Datatables';
const ContentPrice = () => {
    const handleSubmit = () => {
    };
    const [productType, setProductType] = useState('');
    const [dataBarCode, setDataBarCode] = useState([]);
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            center: true,
        },
        {
            name: 'สาขา',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
        },
        {
            name: 'barcode',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ราคาทั่วไป',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ราคา Delivery',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
        },
        {
            name: 'ราคาสมาชิก',
            selector: row => row.master_shift_job_remark,
            sortable: true,
        },
        {
            name: 'ราคา4',
            selector: row => row.master_shift_job_remark,
            sortable: true,
        },
        {
            name: 'ราคา5',
            selector: row => row.master_shift_job_remark,
            sortable: true,
        },
    ];

    return (
        <div style={{ marginTop: "10px" }}>
            <div className='row'>
                <p className="ths">{"สาขา"} :</p>
                <select
                    className="กรอบเลือก"
                    style={{ width: "15%", marginTop: "7px", fontSize: 15, height: "25px" }}
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                >
                    <option value="" className="default-option">เลือก</option>
                    {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                </select>
                <p className="ths">{"barcode"} :</p>
                <select
                    className="กรอบเลือก"
                    style={{ width: "15%", marginTop: "7px", fontSize: 15, height: "25px" }}
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                >
                    <option value="" className="default-option">เลือก</option>
                    {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                </select>
                <p className="ths">{"ราคา"} :</p>
                <select
                    className="กรอบเลือก"
                    style={{ width: "15%", marginTop: "7px", fontSize: 15, height: "25px" }}
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                >
                    <option value="" className="default-option">เลือก</option>
                    {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                </select>
                <p className="ths" >{"มูลค่า"} :</p>
                <select
                    className="กรอบเลือก"
                    style={{ width: "15%", marginTop: "7px", fontSize: 15, height: "25px" }}
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                >
                    <option value="" className="default-option">เลือก</option>
                    {/* เพิ่มตัวเลือกของ dropdown ตามที่ต้องการ */}
                </select>
                <button className="submit-button"
                    onClick={handleSubmit}>
                    ตกลง
                </button>
            </div>
            <DataTable columns={columnData} data={dataBarCode} />
        </div>
    );
};

export default ContentPrice;
