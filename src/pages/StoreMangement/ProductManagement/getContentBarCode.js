import React, { useState } from 'react';
import "../../../components/CSS/report.css";
import DataTable from './Datatables';

const UseContentBarCode = () => {
    const [dataBarCode, setDataBarCode] = useState([]);
    const columnData = [
        {
            name: 'ลำดับ',
            selector: (row, idx) => idx + 1,
            sortable: false,
            center: true,
        },
        {
            name: 'สถานะการใช้งาน',
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
            name: 'ชื่อในการออกบิล',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'ปรเภทสินค้า',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.master_shift_job_remark,
            sortable: true,
            center: true,
        },
        {
            name: 'อัตราส่วน',
            selector: row => row.master_shift_job_remark,
            sortable: true,
        },
    ];

    return (
        <div style={{ marginTop: "10px" }}>
            <DataTable columns={columnData} data={dataBarCode} />
        </div>
    );
};

export default UseContentBarCode;
