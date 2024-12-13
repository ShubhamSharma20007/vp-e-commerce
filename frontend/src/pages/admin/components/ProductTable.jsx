import React from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo } from "react";

const ProductTable = ({ rowData, colDefs, pageSize, onPaginationChanged }) => {
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  //   pagination
  const pagination = true;
  const paginationPageSizeSelector = [10, 20, 50];

  return (
    <>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          rowSelection={rowSelection}
          rowData={rowData}
          onPaginationChanged={onPaginationChanged}
          columnDefs={colDefs}
          pagination={pagination}
          paginationPageSizeSelector={paginationPageSizeSelector}
          paginationPageSize={pageSize}
        />
      </div>
    </>
  );
};

export default ProductTable;
