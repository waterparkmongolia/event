import { useState, useCallback } from 'react';

export interface User {
  username: string;
  phone: string;
}

interface StoredUser {
  username: string;
  phone: string;
  password: string;
}

function getUsers(): StoredUser[] {
  const saved = localStorage.getItem('pb_users');
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem('pb_users', JSON.stringify(users));
}

function getCurrentUser(): User | null {
  const saved = localStorage.getItem('pb_current_user');
  return saved ? JSON.parse(saved) : null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getCurrentUser);

  const register = useCallback((username: string, phone: string, password: string): string | null => {
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return 'Энэ хэрэглэгчийн нэр аль хэдийн бүртгэлтэй байна.';
    }
    const newUser: StoredUser = { username, phone, password };
    saveUsers([...users, newUser]);
    const currentUser: User = { username, phone };
    localStorage.setItem('pb_current_user', JSON.stringify(currentUser));
    setUser(currentUser);
    return null;
  }, []);

  const login = useCallback((username: string, password: string): string | null => {
    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) {
      return 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.';
    }
    const currentUser: User = { username: found.username, phone: found.phone };
    localStorage.setItem('pb_current_user', JSON.stringify(currentUser));
    setUser(currentUser);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pb_current_user');
    setUser(null);
  }, []);

  return { user, register, login, logout };
}
