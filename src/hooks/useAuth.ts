import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  phone: string;
}

async function fetchProfile(userId: string): Promise<User | null> {
  const { data } = await supabase
    .from('profiles')
    .select('username, phone')
    .eq('id', userId)
    .single();
  if (!data) return null;
  return { id: userId, username: data.username, phone: data.phone };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getSession() reads from localStorage — fast, no network needed
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }).catch(() => {
      setUser(null);
      setLoading(false);
    });

    // onAuthStateChange handles login/logout/token refresh after initial load
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return; // already handled by getSession above
      try {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
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
    const { data, error } = await supabase.auth.signUp({ email, password });

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
    setUser(null);
  }, []);

  return { user, loading, register, login, logout };
}
