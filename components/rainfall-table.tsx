"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UnitToggle } from "@/components/unit-toggle"
import { type RainfallReading, type Unit, convertToInches } from "@/lib/types"
import { deleteRainfallReading } from "@/lib/actions"
import { Trash2, Droplets } from "lucide-react"
import { format } from "date-fns"

interface RainfallTableProps {
  readings: RainfallReading[]
  isAdmin: boolean
}

export function RainfallTable({ readings, isAdmin }: RainfallTableProps) {
  const [unit, setUnit] = useState<Unit>("mm")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteRainfallReading(id)
    setDeletingId(null)
  }

  const formatAmount = (amountMm: number) => {
    if (unit === "in") {
      return `${convertToInches(amountMm).toFixed(2)} in`
    }
    return `${Number(amountMm).toFixed(2)} mm`
  }

  return (
    <Card className="shadow-md border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-4 w-4 text-primary" />
              </div>
              Recent Readings
            </CardTitle>
            <CardDescription>
              Your recorded rainfall measurements
            </CardDescription>
          </div>
          <UnitToggle unit={unit} onUnitChange={setUnit} />
        </div>
      </CardHeader>
      <CardContent>
        {readings.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No readings recorded yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {isAdmin && <TableHead className="w-16"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {readings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>
                    {format(new Date(reading.reading_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatAmount(reading.amount_mm)}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reading.id)}
                        disabled={deletingId === reading.id}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
