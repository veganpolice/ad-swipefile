import { AdvertiserDashboard } from "@/components/advertiser-dashboard"

export default async function AdvertiserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background">
      <AdvertiserDashboard advertiserId={id} />
    </main>
  )
}
