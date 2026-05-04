import { useState, useCallback, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  phone: string;
}

// Try to build User from session metadata (instant, no network)
function userFromMeta(session: Session): User | null {
  const meta = session.user.user_metadata;
  if (!meta?.username) return null;
  return { id: session.user.id, username: meta.username, phone: meta.phone ?? '' };
}

// Fallback: fetch profile from DB (for accounts created before metadata was added)
async function fetchProfile(userId: string): Promise<User | null> {
  const { data } = await supabase
    .from('profiles')
    .select('username, phone')
    .eq('id', userId)
    .single();
  if (!data) return null;
  return { id: userId, username: data.username, phone: data.phone };
}

async function resolveUser(session: Session): Promise<User | null> {
  return userFromMeta(session) ?? await fetchProfile(session.user.id);
}

// Read stored session from localStorage synchronously (no network)
function readStoredUser(): User | null {
  try {
    // Supabase v2 stores session under this key
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) ?? '';
      if (!key.startsWith('sb-') || !key.endsWith('-auth-token')) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const u = parsed?.user ?? parsed?.session?.user;
      const meta = u?.user_metadata;
      if (meta?.username) {
        return { id: u.id, username: meta.username, phone: meta.phone ?? '' };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }
      if (!session) return;

      setLoading(true);
      const resolved = await resolveUser(session).catch(() => null);
      setUser(resolved);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const register = useCallback(async (
    username: string, phone: string, password: string
  ): Promise<string | null> => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) return 'Энэ хэрэглэгчийн нэр аль хэдийн бүртгэлтэй байна.';

    const email = `${username}@eventhub.app`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, phone } },
    });

    if (error) return error.message;
    if (!data.user) return 'Бүртгэл үүсгэхэд алдаа гарлаа.';

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, username, phone });

    if (profileError) return profileError.message;
    return null;
  }, []);

  const login = useCallback(async (
    username: string, password: string
  ): Promise<string | null> => {
    const email = `${username}@eventhub.app`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.';
    return null;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, loading, register, login, logout };
}
