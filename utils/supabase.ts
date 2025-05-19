import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';

// Define types for better type safety
export type { Session, User } from '@supabase/supabase-js';

// Get URL and Key from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anonymous Key');
}

// Custom storage implementation for React Native
class ReactNativeStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return window.localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }
}

// Rate limiting implementation
class RateLimiter {
  private lastRefresh: number = 0;
  private readonly minInterval: number = 1000; // Minimum 1 second between refreshes

  canRefresh(): boolean {
    const now = Date.now();
    if (now - this.lastRefresh >= this.minInterval) {
      this.lastRefresh = now;
      return true;
    }
    return false;
  }
}

const rateLimiter = new RateLimiter();

// Singleton instance
let supabase: SupabaseClient | null = null;

// Initialize the Supabase client
export async function createSupabaseClient() {
  if (supabase) {
    return supabase;
  }

  const storage = new ReactNativeStorage();

  const options = {
    auth: {
      storage,
      autoRefreshToken: false, // Disable automatic refresh
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
    global: {
      headers: {
        'X-Client-Info': 'art-sparker@1.0.0',
      },
    },
  };

  if (Platform.OS === 'web') {
    Object.assign(options, {
      headers: {
        'X-Client-Info': 'art-sparker@1.0.0',
      },
      auth: {
        ...options.auth,
        flowType: 'pkce',
      },
    });
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, options);

  // Custom token refresh handling
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'TOKEN_REFRESHED' || !session) return;

    const expiresAt = session.expires_at;
    if (!expiresAt) return;

    // Only refresh if token is close to expiring (within 5 minutes)
    const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
    if (expiresIn > 300) return;

    if (rateLimiter.canRefresh()) {
      try {
        await supabase.auth.refreshSession();
      } catch (error) {
        console.warn('Token refresh failed:', error);
      }
    }
  });

  return supabase;
}

// Get the initialized Supabase client
export async function getSupabaseClient() {
  if (!supabase) {
    return await createSupabaseClient();
  }
  return supabase;
}

// Clear all stored data
export async function clearStorage() {
  const storage = new ReactNativeStorage();
  if (Platform.OS === 'web') {
    window.localStorage.clear();
  } else {
    const keys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.user',
      'supabase.auth.expires',
    ];
    
    for (const key of keys) {
      await storage.removeItem(key);
    }
  }
}