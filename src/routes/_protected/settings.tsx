import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '@/PagePlaceholder'

export const Route = createFileRoute('/_protected/settings')({ component: SettingsPage })

function SettingsPage() {
  return <PagePlaceholder title="Settings" />
}
