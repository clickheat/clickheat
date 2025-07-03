
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Copy, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  position: number;
  is_active: boolean;
  icon?: string;
  clicks?: number;
  ctr?: number;
  created_at: string;
}

const LinkManagement = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [links, setLinks] = useState<Link[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    icon: "",
  });

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

  // Mock data for development
  const mockLinks: Link[] = [
    {
      id: "1",
      title: "YouTube Channel",
      url: "https://youtube.com/@john",
      description: "My latest videos and content",
      position: 0,
      is_active: true,
      icon: "🎥",
      clicks: 1250,
      ctr: 34.2,
      created_at: "2024-01-01T00:00:00.000Z"
    },
    {
      id: "2",
      title: "Instagram Profile",
      url: "https://instagram.com/john",
      description: "Daily updates and stories",
      position: 1,
      is_active: true,
      icon: "📸",
      clicks: 980,
      ctr: 28.5,
      created_at: "2024-01-02T00:00:00.000Z"
    },
    {
      id: "3",
      title: "Twitter/X",
      url: "https://x.com/john",
      description: "Thoughts and quick updates",
      position: 2,
      is_active: true,
      icon: "🐦",
      clicks: 750,
      ctr: 22.1,
      created_at: "2024-01-03T00:00:00.000Z"
    },
    {
      id: "4",
      title: "Personal Website",
      url: "https://johnsmith.com",
      description: "Portfolio and blog",
      position: 3,
      is_active: false,
      icon: "🌐",
      clicks: 441,
      ctr: 15.8,
      created_at: "2024-01-04T00:00:00.000Z"
    }
  ];

  useEffect(() => {
    if (!loading) {
      fetchLinks();
    }
  }, [loading]);

  const fetchLinks = async () => {
    setDataLoading(true);
    try {
      // For now, using mock data. In production, this would fetch from Supabase
      setTimeout(() => {
        setLinks(mockLinks);
        setDataLoading(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to load links");
      setDataLoading(false);
    }
  };

  const handleSaveLink = async () => {
    if (!formData.title || !formData.url) {
      toast.error("Please fill in title and URL");
      return;
    }

    const newLink: Link = {
      id: editingLink?.id || Date.now().toString(),
      title: formData.title,
      url: formData.url,
      description: formData.description,
      icon: formData.icon,
      position: editingLink?.position || links.length,
      is_active: editingLink?.is_active || true,
      clicks: editingLink?.clicks || 0,
      ctr: editingLink?.ctr || 0,
      created_at: editingLink?.created_at || new Date().toISOString()
    };

    if (editingLink) {
      setLinks(links.map(link => link.id === editingLink.id ? newLink : link));
      toast.success("Link updated successfully");
    } else {
      setLinks([...links, newLink]);
      toast.success("Link added successfully");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: "", url: "", description: "", icon: "" });
    setEditingLink(null);
    setIsDialogOpen(false);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || "",
      icon: link.icon || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks(links.filter(link => link.id !== linkId));
    toast.success("Link deleted successfully");
  };

  const handleToggleActive = (linkId: string) => {
    setLinks(links.map(link => 
      link.id === linkId ? { ...link, is_active: !link.is_active } : link
    ));
    toast.success("Link visibility updated");
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedLinks = items.map((link, index) => ({
      ...link,
      position: index
    }));

    setLinks(updatedLinks);
    toast.success("Links reordered successfully");
  };

  const duplicateLink = (link: Link) => {
    const duplicatedLink: Link = {
      ...link,
      id: Date.now().toString(),
      title: `${link.title} (Copy)`,
      position: links.length,
      created_at: new Date().toISOString()
    };
    setLinks([...links, duplicatedLink]);
    toast.success("Link duplicated successfully");
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
              <h1 className="text-3xl font-bold">Link Management</h1>
              <p className="text-muted-foreground">Manage and organize your bio page links</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingLink ? "Edit Link" : "Add New Link"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Link Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="My YouTube Channel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://youtube.com/@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of this link"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon/Emoji</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="🎥 or leave empty"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveLink} className="flex-1">
                      {editingLink ? "Update Link" : "Add Link"}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Links List  */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Links ({links.length})
                <Badge variant="secondary">{links.filter(l => l.is_active).length} active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="links">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {links.map((link, index) => (
                          <Draggable key={link.id} draggableId={link.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`bg-white border rounded-lg p-4 transition-all duration-200 ${
                                  snapshot.isDragging ? "shadow-lg" : "shadow-sm hover:shadow-md"
                                } ${!link.is_active ? "opacity-60" : ""}`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div {...provided.dragHandleProps} className="cursor-move">
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>
                                  
                                  {link.icon && (
                                    <div className="text-2xl">{link.icon}</div>
                                  )}
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h3 className="font-semibold">{link.title}</h3>
                                      {!link.is_active && <Badge variant="secondary">Hidden</Badge>}
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      {link.url}
                                    </p>
                                    {link.description && (
                                      <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                                    )}
                                  </div>
                                  
                                  <div className="text-right">
                                    <div className="text-lg font-semibold">{link.clicks || 0}</div>
                                    <div className="text-sm text-gray-500">{link.ctr || 0}% CTR</div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleToggleActive(link.id)}
                                    >
                                      {link.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => duplicateLink(link)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditLink(link)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteLink(link.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>

          {/* Bio Page Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4"></div>
                  <h2 className="text-xl font-bold">John's Bio Links</h2>
                  <p className="text-gray-600">Creator & Entrepreneur</p>
                </div>
                
                <div className="space-y-3">
                  {links
                    .filter(link => link.is_active)
                    .sort((a, b) => a.position - b.position)
                    .map((link) => (
                      <div
                        key={link.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          {link.icon && <span className="text-xl">{link.icon}</span>}
                          <div className="flex-1">
                            <h3 className="font-medium">{link.title}</h3>
                            {link.description && (
                              <p className="text-sm text-gray-600">{link.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LinkManagement;
