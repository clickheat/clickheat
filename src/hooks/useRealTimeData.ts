import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RealTimeData {
  bioPages: any[];
  links: any[];
  analytics: any[];
  profiles: any[];
}

export const useRealTimeData = (userId?: string) => {
  const [data, setData] = useState<RealTimeData>({
    bioPages: [],
    links: [],
    analytics: [],
    profiles: []
  });
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const fetchInitialData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [bioPages, links, analytics, profiles] = await Promise.all([
        supabase.from('bio_pages').select('*').eq('user_id', userId),
        supabase.from('links').select(`
          *,
          bio_pages!inner(user_id)
        `).eq('bio_pages.user_id', userId),
        supabase.from('click_analytics').select('*').eq('user_id', userId),
        supabase.from('profiles').select('*').eq('id', userId)
      ]);

      setData({
        bioPages: bioPages.data || [],
        links: links.data || [],
        analytics: analytics.data || [],
        profiles: profiles.data || []
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetchInitialData();

    // Set up real-time subscriptions
    const bioPageChannel = supabase
      .channel('bio_pages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bio_pages', filter: `user_id=eq.${userId}` },
        (payload) => {
          setData(prev => {
            const newBioPages = [...prev.bioPages];
            
            if (payload.eventType === 'INSERT') {
              newBioPages.push(payload.new);
            } else if (payload.eventType === 'UPDATE') {
              const index = newBioPages.findIndex(item => item.id === payload.new.id);
              if (index !== -1) newBioPages[index] = payload.new;
            } else if (payload.eventType === 'DELETE') {
              const index = newBioPages.findIndex(item => item.id === payload.old.id);
              if (index !== -1) newBioPages.splice(index, 1);
            }
            
            return { ...prev, bioPages: newBioPages };
          });
        }
      )
      .subscribe();

    const linksChannel = supabase
      .channel('links_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'links' },
        async (payload) => {
          // Verify this link belongs to the user
          if (payload.new || payload.old) {
            const linkId = payload.new?.id || payload.old?.id;
            const { data: linkData } = await supabase
              .from('links')
              .select('bio_pages!inner(user_id)')
              .eq('id', linkId)
              .single();
            
            if (linkData?.bio_pages?.user_id !== userId) return;
          }

          setData(prev => {
            const newLinks = [...prev.links];
            
            if (payload.eventType === 'INSERT') {
              newLinks.push(payload.new);
            } else if (payload.eventType === 'UPDATE') {
              const index = newLinks.findIndex(item => item.id === payload.new.id);
              if (index !== -1) newLinks[index] = payload.new;
            } else if (payload.eventType === 'DELETE') {
              const index = newLinks.findIndex(item => item.id === payload.old.id);
              if (index !== -1) newLinks.splice(index, 1);
            }
            
            return { ...prev, links: newLinks };
          });
        }
      )
      .subscribe();

    const analyticsChannel = supabase
      .channel('analytics_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'click_analytics', filter: `user_id=eq.${userId}` },
        (payload) => {
          setData(prev => {
            const newAnalytics = [...prev.analytics];
            
            if (payload.eventType === 'INSERT') {
              newAnalytics.push(payload.new);
              // Show real-time notification for new clicks
              toast.success(`New click recorded: ${payload.new.link_id}`, {
                duration: 2000,
              });
            }
            
            return { ...prev, analytics: newAnalytics };
          });
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        (payload) => {
          setData(prev => {
            const newProfiles = [...prev.profiles];
            
            if (payload.eventType === 'UPDATE') {
              const index = newProfiles.findIndex(item => item.id === payload.new.id);
              if (index !== -1) {
                newProfiles[index] = payload.new;
              } else {
                newProfiles.push(payload.new);
              }
            }
            
            return { ...prev, profiles: newProfiles };
          });
        }
      )
      .subscribe();

    // Monitor connection status
    const handleConnectionChange = (status: string) => {
      setConnected(status === 'SUBSCRIBED');
      if (status === 'CLOSED') {
        toast.error('Real-time connection lost. Reconnecting...');
      } else if (status === 'SUBSCRIBED') {
        setConnected(true);
      }
    };

    bioPageChannel.on('system', {}, handleConnectionChange);

    return () => {
      supabase.removeChannel(bioPageChannel);
      supabase.removeChannel(linksChannel);
      supabase.removeChannel(analyticsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [userId, fetchInitialData]);

  const updateData = useCallback(async (table: string, id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      toast.error(`Failed to update ${table}`);
      return false;
    }
  }, []);

  const insertData = useCallback(async (table: string, data: any) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      toast.error(`Failed to create ${table}`);
      return null;
    }
  }, []);

  const deleteData = useCallback(async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      toast.error(`Failed to delete ${table}`);
      return false;
    }
  }, []);

  return {
    data,
    loading,
    connected,
    updateData,
    insertData,
    deleteData,
    refetch: fetchInitialData
  };
};