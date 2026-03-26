"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UnitToggle } from "@/components/unit-toggle"
import { type RainfallReading, type Unit, convertToInches } from "@/lib/types"
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  isWithinInterval,
  parseISO
} from "date-fns"
import { CalendarDays, Calendar, CalendarRange, TrendingUp } from "lucide-react"

interface RainfallStatsProps {
  readings: RainfallReading[]
}

export function RainfallStats({ readings }: RainfallStatsProps) {
  const [unit, setUnit] = useState<Unit>("mm")
  const now = new Date()

  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const yearStart = startOfYear(now)
  const yearEnd = endOfYear(now)

  const calculateTotal = (start: Date, end: Date) => {
    return readings
      .filter((reading) => {
        const date = parseISO(reading.reading_date)
        return isWithinInterval(date, { start, end })
      })
      .reduce((sum, reading) => sum + Number(reading.amount_mm), 0)
  }

  const weeklyTotal = calculateTotal(weekStart, weekEnd)
  const monthlyTotal = calculateTotal(monthStart, monthEnd)
  const yearlyTotal = calculateTotal(yearStart, yearEnd)
  const allTimeTotal = readings.reduce((sum, reading) => sum + Number(reading.amount_mm), 0)

  const formatAmount = (amountMm: number) => {
    if (unit === "in") {
      return `${convertToInches(amountMm).toFixed(2)}`
    }
    return `${amountMm.toFixed(2)}`
  }

  const stats = [
    {
      title: "This Week",
      value: formatAmount(weeklyTotal),
      icon: CalendarDays,
      description: "Weekly rainfall total",
    },
    {
      title: "This Month",
      value: formatAmount(monthlyTotal),
      icon: Calendar,
      description: "Monthly rainfall total",
    },
    {
      title: "This Year",
      value: formatAmount(yearlyTotal),
      icon: CalendarRange,
      description: "Yearly rainfall total",
    },
    {
      title: "All Time",
      value: formatAmount(allTimeTotal),
      icon: TrendingUp,
      description: "Total recorded rainfall",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rainfall Statistics</h2>
        <UnitToggle unit={unit} onUnitChange={setUnit} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  {unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
