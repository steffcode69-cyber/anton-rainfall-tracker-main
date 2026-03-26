'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CloudRain, Shield } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

// Only these emails can log in as admin
const ADMIN_EMAILS = [
  'antonroets101@gmail.com',
  'steffcode69@gmail.com',
]

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Check if email is in the admin list
    if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
      setError('Access denied. Only authorized administrators can access this.')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      if (isSignUp) {
        // Sign up new admin
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })
        if (error) throw error
        setSuccess('Account created! Check your email to confirm, then log in.')
        setIsSignUp(false)
      } else {
        // Log in existing admin
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <header className="flex items-center justify-between p-4 bg-card/80 backdrop-blur shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <CloudRain className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rain Gauge</span>
        </Link>
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">
                    {isSignUp ? 'Admin Sign Up' : 'Admin Login'}
                  </CardTitle>
                </div>
                <CardDescription>
                  {isSignUp 
                    ? 'Create your admin account (authorized emails only)'
                    : 'Authorized administrators only'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    {success && <p className="text-sm text-primary font-medium">{success}</p>}
                    <Button type="submit" className="w-full bg-primary hover:bg-[#078282] text-primary-foreground shadow-md" disabled={isLoading}>
                      {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                      {isLoading 
                        ? (isSignUp ? 'Creating account...' : 'Logging in...') 
                        : (isSignUp ? 'Create Account' : 'Login')
                      }
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        setIsSignUp(!isSignUp)
                        setError(null)
                        setSuccess(null)
                      }}
                    >
                      {isSignUp 
                        ? 'Already have an account? Login' 
                        : 'First time? Create account'
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/" className="underline underline-offset-4 hover:text-foreground">
                Back to public view
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
