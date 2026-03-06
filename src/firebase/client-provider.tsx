
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  const firebase = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return initializeFirebase();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !firebase) return null;

  return (
    <FirebaseProvider 
      firebaseApp={firebase.firebaseApp} 
      firestore={firebase.firestore} 
      auth={firebase.auth}
    >
      {children}
    </FirebaseProvider>
  );
};
