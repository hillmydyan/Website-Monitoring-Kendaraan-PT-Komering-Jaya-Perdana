"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, TransportRequest, RequestStatus } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export interface UserSession {
  username: string;
  name: string;
  role: Role;
  signature?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: Role;
  department?: string;
  signature?: string;
}

const DEFAULT_USERS: UserAccount[] = [
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
  
  currentUser: UserSession | null;
  isLoggedIn: boolean;
  isAuthLoaded: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  deleteUser: (id: string) => void;
  changePassword: (id: string, newPassword: string) => void;
  updateSignature: (signatureDataUrl: string) => void;
  loginAsEmployee: () => void;
}

const MockDBContext = createContext<MockDBContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('EMPLOYEE');
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedUsers } = await supabase.from('users').select('*');
        const { data: fetchedRequests } = await supabase.from('transport_requests').select('*').order('submitted_at', { ascending: false });
        
        let loadedUsers = fetchedUsers || [];
        if (loadedUsers.length === 0) {
          loadedUsers = DEFAULT_USERS;
          try {
             await supabase.from('users').insert(DEFAULT_USERS);
          } catch(e) {}
        }
        setUsers(loadedUsers);
        
        if (fetchedRequests) {
          setRequests(fetchedRequests);
        }

        const savedSession = localStorage.getItem('auth_session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          setCurrentUser(session);
          setRole(session.role);
        }
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
      } finally {
        setIsAuthLoaded(true);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthLoaded) {
      if (currentUser) {
        localStorage.setItem('auth_session', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('auth_session');
      }
    }
  }, [currentUser, isAuthLoaded]);

  const isLoggedIn = currentUser !== null;

  const login = (username: string, pass: string) => {
    const foundUser = users.find(u => u.username === username);
    if (foundUser && foundUser.password === pass) {
      const userSession = { 
        username: foundUser.username, 
        name: foundUser.name, 
        role: foundUser.role,
        signature: foundUser.signature
      };
      setCurrentUser(userSession);
      setRole(foundUser.role);
      return true;
    }
    return false;
  };

  const loginAsEmployee = () => {
    const guestSession: UserSession = {
      username: 'employee_guest',
      name: 'Karyawan',
      role: 'EMPLOYEE'
    };
    setCurrentUser(guestSession);
    setRole('EMPLOYEE');
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('EMPLOYEE');
  };

  const addRequest = async (req: Omit<TransportRequest, 'id' | 'status' | 'submitted_at'>) => {
    const newReq: TransportRequest = {
      ...req,
      id: crypto.randomUUID(),
      status: 'PENDING_GA_REQUEST',
      submitted_at: new Date().toISOString(),
    };
    setRequests(prev => [newReq, ...prev]);
    const { error } = await supabase.from('transport_requests').insert(newReq);
    if (error) {
      console.error("Supabase Error (addRequest):", error);
    }
  };

  const updateRequestStatus = async (id: string, status: RequestStatus, updates?: Partial<TransportRequest>) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, ...updates, status };
      }
      return req;
    }));
    const { error } = await supabase.from('transport_requests').update({ ...updates, status }).eq('id', id);
    if (error) {
      console.error("Supabase Error (updateRequestStatus):", error);
    }
  };

  const getRequestById = (id: string) => {
    return requests.find(req => req.id === id);
  };

  const deleteRequest = async (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    const { error } = await supabase.from('transport_requests').delete().eq('id', id);
    if (error) console.error("Supabase Error (deleteRequest):", error);
  };

  const addUser = async (user: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...user,
      id: crypto.randomUUID(),
    };
    setUsers(prev => [...prev, newUser]);
    const { error } = await supabase.from('users').insert(newUser);
    if (error) {
      console.error("Supabase Error (addUser):", error);
    }
  };

  const deleteUser = async (id: string) => {
    if (users.find(u => u.id === id)?.username === 'admin') return;
    setUsers(prev => prev.filter(user => user.id !== id));
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error("Supabase Error (deleteUser):", error);
  };

  const changePassword = async (id: string, newPassword: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === id) {
        return { ...user, password: newPassword };
      }
      return user;
    }));
    const { error } = await supabase.from('users').update({ password: newPassword }).eq('id', id);
    if (error) console.error("Supabase Error (changePassword):", error);
  };

  const updateSignature = async (signatureDataUrl: string) => {
    if (!currentUser) return;
    
    setUsers(prev => prev.map(user => {
      if (user.username === currentUser.username) {
        return { ...user, signature: signatureDataUrl };
      }
      return user;
    }));
    
    setCurrentUser(prev => prev ? { ...prev, signature: signatureDataUrl } : null);
    
    const { error } = await supabase.from('users').update({ signature: signatureDataUrl }).eq('username', currentUser.username);
    if (error) console.error("Supabase Error (updateSignature):", error);
  };

  return (
    <MockDBContext.Provider value={{ 
      role, setRole, requests, addRequest, updateRequestStatus, deleteRequest, getRequestById,
      currentUser, isLoggedIn, isAuthLoaded, login, logout, loginAsEmployee,
      users, addUser, deleteUser, changePassword, updateSignature
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
