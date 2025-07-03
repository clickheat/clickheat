import { useEffect, useState } from 'react';
import { useRealTimeData } from './useRealTimeData';

export interface AnalyticsMetrics {
  totalViews: number;
  totalClicks: number;
  avgCTR: number;
  topLink: string;
  topReferrer: string;
  recentClicks: any[];
  linkPerformance: Array<{
    id: string;
    title: string;
    clicks: number;
    ctr: number;
    heatLevel: number;
  }>;
  trafficSources: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const useRealTimeAnalytics = (userId?: string) => {
  const { data, loading, connected } = useRealTimeData(userId);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalViews: 0,
    totalClicks: 0,
    avgCTR: 0,
    topLink: '',
    topReferrer: '',
    recentClicks: [],
    linkPerformance: [],
    trafficSources: []
  });

  useEffect(() => {
    if (loading) return;

    // Calculate metrics from real-time data
    const calculateMetrics = () => {
      const { analytics, links } = data;
      
      const totalClicks = analytics.length;
      const totalViews = Math.round(totalClicks / 0.273); // Assuming 27.3% average CTR
      const avgCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

      // Calculate link performance
      const linkClickCounts = analytics.reduce((acc: any, click: any) => {
        acc[click.link_id] = (acc[click.link_id] || 0) + 1;
        return acc;
      }, {});

      const linkPerformance = links.map((link: any) => {
        const clicks = linkClickCounts[link.id] || 0;
        const views = Math.round(clicks / 0.273); // Mock views calculation
        const ctr = views > 0 ? (clicks / views) * 100 : 0;
        const maxClicks = Math.max(...Object.values(linkClickCounts), 1);
        const heatLevel = clicks / (maxClicks as number);

        return {
          id: link.id,
          title: link.title,
          clicks,
          ctr: Math.round(ctr * 10) / 10,
          heatLevel
        };
      }).sort((a, b) => b.clicks - a.clicks);

      const topLink = linkPerformance[0]?.title || 'No data';

      // Calculate traffic sources
      const referrerCounts = analytics.reduce((acc: any, click: any) => {
        const referrer = click.referrer || 'Direct';
        const source = referrer.includes('instagram') ? 'Instagram' :
                      referrer.includes('youtube') ? 'YouTube' :
                      referrer.includes('twitter') ? 'Twitter' :
                      referrer.includes('x.com') ? 'Twitter' : 'Direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      const totalReferrerClicks = Object.values(referrerCounts).reduce((a: any, b: any) => a + b, 0);
      const trafficSources = Object.entries(referrerCounts).map(([name, count]: [string, any]) => ({
        name,
        value: Math.round((count / totalReferrerClicks) * 100),
        color: name === 'Instagram' ? '#E4405F' :
               name === 'YouTube' ? '#FF0000' :
               name === 'Twitter' ? '#1DA1F2' : '#8B5CF6'
      }));

      const topReferrer = trafficSources[0]?.name || 'Direct';

      // Recent clicks (last 10)
      const recentClicks = analytics
        .sort((a: any, b: any) => new Date(b.clicked_at).getTime() - new Date(a.clicked_at).getTime())
        .slice(0, 10);

      setMetrics({
        totalViews,
        totalClicks,
        avgCTR: Math.round(avgCTR * 10) / 10,
        topLink,
        topReferrer,
        recentClicks,
        linkPerformance,
        trafficSources
      });
    };

    calculateMetrics();
  }, [data, loading]);

  return {
    metrics,
    loading,
    connected,
    rawData: data
  };
};