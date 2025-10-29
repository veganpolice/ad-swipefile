import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SEARCHAPI_KEY = Deno.env.get('SEARCHAPI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const { page_ids } = await req.json()
    const ids = page_ids || ['80379486838'] // SNIPES USA as default
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    for (const pageId of ids) {
      console.log(`Scraping ads for page: ${pageId}`)
      
      // Call SearchAPI.io
      const searchApiUrl = new URL('https://www.searchapi.io/api/v1/search')
      searchApiUrl.searchParams.set('engine', 'meta_ad_library')
      searchApiUrl.searchParams.set('page_id', pageId)
      searchApiUrl.searchParams.set('active_status', 'all')
      searchApiUrl.searchParams.set('api_key', SEARCHAPI_KEY)
      
      const response = await fetch(searchApiUrl.toString())
      const data = await response.json()
      
      const ads = data.ads || []
      const pageInfo = data.search_information?.ad_library_page_info
      
      // Upsert advertiser
      if (pageInfo) {
        await supabase.from('advertisers').upsert({
          id: pageId,
          platform_id: 2, // Meta Ads
          name: pageInfo.page_name || 'Unknown',
          metadata: {
            page_verification: pageInfo.page_verification,
            likes: pageInfo.likes,
            ig_username: pageInfo.ig_username,
            ig_followers: pageInfo.ig_followers
          },
          updated_at: new Date().toISOString()
        })
      }
      
      // Process each ad
      for (const ad of ads) {
        const startDate = new Date(ad.start_date)
        const endDate = new Date(ad.end_date)
        
        // Upsert ad
        await supabase.from('ads').upsert({
          id: ad.ad_archive_id,
          advertiser_id: pageId,
          ad_type: ad.snapshot?.display_format || 'unknown',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_active: ad.is_active,
          total_active_time: ad.total_active_time,
          metadata: {
            publisher_platform: ad.publisher_platform,
            categories: ad.categories
          },
          updated_at: new Date().toISOString()
        })
        
        // Store ad body text
        const bodyText = ad.snapshot?.body?.text
        if (bodyText) {
          await supabase.from('ad_creatives').insert({
            ad_id: ad.ad_archive_id,
            creative_type: 'body_text',
            content: bodyText
          })
        }
        
        // Store CTA
        if (ad.snapshot?.cta_text) {
          await supabase.from('ad_creatives').insert({
            ad_id: ad.ad_archive_id,
            creative_type: 'cta',
            content: ad.snapshot.cta_text,
            metadata: { cta_type: ad.snapshot.cta_type }
          })
        }
        
        // Download and store images
        const images = ad.snapshot?.images || []
        for (let i = 0; i < images.length; i++) {
          const img = images[i]
          try {
            const imageResponse = await fetch(img.original_image_url)
            const imageBlob = await imageResponse.blob()
            
            const fileName = `meta/${ad.ad_archive_id}_${i}.jpg`
            const { error: uploadError } = await supabase.storage
              .from('ad-images')
              .upload(fileName, imageBlob, {
                contentType: 'image/jpeg',
                upsert: true
              })
            
            if (!uploadError) {
              const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/ad-images/${fileName}`
              
              await supabase.from('ad_creatives').insert({
                ad_id: ad.ad_archive_id,
                creative_type: 'image',
                content: publicUrl,
                storage_path: fileName
              })
            }
          } catch (error) {
            console.error(`Failed to download image: ${error}`)
          }
        }
      }
      
      console.log(`Processed ${ads.length} ads for page ${pageId}`)
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