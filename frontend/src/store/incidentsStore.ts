import { create } from 'zustand';
import { api } from '../services/api';
import type { Incident } from '../types';

interface IncidentsState {
  incidents: Incident[];
  incidentsLoading: boolean;
  incidentsError: string | null;
  incidentsLastUpdated: string | null;
  fetchIncidents: () => Promise<void>;
}

export const useIncidentsStore = create<IncidentsState>((set) => ({
  incidents: [],
  incidentsLoading: false,
  incidentsError: null,
  incidentsLastUpdated: null,

  fetchIncidents: async () => {
    set({ incidentsLoading: true, incidentsError: null });
    try {
      const res = await api.getIncidents();
      if (res.status === 'ok' && res.data) {
        set({ incidents: res.data, incidentsLoading: false, incidentsLastUpdated: new Date().toISOString() });
      } else {
        set({ incidentsLoading: false, incidentsError: res.error || 'Failed to load incidents' });
      }
    } catch {
      set({ incidentsLoading: false, incidentsError: 'Failed to load incidents' });
    }
  },
}));
