// import { useContext } from "react";
// import { useState } from "react";
// import { createContext, Navigate, useNavigate } from "react-router-dom";

// export const AppContext = createContext();

// export const AppContextProvider = ({children}) => {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null)
//     const [isAdmin, setIsAdmin] = useState(false)
//     const [showUserLogin, setShowUserLogin] = useState(false)

//     const value = {navigate, user, setUser, setIsAdmin, isAdmin, showUserLogin, setShowUserLogin}



//     return <AppContext.Provider value={value}>
//         {children}
//     </AppContext.Provider>
// }

// export const useAppContext = () => {
//     return useContext(AppContext)
// }


import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 🌐 Global Axios Defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://event-management-szqn.onrender.com/api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state for auth

  // 🔐 Initial Load: Check for token and load profile
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Set default header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get("/get-profile");

        if (response.data.success) {
          setUser(response.data.user);
          if (response.data.user.role === "admin") {
            setIsAdmin(true);
          }
        } else {
          // Token might be invalid
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAdmin(false);
    navigate("/");
  };

  const value = {
    navigate,
    user, setUser,
    isAdmin, setIsAdmin,
    showUserLogin, setShowUserLogin,
    loading,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
