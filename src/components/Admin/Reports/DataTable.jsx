// components/reports/DataTable.js
import React, { useState, useMemo } from 'react';

const DataTable = ({ 
  columns, 
  rows, 
  pagination = false, 
  itemsPerPage = 10,
  sortable = true,
  searchable = true,
  selectable = false,
  onRowSelect,
  striped = true,
  hoverable = true,
  compact = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Filter and sort data
  const processedData = useMemo(() => {
    let filteredData = rows;

    // Apply search
    if (searchable && searchTerm) {
      filteredData = rows.filter(row => 
        row.some(cell => 
          String(cell).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortable && sortConfig.key !== null) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [rows, searchTerm, sortConfig, searchable, sortable]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pagination ? 
    processedData.slice(startIndex, startIndex + itemsPerPage) : 
    processedData;

  const handleSort = (columnIndex) => {
    setSortConfig({
      key: columnIndex,
      direction: sortConfig.key === columnIndex && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(paginatedData.map((_, index) => startIndex + index));
      setSelectedRows(allIds);
      onRowSelect?.(Array.from(allIds));
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const handleSelectRow = (rowIndex, checked) => {
    const absoluteIndex = startIndex + rowIndex;
    const newSelected = new Set(selectedRows);
    
    if (checked) {
      newSelected.add(absoluteIndex);
    } else {
      newSelected.delete(absoluteIndex);
    }
    
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  const getSortIcon = (columnIndex) => {
    if (sortConfig.key !== columnIndex) return 'fas fa-sort';
    return sortConfig.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  };

  return (
    <div className="data-table-container">
      {/* Table Controls */}
      {(searchable || selectable) && (
        <div className="table-controls">
          {searchable && (
            <div className="table-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          )}
          
          {selectable && selectedRows.size > 0 && (
            <div className="selection-info">
              {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table className={`data-table ${compact ? 'compact' : ''} ${striped ? 'striped' : ''} ${hoverable ? 'hoverable' : ''}`}>
          <thead>
            <tr>
              {selectable && (
                <th className="select-column">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    indeterminate={selectedRows.size > 0 && selectedRows.size < paginatedData.length}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className={sortable ? 'sortable' : ''}
                  onClick={() => sortable && handleSort(index)}
                >
                  <div className="column-header">
                    <span>{column}</span>
                    {sortable && (
                      <i className={getSortIcon(index)}></i>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={selectedRows.has(startIndex + rowIndex) ? 'selected' : ''}
                >
                  {selectable && (
                    <td className="select-cell">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(startIndex + rowIndex)}
                        onChange={(e) => handleSelectRow(rowIndex, e.target.checked)}
                      />
                    </td>
                  )}
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {typeof cell === 'object' && cell !== null ? cell : String(cell)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="no-data">
                  <div className="no-data-content">
                    <i className="fas fa-inbox"></i>
                    <p>No data found</p>
                    {searchTerm && (
                      <button 
                        className="clear-filters"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="table-footer">
        <div className="table-info">
          Showing {paginatedData.length} of {processedData.length} entries
          {searchTerm && ` (filtered from ${rows.length} total entries)`}
        </div>

        {pagination && processedData.length > itemsPerPage && (
          <div className="table-pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <i className="fas fa-angle-double-left"></i>
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <i className="fas fa-angle-double-right"></i>
            </button>
          </div>
        )}

        {pagination && (
          <div className="page-size-selector">
            <label htmlFor="pageSize">Show:</label>
            <select
              id="pageSize"
              value={itemsPerPage}
              onChange={(e) => {
                setCurrentPage(1);
                // This would typically be handled by parent component
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;