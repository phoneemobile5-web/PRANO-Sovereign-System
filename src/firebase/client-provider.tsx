
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  // التأكد من أن التهيئة تتم في المتصفح فقط
  const firebase = useMemo(() => {
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // شاشة تحميل بسيطة تناسب الهواتف القديمة
  if (!isMounted || !firebase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg"></div>
          <div className="space-y-2">
            <p className="text-lg font-black text-primary tracking-widest">مختبر الذكاء</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">جاري تهيئة النظام السحابي...</p>
          </div>
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
