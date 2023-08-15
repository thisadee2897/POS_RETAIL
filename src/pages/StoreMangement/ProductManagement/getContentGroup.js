import React, { useState } from 'react';
import "../../../components/CSS/report.css";
import DataTable from 'react-data-table-component';
const ContentGroup = ({ dataProductSet, setDataProductSet }) => {
    const handleSubmit = () => {
        let data = [...dataProductSet]
        data.push({
            list_no: data.length + 1,
            code: "abcde",
            barcode: "0001",
            name: "สวัสดีปีใหม่ไทย",
            group: "ทอสอบ",
            unit_id: "ชิ้น",
            ratio: "1:1",
        })
        setDataProductSet(data)
    };
    const columnData = [
        {
            name: 'รหัสสินค้า',
            selector: (row, idx) => row.code,
            sortable: false,
            center: true,
            width: "100px",
        },
        {
            name: 'barcodeสินค้าในชุด',
            selector: row => row.barcode,
            sortable: false,
            center: true,
        },
        {
            name: 'ชื่อสินค้าในชุด',
            selector: row => row.name,
            sortable: false,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'สินค้าชุด',
            selector: row => row.group,
            sortable: false,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
        },
        {
            name: 'หน่วยนับ',
            selector: row => row.unit_id,
            sortable: false,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            },
            width: "102px",
        },
        {
            name: 'อัตราส่วน',
            selector: row => row.ratio,
            sortable: false,
            center: true,
            style: {
                whiteSpace: 'nowrap'
            }
            , width: "105px",
        }
    ];

    return (
        <div>
            <div className='row' style={{ display: 'flex', justifyContent: 'flex-end', marginRight: "0px", marginBottom: "2px" }}>
                <button className="submit-button"
                    onClick={handleSubmit}>
                    เพิ่ม
                </button></div>
            <DataTable columns={columnData} data={dataProductSet}
                noDataComponent={<p style={{ fontSize: '14px', marginTop: '10px' }}>ไม่พบข้อมูล</p>}
                fixedHeaderScrollHeight="197.5px"
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
    );
};

export default ContentGroup;
