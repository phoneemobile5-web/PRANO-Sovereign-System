
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

export interface AIProject {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: string;
  temperature: number;
  apiKeys: string[];
  externalAppId?: string;
}

export function useWorkbenchStore() {
  const { user } = useUser();
  const db = useFirestore();

  const userRef = useMemo(() => (db && user ? doc(db, 'users', user.uid) : null), [db, user]);
  const chatRef = useMemo(() => (db && user ? doc(db, 'chatHistories', user.uid) : null), [db, user]);
  const promptsRef = useMemo(() => (db && user ? doc(db, 'customPrompts', user.uid) : null), [db, user]);

  const { data: userData, loading: userLoading } = useDoc(userRef);
  const { data: chatData, loading: chatLoading } = useDoc(chatRef);
  const { data: promptsData, loading: promptsLoading } = useDoc(promptsRef);

  const isLoaded = !userLoading && !chatLoading && !promptsLoading;

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
        path: chatRef.path, operation: 'write', requestResourceData: newMessage
      }));
    }
  };

  const addProject = async (projectData: Omit<AIProject, 'id'>) => {
    if (!promptsRef) return;
    const id = Math.random().toString(36).substr(2, 9);
    const newProject = { ...projectData, id };

    try {
      await setDoc(promptsRef, {
        prompts: arrayUnion(newProject)
      }, { merge: true });
      return newProject;
    } catch (e) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: promptsRef.path, operation: 'write', requestResourceData: newProject
      }));
      return null;
    }
  };

  const updateProject = async (projectId: string, updatedData: Partial<AIProject>) => {
    if (!promptsRef || !promptsData) return;
    const updatedPrompts = (promptsData.prompts || []).map((p: AIProject) => 
      p.id === projectId ? { ...p, ...updatedData } : p
    );

    try {
      await updateDoc(promptsRef, { prompts: updatedPrompts });
    } catch (e) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: promptsRef.path, operation: 'update', requestResourceData: updatedData
      }));
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!promptsRef || !promptsData) return;
    const filteredPrompts = (promptsData.prompts || []).filter((p: AIProject) => p.id !== projectId);

    try {
      await updateDoc(promptsRef, { prompts: filteredPrompts });
    } catch (e) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: promptsRef.path, operation: 'update'
      }));
    }
  };

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
    projects: (promptsData?.prompts as AIProject[]) || [],
    isLoaded,
    addMessage,
    addProject,
    updateProject,
    deleteProject
  };
}
