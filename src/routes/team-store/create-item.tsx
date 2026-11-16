import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '../../PagePlaceholder'

export const Route = createFileRoute('/team-store/create-item')({ component: CreateTeamItemPage })

function CreateTeamItemPage() {
  return <PagePlaceholder title="Create New Team Item" />
}
