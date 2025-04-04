import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('adminToken');
    return stored ? true : false;
  });

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setUser(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
