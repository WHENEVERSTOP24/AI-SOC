import { create } from 'zustand';
import { api } from '../services/api';
import type { Alert } from '../types';

interface AlertsState {
  alerts: Alert[];
  alertsLoading: boolean;
  alertsError: string | null;
  alertsLastUpdated: string | null;
  fetchAlerts: () => Promise<void>;
}

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [],
  alertsLoading: false,
  alertsError: null,
  alertsLastUpdated: null,

  fetchAlerts: async () => {
    set({ alertsLoading: true, alertsError: null });
    try {
      const res = await api.getAlerts();
      if (res.status === 'ok' && res.data) {
        set({ alerts: res.data, alertsLoading: false, alertsLastUpdated: new Date().toISOString() });
      } else {
        set({ alertsLoading: false, alertsError: res.error || 'Failed to load alerts' });
      }
    } catch {
      set({ alertsLoading: false, alertsError: 'Failed to load alerts' });
    }
  },
}));
