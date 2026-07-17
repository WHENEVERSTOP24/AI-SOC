import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { useGlobalRefreshStore } from '../store/globalRefreshStore';

interface SimulatorState {
  isRunning: boolean;
  result: { status: string; message: string } | null;
  error: string | null;
}

export function useSimulator() {
  const [state, setState] = useState<SimulatorState>({
    isRunning: false,
    result: null,
    error: null,
  });

  const triggerGlobalRefresh = useGlobalRefreshStore((s) => s.triggerGlobalRefresh);

  const runAttack = useCallback(async (attackId: string) => {
    setState({ isRunning: true, result: null, error: null });

    const response = await api.simulateAttack(attackId);

    if (response.status === 'ok' && response.data) {
      setState({
        isRunning: false,
        result: { status: 'success', message: response.data.message },
        error: null,
      });

      // 🔄 Trigger global refresh: Dashboard, Alerts, Incidents, Investigation all update
      triggerGlobalRefresh();

      return true;
    } else {
      setState({
        isRunning: false,
        result: null,
        error: response.error || 'Simulation failed.',
      });
      return false;
    }
  }, [triggerGlobalRefresh]);

  const reset = useCallback(() => {
    setState({ isRunning: false, result: null, error: null });
  }, []);

  return { ...state, runAttack, reset };
}
