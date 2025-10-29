"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Building2 } from "lucide-react"
import Link from "next/link"
import type { Ad } from "@/types/ad"

interface AdCardProps {
  ad: Ad
  onClick?: () => void
}

function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function AdCard({ ad, onClick }: AdCardProps) {
  const duration = calculateDuration(ad.startDate, ad.endDate)
  const isActive = ad.status === "active"
  const advertiserId = ad.advertiser.toLowerCase().replace(/\s+/g, "-")

  return (
    <Card
      className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <img
          src={ad.imageUrl || "/placeholder.svg"}
          alt={`${ad.advertiser} advertisement`}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={isActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg leading-tight text-balance">{ad.advertiser}</h3>
          <Badge
            variant="outline"
            className={ad.platform === "Google Ads" ? "border-primary/50 text-primary" : "border-accent/50 text-accent"}
          >
            {ad.platform}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(ad.startDate)} - {formatDate(ad.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {isActive ? "Running for" : "Ran for"} {duration} days
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <Link href={`/advertiser/${advertiserId}`} onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
              <Building2 className="h-4 w-4" />
              View Advertiser Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
