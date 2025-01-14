import React, { createContext, useState, useContext, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from '../constants/collections';
import { useAuth } from '../contexts/AuthContext';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const { currentUser: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ('UserProvider - Auth User:', authUser);
    let unsubscribeFirestore = null;

    const setupUserDataListener = () => {
      if (!authUser?.uid) {
        ('UserProvider - No auth user uid');
        setUser(null);
        setLoading(false);
        return;
      }

      ('UserProvider - Setting up Firestore listener for:', authUser.uid);
      // Inscrever para atualizações do documento do usuário no Firestore
      const userDocRef = doc(db, COLLECTIONS.USERS, authUser.uid);
      unsubscribeFirestore = onSnapshot(
        userDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            ('UserProvider - User data from Firestore:', userData);
            setUser({
              ...authUser,
              ...userData,
              // Garantir que os campos numéricos existam mesmo que não estejam no Firestore
              points: userData.points || 0,
              frequence: userData.frequence || 0,
              distance: userData.distance || 0,
              displayName: userData.name || userData.displayName || 'Usuário',
              name: userData.name || userData.displayName || 'Usuário',
              photoURL: userData.photoURL || ''
            });
          } else {
            console.warn('UserProvider - User document not found:', authUser.uid);
            setUser(authUser);
          }
          setLoading(false);
        },
        (error) => {
          console.error('UserProvider - Error loading user data:', error);
          setUser(authUser);
          setLoading(false);
        }
      );
    };

    setupUserDataListener();

    return () => {
      ('UserProvider - Cleaning up Firestore listener');
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, [authUser]);

  const contextValue = {
    user,
    loading,
    setUser
  };

  ('UserProvider - Current context value:', contextValue);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
