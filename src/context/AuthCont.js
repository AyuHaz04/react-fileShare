import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('user');

    if (stored === 'true' && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.username && parsedUser.email) {
          setIsLoggedIn(true);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData) => {
    if (userData?.username && userData?.email) {
      setIsLoggedIn(true);
      setUser(userData);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};