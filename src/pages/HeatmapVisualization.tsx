
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, RefreshCw, Smartphone, Monitor } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const HeatmapVisualization = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("7d");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [bioPageData, setBioPageData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Mock bio page structure for visualization
  const mockBioPage = {
    title: "John's Bio Links",
    description: "Creator & Entrepreneur",
    links: [
      { id: "1", title: "YouTube Channel", url: "youtube.com/@john", position: 0, clicks: 1250, ctr: 34.2, heatLevel: 0.9 },
      { id: "2", title: "Instagram Profile", url: "instagram.com/john", position: 1, clicks: 980, ctr: 28.5, heatLevel: 0.7 },
      { id: "3", title: "Twitter/X", url: "x.com/john", position: 2, clicks: 750, ctr: 22.1, heatLevel: 0.5 },
      { id: "4", title: "Personal Website", url: "website.com", position: 3, clicks: 441, ctr: 15.8, heatLevel: 0.3 },
      { id: "5", title: "Newsletter", url: "newsletter.com", position: 4, clicks: 123, ctr: 8.2, heatLevel: 0.1 }
    ]
  };

  useEffect(() => {
    if (!loading) {
      fetchHeatmapData();
    }
  }, [dateRange, platformFilter, deviceFilter, loading]);

  const fetchHeatmapData = async () => {
    setDataLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For now, using mock data
      setTimeout(() => {
        setHeatmapData(mockBioPage.links);
        setBioPageData(mockBioPage);
        setDataLoading(false);
        setLastRefresh(new Date());
      }, 1000);
    } catch (error) {
      toast.error("Failed to load heatmap data");
      setDataLoading(false);
    }
  };

  const getHeatColor = (heatLevel: number) => {
    const colors = [
      'bg-blue-100', // Cold
      'bg-blue-200',
      'bg-green-200',
      'bg-yellow-200',
      'bg-orange-200',
      'bg-red-200',
      'bg-red-300',
      'bg-red-400',
      'bg-red-500', // Hot
    ];
    const index = Math.floor(heatLevel * (colors.length - 1));
    return colors[index];
  };

  const exportHeatmap = () => {
    toast.success("Heatmap exported successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-hero p-3 rounded-xl mb-4 inline-block">
            <span className="text-primary-foreground font-bold text-2xl">🔥</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Heatmap Visualization</h1>
              <p className="text-muted-foreground">See where your visitors click most</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={fetchHeatmapData} disabled={dataLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportHeatmap}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters & Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Time Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Platform</label>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Device</label>
                  <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {format(lastRefresh, "HH:mm")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heatmap Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Bio Page Heatmap
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Mobile View</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Mock Bio Page */}
                  <div className="p-6 text-center border-b">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold">{bioPageData?.title}</h2>
                    <p className="text-gray-600">{bioPageData?.description}</p>
                  </div>
                  
                  {/* Links with Heatmap */}
                  <div className="p-4 space-y-3">
                    {heatmapData.map((link) => (
                      <div
                        key={link.id}
                        className={`relative p-4 rounded-lg border-2 border-gray-200 cursor-pointer transition-all duration-300 hover:scale-105 ${getHeatColor(link.heatLevel)}`}
                        title={`${link.clicks} clicks • ${link.ctr}% CTR`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-800">{link.title}</h3>
                            <p className="text-sm text-gray-600">{link.url}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {link.clicks}
                          </Badge>
                        </div>
                        
                        {/* Heat intensity indicator */}
                        <div className="absolute top-2 right-2">
                          <div className={`w-3 h-3 rounded-full ${link.heatLevel > 0.7 ? 'bg-red-500' : link.heatLevel > 0.4 ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Heat Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Heat Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Cold</span>
                <div className="flex space-x-1">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((level, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded ${getHeatColor(level)}`}
                      title={`Heat level: ${Math.round(level * 100)}%`}
                    ></div>
                  ))}
                </div>
                <span className="text-sm font-medium">Hot</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Darker colors indicate higher click frequency
              </p>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">🤖</span>
                AI Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm"><strong>High Performance:</strong> Your YouTube link is getting 34% CTR - consider moving it to the top!</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm"><strong>Cold Spot Alert:</strong> Your Newsletter link has low engagement. Try A/B testing the title or position.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm"><strong>Optimization Tip:</strong> Links 2-4 have similar heat levels. Consider reordering based on your priorities.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HeatmapVisualization;
