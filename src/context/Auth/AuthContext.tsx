import React from 'react';

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextProps | null>(null);
