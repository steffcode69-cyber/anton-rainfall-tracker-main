"use client"

import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UnitToggle } from "@/components/unit-toggle"
import { type RainfallReading, type Unit, convertToInches } from "@/lib/types"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { 
  format, 
  parseISO, 
  startOfMonth, 
  eachMonthOfInterval, 
  subMonths 
} from "date-fns"
import { BarChart3 } from "lucide-react"

interface RainfallChartProps {
  readings: RainfallReading[]
}

export function RainfallChart({ readings }: RainfallChartProps) {
  const [unit, setUnit] = useState<Unit>("mm")

  const chartData = useMemo(() => {
    const now = new Date()
    const months = eachMonthOfInterval({
      start: subMonths(startOfMonth(now), 11),
      end: startOfMonth(now),
    })

    return months.map((month) => {
      const monthStart = startOfMonth(month)
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

      const total = readings
        .filter((reading) => {
          const date = parseISO(reading.reading_date)
          return date >= monthStart && date <= monthEnd
        })
        .reduce((sum, reading) => sum + Number(reading.amount_mm), 0)

      const displayValue = unit === "in" ? convertToInches(total) : total

      return {
        month: format(month, "MMM"),
        fullMonth: format(month, "MMMM yyyy"),
        amount: Number(displayValue.toFixed(2)),
      }
    })
  }, [readings, unit])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-sky-500" />
              Monthly Rainfall
            </CardTitle>
            <CardDescription>Last 12 months of rainfall data</CardDescription>
          </div>
          <UnitToggle unit={unit} onUnitChange={setUnit} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="month"
                stroke="currentColor"
                strokeOpacity={0.3}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                strokeOpacity={0.3}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <p className="text-sm font-medium">
                          {payload[0].payload.fullMonth}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payload[0].value} {unit}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="amount"
                fill="hsl(199, 89%, 48%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
