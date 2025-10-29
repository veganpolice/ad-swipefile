export default function SimplePage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Ad Swipefile</h1>
      <p className="text-lg text-gray-600 mb-8">Browse and analyze competitor advertising campaigns</p>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Check</h2>
        <ul className="space-y-1">
          <li>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
        </ul>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Available Pages</h2>
        <ul className="space-y-2">
          <li><a href="/" className="text-blue-600 hover:underline">Home (Ad Gallery)</a></li>
          <li><a href="/debug" className="text-blue-600 hover:underline">Debug Page</a></li>
          <li><a href="/test" className="text-blue-600 hover:underline">Test Page</a></li>
        </ul>
      </div>
    </div>
  )
}
