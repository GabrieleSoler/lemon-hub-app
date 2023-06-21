import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    setToken(token);
  }

  useEffect(() => {
    getToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
