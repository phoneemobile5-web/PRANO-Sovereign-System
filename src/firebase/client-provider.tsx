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

  // نستخدم نفس واجهة التحميل الموجودة في الصفحة الرئيسية لضمان تطابق الهيدريشن
  if (!firebaseInstance) {
    return (
      <div className="min-h-screen bg-[#001a1a] flex items-center justify-center p-6 text-center font-body" dir="rtl">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-black text-primary tracking-widest uppercase">جاري استحضار Gemma Core 2030...</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Initial Synaptic Sync</p>
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
