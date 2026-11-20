/// <reference types="vite/client" />
import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser Supabase client. It keeps the session in cookies (not localStorage)
 * so the server can see who is signed in. createBrowserClient returns the same
 * instance on every call in the browser.
 */
export function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
  )
}
