'use client';

import React, { createContext, useState, useEffect } from 'react';

export interface User {
  email: string;
  name?: string;
  profilePic?: string;
  user_role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialized: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  initialized: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('userEmail');
    const storedProfilePic = localStorage.getItem('profilePic');
    const storedUserRole = localStorage.getItem('userRole');

    console.log('Stored user data from localStorage:', {
      storedToken,
      storedEmail,
      storedProfilePic,
      storedUserRole,
    });

    // Only set user data if both token and email are available
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setUser({
        email: storedEmail,
        profilePic: storedProfilePic || '',
        user_role: storedUserRole || 'user',
      });
    }
    
    setInitialized(true); // Set initialized to true once everything is loaded
  }, []);

  const login = (userData: User, token: string) => {
    console.log('Logging in with user data:', userData);

    setUser({
      ...userData,
      profilePic: userData.profilePic || '',
      user_role: userData.user_role || 'user',
    });

    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('profilePic', userData.profilePic || '');
    localStorage.setItem('userRole', userData.user_role || 'user');

    console.log('Stored user data in localStorage:', {
      token: localStorage.getItem('token'),
      userEmail: localStorage.getItem('userEmail'),
      profilePic: localStorage.getItem('profilePic'),
      userRole: localStorage.getItem('userRole'),
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('profilePic');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};
