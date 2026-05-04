import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  phone: string;
}

// Read stored session from localStorage — synchronous, no network
function readStoredUser(): User | null {
  try {
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
  const [loading] = useState(false);

  // Only listen for SIGNED_OUT to clear user state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setUser(null);
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

    // Set user immediately after successful registration
    setUser({ id: data.user.id, username, phone });
    return null;
  }, []);

  const login = useCallback(async (
    username: string, password: string
  ): Promise<string | null> => {
    const email = `${username}@eventhub.app`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.';
    if (!data.user) return 'Нэвтрэхэд алдаа гарлаа.';

    // Try metadata first, then fetch profile from DB
    const meta = data.user.user_metadata;
    if (meta?.username) {
      setUser({ id: data.user.id, username: meta.username, phone: meta.phone ?? '' });
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, phone')
        .eq('id', data.user.id)
        .single();
      if (!profile) return 'Профайл олдсонгүй.';
      setUser({ id: data.user.id, username: profile.username, phone: profile.phone });
    }

    return null;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, loading, register, login, logout };
}
