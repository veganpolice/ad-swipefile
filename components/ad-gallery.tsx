"use client"

import { useState, useMemo, useEffect } from "react"
import { AdCard } from "@/components/ad-card"
import { AdFilterSidebar } from "@/components/ad-filter-sidebar"
import { AdDetailDialog } from "@/components/ad-detail-dialog"
import { fetchAds } from "@/lib/ads-service"
import type { Ad, FilterState } from "@/types/ad"

export function AdGallery() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    platform: [],
    status: "all",
    search: "",
    dateRange: { from: undefined, to: undefined },
    adType: [],
    durationRange: { min: 0, max: 365 },
    sortBy: "newest",
  })
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Fetch ads from Supabase
  useEffect(() => {
    async function loadAds() {
      try {
        setLoading(true)
        setError(null)
        const fetchedAds = await fetchAds()
        setAds(fetchedAds)
      } catch (err) {
        console.error('Error loading ads:', err)
        setError('Failed to load ads. Please check your Supabase configuration.')
      } finally {
        setLoading(false)
      }
    }

    loadAds()
  }, [])

  const filteredAds = useMemo(() => {
    const filtered = ads.filter((ad) => {
      // Platform filter
      if (filters.platform.length > 0 && !filters.platform.includes(ad.platform)) {
        return false
      }

      // Status filter
      if (filters.status !== "all" && ad.status !== filters.status) {
        return false
      }

      // Search filter - search in advertiser, headline, and description
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          ad.advertiser.toLowerCase().includes(searchLower) ||
          ad.headline?.toLowerCase().includes(searchLower) ||
          ad.description?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const adStart = new Date(ad.startDate)
        const adEnd = new Date(ad.endDate)

        if (filters.dateRange.from && adEnd < filters.dateRange.from) {
          return false
        }

        if (filters.dateRange.to && adStart > filters.dateRange.to) {
          return false
        }
      }

      // Ad type filter
      if (filters.adType.length > 0 && ad.adType && !filters.adType.includes(ad.adType)) {
        return false
      }

      // Duration range filter
      const duration = Math.ceil(
        (new Date(ad.endDate).getTime() - new Date(ad.startDate).getTime()) / (1000 * 60 * 60 * 24),
      )
      if (duration < filters.durationRange.min || duration > filters.durationRange.max) {
        return false
      }

      return true
    })

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case "oldest":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case "longest": {
          const durationA = new Date(a.endDate).getTime() - new Date(a.startDate).getTime()
          const durationB = new Date(b.endDate).getTime() - new Date(b.startDate).getTime()
          return durationB - durationA
        }
        default:
          return 0
      }
    })

    return filtered
  }, [ads, filters])

  const handleAdClick = (ad: Ad) => {
    setSelectedAd(ad)
    setDialogOpen(true)
  }

  return (
    <div className="flex h-screen">
      <AdFilterSidebar filters={filters} onFiltersChange={setFilters} />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-balance">Ad Swipefile</h1>
            <p className="text-muted-foreground text-lg">Browse and analyze competitor advertising campaigns</p>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading ads...' : `Showing ${filteredAds.length} of ${ads.length} ads`}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-lg">Loading ads from database...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <p className="text-muted-foreground">
                Make sure to set your Supabase environment variables in .env.local
              </p>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {ads.length === 0 ? 'No ads found in database' : 'No ads found matching your filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} onClick={() => handleAdClick(ad)} />
              ))}
            </div>
          )}

          <AdDetailDialog ad={selectedAd} open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
      </div>
    </div>
  )
}
