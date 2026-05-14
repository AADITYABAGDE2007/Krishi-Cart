/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && savedUser.email) {
      setUser(savedUser);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Merge provided user data with existing user data or save to localStorage
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...savedUser, ...userData, ...user };
    setUser(updatedUser);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
