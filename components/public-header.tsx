"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { CloudRain } from "lucide-react"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-white">
            <CloudRain className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Rain Gauge</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
