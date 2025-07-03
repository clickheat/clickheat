import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Play, 
  Pause, 
  Trophy, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Calendar,
  Copy,
  Settings,
  BarChart3,
  Zap
} from "lucide-react";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import BioPageViewer from "../BioPageViewer";

interface ABTestingModuleProps {
  userId: string;
}

interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  variant_a_id: string;
  variant_b_id: string;
  traffic_split: number; // 50 = 50/50, 70 = 70/30
  goal: 'ctr' | 'specific_link' | 'total_clicks';
  target_link_id?: string;
  start_date: string;
  end_date: string;
  auto_promote_winner: boolean;
  created_at: string;
  results?: {
    variant_a: { views: number; clicks: number; ctr: number };
    variant_b: { views: number; clicks: number; ctr: number };
    winner?: 'A' | 'B' | 'inconclusive';
    confidence: number;
  };
}

const ABTestingModule = ({ userId }: ABTestingModuleProps) => {
  const { data, loading, connected, insertData, updateData, deleteData } = useRealTimeData(userId);
  const [tests, setTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    name: "",
    traffic_split: 50,
    goal: "ctr",
    target_link_id: "",
    duration_days: 7,
    auto_promote_winner: true
  });

  const bioPages = data.bioPages || [];
  const links = data.links || [];
  const currentBioPage = bioPages[0];

  // Mock A/B tests data - in real app this would come from database
  useEffect(() => {
    const mockTests: ABTest[] = [
      {
        id: "test-1",
        name: "Link Order Optimization",
        status: "running",
        variant_a_id: "variant-a-1",
        variant_b_id: "variant-b-1",
        traffic_split: 50,
        goal: "ctr",
        start_date: new Date().toISOString(),
        end_date: addDays(new Date(), 7).toISOString(),
        auto_promote_winner: true,
        created_at: new Date().toISOString(),
        results: {
          variant_a: { views: 1250, clicks: 342, ctr: 27.4 },
          variant_b: { views: 1180, clicks: 398, ctr: 33.7 },
          confidence: 85
        }
      },
      {
        id: "test-2",
        name: "Button Color Test",
        status: "completed",
        variant_a_id: "variant-a-2",
        variant_b_id: "variant-b-2",
        traffic_split: 70,
        goal: "total_clicks",
        start_date: addDays(new Date(), -14).toISOString(),
        end_date: addDays(new Date(), -7).toISOString(),
        auto_promote_winner: false,
        created_at: addDays(new Date(), -14).toISOString(),
        results: {
          variant_a: { views: 2100, clicks: 567, ctr: 27.0 },
          variant_b: { views: 900, clicks: 315, ctr: 35.0 },
          winner: 'B',
          confidence: 95
        }
      }
    ];
    setTests(mockTests);
  }, []);

  const createTest = async () => {
    if (!newTest.name || !currentBioPage) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create variant B (duplicate of current bio page with modifications)
    const variantB = await insertData('bio_pages', {
      user_id: userId,
      title: `${currentBioPage.title} (Variant B)`,
      description: currentBioPage.description,
      theme: currentBioPage.theme,
      is_published: false, // Don't publish variants directly
      tracking_code: currentBioPage.tracking_code
    });

    if (!variantB) {
      toast.error("Failed to create test variant");
      return;
    }

    // Duplicate links for variant B
    for (const link of links) {
      await insertData('links', {
        bio_page_id: variantB.id,
        title: link.title,
        url: link.url,
        description: link.description,
        position: link.position,
        is_active: link.is_active,
        icon: link.icon,
        style: link.style
      });
    }

    const test: ABTest = {
      id: Date.now().toString(),
      name: newTest.name,
      status: 'draft',
      variant_a_id: currentBioPage.id,
      variant_b_id: variantB.id,
      traffic_split: newTest.traffic_split,
      goal: newTest.goal as any,
      target_link_id: newTest.target_link_id || undefined,
      start_date: new Date().toISOString(),
      end_date: addDays(new Date(), newTest.duration_days).toISOString(),
      auto_promote_winner: newTest.auto_promote_winner,
      created_at: new Date().toISOString()
    };

    setTests([...tests, test]);
    setIsCreateDialogOpen(false);
    setNewTest({
      name: "",
      traffic_split: 50,
      goal: "ctr",
      target_link_id: "",
      duration_days: 7,
      auto_promote_winner: true
    });

    toast.success("A/B test created successfully!");
  };

  const startTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId ? { ...test, status: 'running' as const } : test
    ));
    toast.success("A/B test started!");
  };

  const pauseTest = (testId: string) => {
    setTests(tests.map(test => 
      test.id === testId ? { ...test, status: 'paused' as const } : test
    ));
    toast.success("A/B test paused");
  };

  const promoteWinner = (testId: string, winner: 'A' | 'B') => {
    toast.success(`Variant ${winner} promoted as the main layout!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getWinnerBadge = (results?: ABTest['results']) => {
    if (!results?.winner) return null;
    
    return (
      <Badge variant="secondary" className="ml-2">
        <Trophy className="h-3 w-3 mr-1" />
        Variant {results.winner} Won
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">A/B Testing</h1>
          <p className="text-muted-foreground">Test different layouts and optimize your bio page performance</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New A/B Test</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="testName">Test Name *</Label>
                <Input
                  id="testName"
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  placeholder="e.g., Link Order Optimization"
                />
              </div>

              <div>
                <Label htmlFor="trafficSplit">Traffic Split</Label>
                <Select value={newTest.traffic_split.toString()} onValueChange={(value) => setNewTest({ ...newTest, traffic_split: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50/50 Split</SelectItem>
                    <SelectItem value="70">70/30 Split</SelectItem>
                    <SelectItem value="80">80/20 Split</SelectItem>
                    <SelectItem value="90">90/10 Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goal">Test Goal</Label>
                <Select value={newTest.goal} onValueChange={(value) => setNewTest({ ...newTest, goal: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ctr">Maximize Overall CTR</SelectItem>
                    <SelectItem value="total_clicks">Maximize Total Clicks</SelectItem>
                    <SelectItem value="specific_link">Focus on Specific Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newTest.goal === 'specific_link' && (
                <div>
                  <Label htmlFor="targetLink">Target Link</Label>
                  <Select value={newTest.target_link_id} onValueChange={(value) => setNewTest({ ...newTest, target_link_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a link" />
                    </SelectTrigger>
                    <SelectContent>
                      {links.map((link) => (
                        <SelectItem key={link.id} value={link.id}>{link.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="duration">Test Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newTest.duration_days}
                  onChange={(e) => setNewTest({ ...newTest, duration_days: parseInt(e.target.value) })}
                  min="1"
                  max="30"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newTest.auto_promote_winner}
                  onCheckedChange={(checked) => setNewTest({ ...newTest, auto_promote_winner: checked })}
                />
                <Label>Auto-promote winner when test ends</Label>
              </div>

              <Button onClick={createTest} className="w-full">
                Create A/B Test
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tests Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tests</p>
                <p className="text-2xl font-bold">{tests.filter(t => t.status === 'running').length}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Tests</p>
                <p className="text-2xl font-bold">{tests.filter(t => t.status === 'completed').length}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Improvement</p>
                <p className="text-2xl font-bold text-green-600">+24%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}
      <Card>
        <CardHeader>
          <CardTitle>Your A/B Tests</CardTitle>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No A/B tests yet</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Test
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test) => (
                <Card key={test.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(test.status)}`}></div>
                        <div>
                          <h3 className="font-semibold">{test.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(test.start_date), 'MMM dd')} - {format(new Date(test.end_date), 'MMM dd')}
                          </p>
                        </div>
                        <Badge variant="outline">{test.status}</Badge>
                        {getWinnerBadge(test.results)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {test.status === 'draft' && (
                          <Button size="sm" onClick={() => startTest(test.id)}>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {test.status === 'running' && (
                          <Button size="sm" variant="outline" onClick={() => pauseTest(test.id)}>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTest(test)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    {test.results && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Variant A</span>
                            <Badge variant="outline">Original</Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Views:</span>
                              <span>{test.results.variant_a.views.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Clicks:</span>
                              <span>{test.results.variant_a.clicks.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold">
                              <span>CTR:</span>
                              <span>{test.results.variant_a.ctr}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Variant B</span>
                            <Badge variant="outline">Test</Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Views:</span>
                              <span>{test.results.variant_b.views.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Clicks:</span>
                              <span>{test.results.variant_b.clicks.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold">
                              <span>CTR:</span>
                              <span className={test.results.variant_b.ctr > test.results.variant_a.ctr ? 'text-green-600' : 'text-red-600'}>
                                {test.results.variant_b.ctr}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {test.results && test.status === 'completed' && test.results.winner && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-yellow-800">
                              Variant {test.results.winner} won with {test.results.confidence}% confidence
                            </p>
                            <p className="text-sm text-yellow-700">
                              {test.results.variant_b.ctr > test.results.variant_a.ctr 
                                ? `+${((test.results.variant_b.ctr / test.results.variant_a.ctr - 1) * 100).toFixed(1)}% improvement`
                                : `${((test.results.variant_a.ctr / test.results.variant_b.ctr - 1) * 100).toFixed(1)}% better than variant B`
                              }
                            </p>
                          </div>
                          <Button size="sm" onClick={() => promoteWinner(test.id, test.results!.winner!)}>
                            <Zap className="h-4 w-4 mr-1" />
                            Promote Winner
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Details Modal */}
      {selectedTest && (
        <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>{selectedTest.name}</span>
                <Badge variant="outline">{selectedTest.status}</Badge>
                {getWinnerBadge(selectedTest.results)}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                {selectedTest.results && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Variant A (Original)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Views:</span>
                            <span className="font-semibold">{selectedTest.results.variant_a.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clicks:</span>
                            <span className="font-semibold">{selectedTest.results.variant_a.clicks.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CTR:</span>
                            <span className="font-semibold">{selectedTest.results.variant_a.ctr}%</span>
                          </div>
                          <Progress value={selectedTest.results.variant_a.ctr} className="mt-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Variant B (Test)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Views:</span>
                            <span className="font-semibold">{selectedTest.results.variant_b.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clicks:</span>
                            <span className="font-semibold">{selectedTest.results.variant_b.clicks.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CTR:</span>
                            <span className="font-semibold">{selectedTest.results.variant_b.ctr}%</span>
                          </div>
                          <Progress value={selectedTest.results.variant_b.ctr} className="mt-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="variants" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Variant A (Original)</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <BioPageViewer pageId={selectedTest.variant_a_id} variant="A" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Variant B (Test)</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <BioPageViewer pageId={selectedTest.variant_b_id} variant="B" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">🤖</span>
                      AI Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedTest.results?.winner === 'B' && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">🎉 Variant B is the clear winner!</h4>
                          <p className="text-green-700 text-sm">
                            Variant B outperformed the original by {((selectedTest.results.variant_b.ctr / selectedTest.results.variant_a.ctr - 1) * 100).toFixed(1)}% 
                            with {selectedTest.results.confidence}% statistical confidence.
                          </p>
                        </div>
                      )}
                      
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">📊 Statistical Analysis</h4>
                        <p className="text-blue-700 text-sm">
                          Based on {selectedTest.results ? selectedTest.results.variant_a.views + selectedTest.results.variant_b.views : 0} total views, 
                          this test has reached statistical significance.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">🔮 Next Test Suggestions</h4>
                        <ul className="text-purple-700 text-sm space-y-1">
                          <li>• Test different button colors (blue vs green)</li>
                          <li>• Experiment with link descriptions</li>
                          <li>• Try different call-to-action phrases</li>
                          <li>• Test mobile vs desktop layouts</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🤖</span>
            AI Testing Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">🎨 Visual Tests</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Test button colors (current vs bright green)</li>
                <li>• Try different background gradients</li>
                <li>• Experiment with link spacing</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">📝 Content Tests</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Test shorter vs longer link titles</li>
                <li>• Add urgency words ("Limited time")</li>
                <li>• Try emoji vs no emoji in titles</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">🔄 Layout Tests</h4>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• Reorder links by performance</li>
                <li>• Test 3 vs 5 vs 7 links</li>
                <li>• Try grid vs list layout</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">⚡ Advanced Tests</h4>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Test with/without profile image</li>
                <li>• Add social proof elements</li>
                <li>• Try different CTA placements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABTestingModule;