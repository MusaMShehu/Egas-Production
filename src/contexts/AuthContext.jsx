// // contexts/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import apiClient from '../api/apiClient';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Check if user is logged in on mount
//     checkAuthStatus();
    
//     // Listen for logout events
//     window.addEventListener('auth:logout', handleLogout);
    
//     return () => {
//       window.removeEventListener('auth:logout', handleLogout);
//     };
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const response = await apiClient.get('/auth/me');
//       if (response.success && response.data) {
//         setUser(response.data);
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await apiClient.post('/auth/login', { email, password });
      
//       if (response.success) {
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//         return { success: true, data: response.data };
//       }
      
//       throw new Error('Login failed');
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await apiClient.get('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await apiClient.post('/auth/register', userData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
      
//       if (response.success) {
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//         return { success: true, data: response.data };
//       }
      
//       throw new Error('Registration failed');
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     logout,
//     register,
//     checkAuthStatus,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };














// // contexts/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// import apiClient from '../api/apiClient'; // Fixed import path

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check auth status on mount - wrapped in useCallback to prevent recreation
//   const checkAuthStatus = useCallback(async () => {
//     try {
//       console.log('Checking auth status...');
//       const response = await apiClient.get('/auth/me');
      
//       console.log('Auth check response:', response);
      
//       // Handle different response structures
//       if (response) {
//         // Case 1: { success: true, data: userObject }
//         if (response.success && response.data) {
//           setUser(response.data);
//           setIsAuthenticated(true);
//         }
//         // Case 2: { data: { user: {...} } }
//         else if (response.data?.user) {
//           setUser(response.data.user);
//           setIsAuthenticated(true);
//         }
//         // Case 3: { data: userObject }
//         else if (response.data) {
//           setUser(response.data);
//           setIsAuthenticated(true);
//         }
//         // Case 4: response itself is user object
//         else if (response._id || response.id) {
//           setUser(response);
//           setIsAuthenticated(true);
//         } else {
//           setUser(null);
//           setIsAuthenticated(false);
//         }
//       } else {
//         setUser(null);
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error.message);
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     checkAuthStatus();
    
//     // Listen for logout events
//     const handleLogout = () => {
//       setUser(null);
//       setIsAuthenticated(false);
//     };
    
//     window.addEventListener('auth:logout', handleLogout);
    
//     return () => {
//       window.removeEventListener('auth:logout', handleLogout);
//     };
//   }, [checkAuthStatus]);

//   const login = async (email, password) => {
//     try {
//       console.log('Attempting login...');
//       const response = await apiClient.post('/auth/login', { email, password });
      
//       console.log('Login response:', response);
      
//       // Extract user data from response
//       let userData = null;
      
//       if (response.success && response.data?.user) {
//         userData = response.data.user;
//       } else if (response.data?.user) {
//         userData = response.data.user;
//       } else if (response.data) {
//         userData = response.data;
//       } else if (response._id || response.id) {
//         userData = response;
//       }
      
//       if (userData) {
//         setUser(userData);
//         setIsAuthenticated(true);
        
//         // Double-check auth status to ensure cookie is working
//         await checkAuthStatus();
        
//         return { 
//           success: true, 
//           data: userData,
//           message: 'Login successful' 
//         };
//       }
      
//       throw new Error(response.message || 'Login failed - invalid response structure');
//     } catch (error) {
//       console.error('Login error details:', {
//         message: error.message,
//         status: error.status,
//         data: error.data,
//         validationErrors: error.validationErrors
//       });
      
//       return {
//         success: false,
//         message: error.message || 'Login failed',
//         validationErrors: error.validationErrors,
//         status: error.status
//       };
//     }
//   };

//   const logout = async () => {
//     try {
//       await apiClient.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//       setIsAuthenticated(false);
//       // Redirect to home or login page
//       window.location.href = '/auth';
//     }
//   };

//   const register = async (formData) => {
//     try {
//       console.log('Attempting registration...');
      
//       // Ensure formData is actually FormData
//       const dataToSend = formData instanceof FormData ? formData : (() => {
//         const fd = new FormData();
//         Object.keys(formData).forEach(key => {
//           if (formData[key] !== null && formData[key] !== undefined) {
//             fd.append(key, formData[key]);
//           }
//         });
//         return fd;
//       })();
      
//       const response = await apiClient.post('/auth/register', dataToSend);
      
//       console.log('Registration response:', response);
      
//       // Extract user data from response
//       let userData = null;
      
//       if (response.success && response.data?.user) {
//         userData = response.data.user;
//       } else if (response.data?.user) {
//         userData = response.data.user;
//       } else if (response.data) {
//         userData = response.data;
//       } else if (response._id || response.id) {
//         userData = response;
//       }
      
//       if (userData) {
//         setUser(userData);
//         setIsAuthenticated(true);
        
//         // Double-check auth status
//         await checkAuthStatus();
        
//         return { 
//           success: true, 
//           data: userData,
//           message: response.message || 'Registration successful' 
//         };
//       }
      
//       throw new Error(response.message || 'Registration failed - invalid response structure');
//     } catch (error) {
//       console.error('Registration error details:', {
//         message: error.message,
//         status: error.status,
//         data: error.data,
//         validationErrors: error.validationErrors
//       });
      
//       return {
//         success: false,
//         message: error.message || 'Registration failed',
//         validationErrors: error.validationErrors,
//         status: error.status
//       };
//     }
//   };

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     logout,
//     register,
//     checkAuthStatus,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };











// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ApiService from '../api/apiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await ApiService.auth.getMe();
      const data = response.data;
      if (data.success && (data.user || data.data)) {
      const userData = data.user || data.data;
      setUser(userData);
      setIsAuthenticated(true);
        // Store minimal user info for quick access (NO TOKEN)
        localStorage.setItem('user', JSON.stringify({
          id: userData.id || userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          profileImage: userData.profileImage
        }));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // const login = async (email, password) => {
  //   const response = await ApiService.auth.login({ email, password });
  //     const data = response.data;
  //     if (data.success && (data.user || data.data)) {
  //     const userData = data.user || data.data;
  //     setUser(userData);
  //     setIsAuthenticated(true);
  //     localStorage.setItem('user', JSON.stringify({
  //       id: userData.id || userData._id,
  //       firstName: userData.firstName,
  //       lastName: userData.lastName,
  //       email: userData.email,
  //       role: userData.role,
  //       profileImage: userData.profileImage
  //     }));
  //     return response;
  //   }
  //   throw new Error(response.message || 'Login failed');
  // };

  const login = async (email, password) => {
  // Login first
  const loginResponse = await ApiService.auth.login({
    email,
    password,
  });

  if (!loginResponse.data.success) {
    throw new Error(
      loginResponse.data.message || "Login failed"
    );
  }

  // Immediately fetch full profile
  const meResponse = await ApiService.auth.getMe();

  const meData = meResponse.data;

  if (meData.success && (meData.user || meData.data)) {
    const userData = meData.user || meData.data;

    setUser(userData);
    setIsAuthenticated(true);

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: userData.id || userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        profileImage: userData.profileImage,
      })
    );

    return userData;
  }

  throw new Error("Failed to load user profile");
};

  const logout = async () => {
    try {
      await ApiService.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      sessionStorage.clear();
    }
  };

  const register = async (formData) => {
    const response = await ApiService.auth.register(formData);
    const data = response.data;
      if (data.success && (data.user || data.data)) {
      const userData = data.user || data.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify({
        id: userData.id || userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        profileImage: userData.profileImage
      }));
      return response;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const updateProfile = async (profileData) => {
    const response = await ApiService.auth.updateProfile(profileData);
    const data = response.data;
    if (data.success && data.data) {
      const userData = data.user || data.data;
      setUser(prev => ({ ...prev, ...data.data }));
      localStorage.setItem('user', JSON.stringify({
        ...data.data,
        // id: data.data.id || data.data._id
        id: userData.id || userData._id,
      }));
      return response;
    }
    throw new Error(response.message || 'Profile update failed');
  };

  const updatePassword = async (currentPassword, newPassword) => {
    return ApiService.auth.updatePassword({ currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      register,
      updateProfile,
      updatePassword,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};