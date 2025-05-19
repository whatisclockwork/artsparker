import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Session, 
  User, 
  getSupabaseClient,
  clearStorage
} from '@/utils/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signUp: async () => ({}),
  signIn: async () => ({}),
  signOut: async () => {},
  loading: true,
});

export const useSession = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        console.log('Setting up auth...');
        await clearStorage(); // Clear any existing session data
        const supabase = await getSupabaseClient();
        
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        console.log('Initial session check:', { currentSession, sessionError });
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log('Auth state changed:', { event, newSession });
            setSession(newSession);
            setUser(newSession?.user || null);
            setLoading(false);
          }
        );
        
        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in setupAuth:', error);
        setLoading(false);
      }
    };
    
    setupAuth();
  }, []);
  
  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting signup for:', email);
      const supabase = await getSupabaseClient();
      const result = await supabase.auth.signUp({
        email,
        password,
      });
      console.log('Signup result:', result);

      if (result.data?.session) {
        setSession(result.data.session);
        setUser(result.data.session.user);
      }

      return result;
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting signin for:', email);
      await clearStorage(); // Clear any existing session data
      const supabase = await getSupabaseClient();
      
      console.log('Supabase client initialized, attempting sign in...');
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in response:', {
        data: result.data,
        error: result.error,
        session: result.data?.session,
        user: result.data?.user
      });
      
      if (result.error) {
        console.error('Sign in error:', result.error);
        return result;
      }
      
      if (!result.data?.session) {
        console.error('No session returned after successful sign in');
        return { 
          error: new Error('No session returned'),
          data: result.data
        };
      }

      // Update local state with the new session
      setSession(result.data.session);
      setUser(result.data.session.user);
      
      return result;
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      console.log('Attempting sign out...');
      const supabase = await getSupabaseClient();
      await supabase.auth.signOut();
      await clearStorage();
      setSession(null);
      setUser(null);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};