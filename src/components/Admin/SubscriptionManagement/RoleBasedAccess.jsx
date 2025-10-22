// components/RoleBasedAccess.js
import React from 'react';
import { usePermissions } from '../../../hooks/usePermissions';

const RoleBasedAccess = ({ 
  permission, 
  permissions, // Array of permissions (any one required)
  allPermissions, // Array of permissions (all required)
  children, 
  fallback = null,
  renderNoAccess = null
}) => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions 
  } = usePermissions();

  let hasAccess = false;

  // Check permissions based on props provided
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = hasAnyPermission(permissions);
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAllPermissions(allPermissions);
  } else {
    // If no permission props provided, grant access (backward compatibility)
    console.warn('RoleBasedAccess: No permission props provided. Granting access by default.');
    hasAccess = true;
  }

  if (!hasAccess) {
    // Return renderNoAccess function result or fallback
    return renderNoAccess ? renderNoAccess() : fallback;
  }

  return children;
};

export default RoleBasedAccess;