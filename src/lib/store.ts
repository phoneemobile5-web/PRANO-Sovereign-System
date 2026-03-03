
'use client';

import { useState, useEffect } from 'react';

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
  const [projects, setProjects] = useState<AIProject[]>([]);
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
    const savedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);

    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error('Failed to parse projects', e);
      }
    } else {
      // Default initial project
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
      setProjects([defaultProject]);
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify([defaultProject]));
    }

    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error('Failed to parse sessions', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveProjects = (newProjects: AIProject[]) => {
    setProjects(newProjects);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(newProjects));
  };

  const saveSessions = (newSessions: AISession[]) => {
    setSessions(newSessions);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(newSessions));
  };

  const addProject = (project: Omit<AIProject, 'id' | 'createdAt'>) => {
    const newProject: AIProject = {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    saveProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<AIProject>) => {
    const newProjects = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveProjects(newProjects);
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
    saveSessions(sessions.filter((s) => s.projectId !== id));
  };

  const addSession = (projectId: string, input: string, output: string) => {
    const newSession: AISession = {
      id: Math.random().toString(36).substr(2, 9),
      projectId,
      input,
      output,
      timestamp: Date.now(),
      isBookmarked: false,
    };
    saveSessions([newSession, ...sessions]);
    return newSession;
  };

  const toggleBookmark = (sessionId: string) => {
    const newSessions = sessions.map((s) =>
      s.id === sessionId ? { ...s, isBookmarked: !s.isBookmarked } : s
    );
    saveSessions(newSessions);
  };

  const deleteSession = (sessionId: string) => {
    saveSessions(sessions.filter((s) => s.id !== sessionId));
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
