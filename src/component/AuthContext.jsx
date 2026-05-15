// src/component/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  // console.log("User:", user);
  // console.log("Token:", token);
  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = async() => {
    
try {
const payload={
  user_id:user?.user_id
}
// console.log("post",payload)
  const res=await api.post("/user-logout",payload)
// console.log("get",res)
  if(res.status==200){
 setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
} catch (error) {
  console.log(error)
}

   
  };
console.log(user?.user_id)
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
