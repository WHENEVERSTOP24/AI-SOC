import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';

export function useDashboardStats() {
  const stats = useDashboardStore((s) => s.stats);
  const loading = useDashboardStore((s) => s.dashboardLoading);
  const error = useDashboardStore((s) => s.dashboardError);
  const lastUpdated = useDashboardStore((s) => s.dashboardLastUpdated);
  const fetchDashboard = useDashboardStore((s) => s.fetchDashboard);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data: stats,
    loading,
    error,
    refetch: fetchDashboard,
    usingMock: false,
    isOffline: error !== null && stats === null,
    lastUpdated,
    dataSource: stats !== null ? 'live' : 'mock',
    loadingLabel: loading ? 'Syncing dashboard...' : 'Loaded',
  };
}
