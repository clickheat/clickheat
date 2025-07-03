import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download, Smartphone, Monitor, Wifi, WifiOff } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";

interface RealTimeHeatmapProps {
  userId: string;
}

const RealTimeHeatmap = ({ userId }: RealTimeHeatmapProps) => {
  const { data, loading, connected, refetch } = useRealTimeData(userId);
  const { metrics } = useRealTimeAnalytics(userId);
  const [dateRange, setDateRange] = useState("7d");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const links = data.links || [];
  const bioPages = data.bioPages || [];
  const currentBioPage = bioPages[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getHeatColor = (heatLevel: number) => {
    if (heatLevel === 0) return 'bg-gray-100';
    
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
    const data = {
      timestamp: new Date().toISOString(),
      filters: { dateRange, platformFilter, deviceFilter },
      linkPerformance: metrics.linkPerformance,
      totalClicks: metrics.totalClicks,
      totalViews: metrics.totalViews
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-export-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Heatmap data exported successfully!");
  };

  const handleRefresh = async () => {
    await refetch();
    setLastRefresh(new Date());
    toast.success("Heatmap data refreshed!");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-3xl font-bold">Real-time Heatmap</h1>
            {connected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">Live</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">Offline</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">See where your visitors click most - updated in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
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
                <div>Last updated:</div>
                <div className="font-mono">{format(lastRefresh, "HH:mm:ss")}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{metrics.totalClicks}</p>
              </div>
              {connected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Links</p>
                <p className="text-2xl font-bold">{links.filter(l => l.is_active).length}</p>
              </div>
              <div className="text-blue-500">🔗</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Top Performer</p>
              <p className="text-lg font-semibold truncate">{metrics.topLink || 'No data'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg CTR</p>
              <p className="text-2xl font-bold">{metrics.avgCTR}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>Bio Page Heatmap</span>
              {connected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">Mobile View</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No links to display heatmap for</p>
              <p className="text-sm text-muted-foreground">Add some links to see the heatmap visualization</p>
            </div>
          ) : (
            <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Mock Bio Page Header */}
              <div className="p-6 text-center border-b">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl font-bold">{currentBioPage?.title || "My Bio Page"}</h2>
                <p className="text-gray-600">{currentBioPage?.description || "Creator & Entrepreneur"}</p>
              </div>
              
              {/* Links with Heatmap */}
              <div className="p-4 space-y-3">
                {links
                  .filter(link => link.is_active)
                  .sort((a, b) => a.position - b.position)
                  .map((link) => {
                    const linkMetrics = metrics.linkPerformance.find(perf => perf.id === link.id) || {
                      clicks: 0,
                      ctr: 0,
                      heatLevel: 0
                    };
                    
                    return (
                      <div
                        key={link.id}
                        className={`relative p-4 rounded-lg border-2 border-gray-200 cursor-pointer transition-all duration-300 hover:scale-105 ${getHeatColor(linkMetrics.heatLevel)}`}
                        title={`${linkMetrics.clicks} clicks • ${linkMetrics.ctr}% CTR • Heat: ${Math.round(linkMetrics.heatLevel * 100)}%`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            {link.icon && <span className="text-xl">{link.icon}</span>}
                            <div>
                              <h3 className="font-semibold text-gray-800">{link.title}</h3>
                              <p className="text-sm text-gray-600 truncate max-w-[200px]">{link.url}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="text-xs">
                              {linkMetrics.clicks}
                            </Badge>
                            {connected && linkMetrics.clicks > 0 && (
                              <div className="text-xs text-green-600 mt-1">Live</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Heat intensity indicator */}
                        <div className="absolute top-2 right-2">
                          <div className={`w-3 h-3 rounded-full ${
                            linkMetrics.heatLevel > 0.7 ? 'bg-red-500' : 
                            linkMetrics.heatLevel > 0.4 ? 'bg-yellow-500' : 
                            linkMetrics.heatLevel > 0 ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                        </div>

                        {/* Real-time pulse effect for active links */}
                        {connected && linkMetrics.clicks > 0 && (
                          <div className="absolute inset-0 bg-green-400 opacity-20 rounded-lg animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
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
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm font-medium">Cold</span>
            <div className="flex space-x-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((level, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded ${getHeatColor(level)} border`}
                  title={`Heat level: ${Math.round(level * 100)}%`}
                ></div>
              ))}
            </div>
            <span className="text-sm font-medium">Hot</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Darker colors indicate higher click frequency. Updates in real-time as users interact with your links.
          </p>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🤖</span>
            Real-time AI Optimization Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.linkPerformance.length > 0 ? (
              <>
                {metrics.linkPerformance[0]?.ctr > 30 && (
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm">
                      <strong>Excellent Performance:</strong> Your "{metrics.linkPerformance[0].title}" link is performing exceptionally well with {metrics.linkPerformance[0].ctr}% CTR!
                    </p>
                  </div>
                )}
                
                {metrics.linkPerformance.some(link => link.heatLevel < 0.2) && (
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm">
                      <strong>Cold Spot Alert:</strong> Some links have low engagement. Consider reordering or updating their titles.
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm">
                    <strong>Real-time Tip:</strong> Your heatmap updates live! Watch for patterns as users interact with your page.
                  </p>
                </div>
              </>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                <p className="text-sm">
                  <strong>Getting Started:</strong> Add some links and start sharing your bio page to see heatmap data!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeHeatmap;