import { useEffect } from 'react';
import { useAlertsStore } from '../store/alertsStore';

export function useAlerts() {
  const alerts = useAlertsStore((s) => s.alerts);
  const loading = useAlertsStore((s) => s.alertsLoading);
  const error = useAlertsStore((s) => s.alertsError);
  const lastUpdated = useAlertsStore((s) => s.alertsLastUpdated);
  const fetchAlerts = useAlertsStore((s) => s.fetchAlerts);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    data: alerts,
    loading,
    error,
    refetch: fetchAlerts,
    usingMock: false,
    isOffline: error !== null && alerts.length === 0,
    lastUpdated,
    dataSource: alerts.length > 0 ? 'live' : 'mock',
    loadingLabel: loading ? (alerts.length > 0 ? 'Syncing with backend...' : 'Loading alerts...') : 'Loaded',
  };
}
