export interface RainfallReading {
  id: string
  amount_mm: number
  reading_date: string
  created_at: string
  created_by: string | null
}

export interface Profile {
  id: string
  email: string | null
  role: 'user' | 'admin'
  created_at: string
}

export type Unit = 'mm' | 'in'

export const MM_TO_INCHES = 0.0393701
export const INCHES_TO_MM = 25.4

export function convertToInches(mm: number): number {
  return Number((mm * MM_TO_INCHES).toFixed(2))
}

export function convertToMm(inches: number): number {
  return Number((inches * INCHES_TO_MM).toFixed(2))
}

export function formatAmount(amount: number, unit: Unit): string {
  if (unit === 'in') {
    return `${convertToInches(amount).toFixed(2)} in`
  }
  return `${amount.toFixed(2)} mm`
}
