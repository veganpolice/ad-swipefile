"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ExternalLink, ChevronLeft, ChevronRight, Bookmark, Download, Eye, EyeOff } from "lucide-react"
import type { Ad } from "@/types/ad"

interface AdDetailDialogProps {
  ad: Ad | null
  open: boolean
  onOpenChange: (open: boolean) => void
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
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function AdDetailDialog({ ad, open, onOpenChange }: AdDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!ad) return null

  const images = ad.images || [ad.imageUrl]
  const duration = calculateDuration(ad.startDate, ad.endDate)
  const isActive = ad.status === "active"
  const firstSeen = ad.firstSeen || ad.startDate
  const lastSeen = ad.lastSeen || ad.endDate

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleSaveToCollection = () => {
    // TODO: Implement save to collection functionality
    console.log("[v0] Save to collection:", ad.id)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("[v0] Export ad:", ad.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{ad.advertiser}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={
                    ad.platform === "Google Ads" ? "border-primary/50 text-primary" : "border-accent/50 text-accent"
                  }
                >
                  {ad.platform}
                </Badge>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={isActive ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}
                >
                  {isActive ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
                {ad.placement && (
                  <Badge variant="outline" className="text-muted-foreground">
                    {ad.placement}
                  </Badge>
                )}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveToCollection}>
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Image Carousel */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${ad.advertiser} advertisement ${currentImageIndex + 1}`}
              className="object-contain w-full h-full"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handlePreviousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Ad Copy Section */}
          {(ad.headline || ad.description || ad.bodyText) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Ad Copy</h3>
              {ad.headline && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Headline</p>
                  <p className="font-medium text-lg">{ad.headline}</p>
                </div>
              )}
              {ad.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-base">{ad.description}</p>
                </div>
              )}
              {ad.bodyText && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Body Text</p>
                  <p className="text-base leading-relaxed">{ad.bodyText}</p>
                </div>
              )}
            </div>
          )}

          {/* Call to Action */}
          {ad.callToAction && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Call to Action</h3>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-base px-4 py-2">
                  {ad.callToAction}
                </Badge>
                {ad.ctaLink && (
                  <a
                    href={ad.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View destination
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Timeline Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">First Seen</p>
                    <p className="font-medium">{formatDate(firstSeen)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Seen</p>
                    <p className="font-medium">{formatDate(lastSeen)}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                    <p className="font-medium">{duration} days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Campaign Period</p>
                    <p className="font-medium">
                      {formatDateShort(ad.startDate)} - {formatDateShort(ad.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Information */}
          {ad.transparencyUrl && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Platform Information</h3>
                <a
                  href={ad.transparencyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  View on {ad.platform} Ad Transparency
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
