import { useState } from 'react'

import { cn } from '@/lib/utils'
import { safeNextPath } from '@/lib/safe-next-path'
import { createClient } from '@/lib/supabase/client'

/** Where to go after signing in when the user didn't come from a specific page. */
const DEFAULT_NEXT = '/dashboard'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const next = new URLSearchParams(window.location.search).get('next')
      const { error } = await supabase.auth.signInWithOAuth({
        // Microsoft 365 / Entra ID. Supabase calls this provider "azure"; the
        // 'email' scope is required so Supabase receives the user's email.
        provider: 'azure',
        options: {
          scopes: 'email',
          redirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(safeNextPath(next, DEFAULT_NEXT))}`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="font-medium text-lg tracking-normal">Bagger Tools</CardTitle>
          <CardDescription>Sign in with your Bagger Sports Microsoft account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSocialLogin}>
            <div className="flex flex-col gap-6">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Continue with Microsoft'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
