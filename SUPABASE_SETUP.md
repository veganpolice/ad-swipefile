# Supabase Setup Instructions

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can find these values in your Supabase project dashboard under Settings > API.

## 2. Database Schema

Your database should have the following tables:

### `advertisers` table
- `id` (text, primary key)
- `platform_id` (integer) - 1 for Google Ads, 2 for Meta Ads
- `name` (text)
- `metadata` (jsonb, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `ads` table
- `id` (text, primary key)
- `advertiser_id` (text, foreign key to advertisers.id)
- `ad_type` (text)
- `start_date` (timestamp)
- `end_date` (timestamp)
- `is_active` (boolean)
- `total_active_time` (integer)
- `metadata` (jsonb, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `ad_creatives` table
- `id` (text, primary key)
- `ad_id` (text, foreign key to ads.id)
- `creative_type` (text) - 'image', 'body_text', 'cta', etc.
- `content` (text)
- `storage_path` (text, nullable)
- `width` (integer, nullable)
- `height` (integer, nullable)
- `metadata` (jsonb, nullable)
- `created_at` (timestamp)

### `ad-images` storage bucket
- Public bucket for storing ad images
- Files should be uploaded with paths like `google/ad_id.jpg` or `meta/ad_id_0.jpg`

## 3. Running the Application

1. Install dependencies: `npm install`
2. Set up your environment variables in `.env.local`
3. Start the development server: `npm run dev`
4. Open http://localhost:3000

## 4. Testing the Integration

The app will show:
- Loading state while fetching data
- Error message if Supabase connection fails
- Empty state if no ads are found
- Your actual ads from the database once connected

## 5. Edge Functions (Optional)

If you want to use the scraping functions, you'll also need:
- `SERPAPI_API_KEY` for Google Ads scraping
- `SEARCHAPI_API_KEY` for Meta Ads scraping

These can be added to your `.env.local` file as well.
