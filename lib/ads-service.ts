import { supabase } from './supabase'
import type { Ad, AdRecord, Advertiser, AdCreative } from '@/types/ad'

export async function fetchAds(): Promise<Ad[]> {
  try {
    console.log('Fetching ads from Supabase...')
    
    // Fetch ads with advertiser information
    const { data: adsData, error: adsError } = await supabase
      .from('ads')
      .select(`
        *,
        advertisers (
          id,
          name,
          platform_id
        )
      `)
      .order('created_at', { ascending: false })

    if (adsError) {
      console.error('Error fetching ads:', adsError)
      throw new Error(`Database error: ${adsError.message}`)
    }

    console.log('Fetched ads data:', adsData?.length || 0, 'records')

    // Fetch all creatives for the ads
    const adIds = adsData?.map(ad => ad.id) || []
    const { data: creativesData, error: creativesError } = await supabase
      .from('ad_creatives')
      .select('*')
      .in('ad_id', adIds)

    if (creativesError) {
      console.error('Error fetching creatives:', creativesError)
    }

    // Transform the data to match the Ad interface
    const ads: Ad[] = (adsData || []).map((ad: any) => {
      const advertiser = ad.advertisers
      const creatives = creativesData?.filter(c => c.ad_id === ad.id) || []
      
      // Get images from creatives
      const images = creatives
        .filter(c => c.creative_type === 'image')
        .map(c => c.content)
      
      // Get body text
      const bodyTextCreative = creatives.find(c => c.creative_type === 'body_text')
      const bodyText = bodyTextCreative?.content
      
      // Get CTA
      const ctaCreative = creatives.find(c => c.creative_type === 'cta')
      const callToAction = ctaCreative?.content
      
      // Determine platform
      const platform = advertiser?.platform_id === 1 ? 'Google Ads' : 'Meta Ads'
      
      // Get primary image (first image or placeholder)
      const imageUrl = images[0] || '/placeholder.jpg'
      
      return {
        id: ad.id,
        imageUrl,
        advertiser: advertiser?.name || 'Unknown',
        platform,
        startDate: ad.start_date,
        endDate: ad.end_date,
        status: ad.is_active ? 'active' : 'inactive',
        adType: ad.ad_type === 'image' ? 'image' : ad.ad_type === 'video' ? 'video' : 'text',
        images,
        headline: ad.metadata?.headline || '',
        description: ad.metadata?.description || '',
        bodyText,
        callToAction,
        ctaLink: ad.metadata?.cta_link || '',
        placement: ad.metadata?.placement || '',
        firstSeen: ad.start_date,
        lastSeen: ad.end_date,
        transparencyUrl: ad.metadata?.transparency_url || ad.metadata?.details_link || ''
      }
    })

    return ads
  } catch (error) {
    console.error('Error in fetchAds:', error)
    return []
  }
}

export async function fetchAdById(id: string): Promise<Ad | null> {
  try {
    const { data: adData, error: adError } = await supabase
      .from('ads')
      .select(`
        *,
        advertisers (
          id,
          name,
          platform_id
        )
      `)
      .eq('id', id)
      .single()

    if (adError || !adData) {
      console.error('Error fetching ad:', adError)
      return null
    }

    // Fetch creatives for this ad
    const { data: creativesData, error: creativesError } = await supabase
      .from('ad_creatives')
      .select('*')
      .eq('ad_id', id)

    if (creativesError) {
      console.error('Error fetching creatives:', creativesError)
    }

    const advertiser = adData.advertisers
    const creatives = creativesData || []
    
    // Get images from creatives
    const images = creatives
      .filter(c => c.creative_type === 'image')
      .map(c => c.content)
    
    // Get body text
    const bodyTextCreative = creatives.find(c => c.creative_type === 'body_text')
    const bodyText = bodyTextCreative?.content
    
    // Get CTA
    const ctaCreative = creatives.find(c => c.creative_type === 'cta')
    const callToAction = ctaCreative?.content
    
    // Determine platform
    const platform = advertiser?.platform_id === 1 ? 'Google Ads' : 'Meta Ads'
    
    // Get primary image (first image or placeholder)
    const imageUrl = images[0] || '/placeholder.jpg'
    
    return {
      id: adData.id,
      imageUrl,
      advertiser: advertiser?.name || 'Unknown',
      platform,
      startDate: adData.start_date,
      endDate: adData.end_date,
      status: adData.is_active ? 'active' : 'inactive',
      adType: adData.ad_type === 'image' ? 'image' : adData.ad_type === 'video' ? 'video' : 'text',
      images,
      headline: adData.metadata?.headline || '',
      description: adData.metadata?.description || '',
      bodyText,
      callToAction,
      ctaLink: adData.metadata?.cta_link || '',
      placement: adData.metadata?.placement || '',
      firstSeen: adData.start_date,
      lastSeen: adData.end_date,
      transparencyUrl: adData.metadata?.transparency_url || adData.metadata?.details_link || ''
    }
  } catch (error) {
    console.error('Error in fetchAdById:', error)
    return null
  }
}
