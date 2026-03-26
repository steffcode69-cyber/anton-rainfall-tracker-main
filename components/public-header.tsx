"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { CloudRain } from "lucide-react"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <CloudRain className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rain Gauge</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
