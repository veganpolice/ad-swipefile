import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Activity, Clock, TrendingUp } from "lucide-react"

interface AdvertiserMetricsProps {
  totalAds: number
  activeAds: number
  inactiveAds: number
  averageDuration: number
}

export function AdvertiserMetrics({ totalAds, activeAds, inactiveAds, averageDuration }: AdvertiserMetricsProps) {
  const activePercentage = ((activeAds / totalAds) * 100).toFixed(0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Ads</CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{totalAds}</div>
          <p className="text-xs text-muted-foreground mt-1">All time campaigns</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Ads</CardTitle>
          <Activity className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{activeAds}</div>
          <p className="text-xs text-muted-foreground mt-1">{activePercentage}% of total ads</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Ads</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{inactiveAds}</div>
          <p className="text-xs text-muted-foreground mt-1">Completed campaigns</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Duration</CardTitle>
          <Clock className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{averageDuration}</div>
          <p className="text-xs text-muted-foreground mt-1">Days per campaign</p>
        </CardContent>
      </Card>
    </div>
  )
}
