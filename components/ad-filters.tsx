"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import type { FilterState } from "@/types/ad"
import { cn } from "@/lib/utils"

interface AdFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function AdFilters({ filters, onFiltersChange }: AdFiltersProps) {
  const handlePlatformChange = (value: string) => {
    onFiltersChange({ ...filters, platform: value })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    onFiltersChange({ ...filters, dateRange: range })
  }

  const clearDateRange = () => {
    onFiltersChange({ ...filters, dateRange: { from: undefined, to: undefined } })
  }

  const hasDateRange = filters.dateRange.from || filters.dateRange.to

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Advertiser</Label>
          <Input
            id="search"
            placeholder="Search by name..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={filters.platform} onValueChange={handlePlatformChange}>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Google Ads">Google Ads</SelectItem>
              <SelectItem value="Meta Ads">Meta Ads</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !hasDateRange && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {hasDateRange ? (
                  <span className="flex-1 truncate">
                    {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd, yyyy") : "Start"} -{" "}
                    {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd, yyyy") : "End"}
                  </span>
                ) : (
                  <span>Pick a date range</span>
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
                  from: filters.dateRange.from,
                  to: filters.dateRange.to,
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
      </div>
    </div>
  )
}
