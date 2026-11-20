import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginForm } from '@/components/login-form'
import { fetchUser } from '@/lib/supabase/fetch-user-server-fn'

export const Route = createFileRoute('/login')({
  // ?next=/orders — where to return after signing in (read by LoginForm).
  validateSearch: (search: Record<string, unknown>): { next?: string } =>
    typeof search.next === 'string' ? { next: search.next } : {},
  // Already signed in? Skip the login page.
  beforeLoad: async () => {
    if (await fetchUser()) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: Login,
})

function Login() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
