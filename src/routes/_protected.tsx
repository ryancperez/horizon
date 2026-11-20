import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { AppLayout } from '@/AppLayout'
import { fetchUser } from '@/lib/supabase/fetch-user-server-fn'

/**
 * Pathless layout: every route in routes/_protected/ requires a signed-in user
 * and is shown inside the sidebar layout.
 */
export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const user = await fetchUser()

    if (!user) {
      // Come back to the page they asked for after signing in.
      throw redirect({ to: '/login', search: { next: location.href } })
    }

    return { user }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { user } = Route.useRouteContext()
  return (
    <AppLayout user={user}>
      <Outlet />
    </AppLayout>
  )
}
