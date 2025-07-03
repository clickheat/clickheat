import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Copy, ExternalLink, Wifi } from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";

interface RealTimeLinkManagementProps {
  userId: string;
}

const RealTimeLinkManagement = ({ userId }: RealTimeLinkManagementProps) => {
  const { data, loading, connected, updateData, insertData, deleteData } = useRealTimeData(userId);
  const { metrics } = useRealTimeAnalytics(userId);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    icon: "",
  });

  const links = data.links || [];
  const bioPages = data.bioPages || [];
  const currentBioPage = bioPages[0];

  const handleSaveLink = async () => {
    if (!formData.title || !formData.url) {
      toast.error("Please fill in title and URL");
      return;
    }

    if (!currentBioPage) {
      toast.error("No bio page found");
      return;
    }

    if (editingLink) {
      const success = await updateData('links', editingLink.id, {
        title: formData.title,
        url: formData.url,
        description: formData.description,
        icon: formData.icon,
        updated_at: new Date().toISOString()
      });
      
      if (success) {
        toast.success("Link updated successfully");
        resetForm();
      }
    } else {
      const newLink = await insertData('links', {
        bio_page_id: currentBioPage.id,
        title: formData.title,
        url: formData.url,
        description: formData.description,
        icon: formData.icon,
        position: links.length,
        is_active: true
      });
      
      if (newLink) {
        toast.success("Link added successfully");
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: "", url: "", description: "", icon: "" });
    setEditingLink(null);
    setIsDialogOpen(false);
  };

  const handleEditLink = (link: any) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || "",
      icon: link.icon || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteLink = async (linkId: string) => {
    const success = await deleteData('links', linkId);
    if (success) {
      toast.success("Link deleted successfully");
    }
  };

  const handleToggleActive = async (link: any) => {
    const success = await updateData('links', link.id, {
      is_active: !link.is_active,
      updated_at: new Date().toISOString()
    });
    
    if (success) {
      toast.success("Link visibility updated");
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions in database
    for (let i = 0; i < items.length; i++) {
      await updateData('links', items[i].id, { position: i });
    }

    toast.success("Links reordered successfully");
  };

  const duplicateLink = async (link: any) => {
    if (!currentBioPage) return;

    const duplicatedLink = await insertData('links', {
      bio_page_id: currentBioPage.id,
      title: `${link.title} (Copy)`,
      url: link.url,
      description: link.description,
      icon: link.icon,
      position: links.length,
      is_active: link.is_active
    });
    
    if (duplicatedLink) {
      toast.success("Link duplicated successfully");
    }
  };

  const getLinkMetrics = (linkId: string) => {
    return metrics.linkPerformance.find(perf => perf.id === linkId) || {
      clicks: 0,
      ctr: 0,
      heatLevel: 0
    };
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-3xl font-bold">Link Management</h1>
            {connected && (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">Live</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">Manage and organize your bio page links with real-time updates</p>
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

      {/* Links List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>Your Links ({links.length})</span>
              {connected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
            </div>
            <Badge variant="secondary">{links.filter(l => l.is_active).length} active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No links yet. Add your first link to get started!</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Link
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {links
                      .sort((a, b) => a.position - b.position)
                      .map((link, index) => {
                        const linkMetrics = getLinkMetrics(link.id);
                        return (
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
                                      {connected && linkMetrics.clicks > 0 && (
                                        <Badge variant="outline" className="text-green-600">
                                          Live: {linkMetrics.clicks} clicks
                                        </Badge>
                                      )}
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
                                    <div className="text-lg font-semibold">{linkMetrics.clicks}</div>
                                    <div className="text-sm text-gray-500">{linkMetrics.ctr}% CTR</div>
                                    {linkMetrics.heatLevel > 0 && (
                                      <div className="text-xs text-orange-600">
                                        🔥 {Math.round(linkMetrics.heatLevel * 100)}% heat
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleToggleActive(link)}
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
                        );
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Live Bio Page Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Live Preview
            {connected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm mx-auto bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold">{currentBioPage?.title || "My Bio Page"}</h2>
              <p className="text-gray-600">{currentBioPage?.description || "Creator & Entrepreneur"}</p>
            </div>
            
            <div className="space-y-3">
              {links
                .filter(link => link.is_active)
                .sort((a, b) => a.position - b.position)
                .map((link) => {
                  const linkMetrics = getLinkMetrics(link.id);
                  return (
                    <div
                      key={link.id}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                    >
                      <div className="flex items-center space-x-3">
                        {link.icon && <span className="text-xl">{link.icon}</span>}
                        <div className="flex-1">
                          <h3 className="font-medium">{link.title}</h3>
                          {link.description && (
                            <p className="text-sm text-gray-600">{link.description}</p>
                          )}
                        </div>
                        {linkMetrics.clicks > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {linkMetrics.clicks}
                          </Badge>
                        )}
                      </div>
                      {linkMetrics.heatLevel > 0 && (
                        <div 
                          className="absolute inset-0 bg-red-500 opacity-10 rounded-lg pointer-events-none"
                          style={{ opacity: linkMetrics.heatLevel * 0.3 }}
                        ></div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeLinkManagement;