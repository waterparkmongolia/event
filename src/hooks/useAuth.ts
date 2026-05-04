import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  username: string;
  phone: string;
}

// Read session synchronously from localStorage — zero network, zero delay
function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(`sb-nqrqpenmoicijgatmpei-auth-token`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const u = parsed?.user ?? parsed?.session?.user;
    const meta = u?.user_metadata;
    if (!meta?.username) return null;
    return { id: u.id, username: meta.username, phone: meta.phone ?? '' };
  } catch {
    return null;
  }
}

export function useAuth() {
  // Initialize immediately from localStorage — no async, no loading screen
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [loading] = useState(false);

  useEffect(() => {
    // onAuthStateChange keeps state in sync after login/logout/token events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }
      if (session?.user?.user_metadata?.username) {
        const meta = session.user.user_metadata;
        setUser({ id: session.user.id, username: meta.username, phone: meta.phone ?? '' });
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
    setUser(null);
  }, []);

  return { user, loading, register, login, logout };
}
