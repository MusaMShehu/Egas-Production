// contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

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
  const [dashboardData, setDashboardData] = useState(null);

  const fetchUserData = async () => {
    try {
      // This would be your API call to get dashboard data
      // const response = await axios.get('/api/user/dashboard');
      // setDashboardData(response.data.data);
      // setUser(response.data.data.user);
      
      // For now, let's use mock data
      const mockData = {
        user: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123-456-7890',
          dob: '1990-01-01',
          gender: 'male',
          address: '123 Main St, City, Country',
          profilePic: '',
          walletBalance: 500
        },
        subscription: {
          active: true,
          type: 'Premium',
          product: 'Organic Milk',
          price: 549,
          nextDelivery: '2023-12-15',
          status: 'active'
        },
        recentOrders: [
          {
            id: 'ORD001',
            date: '2023-12-01',
            product: 'Organic Milk',
            quantity: 2,
            amount: 120,
            status: 'delivered',
            deliveryDate: '2023-12-02',
            tracking: 'TRK123456'
          },
          {
            id: 'ORD002',
            date: '2023-12-05',
            product: 'Buffalo Milk',
            quantity: 1,
            amount: 80,
            status: 'shipped',
            deliveryDate: '2023-12-06',
            tracking: 'TRK789012'
          }
        ],
        orderHistory: [
          {
            id: 'ORD001',
            date: '2023-12-01',
            product: 'Organic Milk',
            quantity: 2,
            amount: 120,
            status: 'delivered'
          },
          {
            id: 'ORD002',
            date: '2023-12-05',
            product: 'Buffalo Milk',
            quantity: 1,
            amount: 80,
            status: 'shipped'
          },
          {
            id: 'ORD003',
            date: '2023-11-28',
            product: 'Skimmed Milk',
            quantity: 3,
            amount: 150,
            status: 'delivered'
          }
        ],
        tickets: [
          {
            id: 'TKT001',
            subject: 'Delivery issue',
            category: 'delivery',
            status: 'open',
            date: '2023-12-03',
            lastUpdated: '2023-12-03',
            message: 'My delivery was late yesterday'
          }
        ]
      };
      
      setDashboardData(mockData);
      setUser(mockData.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const login = (userData) => {
    // In a real app, you would set the token and user data
    localStorage.setItem('token', 'mock-token');
    setUser(userData);
    fetchUserData();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDashboardData(null);
  };

  const value = {
    user,
    dashboardData,
    loading,
    login,
    logout,
    fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;