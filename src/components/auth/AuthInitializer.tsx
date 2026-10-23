'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useStore } from '@/lib/store';

export const AuthInitializer: React.FC = () => {
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    // 1. Initial session check
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user, session);
        }
      })
      .catch((err) => {
        console.warn('Initial auth session check notice:', err);
      });

    // 2. Listen to ongoing auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user, session);
      } else {
        setUser(null, null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return null;
};
