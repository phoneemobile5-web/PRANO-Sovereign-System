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

/**
 * @fileOverview المحرك السينابتي المركزي لنظام Gemma Core 2030.
 * يدير الربط الوراثي بين واجهة المستخدم وقاعدة بيانات Firebase.
 */

export interface ChatMessage {
  text: string;
  role: 'user' | 'model';
  feedback?: 'up' | 'down' | 'none';
  timestamp: number;
}

export interface AIProject {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: string;
  temperature: number;
  apiKeys: string[];
  externalAppId?: string;
  isSustainable?: boolean;
}

export function useWorkbenchStore() {
  const { user } = useUser();
  const db = useFirestore();

  // مراجع الربط السينابتي حسب المخطط المعماري 2030
  const userRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const chatRef = useMemo(() => (db && user ? doc(db, 'chatHistories', user.uid) : null), [db, user]);
  const promptsRef = useMemo(() => (db && user ? doc(db, 'customPrompts', user.uid) : null), [db, user]);

  const { data: userData, loading: userLoading } = useDoc(userRef);
  const { data: chatData, loading: chatLoading } = useDoc(chatRef);
  const { data: promptsData, loading: promptsLoading } = useDoc(promptsRef);

  const isLoaded = !userLoading && !chatLoading && !promptsLoading;

  // إضافة مخرج إدراكي لسجل الدردشة
  const addMessage = async (message: Omit<ChatMessage, 'timestamp'>) => {
    if (!chatRef) return;
    const newMessage = { ...message, timestamp: Date.now() };

    setDoc(chatRef, {
      messages: arrayUnion(newMessage),
      lastUpdated: Date.now()
    }, { merge: true })
    .catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: chatRef.path, operation: 'write', requestResourceData: newMessage
      }));
    });
  };

  // تفعيل مهمة أرضية جديدة
  const addProject = async (projectData: Omit<AIProject, 'id'>) => {
    if (!promptsRef) return;
    const id = Math.random().toString(36).substr(2, 9);
    const newProject = { ...projectData, id, isSustainable: true };

    setDoc(promptsRef, {
      prompts: arrayUnion(newProject)
    }, { merge: true })
    .catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: promptsRef.path, operation: 'write', requestResourceData: newProject
      }));
    });
    return newProject;
  };

  const updateProject = async (projectId: string, updatedData: Partial<AIProject>) => {
    if (!promptsRef || !promptsData) return;
    const updatedPrompts = (promptsData.prompts || []).map((p: AIProject) => 
      p.id === projectId ? { ...p, ...updatedData } : p
    );

    updateDoc(promptsRef, { prompts: updatedPrompts })
    .catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: promptsRef.path, operation: 'update', requestResourceData: updatedData
      }));
    });
  };

  const deleteProject = async (projectId: string) => {
    if (!promptsRef || !promptsData) return;
    const filteredPrompts = (promptsData.prompts || []).filter((p: AIProject) => p.id !== projectId);

    updateDoc(promptsRef, { prompts: filteredPrompts })
    .catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: promptsRef.path, operation: 'delete'
      }));
    });
  };

  useEffect(() => {
    if (user && userRef && !userLoading && !userData) {
      setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        lastLogin: Date.now(),
        avatar: user.photoURL,
        mission: "Earth Command 2030"
      }, { merge: true });
    }
  }, [user, userRef, userLoading, userData]);

  return {
    userProfile: userData,
    sessions: chatData?.messages || [],
    projects: (promptsData?.prompts as AIProject[]) || [],
    isLoaded,
    addMessage,
    addProject,
    updateProject,
    deleteProject
  };
}
