import { createFileRoute, redirect } from '@tanstack/react-router'

// "/" just sends people to the dashboard.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})
