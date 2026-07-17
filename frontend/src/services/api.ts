import axios, { AxiosError } from 'axios';
import type { Alert, Incident, DashboardStats, SimulationAttack, AlertAnalysis } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Response type wrappers ───

interface ApiResponse<T> {
  status: string;
  data?: T;
  error?: string;
}

interface AlertsResponse {
  status: string;
  alerts: Alert[];
  total?: number;
}

interface IncidentsResponse {
  status: string;
  incidents: Incident[];
  total?: number;
}

interface IncidentDetailResponse {
  status: string;
  incident: Incident | null;
}

interface DashboardResponse {
  status: string;
  stats: DashboardStats;
}

interface SimulateResponse {
  status: string;
  command: string;
  message: string;
  pipeline?: unknown;
}

interface MitreResponse {
  status: string;
  techniques: { id: string; count: number; status: string }[];
  coverage: { total_unique: number; mapped_incidents: number };
}

interface AnalyzeAlertResponse {
  status: string;
  analysis: AlertAnalysis;
  message?: string;
}

interface HealthResponse {
  status: string;
  sysmon_available: boolean;
  pipeline_available: boolean;
  alerts_cached: number;
  incidents_cached: number;
}

// ─── Error helper ───

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') return 'Request timed out. Backend may be unavailable.';
    if (!error.response) return 'Cannot connect to backend. Ensure the server is running.';
    return `Server error: ${error.response.status} ${error.response.statusText}`;
  }
  if (error instanceof Error) return error.message;
  return 'An unknown error occurred.';
}

// ─── API methods ───

export const api = {
  /** Health check — lightweight, no pipeline required */
  healthCheck: async (): Promise<ApiResponse<HealthResponse>> => {
    try {
      const { data } = await apiClient.get<HealthResponse>('/health');
      return { status: 'ok', data };
    } catch (error) {
      return { status: 'error', error: getErrorMessage(error) };
    }
  },

  /** Get all alerts from the pipeline */
  getAlerts: async (): Promise<ApiResponse<Alert[]>> => {
    try {
      const { data } = await apiClient.get<AlertsResponse>('/alerts');
      if (data.status === 'ok' && data.alerts) {
        return { status: 'ok', data: data.alerts };
      }
      return { status: data.status, data: [], error: 'No alerts returned.' };
    } catch (error) {
      return { status: 'error', data: [], error: getErrorMessage(error) };
    }
  },

  /** Get all incidents */
  getIncidents: async (): Promise<ApiResponse<Incident[]>> => {
    try {
      const { data } = await apiClient.get<IncidentsResponse>('/incidents');
      if (data.status === 'ok' && data.incidents) {
        return { status: 'ok', data: data.incidents };
      }
      return { status: data.status, data: [], error: 'No incidents returned.' };
    } catch (error) {
      return { status: 'error', data: [], error: getErrorMessage(error) };
    }
  },

  /** Get incident detail by ID */
  getIncidentById: async (id: string): Promise<ApiResponse<Incident | null>> => {
    try {
      const { data } = await apiClient.get<IncidentDetailResponse>(`/incident/${id}`);
      if (data.status === 'ok' && data.incident) {
        return { status: 'ok', data: data.incident };
      }
      return { status: data.status === 'not_found' ? 'not_found' : data.status, data: null, error: `Incident ${id} not found.` };
    } catch (error) {
      return { status: 'error', data: null, error: getErrorMessage(error) };
    }
  },

  /** Get aggregated dashboard statistics */
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const { data } = await apiClient.get<DashboardResponse>('/dashboard');
      if (data.status === 'ok' && data.stats) {
        return { status: 'ok', data: data.stats };
      }
      return { status: data.status, error: 'Dashboard stats unavailable.' };
    } catch (error) {
      return { status: 'error', error: getErrorMessage(error) };
    }
  },

  /** Get MITRE ATT&CK technique coverage */
  getMitre: async (): Promise<ApiResponse<MitreResponse['techniques']>> => {
    try {
      const { data } = await apiClient.get<MitreResponse>('/mitre');
      if (data.status === 'ok') {
        return { status: 'ok', data: data.techniques };
      }
      return { status: data.status, data: [] };
    } catch (error) {
      return { status: 'error', data: [], error: getErrorMessage(error) };
    }
  },

  /** Get investigation graph + correlation + attack story for an incident */
  getInvestigation: async (incidentId?: string): Promise<{ status: string; data?: unknown; error?: string }> => {
    try {
      const url = incidentId ? `/investigation/${incidentId}` : '/investigation';
      const { data } = await apiClient.get<{ status: string; investigation: unknown }>(url);
      if (data.status === 'ok' && data.investigation) {
        return { status: 'ok', data: data.investigation };
      }
      // Preserve backend's exact status (e.g. 'not_found') so callers can differentiate
      return { status: data.status, data: undefined, error: data.status === 'not_found' ? 'No investigation available.' : 'Investigation data unavailable.' };
    } catch (error) {
      return { status: 'error', error: getErrorMessage(error) };
    }
  },

  /** Run lightweight correlation on current alerts */
  getCorrelation: async (): Promise<{ status: string; data?: unknown; error?: string }> => {
    try {
      const { data } = await apiClient.get<{ status: string; correlation: unknown }>('/correlate');
      if (data.status === 'ok' && data.correlation) {
        return { status: 'ok', data: data.correlation };
      }
      return { status: data.status, data: undefined };
    } catch (error) {
      return { status: 'error', error: getErrorMessage(error) };
    }
  },

  /** Generate an attack story from a list of alerts */
  analyzeStory: async (alerts: unknown[]): Promise<{ status: string; data?: unknown; error?: string }> => {
    try {
      const { data } = await apiClient.post<{ status: string; story: unknown }>('/analyze/story', { alerts }, { timeout: 60000 });
      if (data.status === 'ok' && data.story) {
        return { status: 'ok', data: data.story };
      }
      return { status: data.status, error: 'Attack story generation failed.' };
    } catch (error) {
      return { status: 'error', error: getErrorMessage(error) };
    }
  },

  /** Get list of available simulator attacks */
  getSimulatorAttacks: async (): Promise<ApiResponse<SimulationAttack[]>> => {
    try {
      const { data } = await apiClient.get<{ status: string; attacks: SimulationAttack[] }>('/simulate/attacks');
      if (data.status === 'ok' && data.attacks) {
        return { status: 'ok', data: data.attacks };
      }
      return { status: data.status, data: [] };
    } catch (error) {
      return { status: 'error', data: [], error: getErrorMessage(error) };
    }
  },

  /** Analyze a single alert using AI */
  analyzeAlert: async (alert: Alert): Promise<ApiResponse<AlertAnalysis>> => {
    try {
      const { data } = await apiClient.post<AnalyzeAlertResponse>('/analyze/alert', alert, { timeout: 120000 });
      if (data.status === 'ok' && data.analysis) {
        const withMeta: AlertAnalysis = {
          ...data.analysis,
          analyzed_at: new Date().toISOString(),
          alert_id: alert.id,
        };
        return { status: 'ok', data: withMeta };
      }
      return { status: 'error', error: data.message || 'Analysis failed.' };
    } catch (error) {
      return { status: 'error', error: getErrorMessage(error) };
    }
  },

  /** Run a simulation attack */
  simulateAttack: async (attackId: string): Promise<ApiResponse<SimulateResponse>> => {
    try {
      const { data } = await apiClient.post<SimulateResponse>(`/simulate/${attackId}`);
      return { status: data.status === 'success' ? 'ok' : 'error', data };
    } catch (error) {
      return { status: 'error', error: getErrorMessage(error) };
    }
  },
};

export default api;
