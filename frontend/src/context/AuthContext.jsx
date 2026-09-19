import { useState, useEffect } from 'react';
import { AuthContext } from './createAuthContext';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (loginData) => {
    const { token: jwtToken, id, name, email, role, mustChangePassword } = loginData;
    const userData = { id, name, email, role, mustChangePassword: Boolean(mustChangePassword) };

    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);

    return userData;
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Register listener for 401 unauthorized events dispatched by axiosClient
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const value = {
    user,
    token,
    loading: false,
    login,
    updateUser,
    logout,
    isAuthenticated: Boolean(token && user),
    isEmployee: user?.role === 'EMPLOYEE',
    isManager: user?.role === 'MANAGER',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
