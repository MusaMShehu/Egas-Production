// components/UserList.js
import React, { useState } from "react";
import { 
  FiSearch, 
  FiX, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiRefreshCw, 
  FiChevronLeft, 
  FiChevronRight, 
  FiUsers, 
  FiPlus 
} from "react-icons/fi";
import UserCard from "./UserCard";
import UserTable from "./UserTable";
import AdvancedFilters from "./AdvancedFilters";

const UserList = ({
  users,
  loading,
  error,
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  sortConfig,
  onSort,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  selectedUsers,
  onUserSelect,
  onSelectAll,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onCreateUser,
  onRefresh,
  availableRoles
}) => {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  if (loading) {
    return (
      <div className="aum-loading-container">
        <div className="aum-loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aum-error-container">
        <div className="aum-error-icon">⚠️</div>
        <h3>Error Loading Users</h3>
        <p>{error}</p>
        <button onClick={onRefresh} className="aum-btn aum-btn-primary">
          <FiRefreshCw /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="aum-user-list-container">
      {/* Toolbar */}
      <div className="aum-list-toolbar">
        <div className="aum-toolbar-left">
          <div className="aum-search-box">
            <FiSearch className="fas fa-search" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="aum-search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => onSearchChange("")}
                className="aum-clear-search"
              >
                <FiX />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`aum-btn aum-btn-outline ${showAdvancedFilters ? 'active' : ''}`}
          >
            <FiFilter />
            Advanced Filters
            {Object.values(filters).some(f => f !== "all") && (
              <span className="aum-filter-indicator"></span>
            )}
          </button>
        </div>

        <div className="aum-toolbar-right">
          <div className="aum-view-toggle">
            <button
              onClick={() => setViewMode("table")}
              className={`aum-btn aum-btn-icon ${viewMode === "table" ? 'active' : ''}`}
            >
              <FiList />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`aum-btn aum-btn-icon ${viewMode === "card" ? 'active' : ''}`}
            >
              <FiGrid />
            </button>
          </div>

          <button onClick={onRefresh} className="aum-btn aum-btn-icon" title="Refresh">
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <AdvancedFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          availableRoles={availableRoles}
        />
      )}

      {/* Content */}
      {viewMode === "table" ? (
        <UserTable
          users={users}
          sortConfig={sortConfig}
          onSort={onSort}
          selectedUsers={selectedUsers}
          onUserSelect={onUserSelect}
          onSelectAll={onSelectAll}
          onViewUser={onViewUser}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
          onToggleStatus={onToggleStatus}
          availableRoles={availableRoles}
        />
      ) : (
        <div className="aum-user-cards-grid">
          {users.map(user => (
            <UserCard
              key={user._id}
              user={user}
              isSelected={selectedUsers.has(user._id)}
              onSelect={onUserSelect}
              onView={onViewUser}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {users.length > 0 && (
        <div className="aum-pagination-container">
          <div className="aum-pagination-info">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
            {pagination.totalItems} entries
          </div>

          <div className="aum-pagination-controls">
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="aum-items-per-page"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="aum-btn aum-btn-icon"
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: Math.ceil(pagination.totalItems / pagination.itemsPerPage) }, (_, i) => i + 1)
              .filter(page => {
                const current = pagination.currentPage;
                const total = Math.ceil(pagination.totalItems / pagination.itemsPerPage);
                return page === 1 || page === total || Math.abs(page - current) <= 1;
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                if (prevPage && page - prevPage > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="aum-pagination-ellipsis">...</span>
                      <button
                        onClick={() => onPageChange(page)}
                        className={`aum-btn aum-btn-icon ${pagination.currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`aum-btn aum-btn-icon ${pagination.currentPage === page ? 'sactive' : ''}`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
              className="aum-btn aum-btn-icon"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {users.length === 0 && !loading && (
        <div className="aum-empty-state">
          <FiUsers className="aum-empty-icon" />
          <h3>No users found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={onCreateUser} className="aum-btn aum-btn-primary">
            <FiPlus /> Create First User
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;