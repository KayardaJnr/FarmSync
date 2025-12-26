import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocFromCache } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const ref = doc(db, 'users', u.uid);
          let snap;
          try {
            snap = await getDoc(ref);
          } catch (err) {
            console.warn('getDoc failed, attempting cache fallback', err);
            try {
              snap = await getDocFromCache(ref);
            } catch (cacheErr) {
              console.error('Failed to fetch user role from cache', cacheErr);
            }
          }

          if (snap && snap.exists && snap.exists()) {
            const data = snap.data();
            setUserRole(data.role || 'user');
          } else {
            setUserRole('user');
          }
        } catch (err) {
          console.error('Failed to fetch user role', err);
          setUserRole('user');
        }
      } else {
        setUserRole('user');
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'sales-rep':
        return 'Sales Rep';
      case 'vet':
        return 'Veterinarian';
      case 'room-attendant':
        return 'Room Attendant';
      default:
        return role || 'User';
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider value={{ user, userRole, getRoleLabel, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
