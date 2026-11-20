import { useEffect, useId, useRef, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import type { User } from '@supabase/supabase-js'

import { supabase } from './lib/supabaseCilent'
import { Icon } from './sideBar'

/** Avatar button in the top-right corner with the signed-in account and Sign out. */
export function AccountMenu({ user }: { user: User }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const name: string = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? 'Account'
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  // Close when clicking elsewhere or pressing Escape.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function signOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    await router.invalidate()
    await router.navigate({ to: '/login' })
  }

  return (
    <div className="account" ref={rootRef}>
      <button
        type="button"
        className="avatar-button"
        aria-label={`Account: ${name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="avatar" aria-hidden="true">
          {initial}
        </span>
      </button>

      {open && (
        <div className="account-menu" id={menuId} role="menu">
          <div className="account-header">
            <span className="avatar avatar-lg" aria-hidden="true">
              {initial}
            </span>
            <div className="account-names">
              <div className="account-name">{name}</div>
              {user.email && name !== user.email && <div className="account-email">{user.email}</div>}
            </div>
          </div>
          <hr className="guide-divider" />
          <button type="button" role="menuitem" className="menu-item" onClick={signOut} disabled={signingOut}>
            <Icon name="logout" />
            <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
