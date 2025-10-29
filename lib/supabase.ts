import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug logging for Vercel deployment
if (typeof window === 'undefined') {
  console.log('Server-side environment check:')
  console.log('SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  console.log('SUPABASE_URL value:', process.env.NEXT_PUBLIC_SUPABASE_URL)
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your schema
export interface Database {
  public: {
    Tables: {
      advertisers: {
        Row: {
          id: string
          platform_id: number
          name: string
          metadata: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          platform_id: number
          name: string
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform_id?: number
          name?: string
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      ads: {
        Row: {
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
        Insert: {
          id: string
          advertiser_id: string
          ad_type: string
          start_date: string
          end_date: string
          is_active: boolean
          total_active_time: number
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          advertiser_id?: string
          ad_type?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          total_active_time?: number
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      ad_creatives: {
        Row: {
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
        Insert: {
          id?: string
          ad_id: string
          creative_type: string
          content: string
          storage_path?: string | null
          width?: number | null
          height?: number | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          ad_id?: string
          creative_type?: string
          content?: string
          storage_path?: string | null
          width?: number | null
          height?: number | null
          metadata?: Record<string, any> | null
          created_at?: string
        }
      }
    }
  }
}
