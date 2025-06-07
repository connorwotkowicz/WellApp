'use client';

import { createContext, useContext } from "react";

interface AuthContextType {
  user: {
    profilePic?: string;
    user_role?: string;
  } | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
