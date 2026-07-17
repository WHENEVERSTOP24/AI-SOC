import React, { useState, useMemo, useCallback } from 'react';
import { Search, ShieldAlert, FileCode, SlidersHorizontal, RefreshCw, WifiOff, Sparkles } from 'lucide-react';
import { formatTimeOnly } from '../utils/formatTime';
import AlertTable from '../components/AlertTable';
import AlertCard from '../components/AlertCard';
import AIAnalysisPanel from '../components/AIAnalysisPanel';
import { useAlerts } from '../hooks/useAlerts';
import { useAnalysis } from '../hooks/useAnalysis';
import type { Alert, AlertAnalysis } from '../types';

export const Alerts: React.FC = () => {
  const { data: alertsData, loading, error, refetch, isOffline, lastUpdated } = useAlerts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const {
    analyzing,
    result: analysis,
    error: analysisError,
    history,
    analyze,
    clearResult,
    clearHistory,
    loadFromHistory,
  } = useAnalysis();

  // Filter alerts based on search and selected filters
  const filteredAlerts = useMemo(() => {
    const source = alertsData || [];
    return source.filter((alert) => {
      const matchesSearch = 
        alert.rule_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = selectedSeverity === 'ALL' || alert.severity === selectedSeverity;
      const matchesStatus = selectedStatus === 'ALL' || alert.status === selectedStatus;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alertsData, searchQuery, selectedSeverity, selectedStatus]);

  // Set initial selected alert when data loads
  React.useEffect(() => {
    if (filteredAlerts.length > 0 && !selectedAlert) {
      setSelectedAlert(filteredAlerts[0]);
    } else if (filteredAlerts.length > 0) {
      const exists = filteredAlerts.some((a) => a.id === selectedAlert?.id);
      if (!exists) {
        setSelectedAlert(filteredAlerts[0]);
      }
    } else {
      setSelectedAlert(null);
    }
  }, [filteredAlerts, selectedAlert]);

  // Handle analyze click
  const handleAnalyze = useCallback(() => {
    if (selectedAlert) {
      setShowAnalysis(true);
      analyze(selectedAlert);
    }
  }, [selectedAlert, analyze]);

  // Handle history item click
  const handleLoadFromHistory = useCallback((entry: {
    analysis: AlertAnalysis;
    alertId: string;
    timestamp: string;
    alertName: string;
  }) => {
    setShowAnalysis(true);
    loadFromHistory(entry);
  }, [loadFromHistory]);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Alert Triage Panel</h1>
          <p className="text-sm text-soc-muted mt-1.5 flex items-center space-x-2">
            {isOffline ? (
              <WifiOff className="h-4 w-4 text-soc-critical" />
            ) : loading ? (
              <RefreshCw className="h-4 w-4 text-soc-accent animate-spin" />
            ) : (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-low opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-soc-low"></span>
              </span>
            )}
            <span>
              {isOffline
                ? 'Backend offline — showing cached/mock data'
                : loading
                ? 'Fetching alerts from backend...'
                : `Review and audit process execution, network behaviors, and registry modifications.`}
            </span>
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center space-x-1.5 text-xs text-soc-accent hover:text-white px-3 py-1.5 rounded-lg border border-soc-accent/30 hover:bg-soc-accent/10 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Offline/error banner */}
      {(isOffline || error) && (
        <div className="bg-amber-950/10 border border-amber-900/30 text-amber-400/90 rounded-xl p-3 flex items-center space-x-2 text-xs">
          <WifiOff className="h-4 w-4 flex-shrink-0" />
          <span>Using demo data. {error ? `Error: ${error}` : ''}</span>
          {lastUpdated && <span className="ml-auto text-[9px] font-mono opacity-70">Cached {formatTimeOnly(lastUpdated)}</span>}
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-soc-surface border border-soc-border/60 rounded-xl p-5 shadow-card flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-soc-muted/50" />
          <input
            type="text"
            placeholder="Search alerts by ID, rule name, user, or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-soc-bg/60 border border-soc-border/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-soc-muted/40 focus:outline-none focus:border-soc-accent/50 focus:bg-soc-bg transition-all duration-200"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-soc-muted/60" />
            <span className="text-xs text-soc-muted font-medium">Filters:</span>
          </div>

          {/* Severity filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-soc-muted font-medium">Severity</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-soc-bg/60 border border-soc-border/40 text-soc-text rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-soc-accent/50 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="INFO">Info</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-soc-muted font-medium">Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-soc-bg/60 border border-soc-border/40 text-soc-text rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-soc-accent/50 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && !alertsData && (
        <div className="bg-soc-card border border-soc-border/60 rounded-xl p-8 text-center">
          <RefreshCw className="h-8 w-8 mx-auto text-soc-accent animate-spin mb-3" />
          <p className="text-sm text-soc-muted">Loading alerts from backend...</p>
        </div>
      )}

      {/* Split Screen — Alert Table + Analysis/Details */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Alerts table list (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <AlertTable 
              alerts={filteredAlerts}
              selectedAlertId={selectedAlert?.id}
              onSelectAlert={(alert) => {
                setSelectedAlert(alert);
                setShowAnalysis(false);
              }}
            />
          </div>

          {/* Right panel (1/3 width) — toggle between Telemetry Inspector and AI Analysis */}
          <div className="lg:col-span-1">
            {/* Toggle between views */}
            {selectedAlert && (
              <div className="flex items-center space-x-1.5 mb-3 px-1">
                <button
                  onClick={() => setShowAnalysis(false)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    !showAnalysis
                      ? 'bg-soc-accent text-white shadow-glow'
                      : 'bg-soc-bg/60 border border-soc-border/30 text-soc-muted hover:text-white hover:bg-soc-bg'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Telemetry</span>
                </button>
                <button
                  onClick={() => setShowAnalysis(true)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    showAnalysis
                      ? 'bg-soc-accent text-white shadow-glow'
                      : 'bg-soc-bg/60 border border-soc-border/30 text-soc-muted hover:text-white hover:bg-soc-bg'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Analysis</span>
                </button>
              </div>
            )}

            {/* Show selected alert's telemetry or AI analysis */}
            {selectedAlert ? (
              <div className="sticky top-20 space-y-4">
                {showAnalysis ? (
                  <AIAnalysisPanel
                    analysis={analysis}
                    analyzing={analyzing}
                    error={analysisError}
                    history={history}
                    selectedAlertName={selectedAlert?.rule_name}
                    onAnalyze={handleAnalyze}
                    onLoadFromHistory={handleLoadFromHistory}
                    onClearHistory={clearHistory}
                    onClearResult={clearResult}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-soc-accent flex items-center space-x-1.5">
                        <FileCode className="h-4 w-4" />
                        <span>Telemetry Inspector</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-soc-bg/60 border border-soc-border/30 text-soc-muted rounded-lg font-mono">
                        Event Record
                      </span>
                    </div>
                    <AlertCard alert={selectedAlert} />
                  </>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-soc-border/40 rounded-xl p-10 text-center bg-soc-surface/30">
                <ShieldAlert className="h-10 w-10 mx-auto text-soc-muted/30 mb-4" />
                <h4 className="font-semibold text-soc-muted text-sm">No Alert Selected</h4>
                <p className="text-xs text-soc-muted/60 mt-2 max-w-[220px] mx-auto leading-relaxed">
                  {filteredAlerts.length === 0
                    ? 'No alerts match your current filters.'
                    : 'Click on any alert in the table to display details or run AI analysis.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
