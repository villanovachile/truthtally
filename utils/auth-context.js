import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/middlewares/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isSignedIn = user && !user.isAnonymous;

  const value = {
    user,
    isSignedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
