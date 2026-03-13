// import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import apiClient from '../api/client';

// const AuthContext = createContext(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initialized, setInitialized] = useState(false);

//   // Fetch current user profile
//   const fetchUser = useCallback(async () => {
//     try {
//       const response = await apiClient.get('/auth/me');
//       setUser(response.data);
//     } catch (error) {
//       // Silently fail - user is not authenticated
//       setUser(null);
//     } finally {
//       setLoading(false);
//       setInitialized(true);
//     }
//   }, []);

//   // Initialize auth state
//   useEffect(() => {
//     fetchUser();

//     // Listen for logout events
//     const handleLogout = () => {
//       setUser(null);
//       fetchUser(); // Re-check auth state
//     };

//     window.addEventListener('auth:logout', handleLogout);
//     return () => window.removeEventListener('auth:logout', handleLogout);
//   }, [fetchUser]);

//   // Login
//   const login = async (email, password) => {
//     try {
//       const response = await apiClient.post('/auth/login', { email, password });
//       setUser(response.data);
//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message || 'Login failed'
//       };
//     }
//   };

//   // Register
//   const register = async (userData) => {
//     try {
//       const formData = new FormData();
//       Object.keys(userData).forEach(key => {
//         if (userData[key] !== null && userData[key] !== undefined) {
//           formData.append(key, userData[key]);
//         }
//       });

//       const response = await apiClient.post('/auth/register', formData);
//       setUser(response.data);
//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message || 'Registration failed',
//         validationErrors: error.validationErrors
//       };
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       await apiClient.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//       window.location.href = '/';
//     }
//   };

//   // Update profile
//   const updateProfile = async (profileData) => {
//     try {
//       const response = await apiClient.put('/auth/profile', profileData);
//       setUser(response.data);
//       return { success: true, data: response.data };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message || 'Profile update failed'
//       };
//     }
//   };

//   const value = {
//     user,
//     loading,
//     initialized,
//     isAuthenticated: !!user,
//     login,
//     register,
//     logout,
//     updateProfile,
//     refreshUser: fetchUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuthStatus();
    
    // Listen for logout events
    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};