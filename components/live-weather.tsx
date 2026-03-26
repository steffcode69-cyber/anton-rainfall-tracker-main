"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudSun, 
  CloudFog,
  Wind,
  Droplets,
  CloudLightning,
  Moon,
  MapPin
} from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  description: string
  weatherCode: number
  isDay: boolean
  precipitation: number
  rain: number
}

interface MoonData {
  phase: string
  illumination: number
  moonrise: string
  moonset: string
}

interface LiveWeatherProps {
  latitude: number
  longitude: number
  locationName?: string
}

// Calculate moon phase based on date
function getMoonPhase(date: Date): MoonData {
  // Known new moon date for reference
  const knownNewMoon = new Date("2024-01-11T11:57:00Z")
  const lunarCycle = 29.53058867 // days
  
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  const currentCycleDay = daysSinceNewMoon % lunarCycle
  const normalizedPhase = currentCycleDay / lunarCycle
  
  // Calculate illumination (0-100%)
  const illumination = Math.round(Math.abs(Math.cos(normalizedPhase * 2 * Math.PI)) * 100)
  
  // Determine phase name
  let phase: string
  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) {
    phase = "New Moon"
  } else if (normalizedPhase < 0.22) {
    phase = "Waxing Crescent"
  } else if (normalizedPhase < 0.28) {
    phase = "First Quarter"
  } else if (normalizedPhase < 0.47) {
    phase = "Waxing Gibbous"
  } else if (normalizedPhase < 0.53) {
    phase = "Full Moon"
  } else if (normalizedPhase < 0.72) {
    phase = "Waning Gibbous"
  } else if (normalizedPhase < 0.78) {
    phase = "Last Quarter"
  } else {
    phase = "Waning Crescent"
  }
  
  // Approximate moonrise/moonset times (simplified)
  const moonriseHour = Math.round((normalizedPhase * 24 + 18) % 24)
  const moonsetHour = Math.round((normalizedPhase * 24 + 6) % 24)
  
  return {
    phase,
    illumination,
    moonrise: `${moonriseHour.toString().padStart(2, "0")}:00`,
    moonset: `${moonsetHour.toString().padStart(2, "0")}:00`,
  }
}

// Weather code to icon mapping based on WMO codes
function getWeatherIcon(code: number, isDay: boolean) {
  if (code === 0) {
    return isDay ? (
      <Sun className="h-12 w-12 text-amber-500 animate-pulse" />
    ) : (
      <Moon className="h-12 w-12 text-slate-300 animate-pulse" />
    )
  }
  if (code === 1 || code === 2) {
    return isDay ? (
      <CloudSun className="h-12 w-12 text-amber-400" />
    ) : (
      <div className="relative">
        <Cloud className="h-12 w-12 text-slate-400" />
        <Moon className="absolute -top-1 -right-1 h-5 w-5 text-slate-300" />
      </div>
    )
  }
  if (code === 3) return <Cloud className="h-12 w-12 text-slate-400" />
  if (code >= 45 && code <= 48) return <CloudFog className="h-12 w-12 text-slate-400" />
  if (code >= 51 && code <= 67) return <CloudRain className="h-12 w-12 text-blue-500 animate-bounce" style={{ animationDuration: "2s" }} />
  if (code >= 71 && code <= 77) return <CloudSnow className="h-12 w-12 text-sky-300" />
  if (code >= 80 && code <= 82) return <CloudRain className="h-12 w-12 text-blue-600 animate-bounce" style={{ animationDuration: "1.5s" }} />
  if (code >= 85 && code <= 86) return <CloudSnow className="h-12 w-12 text-sky-400" />
  if (code >= 95 && code <= 99) return <CloudLightning className="h-12 w-12 text-yellow-500 animate-pulse" />
  return <Cloud className="h-12 w-12 text-slate-400" />
}

// Check if weather code indicates rain
function isRaining(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)
}

// Weather code to description
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  }
  return descriptions[code] || "Unknown"
}

export function LiveWeather({ latitude, longitude, locationName = "Vanderbijlpark, Gauteng" }: LiveWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [moonData, setMoonData] = useState<MoonData | null>(null)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Update moon data when time changes (check once per hour)
  useEffect(() => {
    setMoonData(getMoonPhase(currentTime))
  }, [Math.floor(currentTime.getTime() / 3600000)])

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day,precipitation,rain&timezone=Africa/Johannesburg`
        )
        
        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }
        
        const data = await response.json()
        
        setWeather({
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
          description: getWeatherDescription(data.current.weather_code),
          isDay: data.current.is_day === 1,
          precipitation: data.current.precipitation || 0,
          rain: data.current.rain || 0,
        })
        setError(null)
      } catch (err) {
        setError("Unable to load weather")
        console.error("Weather fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [latitude, longitude])

  // Format time for South Africa timezone
  const formattedTime = currentTime.toLocaleTimeString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  const formattedDate = currentTime.toLocaleDateString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  if (loading) {
    return (
      <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">{error || "Weather unavailable"}</p>
        </CardContent>
      </Card>
    )
  }

  const raining = isRaining(weather.weatherCode)

  return (
    <Card className={`border-0 shadow-md overflow-hidden transition-colors ${
      weather.isDay 
        ? "bg-gradient-to-br from-sky-100 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/20" 
        : "bg-gradient-to-br from-slate-800 to-indigo-900 dark:from-slate-900 dark:to-indigo-950"
    }`}>
      <CardContent className="p-4">
        {/* Location and Time Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className={`h-3.5 w-3.5 ${weather.isDay ? "text-muted-foreground" : "text-slate-400"}`} />
            <span className={`text-xs font-medium ${weather.isDay ? "text-muted-foreground" : "text-slate-300"}`}>
              {locationName}
            </span>
          </div>
          <div className={`text-right ${weather.isDay ? "text-foreground" : "text-slate-200"}`}>
            <div className="text-lg font-bold tabular-nums">{formattedTime}</div>
            <div className={`text-xs ${weather.isDay ? "text-muted-foreground" : "text-slate-400"}`}>{formattedDate}</div>
          </div>
        </div>

        {/* Day/Night Indicator Animation */}
        <div className="relative mb-3">
          <div className={`absolute inset-0 rounded-lg transition-opacity ${
            weather.isDay ? "opacity-0" : "opacity-100"
          }`}>
            {/* Stars animation for night */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${(i * 17 + 5) % 100}%`,
                    top: `${(i * 23 + 10) % 80}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${1.5 + (i % 3) * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              {getWeatherIcon(weather.weatherCode, weather.isDay)}
              {/* Rain drops animation */}
              {raining && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.6s" }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${weather.isDay ? "text-foreground" : "text-slate-100"}`}>
                  {Math.round(weather.temperature)}°C
                </span>
              </div>
              <span className={`text-sm ${weather.isDay ? "text-muted-foreground" : "text-slate-300"}`}>
                {weather.description}
              </span>
              <div className={`mt-1 flex items-center gap-3 text-sm ${weather.isDay ? "text-muted-foreground" : "text-slate-400"}`}>
                <span className="flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5" />
                  {weather.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3.5 w-3.5" />
                  {Math.round(weather.windSpeed)} km/h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rain Info (shown when raining) */}
        {raining && weather.rain > 0 && (
          <div className={`mb-3 p-2 rounded-md ${
            weather.isDay ? "bg-blue-100 dark:bg-blue-900/30" : "bg-blue-900/40"
          }`}>
            <div className="flex items-center gap-2">
              <CloudRain className={`h-4 w-4 ${weather.isDay ? "text-blue-600" : "text-blue-400"}`} />
              <span className={`text-sm font-medium ${weather.isDay ? "text-blue-700 dark:text-blue-300" : "text-blue-300"}`}>
                Current rainfall: {weather.rain.toFixed(1)} mm
              </span>
            </div>
          </div>
        )}

        {/* Moon Info */}
        {moonData && (
          <div className={`pt-3 border-t ${weather.isDay ? "border-border/50" : "border-slate-700"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Moon className={`h-5 w-5 ${weather.isDay ? "text-slate-500" : "text-yellow-200"}`} />
                  {/* Moon illumination indicator */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `inset(0 ${100 - moonData.illumination}% 0 0)`,
                    }}
                  >
                    <Moon className={`h-5 w-5 ${weather.isDay ? "text-slate-300" : "text-yellow-100"}`} />
                  </div>
                </div>
                <div>
                  <span className={`text-xs font-medium ${weather.isDay ? "text-foreground" : "text-slate-200"}`}>
                    {moonData.phase}
                  </span>
                  <span className={`text-xs ml-2 ${weather.isDay ? "text-muted-foreground" : "text-slate-400"}`}>
                    {moonData.illumination}% illuminated
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Day/Night badge */}
        <div className="mt-3 flex justify-end">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
            weather.isDay 
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" 
              : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
          }`}>
            {weather.isDay ? (
              <>
                <Sun className="h-3 w-3" />
                Daytime
              </>
            ) : (
              <>
                <Moon className="h-3 w-3" />
                Nighttime
              </>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
