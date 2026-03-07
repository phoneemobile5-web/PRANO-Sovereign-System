
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp 
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export interface ChatMessage {
  text: string;
  role: 'user' | 'model';
  feedback?: 'up' | 'down' | 'none';
  timestamp: number;
}

export interface CustomPrompt {
  id: string;
  label: string;
  prompt: string;
  category: string;
  createdAt: number;
}

export function useWorkbenchStore() {
  const { user } = useUser();
  const db = useFirestore();

  // مراجع الوثائق بناءً على المخطط المعماري الجديد
  const userRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const chatRef = useMemo(() => (db && user ? doc(db, 'chatHistories', user.uid) : null), [db, user]);
  const promptsRef = useMemo(() => (db && user ? doc(db, 'customPrompts', user.uid) : null), [db, user]);

  const { data: userData, loading: userLoading } = useDoc(userRef);
  const { data: chatData, loading: chatLoading } = useDoc(chatRef);
  const { data: promptsData, loading: promptsLoading } = useDoc(promptsRef);

  const isLoaded = !userLoading && !chatLoading && !promptsLoading;

  // إضافة رسالة إلى سجل الربط السينابتي
  const addMessage = async (message: Omit<ChatMessage, 'timestamp'>) => {
    if (!chatRef) return;
    const newMessage = { ...message, timestamp: Date.now() };

    try {
      await setDoc(chatRef, {
        messages: arrayUnion(newMessage),
        lastUpdated: Date.now()
      }, { merge: true });
    } catch (e) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: chatRef.path, operation: 'update', requestResourceData: newMessage
      }));
    }
  };

  // إضافة أمر مخصص جديد (الچينيوم)
  const addPrompt = async (prompt: Omit<CustomPrompt, 'id' | 'createdAt'>) => {
    if (!promptsRef) return;
    const id = Math.random().toString(36).substr(2, 9);
    const newPrompt = { ...prompt, id, createdAt: Date.now() };

    try {
      await setDoc(promptsRef, {
        prompts: arrayUnion(newPrompt)
      }, { merge: true });
    } catch (e) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: promptsRef.path, operation: 'update', requestResourceData: newPrompt
      }));
    }
  };

  // تحديث بيانات المستخدم عند تسجيل الدخول
  useEffect(() => {
    if (user && userRef && !userLoading && !userData) {
      setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        lastLogin: Date.now(),
        avatar: user.photoURL
      }, { merge: true });
    }
  }, [user, userRef, userLoading, userData]);

  return {
    userProfile: userData,
    sessions: chatData?.messages || [],
    projects: promptsData?.prompts || [],
    isLoaded,
    addMessage,
    addPrompt
  };
}
