import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { createClient } from '@/lib/supabase/server'
import { safeNextPath } from '@/lib/safe-next-path'

/**
 * OAuth callback (PKCE). Microsoft → Supabase → here with ?code=…&next=…
 * Exchanges the code for a session cookie, then sends the user on to `next`.
 *
 * Adapted from the block's routes/auth/oauth.ts. The file is named confirm.ts
 * because TanStack's file router derives the URL from the file name, and the
 * login form redirects to /auth/confirm.
 */
const confirmFn = createServerFn({ method: 'GET' })
  .validator((search: unknown) => {
    const params = (search && typeof search === 'object' ? search : {}) as Record<string, unknown>
    return {
      code: typeof params.code === 'string' ? params.code : undefined,
      next: typeof params.next === 'string' ? params.next : undefined,
      error: typeof params.error_description === 'string' ? params.error_description : undefined,
    }
  })
  .handler(async ({ data }) => {
    const request = getRequest()

    if (!request) {
      throw redirect({ to: '/auth/error', search: { error: 'No request' } })
    }

    // The provider (e.g. Microsoft) can send the user back with an error instead of a code.
    if (data.error) {
      throw redirect({ to: '/auth/error', search: { error: data.error } })
    }

    // Only allow same-origin paths (rejects "//evil.com" and absolute URLs).
    const next = safeNextPath(data.next, '/dashboard', new URL(request.url).origin)

    if (data.code) {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(data.code)

      if (!error) {
        throw redirect({ href: next })
      }
      throw redirect({ to: '/auth/error', search: { error: error.message } })
    }

    throw redirect({ to: '/auth/error', search: { error: 'No code found' } })
  })

export const Route = createFileRoute('/auth/confirm')({
  preload: false,
  loader: (opts) => confirmFn({ data: opts.location.search }),
})
