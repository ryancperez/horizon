import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

/**
 * Orders data for the Orders page.
 *
 * Pattern used everywhere in the app:
 *   1. a server function that fetches the data (runs only on the server, so
 *      database credentials and API keys never reach the browser)
 *   2. a `queryOptions` factory that names the data (query key) and says how
 *      to fetch it, used by both route loaders and components
 *
 * TODO: getOrders returns sample data until the orders table exists in
 * Supabase. Swap the body for a Supabase query (see the comment inside).
 */

export type OrderStatus = 'new' | 'in_production' | 'ready' | 'shipped' | 'cancelled'

export type OrderSummary = {
  id: number
  orderNumber: string
  customerName: string
  team: string | null
  status: OrderStatus
  total: number
  orderDate: string // ISO date
}

export type OrdersPage = {
  orders: OrderSummary[]
  total: number
  page: number
  pageSize: number
}

export type OrdersFilters = {
  q?: string
  page?: number
}

export const ORDERS_PAGE_SIZE = 25

export const getOrders = createServerFn({ method: 'GET' })
  .validator((input: unknown): Required<OrdersFilters> => {
    const { q, page } = (input ?? {}) as OrdersFilters
    return {
      q: typeof q === 'string' ? q.trim() : '',
      page: typeof page === 'number' && page > 0 ? Math.floor(page) : 1,
    }
  })
  .handler(async ({ data }): Promise<OrdersPage> => {
    const { q, page } = data
    const from = (page - 1) * ORDERS_PAGE_SIZE

    /*
     * With Supabase this becomes something like:
     *
     *   const supabase = createClient() // from '@/lib/supabase/server'
     *   let query = supabase
     *     .from('orders')
     *     .select('id, order_number, customer_first_name, customer_last_name, status, total, order_date, team_stores(name)', { count: 'exact' })
     *     .order('order_date', { ascending: false })
     *     .range(from, from + ORDERS_PAGE_SIZE - 1)
     *   if (q) query = query.or(`order_number.ilike.%${q}%,customer_last_name.ilike.%${q}%`)
     *   const { data, count, error } = await query
     */
    await new Promise((r) => setTimeout(r, 300)) // pretend network/database time

    const needle = q.toLowerCase()
    const matches = SAMPLE_ORDERS.filter(
      (o) =>
        !needle ||
        o.orderNumber.toLowerCase().includes(needle) ||
        o.customerName.toLowerCase().includes(needle) ||
        o.team?.toLowerCase().includes(needle),
    )

    return {
      orders: matches.slice(from, from + ORDERS_PAGE_SIZE),
      total: matches.length,
      page,
      pageSize: ORDERS_PAGE_SIZE,
    }
  })

/** Query keys for orders. Invalidate `ordersKeys.all` to refresh every orders query. */
export const ordersKeys = {
  all: ['orders'] as const,
  list: (filters: Required<OrdersFilters>) => [...ordersKeys.all, 'list', filters] as const,
}

export function ordersListQuery(filters: OrdersFilters) {
  const normalized = { q: filters.q ?? '', page: filters.page ?? 1 }
  return queryOptions({
    queryKey: ordersKeys.list(normalized),
    queryFn: () => getOrders({ data: normalized }),
    // Keep showing the current page while the next page or search loads.
    placeholderData: keepPreviousData,
  })
}

/* ------------------------------------------------------------------ */
/* Sample data (remove once Supabase is wired up)                      */
/* ------------------------------------------------------------------ */

const FIRST = ['Ava', 'Liam', 'Mia', 'Noah', 'Emma', 'Lucas', 'Sofia', 'Ethan', 'Chloe', 'Mason', 'Isla', 'Logan']
const LAST = ['Garcia', 'Nguyen', 'Smith', 'Patel', 'Johnson', 'Lopez', 'Kim', 'Brown', 'Davis', 'Martinez', 'Lee']
const TEAMS = ['Lincoln HS Baseball', 'Westview Softball', 'Mesa Little League', 'Valley Club Soccer', null]
const STATUSES: OrderStatus[] = ['new', 'new', 'in_production', 'ready', 'shipped', 'shipped', 'cancelled']

const SAMPLE_ORDERS: OrderSummary[] = Array.from({ length: 57 }, (_, i) => {
  const day = new Date(Date.UTC(2026, 10, 19) - i * 0.6 * 86_400_000)
  return {
    id: 1000 + i,
    orderNumber: `BS-${String(24_180 - i).padStart(5, '0')}`,
    customerName: `${FIRST[(i * 7) % FIRST.length]} ${LAST[(i * 5) % LAST.length]}`,
    team: TEAMS[(i * 3) % TEAMS.length],
    status: STATUSES[(i * 5) % STATUSES.length],
    total: Math.round((35 + ((i * 37) % 420) + ((i * 13) % 100) / 100) * 100) / 100,
    orderDate: day.toISOString(),
  }
})
