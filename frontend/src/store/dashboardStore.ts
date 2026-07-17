import { create } from 'zustand';
import { api } from '../services/api';
import type { DashboardStats } from '../types';

interface DashboardState {
  stats: DashboardStats | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
  dashboardLastUpdated: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  dashboardLoading: false,
  dashboardError: null,
  dashboardLastUpdated: null,

  fetchDashboard: async () => {
    set({ dashboardLoading: true, dashboardError: null });
    try {
      const res = await api.getDashboardStats();
      if (res.status === 'ok' && res.data) {
        set({ stats: res.data, dashboardLoading: false, dashboardLastUpdated: new Date().toISOString() });
      } else {
        set({ dashboardLoading: false, dashboardError: res.error || 'Failed to load stats' });
      }
    } catch {
      set({ dashboardLoading: false, dashboardError: 'Failed to load stats' });
    }
  },
}));
