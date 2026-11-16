import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '../../PagePlaceholder'

export const Route = createFileRoute('/team-store/create')({ component: CreateTeamStorePage })

function CreateTeamStorePage() {
  return <PagePlaceholder title="Create New Team Store" />
}
