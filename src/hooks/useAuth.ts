import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) fetchProfile(session.user.id);
      else { setUser(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(id: string) {
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    if (data) setUser(data as User);
    setLoading(false);
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signup(email: string, password: string, displayName: string, role: 'gm' | 'player') {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    await supabase.from('users').insert({
      id: data.user.id, email, role, display_name: displayName,
    });

    if (role === 'player') {
      await supabase.from('player_state').insert({ player_id: data.user.id });
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return { user, loading, login, signup, logout };
}
