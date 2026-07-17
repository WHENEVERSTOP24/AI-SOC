import { useState, useCallback } from 'react';
import { useAnalysisStore } from '../store/analysisStore';
import type { Alert, AlertAnalysis } from '../types';

const STORAGE_KEY = 'ai-soc-analysis-history';
const MAX_HISTORY = 20;

interface CachedEntry {
  analysis: AlertAnalysis;
  alertId: string;
  timestamp: string;
  alertName: string;
}

function loadHistory(): CachedEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: CachedEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch {
    // localStorage full — silently fail
  }
}

export function useAnalysis() {
  const analyzing = useAnalysisStore((s) => s.analyzing);
  const result = useAnalysisStore((s) => s.analysis);
  const error = useAnalysisStore((s) => s.analysisError);
  const fetchAnalysis = useAnalysisStore((s) => s.fetchAnalysis);
  const clearAnalysis = useAnalysisStore((s) => s.clearAnalysis);

  const [history, setHistory] = useState<CachedEntry[]>(loadHistory);
  const [alertId, setAlertId] = useState<string | null>(null);

  const analyze = useCallback(async (alert: { id: string; rule_name: string } & Partial<Alert>) => {
    setAlertId(alert.id);
    await fetchAnalysis(alert as Alert);

    // After fetch completes, cache if we got a result
    const state = useAnalysisStore.getState();
    if (state.analysis) {
      const entry: CachedEntry = {
        analysis: state.analysis,
        alertId: alert.id,
        timestamp: new Date().toISOString(),
        alertName: alert.rule_name,
      };
      const updated = [entry, ...loadHistory()];
      setHistory(updated);
      saveHistory(updated);
    }
  }, [fetchAnalysis]);

  const clearResult = useCallback(() => {
    clearAnalysis();
    setAlertId(null);
  }, [clearAnalysis]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const loadFromHistory = useCallback((entry: CachedEntry) => {
    // Manually set analysis from history
    useAnalysisStore.setState({
      analysis: entry.analysis,
      analyzing: false,
      analysisError: null,
    });
    setAlertId(entry.alertId);
  }, []);

  return {
    analyzing,
    result,
    error,
    alertId,
    history,
    analyze,
    clearResult,
    clearHistory,
    loadFromHistory,
  };
}
