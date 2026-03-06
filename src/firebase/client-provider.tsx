'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Initialize Firebase ONLY on the client side inside useMemo
  const firebase = useMemo(() => {
    return initializeFirebase();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show a loading state during server-side rendering or before mounting
  if (!isMounted || !firebase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-primary font-bold animate-pulse tracking-widest">جاري تشغيل المختبر...</div>
        </div>
      </div>
    );
  }

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
