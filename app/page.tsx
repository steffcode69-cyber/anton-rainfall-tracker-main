import { createClient } from "@/lib/supabase/server"
import { PublicHeader } from "@/components/public-header"
import { RainfallStats } from "@/components/rainfall-stats"
import { RainfallChart } from "@/components/rainfall-chart"
import { RainfallTable } from "@/components/rainfall-table"
import type { RainfallReading } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()

  // Get all rainfall readings for public view
  const { data: readings } = await supabase
    .from("rainfall_readings")
    .select("*")
    .order("reading_date", { ascending: false })

  const rainfallReadings: RainfallReading[] = readings || []

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Rainfall Tracker
          </h1>
          <p className="mt-2 text-muted-foreground">
            View rainfall measurements and statistics
          </p>
        </div>
        
        <div className="flex flex-col gap-8">
          {/* Stats Section */}
          <RainfallStats readings={rainfallReadings} />

          {/* Chart and Table Section */}
          <div className="grid gap-8 lg:grid-cols-2">
            <RainfallChart readings={rainfallReadings} />
            
            {/* Readings Table - public view (no admin actions) */}
            <RainfallTable readings={rainfallReadings} isAdmin={false} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Rain Gauge App - Track your rainfall measurements
        </div>
      </footer>
    </div>
  )
}
