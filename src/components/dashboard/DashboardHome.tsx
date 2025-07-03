
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  MousePointer, 
  Eye, 
  ExternalLink, 
  Instagram, 
  Youtube,
  Twitter
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DashboardHome = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Mock data
  const metrics = {
    totalViews: 12547,
    totalClicks: 3421,
    avgCTR: 27.3,
    topLink: "YouTube Channel",
    topReferrer: "Instagram"
  };

  const trendData = [
    { name: "Mon", clicks: 45, views: 120 },
    { name: "Tue", clicks: 52, views: 135 },
    { name: "Wed", clicks: 48, views: 128 },
    { name: "Thu", clicks: 61, views: 142 },
    { name: "Fri", clicks: 73, views: 168 },
    { name: "Sat", clicks: 67, views: 156 },
    { name: "Sun", clicks: 58, views: 148 }
  ];

  const topLinks = [
    { title: "YouTube Channel", url: "youtube.com/@username", clicks: 1250, ctr: 34.2 },
    { title: "Instagram Profile", url: "instagram.com/username", clicks: 980, ctr: 28.5 },
    { title: "Twitter/X", url: "x.com/username", clicks: 750, ctr: 22.1 },
    { title: "Personal Website", url: "website.com", clicks: 441, ctr: 15.8 }
  ];

  const trafficSources = [
    { name: "Instagram", value: 45, color: "#E4405F" },
    { name: "YouTube", value: 28, color: "#FF0000" },
    { name: "Twitter", value: 15, color: "#1DA1F2" },
    { name: "Direct", value: 12, color: "#8B5CF6" }
  ];

  const aiSuggestions = [
    "Move 'YouTube Channel' above 'Instagram Profile' - it's converting 3x better",
    "Try A/B testing your page layout - current CTR could improve by 15%",
    "Add a call-to-action button to your top performing link",
    "Weekend traffic is 20% higher - consider posting content on Fridays"
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-xl p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {greeting}, John! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              You got <span className="font-semibold text-foreground">321 clicks</span> yesterday — 
              <span className="text-green-600 font-semibold"> 18% higher</span> than average.
            </p>
          </div>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Page
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-green-600">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-green-600">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgCTR}%</div>
            <p className="text-xs text-green-600">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Link</CardTitle>
            <Badge variant="secondary">Best</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{metrics.topLink}</div>
            <p className="text-xs text-muted-foreground">1,250 clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Referrer</CardTitle>
            <Instagram className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{metrics.topReferrer}</div>
            <p className="text-xs text-muted-foreground">45% of traffic</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Click Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="views" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Top Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{link.title}</h4>
                    <p className="text-sm text-muted-foreground">{link.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{link.clicks} clicks</p>
                    <p className="text-sm text-green-600">{link.ctr}% CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🤖</span>
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
