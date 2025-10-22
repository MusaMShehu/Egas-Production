// components/RoleBasedAccess.js
const RoleBasedAccess = ({ children, permission }) => {
  return permission ? children : null;
};

export default RoleBasedAccess;