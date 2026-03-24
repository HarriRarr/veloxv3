import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lradskryalewrmczphfq.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYWRza3J5YWxld3JtY3pwaGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNTcyMTYsImV4cCI6MjA4OTczMzIxNn0.iNFCXxV_E4ovIqnbMph2xB0RBJB8lzRpcn5ycfVcT4E";

export function createClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookieOptions: {
        sameSite: 'none',
        secure: true
      }
    }
  )
}
