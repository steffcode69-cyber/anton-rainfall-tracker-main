"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { CloudRain, LogOut, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  email: string | null
  isAdmin: boolean
}

export function DashboardHeader({ email, isAdmin }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <CloudRain className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rain Gauge</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            {isAdmin && (
              <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">{email}</span>
          </div>
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleSignOut} className="border-primary/20 hover:bg-primary/10 hover:text-primary">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
