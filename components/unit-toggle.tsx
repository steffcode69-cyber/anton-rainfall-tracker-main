"use client"

import { Button } from "@/components/ui/button"
import { type Unit } from "@/lib/types"

interface UnitToggleProps {
  unit: Unit
  onUnitChange: (unit: Unit) => void
}

export function UnitToggle({ unit, onUnitChange }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-primary/20 bg-card p-1 shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onUnitChange('mm')}
        className={`h-7 px-3 text-xs ${unit === 'mm' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'hover:bg-primary/10'}`}
      >
        mm
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onUnitChange('in')}
        className={`h-7 px-3 text-xs ${unit === 'in' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'hover:bg-primary/10'}`}
      >
        in
      </Button>
    </div>
  )
}
