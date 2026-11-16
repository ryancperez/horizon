import { Outlet, createRootRoute } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'material-symbols/outlined.css'
import '../styles.css'

import { AppLayout } from '../AppLayout'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="page-header">
      <h1>Page not found</h1>
      <p className="muted">That page doesn't exist.</p>
    </div>
  ),
})

function RootComponent() {
  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
