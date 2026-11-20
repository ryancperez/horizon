import { createFileRoute, redirect } from '@tanstack/react-router'

// "/" just sends people to the dashboard (which asks them to sign in first).
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})
