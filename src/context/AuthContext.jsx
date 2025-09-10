import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (user, jwt) => {
    setUser(user);
    setToken(jwt);
    localStorage.setItem("token", jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = { user, token, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
