import React, { useState } from 'react';
import "../../../components/CSS/report.css";
import DataTable from './Datatables';
const ContentGroup = () => {
    const handleSubmit = () => {
    };
    const [productType, setProductType] = useState('');
    const [dataContentGroup, setDataContentGroup] = useState([]);
    const columnData = [
        {
            name: 'รหัสสินค้า',
            selector: (row, idx) => idx + 1,
            sortable: false,
            center: true,
        },
        {
            name: 'barcodeสินค้าในชุด',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
        },
        {
            name: 'ชื่อสินค้าในชุด',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'สินค้าชุด',
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
            name: 'อัตราส่วน',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        }
    ];

    return (
        <div style={{ marginTop: "10px" }}>
            <div className="submit-button-container">
                <button className="submit-button" onClick={handleSubmit}>
                    เพิ่ม
                </button>
            </div>
            <DataTable columns={columnData} data={dataContentGroup} />
        </div>
    );
};

export default ContentGroup;
