import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { PagePlaceholder } from '@/PagePlaceholder'
import { Icon } from '@/sideBar'
import { ordersKeys, ordersListQuery } from '@/queries/orders'
import type { OrderStatus } from '@/queries/orders'

type OrdersSearch = { q?: string; page?: number }

export const Route = createFileRoute('/_protected/orders')({
  // Search and page live in the URL (/orders?q=smith&page=2), so they survive
  // reloads and can be bookmarked or shared.
  validateSearch: (search: Record<string, unknown>): OrdersSearch => ({
    q: typeof search.q === 'string' && search.q ? search.q : undefined,
    page: Number(search.page) > 1 ? Math.floor(Number(search.page)) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  // Start fetching before the page renders (and during server rendering).
  // If the data is already cached and fresh, this returns immediately.
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(ordersListQuery(deps)),
  component: OrdersPage,
})

function OrdersPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()
  const { data, isFetching } = useSuspenseQuery(ordersListQuery(search))

  // Search box: update the URL 300ms after typing stops.
  const [text, setText] = useState(search.q ?? '')
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? '') !== text.trim()) {
        navigate({ search: { q: text.trim() || undefined }, replace: true })
      }
    }, 300)
    return () => clearTimeout(t)
  }, [text, search.q, navigate])

  const page = data.page
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize))
  const goToPage = (p: number) => navigate({ search: (s) => ({ ...s, page: p > 1 ? p : undefined }) })

  return (
    <>
      <PagePlaceholder title="Orders" />

      <div className="orders-toolbar">
        <label className="search-field">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search order #, customer or team"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Search orders"
          />
        </label>
        <button
          type="button"
          className="text-button"
          // Marks every orders query stale and refetches the one on screen.
          onClick={() => queryClient.invalidateQueries({ queryKey: ordersKeys.all })}
          disabled={isFetching}
        >
          <Icon name="refresh" />
          {isFetching ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className={`orders-table-wrap ${isFetching ? 'is-fetching' : ''}`}>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Team</th>
              <th>Status</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((o) => (
              <tr key={o.id}>
                <td className="mono">{o.orderNumber}</td>
                <td>{dateFmt.format(new Date(o.orderDate))}</td>
                <td>{o.customerName}</td>
                <td className="muted-cell">{o.team ?? '—'}</td>
                <td>
                  <span className={`status status-${o.status}`}>{STATUS_LABEL[o.status]}</span>
                </td>
                <td className="num">{moneyFmt.format(o.total)}</td>
              </tr>
            ))}
            {data.orders.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No orders match “{search.q}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <span className="muted">
          {data.total === 0
            ? '0 orders'
            : `${(page - 1) * data.pageSize + 1}–${Math.min(page * data.pageSize, data.total)} of ${data.total}`}
        </span>
        <button type="button" className="icon-button" onClick={() => goToPage(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <Icon name="chevron_left" />
        </button>
        <button type="button" className="icon-button" onClick={() => goToPage(page + 1)} disabled={page >= pageCount} aria-label="Next page">
          <Icon name="chevron_right" />
        </button>
      </div>
    </>
  )
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'New',
  in_production: 'In production',
  ready: 'Ready',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
}

const moneyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
