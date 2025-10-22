// hooks/usePermissions.js
import { useAuth } from '../contexts/AuthContext';

// Enhanced permissions configuration with more roles and permissions
const permissionsConfig = {
  'super-admin': [
    'subscriptions:read',
    'subscriptions:create',
    'subscriptions:update',
    'subscriptions:delete',
    'subscriptions:bulk',
    'subscriptions:analytics',
    'subscriptions:export',
    'subscriptions:manage',
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'users:manage',
    'settings:read',
    'settings:update',
    'system:admin'
  ],
  'admin': [
    'subscriptions:read',
    'subscriptions:create',
    'subscriptions:update',
    'subscriptions:delete',
    'subscriptions:bulk',
    'subscriptions:analytics',
    'subscriptions:export',
    'subscriptions:manage',
    'users:read',
    'users:create',
    'users:update',
    'settings:read'
  ],
  'manager': [
    'subscriptions:read',
    'subscriptions:create',
    'subscriptions:update',
    'subscriptions:analytics',
    'subscriptions:export',
    'users:read'
  ],
  'operator': [
    'subscriptions:read',
    'subscriptions:update',
    'subscriptions:create'
  ],
  'viewer': [
    'subscriptions:read',
    'users:read'
  ],
  'customer': [
    'subscriptions:read:own',
    'subscriptions:create:own',
    'subscriptions:update:own'
  ]
};

export const usePermissions = () => {
  // ✅ Use your existing Auth hook directly
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user?.role) {
      console.warn('usePermissions: No user or role found');
      return false;
    }
    const perms = permissionsConfig[user.role] || [];
    return perms.includes(permission);
  };

  const hasAnyPermission = (perms) => perms?.some(hasPermission);
  const hasAllPermissions = (perms) => perms?.every(hasPermission);
  const canPerformAction = (action, resource) => hasPermission(`${resource}:${action}`);
  const canAccessOwn = (resource) =>
    hasPermission(`${resource}:read:own`) || hasPermission(`${resource}:read`);
  const getAvailablePermissions = () => permissionsConfig[user?.role] || [];

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canPerformAction,
    canAccessOwn,
    getAvailablePermissions,
    userRole: user?.role,
    isSuperAdmin: user?.role === 'super-admin',
    isAdmin: ['admin', 'super-admin'].includes(user?.role),
    isManager: ['manager', 'admin', 'super-admin'].includes(user?.role),
    isOperator: ['operator', 'manager', 'admin', 'super-admin'].includes(user?.role),
    isViewer: ['viewer', 'operator', 'manager', 'admin', 'super-admin'].includes(user?.role),
    isCustomer: user?.role === 'customer',
    currentUser: user,
  };
};

export default usePermissions;
