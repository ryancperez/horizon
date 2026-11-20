import type { Factor, User } from '@supabase/supabase-js'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { createClient } from '@/lib/supabase/server'

/**
 * Only accounts with this email domain may use Bagger Tools. Restricting the
 * Microsoft (Azure) provider to your own tenant in Supabase is the main
 * safeguard; this is a second check. Set to null to allow any account.
 */
export const ALLOWED_EMAIL_DOMAIN: string | null = 'baggersports.com'

type SSRSafeUser = User & {
  factors: (Factor & { factor_type: 'phone' | 'totp' })[]
}

/**
 * Returns the signed-in user (verified with Supabase), or null.
 * Signs out and redirects to /auth/error if the account isn't allowed.
 */
export const fetchUser: () => Promise<SSRSafeUser | null> = createServerFn({
  method: 'GET',
}).handler(async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  const domain = data.user.email?.split('@')[1]?.toLowerCase()
  if (ALLOWED_EMAIL_DOMAIN && domain !== ALLOWED_EMAIL_DOMAIN) {
    await supabase.auth.signOut({ scope: 'local' })
    throw redirect({
      to: '/auth/error',
      search: { error: `Only @${ALLOWED_EMAIL_DOMAIN} accounts can use Bagger Tools.` },
    })
  }

  return data.user as SSRSafeUser
})
