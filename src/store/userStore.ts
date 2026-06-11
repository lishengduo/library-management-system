import { create } from 'zustand';
import type { User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface UserStore {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, email: string, password?: string, studentId?: string, role?: 'student' | 'teacher') => boolean;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,

  login: (email: string, _password: string) => {
    const user = mockUsers.find((u) => u.email === email);
    if (user) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
  },

  register: (username: string, email: string, _password?: string, studentId?: string, role?: 'student' | 'teacher') => {
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return false;
    }
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: role || 'student',
      studentId: studentId || Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ currentUser: newUser });
    return true;
  },
}));
