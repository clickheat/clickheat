import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface BioPageViewerProps {
  pageId?: string;
  variant?: 'A' | 'B';
}

const BioPageViewer = ({ pageId, variant }: BioPageViewerProps) => {
  const { id } = useParams();
  const [bioPage, setBioPage] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentPageId = pageId || id;

  useEffect(() => {
    if (!currentPageId) return;

    const fetchBioPage = async () => {
      try {
        // Fetch bio page
        const { data: bioPageData } = await supabase
          .from('bio_pages')
          .select('*')
          .eq('id', currentPageId)
          .eq('is_published', true)
          .single();

        if (!bioPageData) {
          setLoading(false);
          return;
        }

        setBioPage(bioPageData);

        // Fetch links
        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('bio_page_id', currentPageId)
          .eq('is_active', true)
          .order('position');

        setLinks(linksData || []);

        // Track page view
        await supabase
          .from('click_analytics')
          .insert({
            bio_page_id: currentPageId,
            user_id: bioPageData.user_id,
            link_id: linksData?.[0]?.id || currentPageId, // Use first link or page id
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            country: 'Unknown',
            city: 'Unknown'
          });

      } catch (error) {
        console.error('Error fetching bio page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBioPage();
  }, [currentPageId]);

  const handleLinkClick = async (link: any) => {
    // Track click
    await supabase
      .from('click_analytics')
      .insert({
        link_id: link.id,
        bio_page_id: currentPageId,
        user_id: bioPage.user_id,
        referrer: window.location.href,
        user_agent: navigator.userAgent,
        country: 'Unknown',
        city: 'Unknown'
      });

    // Open link
    window.open(link.url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bioPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">This bio page doesn't exist or isn't published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {variant && (
          <div className="text-center mb-4">
            <Badge variant="outline">Test Variant {variant}</Badge>
          </div>
        )}
        
        <Card className="overflow-hidden shadow-xl">
          {/* Header */}
          <div className="p-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{bioPage.title}</h1>
            {bioPage.description && (
              <p className="text-blue-100">{bioPage.description}</p>
            )}
          </div>

          {/* Links */}
          <div className="p-6 space-y-4">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  {link.icon && (
                    <span className="text-2xl">{link.icon}</span>
                  )}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="text-sm text-gray-600">{link.description}</p>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 text-center text-xs text-gray-500 border-t">
            Powered by ClickHeat
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BioPageViewer;