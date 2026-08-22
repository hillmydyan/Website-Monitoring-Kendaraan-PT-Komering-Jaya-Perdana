"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, TransportRequest, RequestStatus } from '@/lib/types';

export interface UserSession {
  username: string;
  name: string;
  role: Role;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string; // Stored in plain text ONLY for mock DB purposes
  name: string;
  role: Role;
  department?: string;
}

const DEFAULT_USERS: UserAccount[] = [
  { id: '1', username: 'employee', password: '123', name: 'Budi Santoso', role: 'EMPLOYEE', department: 'IT' },
  { id: '2', username: 'ga', password: '123', name: 'Agus (GA)', role: 'GA_PIC', department: 'HR & GA' },
  { id: '3', username: 'manager', password: '123', name: 'Ibu Ratna (Mgr)', role: 'MANAGER', department: 'HR & GA' },
  { id: '4', username: 'admin', password: '123', name: 'System Admin', role: 'ADMIN', department: 'IT' },
];

interface MockDBContextType {
  role: Role;
  setRole: (role: Role) => void;
  requests: TransportRequest[];
  addRequest: (req: Omit<TransportRequest, 'id' | 'status' | 'submitted_at'>) => void;
  updateRequestStatus: (id: string, status: RequestStatus, updates?: Partial<TransportRequest>) => void;
  deleteRequest: (id: string) => void;
  getRequestById: (id: string) => TransportRequest | undefined;
  
  // Auth additions
  currentUser: UserSession | null;
  isLoggedIn: boolean;
  isAuthLoaded: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  
  // User Management additions
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  deleteUser: (id: string) => void;
  changePassword: (id: string, newPassword: string) => void;
}

const MockDBContext = createContext<MockDBContextType | undefined>(undefined);

// Dummy Signatures for Auto-stamp
export const DUMMY_GA_SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='; // Replace with a real base64 stamp later if needed
export const DUMMY_MANAGER_SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('EMPLOYEE');
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('transport_requests');
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequests(JSON.parse(saved));
    }
    
    const savedUsers = localStorage.getItem('transport_users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      const migratedUsers = parsedUsers.map((u: UserAccount) => ({
        ...u,
        password: u.password || '123'
      }));
      setUsers(migratedUsers);
    } else {
      setUsers(DEFAULT_USERS);
    }
    
    const savedSession = localStorage.getItem('auth_session');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setCurrentUser(session);
      setRole(session.role);
    }
    setIsAuthLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isAuthLoaded) {
      localStorage.setItem('transport_requests', JSON.stringify(requests));
      localStorage.setItem('transport_users', JSON.stringify(users));
      if (currentUser) {
        localStorage.setItem('auth_session', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('auth_session');
      }
    }
  }, [requests, users, currentUser, isAuthLoaded]);

  const isLoggedIn = currentUser !== null;

  const login = (username: string, pass: string) => {
    const foundUser = users.find(u => u.username === username);

    // Dummy authentication logic: check plain text password
    if (foundUser && foundUser.password === pass) {
      const userSession = { username: foundUser.username, name: foundUser.name, role: foundUser.role };
      setCurrentUser(userSession);
      setRole(foundUser.role);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('EMPLOYEE'); // default fallback
  };

  const addRequest = (req: Omit<TransportRequest, 'id' | 'status' | 'submitted_at'>) => {
    const newReq: TransportRequest = {
      ...req,
      id: crypto.randomUUID(),
      status: 'PENDING_GA_REQUEST',
      submitted_at: new Date().toISOString(),
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const updateRequestStatus = (id: string, status: RequestStatus, updates?: Partial<TransportRequest>) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, ...updates, status };
      }
      return req;
    }));
  };

  const getRequestById = (id: string) => {
    return requests.find(req => req.id === id);
  };

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const addUser = (user: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...user,
      id: crypto.randomUUID(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (id: string) => {
    // Prevent deleting the main admin
    if (users.find(u => u.id === id)?.username === 'admin') return;
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const changePassword = (id: string, newPassword: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === id) {
        return { ...user, password: newPassword };
      }
      return user;
    }));
  };

  return (
    <MockDBContext.Provider value={{ 
      role, setRole, requests, addRequest, updateRequestStatus, deleteRequest, getRequestById,
      currentUser, isLoggedIn, isAuthLoaded, login, logout,
      users, addUser, deleteUser, changePassword
    }}>
      {children}
    </MockDBContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(MockDBContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
