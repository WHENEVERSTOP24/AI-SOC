import React, { useState } from 'react';
import { 
  Monitor, 
  User,
  Crosshair,
  RefreshCw,
  WifiOff,
  Clock,
  AlertCircle,
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import AIAnalysisCard from '../components/AIAnalysisCard';
import IncidentTimeline from '../components/IncidentTimeline';
import MitreBadge from '../components/MitreBadge';
import SeverityBadge from '../components/SeverityBadge';
import { formatLastUpdated } from '../utils/formatTime';
import { useIncidents } from '../hooks/useIncidents';
import { mockIncidents } from '../utils/mockData';
import type { Incident } from '../types';

export const IncidentPage: React.FC = () => {
  const { data: incidentsData, loading, refetch, usingMock, isOffline, lastUpdated } = useIncidents();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Use live data or fallback to mock
  const incidents = (incidentsData && incidentsData.length > 0) ? incidentsData : mockIncidents;
  const currentIncident = selectedIncident || incidents[0] || mockIncidents[0];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title & Case Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Incident Investigation Desk</h1>
            {loading && <RefreshCw className="h-4 w-4 text-soc-accent animate-spin" />}
          </div>
          <p className="text-sm text-soc-muted mt-1.5 flex items-center space-x-2">
            {isOffline ? (
              <WifiOff className="h-4 w-4 text-soc-critical" />
            ) : null}
            <span>
              {usingMock || isOffline
                ? 'Backend offline — showing demo cases. Live data will appear when the backend is connected.'
                : 'Analyze multi-stage kill chains, EDR telemetry correlations, and LLM-assisted playbooks.'}
            </span>
          </p>
        </div>

        {/* Case Selector Tabs */}
        <div className="flex items-center space-x-1.5">
          <div className="bg-soc-surface border border-soc-border/60 p-1 rounded-xl flex items-center space-x-1">
            {incidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                  currentIncident.id === inc.id
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
            title="Refresh incidents"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Incident Summary Banner Card */}
      <div className="card-premium-accent p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
        {/* Risk Score */}
        <div className="flex justify-center border-b lg:border-b-0 lg:border-r border-soc-border/30 pb-6 lg:pb-0 lg:pr-6">
          <RiskGauge score={currentIncident.risk_score} size={130} strokeWidth={10} />
        </div>

        {/* Details and Metadata */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold text-soc-muted bg-soc-bg/60 px-2.5 py-1 border border-soc-border/30 rounded-lg">
              {currentIncident.id}
            </span>
            <SeverityBadge severity={currentIncident.severity} />
            <span className="text-xs px-3 py-1 bg-soc-accent/10 border border-soc-accent/20 text-soc-accent rounded-lg font-semibold">
              {currentIncident.status}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white leading-tight">
            {currentIncident.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center space-x-3 bg-soc-bg/40 border border-soc-border/20 rounded-xl p-3.5 hover:border-soc-accent/20 transition-colors">
              <Monitor className="h-5 w-5 text-soc-muted" />
              <div>
                <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">Impacted Host</div>
                <div className="font-mono text-sm text-zinc-200 mt-0.5">{currentIncident.host}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-soc-bg/40 border border-soc-border/20 rounded-xl p-3.5 hover:border-soc-accent/20 transition-colors">
              <User className="h-5 w-5 text-soc-muted" />
              <div>
                <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">User Context</div>
                <div className="font-mono text-sm text-zinc-200 mt-0.5">{currentIncident.user}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-soc-bg/40 border border-soc-border/20 rounded-xl p-3.5 hover:border-soc-accent/20 transition-colors">
              <Crosshair className="h-5 w-5 text-soc-muted" />
              <div>
                <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">Correlated Events</div>
                <div className="font-mono text-sm text-zinc-200 mt-0.5">{currentIncident.alerts_count} Telemetry Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Badges mapped to incident */}
      <div className="card-premium p-5 text-left">
        <h4 className="text-xs font-semibold text-soc-muted uppercase tracking-wider mb-3 flex items-center space-x-2">
          <span className="w-1 h-4 bg-soc-accent rounded-full" />
          <span>Mapped MITRE ATT&CK Techniques</span>
        </h4>
        {currentIncident.mitre_mapping && currentIncident.mitre_mapping.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentIncident.mitre_mapping.map((mitre) => (
              <MitreBadge 
                key={mitre.id}
                techniqueId={mitre.id}
                techniqueName={mitre.technique}
                tactic={mitre.tactic}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-soc-muted">No MITRE techniques mapped for this incident.</p>
        )}
      </div>

      {/* Last Updated + offline indicator */}
      {(isOffline || lastUpdated) && (
        <div className="flex items-center space-x-2 text-[10px] text-soc-muted/60">
          {isOffline && (
            <span className="flex items-center space-x-1 text-soc-critical/70">
              <AlertCircle className="h-3 w-3" />
              <span>Backend offline</span>
            </span>
          )}
          {lastUpdated && (
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatLastUpdated(lastUpdated)}</span>
            </span>
          )}
        </div>
      )}

      {/* Detail Analysis & Timeline layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Local LLM Analysis */}
        <AIAnalysisCard incident={currentIncident} />

        {/* Chronological Timeline */}
        {currentIncident.timeline && currentIncident.timeline.length > 0 ? (
          <IncidentTimeline timeline={currentIncident.timeline} />
        ) : (
          <div className="card-premium p-8 text-center">
            <Clock className="h-8 w-8 mx-auto text-soc-muted/30 mb-3" />
            <h4 className="font-semibold text-soc-muted text-sm">No Timeline Events</h4>
            <p className="text-xs text-soc-muted/60 mt-2 max-w-[240px] mx-auto leading-relaxed">
              This incident has no timeline events yet. Events will appear as alerts are correlated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentPage;
