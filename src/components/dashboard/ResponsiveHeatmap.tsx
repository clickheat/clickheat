import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Smartphone, Monitor, Tablet, Wifi, WifiOff, Maximize2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";

interface ResponsiveHeatmapProps {
  userId: string;
}

const ResponsiveHeatmap = ({ userId }: ResponsiveHeatmapProps) => {
  const { data, loading, connected, refetch } = useRealTimeData(userId);
  const { metrics } = useRealTimeAnalytics(userId);
  const [dateRange, setDateRange] = useState("7d");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      'bg-blue-100', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
      'bg-orange-200', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500'
    ];
    const index = Math.floor(heatLevel * (colors.length - 1));
    return colors[index];
  };

  const getDeviceStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-md mx-auto';
      case 'desktop':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-sm mx-auto';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  const exportHeatmap = () => {
    const data = {
      timestamp: new Date().toISOString(),
      viewMode,
      filters: { dateRange, platformFilter, deviceFilter },
      linkPerformance: metrics.linkPerformance,
      totalClicks: metrics.totalClicks,
      totalViews: metrics.totalViews
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-${viewMode}-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`${viewMode} heatmap data exported successfully!`);
  };

  const handleRefresh = async () => {
    await refetch();
    setLastRefresh(new Date());
    toast.success("Heatmap data refreshed!");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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

  const HeatmapContent = () => (
    <div className="space-y-6">
      {/* Device Selector */}
      <div className="flex justify-center">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mobile" className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="tablet" className="flex items-center space-x-2">
              <Tablet className="h-4 w-4" />
              <span className="hidden sm:inline">Tablet</span>
            </TabsTrigger>
            <TabsTrigger value="desktop" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Desktop</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Responsive Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-xl md:text-2xl font-bold">{metrics.totalClicks}</p>
              </div>
              {connected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Device</p>
                <p className="text-lg md:text-xl font-bold capitalize">{viewMode}</p>
              </div>
              {getDeviceIcon(viewMode)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Top Link</p>
              <p className="text-sm md:text-lg font-semibold truncate">{metrics.topLink || 'No data'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg CTR</p>
              <p className="text-xl md:text-2xl font-bold">{metrics.avgCTR}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Heatmap Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg md:text-xl">Bio Page Heatmap</span>
              {connected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </div>
            <div className="flex items-center space-x-2">
              {getDeviceIcon(viewMode)}
              <span className="text-sm text-muted-foreground capitalize">{viewMode} View</span>
              {!isFullscreen && (
                <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
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
            <div className={`${getDeviceStyles()} transition-all duration-300`}>
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                viewMode === 'desktop' ? 'p-8' : viewMode === 'tablet' ? 'p-6' : 'p-4'
              }`}>
                {/* Bio Page Header */}
                <div className={`text-center border-b ${
                  viewMode === 'desktop' ? 'pb-8 mb-8' : viewMode === 'tablet' ? 'pb-6 mb-6' : 'pb-4 mb-4'
                }`}>
                  <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    viewMode === 'desktop' ? 'w-32 h-32' : viewMode === 'tablet' ? 'w-24 h-24' : 'w-20 h-20'
                  }`}>
                    <span className={`${viewMode === 'desktop' ? 'text-4xl' : viewMode === 'tablet' ? 'text-3xl' : 'text-2xl'}`}>
                      👤
                    </span>
                  </div>
                  <h2 className={`font-bold text-gray-800 ${
                    viewMode === 'desktop' ? 'text-3xl mb-3' : viewMode === 'tablet' ? 'text-2xl mb-2' : 'text-xl mb-2'
                  }`}>
                    {currentBioPage?.title || "My Bio Page"}
                  </h2>
                  {currentBioPage?.description && (
                    <p className={`text-gray-600 ${
                      viewMode === 'desktop' ? 'text-lg' : viewMode === 'tablet' ? 'text-base' : 'text-sm'
                    }`}>
                      {currentBioPage.description}
                    </p>
                  )}
                </div>
                
                {/* Responsive Links with Heatmap */}
                <div className={`space-y-${viewMode === 'desktop' ? '4' : '3'}`}>
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
                          className={`relative rounded-lg border-2 border-gray-200 cursor-pointer transition-all duration-300 hover:scale-105 ${getHeatColor(linkMetrics.heatLevel)} ${
                            viewMode === 'desktop' ? 'p-6' : viewMode === 'tablet' ? 'p-5' : 'p-4'
                          }`}
                          title={`${linkMetrics.clicks} clicks • ${linkMetrics.ctr}% CTR • Heat: ${Math.round(linkMetrics.heatLevel * 100)}%`}
                        >
                          <div className={`flex items-center ${
                            viewMode === 'desktop' ? 'space-x-4' : 'space-x-3'
                          }`}>
                            {link.icon && (
                              <span className={`${
                                viewMode === 'desktop' ? 'text-3xl' : viewMode === 'tablet' ? 'text-2xl' : 'text-xl'
                              }`}>
                                {link.icon}
                              </span>
                            )}
                            <div className="flex-1">
                              <h3 className={`font-semibold text-gray-800 ${
                                viewMode === 'desktop' ? 'text-xl mb-2' : viewMode === 'tablet' ? 'text-lg mb-1' : 'text-base'
                              }`}>
                                {link.title}
                              </h3>
                              {link.description && viewMode !== 'mobile' && (
                                <p className={`text-gray-600 ${
                                  viewMode === 'desktop' ? 'text-base' : 'text-sm'
                                }`}>
                                  {link.description}
                                </p>
                              )}
                              {viewMode === 'desktop' && (
                                <p className="text-sm text-gray-500 mt-1 truncate">
                                  {link.url}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary" className={`${
                                viewMode === 'desktop' ? 'text-sm' : 'text-xs'
                              }`}>
                                {linkMetrics.clicks}
                              </Badge>
                              {connected && linkMetrics.clicks > 0 && (
                                <div className="text-xs text-green-600 mt-1">Live</div>
                              )}
                              {viewMode === 'desktop' && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {linkMetrics.ctr}% CTR
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Heat intensity indicator */}
                          <div className="absolute top-2 right-2">
                            <div className={`rounded-full ${
                              linkMetrics.heatLevel > 0.7 ? 'bg-red-500' : 
                              linkMetrics.heatLevel > 0.4 ? 'bg-yellow-500' : 
                              linkMetrics.heatLevel > 0 ? 'bg-blue-500' : 'bg-gray-300'
                            } ${viewMode === 'desktop' ? 'w-4 h-4' : 'w-3 h-3'}`}></div>
                          </div>

                          {/* Real-time pulse effect */}
                          {connected && linkMetrics.clicks > 0 && (
                            <div className="absolute inset-0 bg-green-400 opacity-20 rounded-lg animate-pulse"></div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Device-specific footer */}
                {viewMode === 'desktop' && (
                  <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-sm text-gray-500">Powered by ClickHeat • Real-time Analytics</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white overflow-auto' : ''} p-6 space-y-6`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">Responsive Heatmap</h1>
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
          <p className="text-muted-foreground">Multi-device heatmap visualization with real-time updates</p>
        </div>
        <div className="flex items-center space-x-2">
          {isFullscreen && (
            <Button variant="outline" onClick={toggleFullscreen}>
              Exit Fullscreen
            </Button>
          )}
          <Button variant="outline" onClick={handleRefresh} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" onClick={exportHeatmap} size="sm">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Filters - Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Device Filter</label>
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="mobile">Mobile Only</SelectItem>
                  <SelectItem value="desktop">Desktop Only</SelectItem>
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

      <HeatmapContent />

      {/* Heat Legend - Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Heat Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
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
            Darker colors indicate higher click frequency. View adapts to {viewMode} layout automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsiveHeatmap;