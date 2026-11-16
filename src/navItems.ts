/**
 * Sidebar navigation config. Add, remove or reorder links here.
 * `icon` is a Material Symbols name: https://fonts.google.com/icons
 */
import type { LinkProps } from '@tanstack/react-router'

export type NavLeaf = {
  label: string
  /** Type-checked against the app's routes. */
  to: NonNullable<LinkProps['to']>
  icon: string
}

/** Sub-navigation link shown under its parent in the expanded sidebar. */
export type NavChild = Omit<NavLeaf, 'icon'>

export type NavItem = NavLeaf & {
  children?: NavChild[]
}

/** Main section (top of the sidebar). */
export const mainNav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { label: 'Orders', to: '/orders', icon: 'receipt_long' },
  {
    label: 'Team Store',
    to: '/team-store',
    icon: 'storefront',
    children: [
      { label: 'Create New Team Store', to: '/team-store/create' },
      { label: 'Create New Team Item', to: '/team-store/create-item' },
    ],
  },
]

/** Bottom section, separated by a divider (like YouTube's Settings group). */
export const secondaryNav: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: 'settings' },
]
