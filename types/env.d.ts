declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_OPENAI_API_KEY: string;
      EXPO_PUBLIC_ADMOB_APP_ID: string;
      EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID: string;
    }
  }
}

export {};