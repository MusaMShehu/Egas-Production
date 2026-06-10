import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import ApiService from "../api/apiService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
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
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: userData.id || userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role,
            profileImage: userData.profileImage,
          }),
        );
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
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
      localStorage.removeItem("user");
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = async (email, password) => {
    // Login first
    const loginResponse = await ApiService.auth.login({
      email,
      password,
    });

    if (!loginResponse.data.success) {
      throw new Error(loginResponse.data.message || "Login failed");
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
        }),
      );

      return {
        success: true,
        user: userData,
      };
    }

    throw new Error("Failed to load user profile");
  };

  const logout = async () => {
    try {
      await ApiService.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
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
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id || userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          profileImage: userData.profileImage,
        }),
      );
      return {
        success: true,
        user: userData,
      };
    }
    throw new Error(response.message || "Registration failed");
  };

  const updateProfile = async (profileData) => {
    const response = await ApiService.auth.updateProfile(profileData);
    const data = response.data;
    if (data.success && data.data) {
      const userData = data.user || data.data;
      setUser((prev) => ({ ...prev, ...data.data }));
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.data,
          // id: data.data.id || data.data._id
          id: userData.id || userData._id,
        }),
      );
      return response;
    }
    throw new Error(response.message || "Profile update failed");
  };

  const updatePassword = async (currentPassword, newPassword) => {
    return ApiService.auth.updatePassword({ currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        updateProfile,
        updatePassword,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
