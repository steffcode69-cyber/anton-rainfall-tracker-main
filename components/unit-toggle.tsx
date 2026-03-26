"use client"

import { Button } from "@/components/ui/button"
import { type Unit } from "@/lib/types"

interface UnitToggleProps {
  unit: Unit
  onUnitChange: (unit: Unit) => void
}

export function UnitToggle({ unit, onUnitChange }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
      <Button
        variant={unit === 'mm' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onUnitChange('mm')}
        className="h-7 px-3 text-xs"
      >
        mm
      </Button>
      <Button
        variant={unit === 'in' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onUnitChange('in')}
        className="h-7 px-3 text-xs"
      >
        in
      </Button>
    </div>
  )
}
