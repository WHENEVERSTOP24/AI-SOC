import { create } from 'zustand';
import { api } from '../services/api';
import type { Alert, AlertAnalysis } from '../types';

interface AnalysisState {
  analysis: AlertAnalysis | null;
  analyzing: boolean;
  analysisError: string | null;
  fetchAnalysis: (alert: Alert) => Promise<void>;
  clearAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysis: null,
  analyzing: false,
  analysisError: null,

  fetchAnalysis: async (alert: Alert) => {
    set({ analyzing: true, analysisError: null });
    try {
      const res = await api.analyzeAlert(alert);
      if (res.status === 'ok' && res.data) {
        set({ analysis: res.data, analyzing: false });
      } else {
        set({ analyzing: false, analysisError: res.error || 'Analysis failed.' });
      }
    } catch {
      set({ analyzing: false, analysisError: 'Analysis failed.' });
    }
  },

  clearAnalysis: () => set({ analysis: null, analysisError: null }),
}));
