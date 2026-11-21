import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { routeTree } from './routeTree.gen'

/** Shared with every route through `context` (e.g. `context.queryClient` in loaders). */
export type RouterContext = {
  queryClient: QueryClient
}

export function getRouter() {
  // A new client per router: on the server that means one per request, so
  // cached data is never shared between users.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Treat fetched data as fresh for 30s before refetching in the background.
        staleTime: 30_000,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Let React Query decide what is stale; loaders always run and hit its cache.
    defaultPreloadStaleTime: 0,
  })

  // Wraps the app in <QueryClientProvider> and hands data fetched during
  // server rendering to the browser so it isn't fetched twice.
  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
