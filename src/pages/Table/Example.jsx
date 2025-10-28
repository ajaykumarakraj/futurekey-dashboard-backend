import React, { useState } from "react";
import "../../app.css";
import "./tableStyles.css";

const Example = ({ data, columns, rowsPerPageOptions = [5, 10, 25] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value.toLowerCase(),
    }));
    setPage(0); // Reset to first page on filter
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setPage(0);
  };

  const filteredData = data.filter((row) =>
    columns.every((column) =>
      filters[column.field]
        ? String(row[column.field]).toLowerCase().includes(filters[column.field])
        : true
    )
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column, i) => (

              <th key={i}>
                <div>{column.headerName}</div>
                <input
                  type="text"
                  placeholder={`Filter ${column.headerName}`}
                  onChange={(e) => handleFilterChange(column.field, e.target.value)}
                  style={{ width: "100%", marginTop: "5px" }}
                />
              </th>

            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, i) => (
              <tr key={i}>
                {columns.map((column, i) => (
                  <td key={i}>
                    {column.renderCell ? column.renderCell(row) : row[column.field]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>


    </div>
  );
};

export default Example;
