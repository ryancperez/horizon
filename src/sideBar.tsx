import { useEffect, useId, useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

import { mainNav, secondaryNav } from './navItems'
import type { NavItem } from './navItems'

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined icon ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}

export function MenuButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="icon-button" onClick={onClick} aria-label={label}>
      <Icon name="menu" />
    </button>
  )
}

export function Logo() {
  return (
    <Link to="/dashboard" className="logo" aria-label="Bagger Tools home">
      <span className="logo-mark" aria-hidden="true">
        B
      </span>
      <span className="logo-text">Bagger Tools</span>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Full guide (240px) — used when expanded and inside the drawer       */
/* ------------------------------------------------------------------ */

function GuideEntry({ item }: { item: NavItem }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const inSection = pathname === item.to || pathname.startsWith(item.to + '/')
  const [expanded, setExpanded] = useState(true)
  const listId = useId()

  // Re-open if it was collapsed and the user navigates into this section.
  useEffect(() => {
    if (inSection) setExpanded(true)
  }, [inSection])

  if (!item.children?.length) {
    return (
      <li>
        <Link to={item.to} className="guide-item">
          <Icon name={item.icon} />
          <span className="guide-label">{item.label}</span>
        </Link>
      </li>
    )
  }

  return (
    <li>
      {/* When collapsed, highlight the parent if a child page is open. */}
      <div className="guide-parent" data-child-active={!expanded && inSection ? '' : undefined}>
        <Link to={item.to} className="guide-item" activeOptions={{ exact: true }}>
          <Icon name={item.icon} />
          <span className="guide-label">{item.label}</span>
        </Link>
        <button
          type="button"
          className="guide-expand"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.label}`}
          onClick={() => setExpanded((v) => !v)}
        >
          <Icon name="expand_more" />
        </button>
      </div>
      <ul id={listId} className="guide-sublist" hidden={!expanded}>
        {item.children.map((child) => (
          <li key={child.to}>
            <Link to={child.to} className="guide-item guide-subitem" activeOptions={{ exact: true }}>
              <span className="guide-label">{child.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

function GuideSection({ items }: { items: NavItem[] }) {
  return (
    <ul className="guide-section">
      {items.map((item) => (
        <GuideEntry key={item.to} item={item} />
      ))}
    </ul>
  )
}

export function GuideFull() {
  return (
    <nav className="guide-full" aria-label="Main">
      <GuideSection items={mainNav} />
      <hr className="guide-divider" />
      <GuideSection items={secondaryNav} />
      <footer className="guide-footer">© {new Date().getFullYear()} Bagger Sports</footer>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Mini guide (72px) — icon above a small label                        */
/* ------------------------------------------------------------------ */

export function GuideMini() {
  return (
    <nav className="guide-mini" aria-label="Main">
      <ul>
        {[...mainNav, ...secondaryNav].map((item) => (
          <li key={item.to}>
            <Link to={item.to} className="mini-item">
              <Icon name={item.icon} />
              <span className="mini-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Drawer — overlays the page on narrower screens                      */
/* ------------------------------------------------------------------ */

export function GuideDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    panelRef.current?.querySelector<HTMLElement>('button, a')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} inert={!open}>
      <div className="drawer-scrim" onClick={onClose} />
      <div
        ref={panelRef}
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="header-start drawer-header">
          <MenuButton onClick={onClose} label="Close menu" />
          <Logo />
        </div>
        <GuideFull />
      </div>
    </div>
  )
}
