import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'

/** Server Supabase client: reads and refreshes the session from request cookies. */
export function createClient() {
  return createServerClient(
    // VITE_ vars are inlined at build time on the server too, so these work in
    // dev and in production builds; process.env is the fallback for hosts that
    // inject env vars at runtime.
    import.meta.env.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({ name, value: value ?? '' }))
        },
        setAll(cookies) {
          // Keep Supabase's cookie options (path, maxAge, sameSite, ...) so the
          // session cookie lives as long as it should.
          cookies.forEach(({ name, value, options }) => setCookie(name, value, options))
        },
      },
    },
  )
}
