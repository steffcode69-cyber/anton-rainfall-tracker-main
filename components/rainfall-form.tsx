"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addRainfallReading } from "@/lib/actions"
import { type Unit } from "@/lib/types"
import { CloudRain, Plus } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export function RainfallForm() {
  const [amount, setAmount] = useState("")
  const [unit, setUnit] = useState<Unit>("mm")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append("amount", amount)
    formData.append("unit", unit)
    formData.append("date", date)

    const result = await addRainfallReading(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setAmount("")
      setTimeout(() => setSuccess(false), 3000)
    }

    setIsLoading(false)
  }

  return (
    <Card className="shadow-md border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <CloudRain className="h-4 w-4 text-primary" />
          </div>
          Add Rainfall Reading
        </CardTitle>
        <CardDescription>
          Record a new rainfall measurement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="w-24">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">mm</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm text-primary font-medium">
              Reading added successfully!
            </p>
          )}
          <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-[#078282] text-primary-foreground shadow-md">
            {isLoading ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Adding..." : "Add Reading"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
