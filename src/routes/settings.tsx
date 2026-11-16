import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '../PagePlaceholder'

export const Route = createFileRoute('/settings')({ component: SettingsPage })

function SettingsPage() {
  return <PagePlaceholder title="Settings" />
}
