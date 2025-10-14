import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // ✅ Memoized fetchProfile to prevent infinite re-renders
  const fetchProfile = useCallback(async (jwt) => {
    try {
      const res = await fetch("https://egas-server-1.onrender.com/api/v1/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();

      setUser(data.user);
      setToken(jwt);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error("Profile fetch failed:", err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, []); // ✅ empty dependency array

  // ✅ Login
  const login = async (email, password) => {
    const res = await fetch("https://egas-server-1.onrender.com/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  // ✅ Register
  const register = async (formData) => {
    const res = await fetch("https://egas-server-1.onrender.com/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      throw new Error(data.message || "Registration failed");
    }
  };

  // ✅ Logout (fully resets)
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  // ✅ Validate token on load (only once)
  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
