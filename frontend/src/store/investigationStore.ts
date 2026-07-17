import { create } from 'zustand';
import { api } from '../services/api';
import type { Investigation } from '../types';

interface InvestigationState {
  investigation: Investigation | null;
  investigationLoading: boolean;
  investigationError: string | null;
  investigationLastUpdated: string | null;
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
  fetchInvestigation: (incidentId?: string) => Promise<void>;
  clearInvestigation: () => void;
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  investigation: null,
  investigationLoading: false,
  investigationError: null,
  investigationLastUpdated: null,
  selectedIncidentId: '',

  setSelectedIncidentId: (id: string) => set({ selectedIncidentId: id }),

  fetchInvestigation: async (incidentId?: string) => {
    const id = incidentId || get().selectedIncidentId;
    if (!id) {
      set({ investigationLoading: false, investigationError: 'No incident selected.' });
      return;
    }
    set({ investigationLoading: true, investigationError: null, investigation: null });
    try {
      const res = await api.getInvestigation(id);
      if (res.status === 'ok' && res.data) {
        set({
          investigation: res.data as unknown as Investigation,
          investigationLoading: false,
          investigationLastUpdated: new Date().toISOString(),
        });
      } else {
        // Use the error message from api layer (e.g. 'No investigation available.' for not_found)
        set({ investigationLoading: false, investigationError: res.error || 'Investigation data unavailable.' });
      }
    } catch {
      set({ investigationLoading: false, investigationError: 'Failed to load investigation.' });
    }
  },

  clearInvestigation: () => set({ investigation: null, investigationLastUpdated: null }),
}));
