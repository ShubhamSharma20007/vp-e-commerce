import React from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data
import "ag-grid-community/styles/ag-theme-quartz.css";
const OrderTable = ({ colDefs, rowData }) => {
  return (
    <>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          //   rowSelection={rowSelection}
          //   onPaginationChanged={onPaginationChanged}
          pagination={true}
          //   paginationPageSizeSelector={paginationPageSizeSelector}
          //   paginationPageSize={pageSize}
        />
      </div>
    </>
  );
};

export default OrderTable;
