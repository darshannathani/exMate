import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuthState = (role) => {
    setUserRole(role);
    setIsAuthenticated(!!role);
  };

  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);