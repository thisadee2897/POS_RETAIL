import React from "react";
import DataTable from 'react-data-table-component-footer';

const customStyles = {
    headCells: {
        style: {
            paddingTop: '1px',
            background: '#6598F6',
            color: "white",
            fontSize: "15px",
            height: "30px",
            whiteSpace: 'nowrap'
        },
    },
    rows: {
        style: {
            backgroundColor: '#F2f2f2',
            fontSize: "12px",
        }
    }
};

const Datatables = (props) => {

    return (
        <div style={props.style ? props.style : { marginLeft: "0%", marginRight: "0%",height: "60px", }}>
            <DataTable
                noHeader
                customStyles={customStyles}
                fixedHeader={true}
                fixedHeaderScrollHeight="65vh"
                columns={props.columns}
                data={props.data}
                striped
                persistTableHead
                defaultSortAsc={true}
                // conditionalRowStyles={props.conditionalRowStyles}
                conditionalRowStyles={props.backgroundColor}
                noDataComponent={<p style={{ fontSize: '14px', marginTop: '2px' }}>ไม่พบข้อมูล</p>}
                paginationPerPage={props.paginationPerPage ? props.paginationPerPage : 50}
                paginationRowsPerPageOptions={props.paginationRowsPerPageOptions ? props.paginationRowsPerPageOptions : [50, 100, 150, 200]}
                pagination={props.pagination ? props.pagination : true}
                dense
                paginationTotalRows={props.paginationTotalRows}
                progressPending={props.progressPending}
                onChangeRowsPerPage={props.onChangeRowsPerPage}
                onChangePage={props.onChangePage}
                footer={props.footer}
                footerBold={props.footerBold}
                expandableRows={props.expandableRows}
                expandableRowExpanded={props.expandableRowExpanded}
                expandableRowsComponent={props.expandableRowExpanded}
            />
        </div>
    );
}

export default Datatables;
