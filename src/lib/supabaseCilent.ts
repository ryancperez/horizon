import { createClient } from './supabase/client'

/**
 * Shared browser Supabase client for the app (sign out, queries from components).
 * Uses the same cookie-based client as the login flow so everything sees one session.
 * Don't use this in server functions; use createClient from './supabase/server' there.
 */
export const supabase = createClient()
