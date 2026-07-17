import { useEffect } from 'react';
import { useIncidentsStore } from '../store/incidentsStore';

export function useIncidents() {
  const incidents = useIncidentsStore((s) => s.incidents);
  const loading = useIncidentsStore((s) => s.incidentsLoading);
  const error = useIncidentsStore((s) => s.incidentsError);
  const lastUpdated = useIncidentsStore((s) => s.incidentsLastUpdated);
  const fetchIncidents = useIncidentsStore((s) => s.fetchIncidents);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    data: incidents,
    loading,
    error,
    refetch: fetchIncidents,
    usingMock: false,
    isOffline: error !== null && incidents.length === 0,
    lastUpdated,
    dataSource: incidents.length > 0 ? 'live' : 'mock',
    loadingLabel: loading ? (incidents.length > 0 ? 'Syncing with backend...' : 'Loading incidents...') : 'Loaded',
  };
}

export function useIncidentById(id: string) {
  const incidents = useIncidentsStore((s) => s.incidents);
  const loading = useIncidentsStore((s) => s.incidentsLoading);
  const fetchIncidents = useIncidentsStore((s) => s.fetchIncidents);

  useEffect(() => {
    if (incidents.length === 0) fetchIncidents();
  }, [incidents.length, fetchIncidents]);

  const incident = incidents.find((i) => i.id === id) || null;

  return {
    data: incident,
    loading: loading && incidents.length === 0,
    error: !loading && incidents.length === 0 ? 'No incidents found.' : null,
    refetch: fetchIncidents,
    usingMock: false,
    isOffline: false,
  };
}
