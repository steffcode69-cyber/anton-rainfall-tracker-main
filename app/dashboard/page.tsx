import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { RainfallForm } from "@/components/rainfall-form"
import { RainfallTable } from "@/components/rainfall-table"
import { RainfallStats } from "@/components/rainfall-stats"
import { RainfallChart } from "@/components/rainfall-chart"
import type { RainfallReading, Profile } from "@/lib/types"

// Only these emails can access the admin dashboard
const ADMIN_EMAILS = [
  'antonroets101@gmail.com',
  'steffcode69@gmail.com',
]

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/admin")
  }

  // Check if user is an authorized admin
  const isAuthorizedAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')
  
  if (!isAuthorizedAdmin) {
    // Sign out unauthorized users and redirect to home
    await supabase.auth.signOut()
    redirect("/")
  }

  // Get user profile to check admin status
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>()

  const isAdmin = profile?.role === "admin"

  // Get all rainfall readings
  const { data: readings } = await supabase
    .from("rainfall_readings")
    .select("*")
    .order("reading_date", { ascending: false })

  const rainfallReadings: RainfallReading[] = readings || []

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader email={user.email ?? null} isAdmin={isAdmin} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Stats Section */}
          <RainfallStats readings={rainfallReadings} />

          {/* Chart and Form/Table Section */}
          <div className="grid gap-8 lg:grid-cols-2">
            <RainfallChart readings={rainfallReadings} />
            
            <div className="flex flex-col gap-8">
              {/* Admin: Rainfall Input Form */}
              <RainfallForm />
              
              {/* Readings Table with delete capability */}
              <RainfallTable readings={rainfallReadings} isAdmin={true} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
