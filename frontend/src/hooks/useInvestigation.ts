import { useEffect } from 'react';
import { useInvestigationStore } from '../store/investigationStore';

export function useInvestigation(incidentId: string) {
  const investigation = useInvestigationStore((s) => s.investigation);
  const loading = useInvestigationStore((s) => s.investigationLoading);
  const error = useInvestigationStore((s) => s.investigationError);
  const lastUpdated = useInvestigationStore((s) => s.investigationLastUpdated);
  const fetchInvestigation = useInvestigationStore((s) => s.fetchInvestigation);
  const setSelectedIncidentId = useInvestigationStore((s) => s.setSelectedIncidentId);
  const clearInvestigation = useInvestigationStore((s) => s.clearInvestigation);

  // Set selected incident ID whenever incidentId changes
  useEffect(() => {
    setSelectedIncidentId(incidentId);
  }, [incidentId, setSelectedIncidentId]);

  // Fetch investigation whenever incidentId changes
  useEffect(() => {
    fetchInvestigation(incidentId);
  }, [incidentId, fetchInvestigation]);

  const isNotFound = error === 'No investigation available.';
  const isOffline = error !== null && investigation === null && !isNotFound;

  return {
    data: investigation,
    loading,
    error,
    lastUpdated,
    refetch: () => fetchInvestigation(incidentId),
    clearInvestigation,
    usingMock: false,
    isOffline,
    isNotFound,
    dataSource: investigation !== null ? 'live' : ('mock' as 'live' | 'cached' | 'mock'),
    loadingLabel: loading ? 'Loading Investigation...' : 'Loaded',
  };
}
