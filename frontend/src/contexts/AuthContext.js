import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getUserData, updateUserData } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        // Load user data from Firestore
        const result = await getUserData(user.uid);
        if (result.success) {
          setUserData(result.data);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const saveUserData = async (data) => {
    if (currentUser) {
      const result = await updateUserData(currentUser.uid, data);
      if (result.success) {
        setUserData(prev => ({ ...prev, ...data }));
      }
      return result;
    }
    return { success: false, error: 'No user logged in' };
  };

  const value = {
    currentUser,
    userData,
    loading,
    saveUserData,
    setUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};