import { supabase } from '@/lib/supabase'

export default async function DebugPage() {
  const envCheck = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keyValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
  }

  let dbTest = null
  try {
    const { data, error } = await supabase
      .from('advertisers')
      .select('count')
      .limit(1)
    
    dbTest = {
      success: !error,
      error: error?.message,
      data
    }
  } catch (err) {
    dbTest = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Environment Variables</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(envCheck, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Database Test</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(dbTest, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
