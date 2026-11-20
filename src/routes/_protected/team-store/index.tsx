import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/PagePlaceholder'

export const Route = createFileRoute('/_protected/team-store/')({ component: TeamStorePage })

function TeamStorePage() {
  return <PagePlaceholder title="Team Store" />
}
