import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Activity,
  Link,
  Shuffle,
  Layout,
  Sparkles,
  FileText,
  Globe,
  Gift,
  User,
  CreditCard,
  Bell,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRealTimeData } from "@/hooks/useRealTimeData";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  category?: string;
}

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useRealTimeData();

  const bioPages = data.bioPages || [];
  const currentBioPage = bioPages[0];

  const sidebarItems: SidebarItem[] = [
    // Main Navigation
    { id: "dashboard", label: "Dashboard Home", icon: <Home size={20} />, path: "/dashboard", category: "main" },
    { id: "heatmap", label: "Heatmap Visualization", icon: <Activity size={20} />, path: "/dashboard/heatmap", category: "main" },
    { id: "links", label: "Link Management", icon: <Link size={20} />, path: "/dashboard/links", category: "main" },
    { id: "testing", label: "A/B Testing", icon: <Shuffle size={20} />, path: "/dashboard/testing", category: "main" },
    { id: "builder", label: "Bio Page Builder", icon: <Layout size={20} />, path: "/dashboard/builder", category: "main" },
    
    // Tools & Insights
    { id: "ai", label: "AI Assistant", icon: <Sparkles size={20} />, path: "/dashboard/ai", category: "tools" },
    { id: "reports", label: "Reports & Export", icon: <FileText size={20} />, path: "/dashboard/reports", category: "tools" },
    { id: "seo", label: "SEO Tools", icon: <Globe size={20} />, path: "/dashboard/seo", category: "tools" },
    { id: "referral", label: "Referral Program", icon: <Gift size={20} />, path: "/dashboard/referral", category: "tools" },
        
    // User Settings
    { id: "profile", label: "Profile & Appearance", icon: <User size={20} />, path: "/dashboard/profile", category: "settings" },
    { id: "billing", label: "Subscription & Billing", icon: <CreditCard size={20} />, path: "/dashboard/billing", category: "settings" },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} />, path: "/dashboard/notifications", category: "settings" },
    { id: "support", label: "Support / Helpdesk", icon: <LifeBuoy size={20} />, path: "/dashboard/support", category: "settings" },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleViewLivePage = () => {
    if (currentBioPage) {
      // Open in new tab to avoid navigation issues
      window.open(`/bio/${currentBioPage.id}`, '_blank');
    } else {
      toast.error("No bio page found. Please create one first.");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderSidebarItem = (item: SidebarItem) => (
    <Button
      key={item.id}
      variant={isActive(item.path) ? "secondary" : "ghost"}
      className={`w-full justify-start ${collapsed ? "px-2" : "px-3"} h-10`}
      onClick={() => navigate(item.path)}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
    </Button>
  );

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "main": return "📊 Main Navigation";
      case "tools": return "⚙️ Tools & Insights";
      case "settings": return "👤 User Settings";
      default: return "";
    }
  };

  const groupedItems = sidebarItems.reduce((acc, item) => {
    const category = item.category || "main";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  return (
    <div className={`bg-card border-r border-border h-screen flex flex-col transition-all duration-300 ${
      collapsed ? "w-16" : "w-64"
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <span className="text-primary-foreground font-bold text-lg">🔥</span>
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              ClickHeat
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <span className="text-primary-foreground font-bold text-lg">🔥</span>
            </div>
          </div>
        )}
      </div>

      {/* View Live Page Button */}
      {!collapsed && currentBioPage && (
        <div className="p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewLivePage}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Page
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            {!collapsed && (
              <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {getCategoryTitle(category)}
              </p>
            )}
            <div className="space-y-1">
              {items.map(renderSidebarItem)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border space-y-2">
        {!collapsed && (
          <div className="flex items-center space-x-3 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User Name</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={`w-full ${collapsed ? "px-2" : "justify-start px-3"}`}
        >
          <LogOut size={16} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full px-2"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;