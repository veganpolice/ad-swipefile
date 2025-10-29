"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, X, Search, SlidersHorizontal } from "lucide-react"
import { format } from "date-fns"
import type { FilterState } from "@/types/ad"
import { cn } from "@/lib/utils"

interface AdFilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function AdFilterSidebar({ filters, onFiltersChange }: AdFilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...localFilters, ...updates }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePlatformToggle = (platform: string) => {
    const currentPlatforms = localFilters.platform || []
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter((p) => p !== platform)
      : [...currentPlatforms, platform]
    updateFilters({ platform: newPlatforms })
  }

  const handleAdTypeToggle = (type: string) => {
    const currentTypes = localFilters.adType || []
    const newTypes = currentTypes.includes(type) ? currentTypes.filter((t) => t !== type) : [...currentTypes, type]
    updateFilters({ adType: newTypes })
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    updateFilters({ dateRange: range })
  }

  const clearDateRange = () => {
    updateFilters({ dateRange: { from: undefined, to: undefined } })
  }

  const handleDurationChange = (values: number[]) => {
    updateFilters({ durationRange: { min: values[0], max: values[1] } })
  }

  const handleReset = () => {
    const defaultFilters: FilterState = {
      platform: [],
      status: "all",
      search: "",
      dateRange: { from: undefined, to: undefined },
      adType: [],
      durationRange: { min: 0, max: 365 },
      sortBy: "newest",
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const hasDateRange = localFilters.dateRange?.from || localFilters.dateRange?.to
  const hasActiveFilters =
    localFilters.platform.length > 0 ||
    localFilters.status !== "all" ||
    localFilters.search !== "" ||
    hasDateRange ||
    localFilters.adType.length > 0 ||
    localFilters.durationRange.min > 0 ||
    localFilters.durationRange.max < 365

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs">
              Reset All
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Refine your ad search</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Text Search */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Search Content</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={localFilters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search ads, advertisers..."
                className="pl-9"
              />
            </div>
          </div>

          <Separator />

          {/* Platform Multi-Select */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Platforms</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="google-ads"
                  checked={localFilters.platform.includes("Google Ads")}
                  onCheckedChange={() => handlePlatformToggle("Google Ads")}
                />
                <label
                  htmlFor="google-ads"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Google Ads
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="meta-ads"
                  checked={localFilters.platform.includes("Meta Ads")}
                  onCheckedChange={() => handlePlatformToggle("Meta Ads")}
                />
                <label
                  htmlFor="meta-ads"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Meta Ads
                </label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <RadioGroup value={localFilters.status} onValueChange={(value) => updateFilters({ status: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label htmlFor="status-all" className="font-normal cursor-pointer">
                  All Status
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="status-active" />
                <Label htmlFor="status-active" className="font-normal cursor-pointer">
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inactive" id="status-inactive" />
                <Label htmlFor="status-inactive" className="font-normal cursor-pointer">
                  Inactive
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Ad Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ad Type</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-image"
                  checked={localFilters.adType.includes("image")}
                  onCheckedChange={() => handleAdTypeToggle("image")}
                />
                <label
                  htmlFor="type-image"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Image Ads
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-video"
                  checked={localFilters.adType.includes("video")}
                  onCheckedChange={() => handleAdTypeToggle("video")}
                />
                <label
                  htmlFor="type-video"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Video Ads
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-text"
                  checked={localFilters.adType.includes("text")}
                  onCheckedChange={() => handleAdTypeToggle("text")}
                />
                <label
                  htmlFor="type-text"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Text Ads
                </label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Range Picker */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !hasDateRange && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {hasDateRange ? (
                    <span className="flex-1 truncate text-xs">
                      {localFilters.dateRange.from ? format(localFilters.dateRange.from, "MMM dd, yyyy") : "Start"} -{" "}
                      {localFilters.dateRange.to ? format(localFilters.dateRange.to, "MMM dd, yyyy") : "End"}
                    </span>
                  ) : (
                    <span className="text-xs">Pick a date range</span>
                  )}
                  {hasDateRange && (
                    <X
                      className="ml-2 h-4 w-4 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearDateRange()
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: localFilters.dateRange?.from,
                    to: localFilters.dateRange?.to,
                  }}
                  onSelect={(range) =>
                    handleDateRangeChange({
                      from: range?.from,
                      to: range?.to,
                    })
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          {/* Duration Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Duration (days)</Label>
              <span className="text-xs text-muted-foreground">
                {localFilters.durationRange.min} - {localFilters.durationRange.max}
              </span>
            </div>
            <Slider
              min={0}
              max={365}
              step={1}
              value={[localFilters.durationRange.min, localFilters.durationRange.max]}
              onValueChange={handleDurationChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 days</span>
              <span>365 days</span>
            </div>
          </div>

          <Separator />

          {/* Sort Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <RadioGroup value={localFilters.sortBy} onValueChange={(value: any) => updateFilters({ sortBy: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="sort-newest" />
                <Label htmlFor="sort-newest" className="font-normal cursor-pointer">
                  Newest First
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oldest" id="sort-oldest" />
                <Label htmlFor="sort-oldest" className="font-normal cursor-pointer">
                  Oldest First
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="longest" id="sort-longest" />
                <Label htmlFor="sort-longest" className="font-normal cursor-pointer">
                  Longest Running
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
