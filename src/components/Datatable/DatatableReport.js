// import MaterialTable from 'material-table';
import MaterialTable from "@eataly/material-table";
import { useEffect, useState } from 'react';
import { MTableToolbar } from 'material-table';
import HeaderReport from '../HeaderReport/HeaderReport';

const DatatableReport = (props) => {
    return (
        <div style={{ width: props.width ? props.width : '100%', marginRight:"1%" }}>
            <MaterialTable
                footerData={props.footerData ? props.footerData : []}
                components={{
                    Container: prop => <div>{prop.children}</div>,
                }}
                title={props.title}
                columns={props.columns}
                data={props.data}
                options={{
                    filtering: props.filtering,
                    // exportButton: true,
                    search: false,
                    toolbar: false,
                    headerStyle: {
                        background: '#6598F6', color: 'white',
                        fontSize: '14px', whiteSpace: 'nowrap',
                        height: "30px"
                    },
                    rowStyle: {
                        whiteSpace: 'nowrap'
                    },
                    maxBodyHeight: "70vh",
                    pageSizeOptions: [50, 100, 150, 200],
                    pageSize: 50,
                    emptyRowsWhenPaging: false,
                    exportFileName: "data",
                }}
                localization={{
                    body: {
                        emptyDataSourceMessage: "ไม่พบข้อมูล"
                    },
                    toolbar: {
                        searchPlaceholder: 'ค้นหา',
                    },
                }}
            />
        </div>
    );
}


export default DatatableReport;

