'use client';

import React, { useEffect, useState } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

/**
 * موزع خدمات Firebase لضمان التحميل في المتصفح فقط وتجنب أخطاء الهيدريشن
 */
export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [firebaseInstance, setFirebaseInstance] = useState<{
    firebaseApp: any;
    firestore: any;
    auth: any;
  } | null>(null);

  useEffect(() => {
    const instance = initializeFirebase();
    if (instance) {
      setFirebaseInstance(instance);
    }
  }, []);

  if (!firebaseInstance) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <div className="w-10 h-10 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-[#3b82f6] tracking-widest uppercase">جاري تشغيل المختبر...</p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebaseInstance.firebaseApp} 
      firestore={firebaseInstance.firestore} 
      auth={firebaseInstance.auth}
    >
      {children}
    </FirebaseProvider>
  );
};
