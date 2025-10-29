export interface Ad {
  id: string
  imageUrl: string
  advertiser: string
  platform: "Google Ads" | "Meta Ads"
  startDate: string
  endDate: string
  status: "active" | "inactive"
  adType?: "image" | "video" | "text"
  images?: string[]
  headline?: string
  description?: string
  bodyText?: string
  callToAction?: string
  ctaLink?: string
  placement?: string
  firstSeen?: string
  lastSeen?: string
  transparencyUrl?: string
}

// Database types for Supabase
export interface Advertiser {
  id: string
  platform_id: number
  name: string
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface AdRecord {
  id: string
  advertiser_id: string
  ad_type: string
  start_date: string
  end_date: string
  is_active: boolean
  total_active_time: number
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface AdCreative {
  id: string
  ad_id: string
  creative_type: string
  content: string
  storage_path: string | null
  width: number | null
  height: number | null
  metadata: Record<string, any> | null
  created_at: string
}

export interface FilterState {
  platform: string[]
  status: string
  search: string
  dateRange: {
    from?: Date
    to?: Date
  }
  adType: string[]
  durationRange: {
    min: number
    max: number
  }
  sortBy: "newest" | "oldest" | "longest"
}
