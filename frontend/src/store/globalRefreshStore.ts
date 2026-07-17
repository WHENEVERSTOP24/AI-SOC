import { create } from 'zustand';
import { useAlertsStore } from './alertsStore';
import { useIncidentsStore } from './incidentsStore';
import { useDashboardStore } from './dashboardStore';
import { useInvestigationStore } from './investigationStore';

interface GlobalRefreshState {
  refreshCounter: number;
  triggerGlobalRefresh: () => void;
}

export const useGlobalRefreshStore = create<GlobalRefreshState>((set) => ({
  refreshCounter: 0,

  triggerGlobalRefresh: () => {
    // Fire all data fetches in parallel
    useAlertsStore.getState().fetchAlerts();
    useIncidentsStore.getState().fetchIncidents();
    useDashboardStore.getState().fetchDashboard();

    const investigationId = useInvestigationStore.getState().selectedIncidentId;
    if (investigationId) {
      useInvestigationStore.getState().fetchInvestigation(investigationId);
    }

    set((s) => ({ refreshCounter: s.refreshCounter + 1 }));
  },
}));
