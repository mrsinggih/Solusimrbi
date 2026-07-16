/**
 * Supabase client configuration with safe client fallback
 * Solusi Mr Bi - Scalable Client Architecture
 */

export const getSupabaseConfig = () => {
  const meta = import.meta as any;
  const supabaseUrl = meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

  return {
    supabaseUrl,
    supabaseAnonKey,
    isConfigured: !!meta.env.VITE_SUPABASE_URL,
  };
};

export const mockSupabaseAction = async <T>(actionName: string, mockData: T): Promise<T> => {
  console.log(`[Supabase Service Action: ${actionName}] - Simulating cloud persistence...`);
  return new Promise((resolve) => setTimeout(() => resolve(mockData), 400));
};
