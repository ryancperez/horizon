import { createFileRoute } from '@tanstack/react-router'

import { PagePlaceholder } from '../PagePlaceholder'

export const Route = createFileRoute('/orders')({ component: OrdersPage })

function OrdersPage() {
  return <PagePlaceholder title="Orders" />
}
