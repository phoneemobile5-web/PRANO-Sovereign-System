
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Firestore
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export interface AIProject {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  inputSchema: string;
  outputSchema: string;
  createdAt: number;
}

export interface AISession {
  id: string;
  projectId: string;
  input: string;
  output: string;
  timestamp: number;
  isBookmarked: boolean;
}

const STORAGE_KEY_PROJECTS = 'ai_workbench_projects';
const STORAGE_KEY_SESSIONS = 'ai_workbench_sessions';

export function useWorkbenchStore() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  
  // Local state as fallback
  const [localProjects, setLocalProjects] = useState<AIProject[]>([]);
  const [localSessions, setLocalSessions] = useState<AISession[]>([]);
  const [isLocalLoaded, setIsLocalLoaded] = useState(false);

  // Firestore queries
  const projectsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'projects'), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const sessionsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'sessions'), orderBy('timestamp', 'desc'));
  }, [db, user]);

  const { data: remoteProjects, loading: projectsLoading } = useCollection<AIProject>(projectsQuery);
  const { data: remoteSessions, loading: sessionsLoading } = useCollection<AISession>(sessionsQuery);

  // Load local data on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
    const savedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);

    if (savedProjects) {
      try { setLocalProjects(JSON.parse(savedProjects)); } catch (e) {}
    } else {
      const defaultProject: AIProject = {
        id: '1',
        name: 'My First AI Project',
        description: 'General purpose assistant',
        prompt: 'You are a helpful AI assistant.',
        model: 'gemini-1.5-flash',
        temperature: 0.7,
        topP: 0.95,
        maxTokens: 1024,
        inputSchema: '',
        outputSchema: '',
        createdAt: Date.now(),
      };
      setLocalProjects([defaultProject]);
    }

    if (savedSessions) {
      try { setLocalSessions(JSON.parse(savedSessions)); } catch (e) {}
    }
    setIsLocalLoaded(true);
  }, []);

  const projects = user ? (remoteProjects || []) : localProjects;
  const sessions = user ? (remoteSessions || []) : localSessions;
  const isLoaded = user ? (!projectsLoading && !sessionsLoading) : isLocalLoaded;

  const addProject = (project: Omit<AIProject, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newProject: AIProject = {
      ...project,
      id,
      createdAt: Date.now(),
    };

    if (user && db) {
      const docRef = doc(db, 'users', user.uid, 'projects', id);
      setDoc(docRef, newProject).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: newProject
        }));
      });
    } else {
      const updated = [...localProjects, newProject];
      setLocalProjects(updated);
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
    }
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<AIProject>) => {
    if (user && db) {
      const docRef = doc(db, 'users', user.uid, 'projects', id);
      setDoc(docRef, updates, { merge: true }).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updates
        }));
      });
    } else {
      const updated = localProjects.map((p) => (p.id === id ? { ...p, ...updates } : p));
      setLocalProjects(updated);
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
    }
  };

  const deleteProject = (id: string) => {
    if (user && db) {
      const docRef = doc(db, 'users', user.uid, 'projects', id);
      deleteDoc(docRef).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        }));
      });
    } else {
      const updated = localProjects.filter((p) => p.id !== id);
      setLocalProjects(updated);
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
    }
  };

  const addSession = (projectId: string, input: string, output: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newSession: AISession = {
      id,
      projectId,
      input,
      output,
      timestamp: Date.now(),
      isBookmarked: false,
    };

    if (user && db) {
      const docRef = doc(db, 'users', user.uid, 'sessions', id);
      setDoc(docRef, newSession).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: newSession
        }));
      });
    } else {
      const updated = [newSession, ...localSessions];
      setLocalSessions(updated);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    }
    return newSession;
  };

  const toggleBookmark = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    if (user && db) {
      const docRef = doc(db, 'users', user.uid, 'sessions', sessionId);
      setDoc(docRef, { isBookmarked: !session.isBookmarked }, { merge: true }).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update'
        }));
      });
    } else {
      const updated = localSessions.map((s) =>
        s.id === sessionId ? { ...s, isBookmarked: !s.isBookmarked } : s
      );
      setLocalSessions(updated);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    }
  };

  const deleteSession = (sessionId: string) => {
    if (user && db) {
      const docRef = doc(db, 'users', user.uid, 'sessions', sessionId);
      deleteDoc(docRef).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        }));
      });
    } else {
      const updated = localSessions.filter((s) => s.id !== sessionId);
      setLocalSessions(updated);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    }
  };

  return {
    projects,
    sessions,
    isLoaded,
    addProject,
    updateProject,
    deleteProject,
    addSession,
    toggleBookmark,
    deleteSession,
  };
}
