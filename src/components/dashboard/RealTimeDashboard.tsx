import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  MousePointer, 
  Eye, 
  ExternalLink, 
  Instagram, 
  Youtube,
  Twitter,
  Wifi,
  WifiOff
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { format } from "date-fns";

interface RealTimeDashboardProps {
  userId: string;
}

const RealTimeDashboard = ({ userId }: RealTimeDashboardProps) => {
  const { metrics, loading, connected } = useRealTimeAnalytics(userId);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Mock trend data - in real app this would come from analytics
  const trendData = [
    { name: "Mon", clicks: 45, views: 120 },
    { name: "Tue", clicks: 52, views: 135 },
    { name: "Wed", clicks: 48, views: 128 },
    { name: "Thu", clicks: 61, views: 142 },
    { name: "Fri", clicks: 73, views: 168 },
    { name: "Sat", clicks: 67, views: 156 },
    { name: "Sun", clicks: 58, views: 148 }
  ];

  const aiSuggestions = [
    "Move your top performing link to position #1 for 15% more clicks",
    "Your weekend traffic is 20% higher - consider posting content on Fridays",
    "Add a call-to-action button to boost engagement by 25%",
    "Try A/B testing your page layout - current CTR could improve by 12%"
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {connected ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Live updates active</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">Reconnecting...</span>
            </>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {format(new Date(), "HH:mm:ss")}
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-xl p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {greeting}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              You got <span className="font-semibold text-foreground">{metrics.totalClicks}</span> clicks today — 
              <span className="text-green-600 font-semibold"> Real-time tracking active</span>
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
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-green-600">Live tracking</p>
          </CardContent>
          {connected && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-green-600">+{metrics.recentClicks.length} recent</p>
          </CardContent>
          {connected && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgCTR}%</div>
            <p className="text-xs text-green-600">Above average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Link</CardTitle>
            <Badge variant="secondary">Best</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{metrics.topLink}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.linkPerformance[0]?.clicks || 0} clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Source</CardTitle>
            <Instagram className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{metrics.topReferrer}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.trafficSources[0]?.value || 0}% of traffic
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Click Trends (Last 7 Days)
              {connected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </CardTitle>
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
            <CardTitle>Live Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.trafficSources.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.trafficSources}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {metrics.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No traffic data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Live Link Performance
              {connected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.linkPerformance.slice(0, 4).map((link, index) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{link.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={link.heatLevel * 100} className="w-20 h-2" />
                      <span className="text-xs text-muted-foreground">
                        Heat: {Math.round(link.heatLevel * 100)}%
                      </span>
                    </div>
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
              Real-time AI Insights
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

      {/* Recent Activity */}
      {metrics.recentClicks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Clicks
              <Badge variant="secondary">{metrics.recentClicks.length} recent</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.recentClicks.slice(0, 5).map((click, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Link clicked</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(click.clicked_at), "HH:mm:ss")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeDashboard;