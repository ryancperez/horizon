import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '#/PagePlaceholder'

export const Route = createFileRoute('/_protected/tools')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PagePlaceholder title="Tools" />
}
