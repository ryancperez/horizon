import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import type { User } from '@supabase/supabase-js'

import { AccountMenu } from './AccountMenu'

import { GuideDrawer, GuideFull, GuideMini, Logo, MenuButton } from './sideBar'
import { useMediaQuery } from './useMediaQuery'

// Same breakpoints YouTube uses for its guide.
const WIDE = '(min-width: 1313px)' // persistent sidebar, toggles full <-> mini
const MEDIUM = '(min-width: 792px)' // mini sidebar + overlay drawer
const STORAGE_KEY = 'bagger-tools:guide-open'

function readStoredOpen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

export function AppLayout({ children, user }: { children: ReactNode; user: User }) {
  const isWide = useMediaQuery(WIDE)
  const isMedium = useMediaQuery(MEDIUM)
  // Start expanded on the server, then apply the saved choice in the browser.
  const [guideOpen, setGuideOpen] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => setGuideOpen(readStoredOpen()), [])

  // Remember the expanded/collapsed choice, like YouTube does.
  const saveGuideOpen = useCallback((open: boolean) => {
    setGuideOpen(open)
    try {
      localStorage.setItem(STORAGE_KEY, String(open))
    } catch {
      /* storage unavailable */
    }
  }, [])

  // Close the overlay drawer after navigating or when the window gets wide.
  useEffect(() => setDrawerOpen(false), [pathname, isWide])

  const toggle = useCallback(() => {
    if (isWide) saveGuideOpen(!guideOpen)
    else setDrawerOpen((v) => !v)
  }, [isWide, guideOpen, saveGuideOpen])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const mode = isWide ? (guideOpen ? 'full' : 'mini') : isMedium ? 'mini' : 'none'

  return (
    <div className="app" data-guide={mode}>
      <header className="masthead">
        <div className="header-start">
          <MenuButton onClick={toggle} label="Toggle navigation" />
          <Logo />
        </div>
        <div className="header-end">
          <AccountMenu user={user} />
        </div>
      </header>

      {mode === 'full' && (
        <aside className="guide-persistent">
          <GuideFull />
        </aside>
      )}
      {mode === 'mini' && (
        <aside className="guide-persistent">
          <GuideMini />
        </aside>
      )}
      {!isWide && <GuideDrawer open={drawerOpen} onClose={closeDrawer} />}

      <main className="page">{children}</main>
    </div>
  )
}
