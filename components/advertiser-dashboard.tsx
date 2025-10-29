"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Calendar, Activity } from "lucide-react"
import Link from "next/link"
import { AdvertiserMetrics } from "./advertiser-metrics"
import { AdvertiserCharts } from "./advertiser-charts"
import { AdvertiserAdsList } from "./advertiser-ads-list"
import type { Ad } from "@/types/ad"

const mockAdvertiserData: Record<string, any> = {
  "techcorp-solutions": {
    id: "techcorp-solutions",
    name: "TechCorp Solutions",
    logo: "/modern-tech-ad.png",
    website: "https://techcorp.example.com",
    industry: "Technology",
    description: "Leading provider of AI-powered business solutions and enterprise software.",
    totalAds: 12,
    activeAds: 4,
    inactiveAds: 8,
    averageDuration: 52,
    firstAdDate: "2023-11-15",
    lastAdDate: "2024-03-15",
  },
  "stylehub-fashion": {
    id: "stylehub-fashion",
    name: "StyleHub Fashion",
    logo: "/fashion-brand-advertisement.jpg",
    website: "https://stylehub.example.com",
    industry: "Fashion & Retail",
    description: "Premium fashion brand offering contemporary styles for the modern wardrobe.",
    totalAds: 8,
    activeAds: 2,
    inactiveAds: 6,
    averageDuration: 28,
    firstAdDate: "2023-12-01",
    lastAdDate: "2024-02-28",
  },
  "quickeats-delivery": {
    id: "quickeats-delivery",
    name: "QuickEats Delivery",
    logo: "/food-delivery-app-advertisement.jpg",
    website: "https://quickeats.example.com",
    industry: "Food & Delivery",
    description: "Fast and reliable food delivery service connecting you with local restaurants.",
    totalAds: 15,
    activeAds: 6,
    inactiveAds: 9,
    averageDuration: 45,
    firstAdDate: "2023-10-01",
    lastAdDate: "2024-04-20",
  },
}

const mockAdsData: Record<string, Ad[]> = {
  "techcorp-solutions": [
    {
      id: "1",
      imageUrl: "/modern-tech-ad.png",
      advertiser: "TechCorp Solutions",
      platform: "Google Ads",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      status: "active",
      headline: "Transform Your Business with AI",
      description: "Discover how our cutting-edge AI solutions can revolutionize your workflow",
      callToAction: "Start Free Trial",
      placement: "Search Network",
      firstSeen: "2024-01-15",
      lastSeen: "2024-03-15",
    },
  ],
  "stylehub-fashion": [
    {
      id: "2",
      imageUrl: "/fashion-brand-advertisement.jpg",
      advertiser: "StyleHub Fashion",
      platform: "Meta Ads",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      status: "inactive",
      headline: "Spring Collection 2024",
      description: "Elevate your style with our latest arrivals",
      callToAction: "Shop Now",
      placement: "Facebook Feed",
    },
  ],
  "quickeats-delivery": [
    {
      id: "3",
      imageUrl: "/food-delivery-app-advertisement.jpg",
      advertiser: "QuickEats Delivery",
      platform: "Google Ads",
      startDate: "2024-01-20",
      endDate: "2024-04-20",
      status: "active",
      headline: "Food Delivered in 30 Minutes or Less",
      description: "Your favorite restaurants, delivered fast",
      callToAction: "Order Now",
      placement: "Display Network",
    },
  ],
}

interface AdvertiserDashboardProps {
  advertiserId: string
}

export function AdvertiserDashboard({ advertiserId }: AdvertiserDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const advertiser = mockAdvertiserData[advertiserId] || {
    id: advertiserId,
    name: advertiserId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    logo: "/placeholder.svg",
    website: "https://example.com",
    industry: "Unknown",
    description: "No description available.",
    totalAds: 0,
    activeAds: 0,
    inactiveAds: 0,
    averageDuration: 0,
    firstAdDate: new Date().toISOString(),
    lastAdDate: new Date().toISOString(),
  }

  const ads = mockAdsData[advertiserId] || []

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advertiser Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analytics and ad performance</p>
        </div>
      </div>

      {/* Advertiser Profile Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={advertiser.logo || "/placeholder.svg"} alt={advertiser.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {advertiser.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h2 className="text-2xl font-bold text-foreground">{advertiser.name}</h2>
                <Badge variant="secondary" className="w-fit">
                  {advertiser.industry}
                </Badge>
              </div>

              <p className="text-muted-foreground max-w-2xl">{advertiser.description}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>First ad: {new Date(advertiser.firstAdDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span>Latest ad: {new Date(advertiser.lastAdDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="gap-2 bg-transparent" asChild>
              <a href={advertiser.website} target="_blank" rel="noopener noreferrer">
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <AdvertiserMetrics
        totalAds={advertiser.totalAds}
        activeAds={advertiser.activeAds}
        inactiveAds={advertiser.inactiveAds}
        averageDuration={advertiser.averageDuration}
      />

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card/50 border border-border/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ads">All Ads ({ads.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdvertiserCharts activeAds={advertiser.activeAds} inactiveAds={advertiser.inactiveAds} ads={ads} />
        </TabsContent>

        <TabsContent value="ads">
          <AdvertiserAdsList ads={ads} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
