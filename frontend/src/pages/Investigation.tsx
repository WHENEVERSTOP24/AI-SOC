import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  GitBranch, Sparkles, Target,
  BrainCircuit, RefreshCw, WifiOff, Layers, Crosshair,
  ChevronRight, Zap, Lightbulb, Clock, Info, SearchX,
} from 'lucide-react';
import InvestigationGraph from '../components/InvestigationGraph';
import SeverityBadge from '../components/SeverityBadge';

import { formatLastUpdated } from '../utils/formatTime';
import { useInvestigation } from '../hooks/useInvestigation';
import { useIncidents } from '../hooks/useIncidents';
import type { AttackStory, Investigation, GraphNode, CorrelationPair } from '../types';

export const InvestigationPage: React.FC = () => {
  const [selectedIncidentId, setSelectedIncidentId] = useState('');
  const [selectedGraphNode, setSelectedGraphNode] = useState<GraphNode | null>(null);

  const {
    data: investigation, loading, error, refetch,
    isOffline, isNotFound, dataSource, lastUpdated, loadingLabel,
  } = useInvestigation(selectedIncidentId);

  const { data: incidents, loading: incidentsLoading } = useIncidents();

  // Auto-select first incident once real incidents are loaded and none is selected
  useEffect(() => {
    if (!selectedIncidentId && incidents.length > 0 && !incidentsLoading) {
      setSelectedIncidentId(incidents[0].id);
    }
  }, [selectedIncidentId, incidents, incidentsLoading]);

  const currentIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  // Safely access nested data
  const inv = investigation as unknown as Investigation | null;
  const story: AttackStory | null = inv?.attack_story ?? null;
  const graphNodes = inv?.graph?.nodes ?? [];
  const graphEdges = inv?.graph?.edges ?? [];
  const correlationScore = inv?.correlation?.global_score ?? 0;
  const correlations: CorrelationPair[] = inv?.correlation?.correlations ?? [];

  // Clear selected node when switching incidents
  const handleIncidentChange = useCallback((id: string) => {
    setSelectedIncidentId(id);
    setSelectedGraphNode(null);
  }, []);

  // Compute time window from alert timestamps
  const timeWindow = useMemo(() => {
    if (!story?.stages?.length) return 'N/A';
    const times = story.stages.flatMap(s => s.alerts.map(a => a.id));
    return `${times.length} event(s)`; // Simplified for now
  }, [story]);

  // Show selected alert details in a side panel
  const selectedAlertDetails = useMemo(() => {
    if (!selectedGraphNode || selectedGraphNode.type !== 'alert') return null;
    const alertId = selectedGraphNode.alert_id;
    const relatedCorrelations = correlations.filter(
      (c) => c.alert_a === alertId || c.alert_b === alertId,
    );
    return { node: selectedGraphNode, correlations: relatedCorrelations };
  }, [selectedGraphNode, correlations]);

  // Loading labels for different sections
  const isLoadingMetadata = loading && !inv;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title & Incident Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Investigation Graph</h1>
            {loading && <RefreshCw className="h-4 w-4 text-soc-accent animate-spin" />}
          </div>
          <p className="text-sm text-soc-muted mt-1.5 flex items-center space-x-2">
            {isOffline ? (
              <WifiOff className="h-4 w-4 text-soc-critical" />
            ) : isNotFound ? (
              <SearchX className="h-4 w-4 text-soc-medium" />
            ) : loading ? (
              <RefreshCw className="h-4 w-4 text-soc-accent animate-spin" />
            ) : (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-low opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-soc-low" />
              </span>
            )}
            <span>
              {isOffline
                ? 'Backend offline — showing cached/inferred data.'
                : isNotFound
                ? 'No investigation available for this incident.'
                : loading
                ? loadingLabel
                : 'Visualize relationships between hosts, processes, alerts, and MITRE techniques.'}
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="bg-soc-surface border border-soc-border/60 p-1 rounded-xl flex items-center space-x-1">
            {incidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => handleIncidentChange(inc.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                  selectedIncidentId === inc.id
                    ? 'bg-soc-accent text-white shadow-glow'
                    : 'text-soc-muted hover:text-white hover:bg-soc-bg/60'
                }`}
              >
                {inc.id.split('-').pop()}
              </button>
            ))}
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2 text-soc-muted hover:text-white bg-soc-surface border border-soc-border/60 rounded-xl hover:bg-soc-bg/60 transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cached/Offline/NotFound indicator banner */}
      {(isOffline || isNotFound || dataSource === 'cached' || dataSource === 'mock') && !loading && (
        <div className={`rounded-xl p-3 flex items-center space-x-2 text-xs ${
          isOffline
            ? 'bg-amber-950/10 border border-amber-900/30 text-amber-400/90'
            : isNotFound
            ? 'bg-blue-950/10 border border-blue-900/30 text-blue-400/90'
            : 'bg-soc-accent/5 border border-soc-accent/20 text-soc-accent/80'
        }`}>
          {isOffline ? (
            <WifiOff className="h-4 w-4 flex-shrink-0" />
          ) : isNotFound ? (
            <SearchX className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Info className="h-4 w-4 flex-shrink-0" />
          )}
          <span>
            {isOffline
              ? 'Backend offline — showing cached/inferred data.'
              : isNotFound
              ? 'No investigation available for this incident.'
              : dataSource === 'cached'
              ? 'Showing cached investigation data. Syncing with backend...'
              : 'Using demo data. Connect the backend for live investigation views.'}
          </span>
          {lastUpdated && (
            <span className="ml-auto text-[9px] font-mono opacity-70">
              {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>
      )}

      {/* Loading Skeleton — Investigation Metadata */}
      {isLoadingMetadata && (
        <div className="card-premium-accent p-6 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-soc-border/30 pb-6 lg:pb-0 lg:pr-6">
              <div className="w-[120px] h-[120px] rounded-full bg-soc-border/20" />
              <div className="h-3 w-24 bg-soc-border/20 rounded mt-3" />
            </div>
            <div className="lg:col-span-3 space-y-3">
              <div className="h-5 w-64 bg-soc-border/20 rounded" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-32 bg-soc-border/20 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton — Graph + Content */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="card-premium p-6">
              <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-soc-border/30">
                <div className="h-4 w-4 bg-soc-border/20 rounded" />
                <div className="h-4 w-32 bg-soc-border/20 rounded" />
              </div>
              <div className="h-[300px] bg-soc-border/10 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 mx-auto text-soc-accent animate-spin mb-3" />
                  <p className="text-sm text-soc-muted">Loading Investigation...</p>
                  <p className="text-xs text-soc-muted/60 mt-1">{loadingLabel}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="card-premium p-5 animate-pulse">
                <div className="h-4 w-32 bg-soc-border/20 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-12 bg-soc-border/20 rounded-xl" />
                  <div className="h-12 bg-soc-border/20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content — only render when not loading */}
      {!loading && (
        <>
          {/* Investigation Metadata Panel */}
          <div className="card-premium-accent p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            {/* Correlation Score */}
            <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-soc-border/30 pb-6 lg:pb-0 lg:pr-6">
              <div className="relative w-[120px] h-[120px]">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r={26} stroke="#1E2A45" strokeWidth="5" fill="transparent" />
                  <circle
                    cx="32" cy="32" r={26}
                    stroke={correlationScore >= 70 ? '#22C55E' : correlationScore >= 40 ? '#FACC15' : '#EF4444'}
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - correlationScore / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{correlationScore}%</span>
                </div>
              </div>
              <span className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider mt-2">Correlation Confidence</span>
            </div>

            {/* Metadata Details */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center space-x-3">
                <GitBranch className="h-5 w-5 text-soc-accent flex-shrink-0" />
                <span className="text-sm font-semibold text-white truncate">{inv?.title || currentIncident.title}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-2">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">Investigation ID</div>
                  <div className="font-mono text-xs text-zinc-300 mt-0.5">{inv?.incident_id || currentIncident.id}</div>
                </div>
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-2">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">Host</div>
                  <div className="font-mono text-xs text-zinc-300 mt-0.5 truncate">{inv?.host || currentIncident.host}</div>
                </div>
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-2">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">User</div>
                  <div className="font-mono text-xs text-zinc-300 mt-0.5 truncate">{inv?.user || currentIncident.user}</div>
                </div>
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-2">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">Alerts</div>
                  <div className="font-mono text-xs text-soc-accent mt-0.5">{inv?.correlation?.total_alerts ?? currentIncident.alerts_count}</div>
                </div>
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-2">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">Risk Score</div>
                  <div className="font-mono text-xs text-zinc-300 mt-0.5">{currentIncident.risk_score}/10</div>
                </div>
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-2">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">Kill Chain</div>
                  <div className="font-mono text-xs text-soc-accent mt-0.5">{story?.kill_chain_coverage || 'N/A'}</div>
                </div>
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-2">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">Time Window</div>
                  <div className="font-mono text-xs text-zinc-300 mt-0.5">{timeWindow}</div>
                </div>
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-2">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">Data Source</div>
                  <div className={`font-mono text-xs mt-0.5 ${dataSource === 'live' ? 'text-soc-low' : 'text-soc-medium'}`}>
                    {dataSource === 'live' ? '◉ Live' : dataSource === 'cached' ? '○ Cached' : '○ Demo'}
                  </div>
                </div>
              </div>
              {/* Last Updated */}
              {lastUpdated && (
                <div className="flex items-center space-x-1.5 text-[10px] text-soc-muted/60 font-mono">
                  <Clock className="h-3 w-3" />
                  <span>{formatLastUpdated(lastUpdated)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Left: Graph + Story (3/5) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Investigation Graph */}
              <div className="card-premium p-0 overflow-hidden">
                <div className="px-5 py-3 border-b border-soc-border/30 bg-gradient-to-r from-soc-card to-soc-bg/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-soc-accent" />
                    <h3 className="font-bold text-white text-sm">Relationship Graph</h3>
                  </div>
                  {selectedGraphNode && (
                    <button
                      onClick={() => setSelectedGraphNode(null)}
                      className="text-[9px] text-soc-muted hover:text-white bg-soc-bg/60 border border-soc-border/30 px-2 py-0.5 rounded-lg transition-colors"
                    >
                      Deselect
                    </button>
                  )}
                </div>
                <InvestigationGraph
                  nodes={graphNodes}
                  edges={graphEdges}
                  selectedNodeId={selectedGraphNode?.id}
                  onNodeClick={setSelectedGraphNode}
                />
              </div>

              {/* Attack Story */}
              {story && story.stages.length > 0 ? (
                <div className="card-premium p-5">
                  <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-soc-border/30">
                    <div className="bg-soc-accent/10 p-1.5 rounded-lg">
                      <Sparkles className="h-4 w-4 text-soc-accent" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Attack Story</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-soc-bg/40 border border-soc-border/20 rounded-xl p-4">
                      <p className="text-sm text-soc-text/90 leading-relaxed whitespace-pre-line">{story.narrative}</p>
                    </div>

                    {story.stages.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider flex items-center space-x-1.5">
                          <Target className="h-3 w-3" />
                          <span>Kill Chain Stages</span>
                        </span>
                        {story.stages.map((stage, idx) => (
                          <div key={stage.stage} className="flex items-start space-x-3 p-3 bg-soc-bg/40 border border-soc-border/20 rounded-xl hover:border-soc-accent/20 transition-colors">
                            <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-soc-accent/20 to-soc-accentSecondary/10 border border-soc-accent/20 text-soc-accent flex items-center justify-center font-mono text-xs font-bold">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-white">{stage.stage}</span>
                                <span className="text-[10px] font-mono text-soc-muted bg-soc-bg/60 border border-soc-border/30 px-2 py-0.5 rounded-lg whitespace-nowrap ml-2">
                                  {stage.alert_count} alert{stage.alert_count !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <p className="text-xs text-soc-muted/80 mt-1">
                                {stage.alerts.map((a) => a.rule).join(', ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {story.next_steps.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider flex items-center space-x-1.5">
                          <Lightbulb className="h-3 w-3" />
                          <span>Recommended Investigation Steps</span>
                        </span>
                        <div className="space-y-1.5">
                          {story.next_steps.map((step, idx) => (
                            <div key={idx} className="flex items-start space-x-2 p-2.5 bg-soc-bg/40 border border-soc-border/20 rounded-xl">
                              <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-soc-accent/10 border border-soc-accent/20 text-soc-accent flex items-center justify-center font-mono text-[9px] font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-xs text-soc-text/80 leading-relaxed pt-0.5">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card-premium p-8 text-center">
                  <Sparkles className="h-8 w-8 mx-auto text-soc-muted/30 mb-3" />
                  <h4 className="font-semibold text-soc-muted text-sm">No Attack Story Available</h4>
                  <p className="text-xs text-soc-muted/60 mt-2 max-w-[300px] mx-auto leading-relaxed">
                    Correlate at least 2 alerts on the same host to generate a multi-stage attack story.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Details (2/5) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Selected Alert Details — when a node is clicked */}
              {selectedAlertDetails ? (
                <div className="card-premium p-5">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-soc-border/30">
                    <div className="flex items-center space-x-2.5">
                      <div className="bg-soc-accent/10 p-1.5 rounded-lg">
                        <Crosshair className="h-4 w-4 text-soc-accent" />
                      </div>
                      <h3 className="font-bold text-white text-sm">Alert Details</h3>
                    </div>
                    <SeverityBadge severity={(selectedAlertDetails.node.severity || 'MEDIUM') as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider mb-1">Alert ID</div>
                      <div className="font-mono text-xs text-white">{selectedAlertDetails.node.alert_id || selectedAlertDetails.node.id}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider mb-1">Rule</div>
                      <div className="text-xs text-soc-text/90">{selectedAlertDetails.node.label}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider mb-1">Type</div>
                      <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border"
                        style={{
                          backgroundColor: 'rgba(239,68,68,0.1)',
                          color: '#EF4444',
                          borderColor: 'rgba(239,68,68,0.2)',
                        }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                        <span>ALERT</span>
                      </div>
                    </div>

                    {/* Correlation reasons for this alert */}
                    {selectedAlertDetails.correlations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-soc-border/20">
                        <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider mb-2">Correlation Reasons</div>
                        <div className="space-y-2">
                          {selectedAlertDetails.correlations.map((c, idx) => (
                            <div key={idx} className="bg-soc-bg/40 border border-soc-border/20 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] font-mono font-bold text-soc-muted">{c.alert_a} ⟷ {c.alert_b}</span>
                                <span className="text-[10px] font-mono font-bold text-soc-accent">{c.correlation_score}%</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {c.breakdown.map((reason: string, ri: number) => {
                                  const cleanReason = reason.includes(':') ? reason.split(':')[0] : reason;
                                  const label = cleanReason
                                    .replace(/_/g, ' ')
                                    .replace(/\b\w/g, (l) => l.toUpperCase());
                                  return (
                                    <span key={ri} className="inline-flex items-center space-x-1 text-[8px] px-1.5 py-0.5 bg-soc-accent/10 border border-soc-accent/20 text-soc-accent/80 rounded font-mono">
                                      <span className="text-[6px]">✓</span>
                                      <span>{label}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Correlation Details (default when no node is selected) */
                <div className="card-premium p-5">
                  <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-soc-border/30">
                    <div className="bg-soc-accent/10 p-1.5 rounded-lg">
                      <Crosshair className="h-4 w-4 text-soc-accent" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Correlation Details</h3>
                  </div>

                  {correlations.length > 0 ? (
                    <div className="space-y-2.5">
                      <p className="text-[10px] text-soc-muted/70 mb-2 leading-relaxed">
                        Click any node in the graph to see detailed correlation reasons for that alert.
                      </p>
                      {correlations.slice(0, 4).map((pair, idx) => (
                        <div key={idx} className="bg-soc-bg/40 border border-soc-border/20 rounded-xl p-3 hover:border-soc-accent/20 transition-colors">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-mono font-bold text-soc-muted">{pair.alert_a}</span>
                            <span className="text-[10px] font-mono font-bold text-soc-accent">{pair.correlation_score}%</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-soc-text/70 mb-1.5">
                            <span className="font-mono truncate">{pair.rule_a}</span>
                            <ChevronRight className="h-3 w-3 text-soc-muted/50 flex-shrink-0" />
                            <span className="font-mono truncate">{pair.rule_b}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {pair.breakdown.map((reason: string, ri: number) => {
                              const cleanReason = reason.includes(':') ? reason.split(':')[0] : reason;
                              const label = cleanReason
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase());
                              return (
                                <span key={ri} className="inline-flex items-center space-x-1 text-[8px] px-1.5 py-0.5 bg-soc-accent/10 border border-soc-accent/20 text-soc-accent/80 rounded font-mono">
                                  <span className="text-[6px]">✓</span>
                                  <span>{label}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-8 w-8 mx-auto text-soc-muted/30 mb-3" />
                      <h4 className="font-semibold text-soc-muted text-sm">No Correlated Alert Pairs</h4>
                      <p className="text-xs text-soc-muted/60 mt-2 max-w-[220px] mx-auto leading-relaxed">
                        At least 2 alerts in the same host/user group are required for correlation.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Summary */}
              {currentIncident.ai_summary ? (
                <div className="card-premium p-5">
                  <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-soc-border/30">
                    <div className="bg-soc-accent/10 p-1.5 rounded-lg">
                      <BrainCircuit className="h-4 w-4 text-soc-accent" />
                    </div>
                    <h3 className="font-bold text-white text-sm">AI Summary</h3>
                  </div>
                  <div className="bg-soc-bg/40 border border-soc-border/20 rounded-xl p-4">
                    <p className="text-sm text-soc-text/90 leading-relaxed">
                      {currentIncident.ai_summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-soc-border/20 grid grid-cols-3 gap-3">
                    <div className="text-center bg-soc-bg/40 border border-soc-border/20 rounded-xl p-3">
                      <div className="text-xs font-bold text-soc-low">{currentIncident.confidence_score}%</div>
                      <div className="text-[9px] text-soc-muted mt-0.5">Attack Confidence</div>
                    </div>
                    <div className="text-center bg-soc-bg/40 border border-soc-border/20 rounded-xl p-3">
                      <div className="text-xs font-bold text-soc-accent">{correlationScore}%</div>
                      <div className="text-[9px] text-soc-muted mt-0.5">Correlation Score</div>
                    </div>
                    <div className="text-center bg-soc-bg/40 border border-soc-border/20 rounded-xl p-3">
                      <div className="text-xs font-bold text-soc-medium">Low</div>
                      <div className="text-[9px] text-soc-muted mt-0.5">FP Probability</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-premium p-6 text-center">
                  <BrainCircuit className="h-8 w-8 mx-auto text-soc-muted/30 mb-3" />
                  <h4 className="font-semibold text-soc-muted text-sm">No AI Analysis Available</h4>
                  <p className="text-xs text-soc-muted/60 mt-2 max-w-[240px] mx-auto leading-relaxed">
                    Run an AI analysis on this incident from the Timeline or Alerts page.
                  </p>
                </div>
              )}

              {/* Attack Progression */}
              {story && story.stages.length > 0 && (
                <div className="card-premium p-5">
                  <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-soc-border/30">
                    <div className="bg-soc-accent/10 p-1.5 rounded-lg">
                      <Zap className="h-4 w-4 text-soc-accent" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Attack Progression</h3>
                  </div>
                  <div className="space-y-3">
                    {story.stages.map((stage, idx) => (
                      <div key={stage.stage} className="flex items-center space-x-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          idx === 0 ? 'bg-soc-critical/20 text-soc-critical border border-soc-critical/30' :
                          idx === story.stages.length - 1 ? 'bg-soc-low/20 text-soc-low border border-soc-low/30' :
                          'bg-soc-accent/20 text-soc-accent border border-soc-accent/30'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-white font-medium truncate">{stage.stage}</span>
                            <span className="text-[9px] text-soc-muted font-mono flex-shrink-0">{stage.alert_count} alert{stage.alert_count !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="mt-1 h-1.5 bg-soc-bg/60 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                              idx === 0 ? 'bg-soc-critical' :
                              idx === story.stages.length - 1 ? 'bg-soc-low' : 'bg-soc-accent'
                            }`} style={{ width: `${((idx + 1) / story.stages.length) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Error state — when backend is unavailable and no cached data */}
      {error && !loading && !inv && isOffline && (
        <div className="card-premium p-8 text-center">
          <WifiOff className="h-10 w-10 mx-auto text-soc-critical mb-4" />
          <h4 className="font-semibold text-white text-sm">Backend Offline</h4>
          <p className="text-xs text-soc-muted mt-2 max-w-[300px] mx-auto leading-relaxed">
            Unable to load investigation data. The backend may be unavailable.
          </p>
          <button
            onClick={refetch}
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-soc-accent text-white hover:shadow-glow transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Attempt Reconnect</span>
          </button>
        </div>
      )}

      {/* Not found state — when backend returns no investigation for this incident */}
      {error && !loading && !inv && isNotFound && (
        <div className="card-premium p-8 text-center">
          <SearchX className="h-10 w-10 mx-auto text-soc-medium mb-4" />
          <h4 className="font-semibold text-white text-sm">No Investigation Available</h4>
          <p className="text-xs text-soc-muted mt-2 max-w-[300px] mx-auto leading-relaxed">
            The incident "{selectedIncidentId}" has no correlated investigation data.
            Run an attack simulation or correlate alerts to generate an investigation.
          </p>
          <button
            onClick={refetch}
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-soc-accent text-white hover:shadow-glow transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InvestigationPage;
