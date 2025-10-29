"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink } from "lucide-react"
import { AdDetailDialog } from "./ad-detail-dialog"
import type { Ad } from "@/types/ad"

interface AdvertiserAdsListProps {
  ads: Ad[]
}

export function AdvertiserAdsList({ ads }: AdvertiserAdsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)

  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = platformFilter === "all" || ad.platform === platformFilter
    const matchesStatus = statusFilter === "all" || ad.status === statusFilter

    return matchesSearch && matchesPlatform && matchesStatus
  })

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Ads</CardTitle>
              <CardDescription>Complete list of campaigns from this advertiser</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                onClick={() => setSelectedAd(ad)}
              >
                <img
                  src={ad.imageUrl || "/placeholder.svg"}
                  alt={ad.headline || "Ad"}
                  className="w-full sm:w-32 h-32 object-cover rounded-md"
                />

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-lg">{ad.headline || "Untitled Ad"}</h3>
                    <Badge
                      variant={ad.status === "active" ? "default" : "secondary"}
                      className={ad.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                    >
                      {ad.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-normal">
                      {ad.platform}
                    </Badge>
                    <span>•</span>
                    <span>
                      {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{calculateDuration(ad.startDate, ad.endDate)} days</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="self-start"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedAd(ad)
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {filteredAds.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No ads found matching your filters</div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedAd && (
        <AdDetailDialog ad={selectedAd} open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)} />
      )}
    </>
  )
}
