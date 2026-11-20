import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/PagePlaceholder'

export const Route = createFileRoute('/_protected/dashboard')({ component: DashboardPage })

function DashboardPage() {
  return <PagePlaceholder title="Dashboard" />
}
