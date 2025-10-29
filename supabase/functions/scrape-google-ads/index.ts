import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SERPAPI_KEY = Deno.env.get('SERPAPI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface GoogleAdCreative {
  advertiser_id: string
  advertiser: string
  ad_creative_id: string
  format: string
  image?: string
  width?: number
  height?: number
  first_shown: number
  last_shown: number
  details_link: string
}

serve(async (req) => {
  try {
    // Get advertiser IDs from request or use defaults
    const { advertiser_ids } = await req.json()
    const ids = advertiser_ids || ['AR17828074650563772417'] // Tesla as default
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    for (const advertiserId of ids) {
      console.log(`Scraping ads for advertiser: ${advertiserId}`)
      
      // Call SerpAPI
      const serpApiUrl = new URL('https://serpapi.com/search')
      serpApiUrl.searchParams.set('engine', 'google_ads_transparency_center')
      serpApiUrl.searchParams.set('advertiser_id', advertiserId)
      serpApiUrl.searchParams.set('region', '2840')
      serpApiUrl.searchParams.set('api_key', SERPAPI_KEY)
      
      const response = await fetch(serpApiUrl.toString())
      const data = await response.json()
      
      if (data.error) {
        console.error(`SerpAPI error: ${data.error}`)
        continue
      }
      
      const adCreatives: GoogleAdCreative[] = data.ad_creatives || []
      
      // Upsert advertiser
      await supabase.from('advertisers').upsert({
        id: advertiserId,
        platform_id: 1, // Google Ads
        name: adCreatives[0]?.advertiser || 'Unknown',
        updated_at: new Date().toISOString()
      })
      
      // Process each ad
      for (const ad of adCreatives) {
        const startDate = new Date(ad.first_shown * 1000)
        const endDate = new Date(ad.last_shown * 1000)
        const isActive = (Date.now() - ad.last_shown * 1000) < 7 * 24 * 60 * 60 * 1000
        
        // Upsert ad
        await supabase.from('ads').upsert({
          id: ad.ad_creative_id,
          advertiser_id: advertiserId,
          ad_type: ad.format,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_active: isActive,
          total_active_time: ad.last_shown - ad.first_shown,
          metadata: {
            details_link: ad.details_link
          },
          updated_at: new Date().toISOString()
        })
        
        // Download and store image if present
        if (ad.image) {
          try {
            const imageResponse = await fetch(ad.image)
            const imageBlob = await imageResponse.blob()
            
            const fileName = `google/${ad.ad_creative_id}.jpg`
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('ad-images')
              .upload(fileName, imageBlob, {
                contentType: 'image/jpeg',
                upsert: true
              })
            
            if (!uploadError) {
              const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/ad-images/${fileName}`
              
              // Insert creative record
              await supabase.from('ad_creatives').insert({
                ad_id: ad.ad_creative_id,
                creative_type: 'image',
                content: publicUrl,
                storage_path: fileName,
                width: ad.width,
                height: ad.height
              })
            }
          } catch (error) {
            console.error(`Failed to download image: ${error}`)
          }
        }
      }
      
      console.log(`Processed ${adCreatives.length} ads for ${advertiserId}`)
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Scraping completed' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})