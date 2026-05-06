import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/apiConfig.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('fieldOpsUser');
    return userInfo ? JSON.parse(userInfo) : null;
  });

  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('fieldOpsUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const signup = async (name, email, password, role) => {
    const { data } = await axios.post('/api/users', { name, email, password, role });
    localStorage.setItem('fieldOpsUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fieldOpsUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
