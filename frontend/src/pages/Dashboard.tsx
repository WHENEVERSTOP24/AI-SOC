import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Clock, 
  Monitor, 
  Sparkles, 
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

import StatCard from '../components/StatCard';
import RiskGauge from '../components/RiskGauge';
import SeverityBadge from '../components/SeverityBadge';
import { useDashboardStats } from '../hooks/useDashboard';
import { useIncidents } from '../hooks/useIncidents';
import { mockIncidents } from '../utils/mockData';

const alertTimelineData = [
  { time: '12:00', count: 2 },
  { time: '13:00', count: 4 },
  { time: '14:00', count: 3 },
  { time: '15:00', count: 7 },
  { time: '16:00', count: 5 },
  { time: '17:00', count: 9 },
  { time: '18:00', count: 14 },
];

const mitreTacticData = [
  { name: 'Execution', count: 3, color: '#8B5CF6' },
  { name: 'Persistence', count: 1, color: '#FACC15' },
  { name: 'Defense Evasion', count: 4, color: '#F97316' },
  { name: 'Cred Access', count: 1, color: '#EF4444' },
];

export const Dashboard: React.FC = () => {
  const { data: stats, loading, error, refetch, usingMock, isOffline } = useDashboardStats();
  const { data: incidentsData } = useIncidents();

  const latestIncident = (incidentsData && incidentsData[0]) || mockIncidents[0];
  const activeAlerts = stats?.activeAlerts ?? 14;
  const openIncidents = stats?.openIncidents ?? 3;
  const avgResponseTime = stats?.avgResponseTime ?? '1.8s';
  const monitoredHosts = stats?.monitoredHosts ?? 124;
  const riskLevel = stats?.riskLevel ?? 'HIGH';

  // Compute numeric risk score from the latest incident for the gauge
  const riskScore = latestIncident?.risk_score ?? 8.7;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Title */}
      <div className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Security Operations Console</h1>
            <p className="text-sm text-soc-muted mt-1.5 flex items-center space-x-2">
              {isOffline ? (
                <WifiOff className="h-4 w-4 text-soc-critical" />
              ) : (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-low opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-soc-low"></span>
                </span>
              )}
              <span>
                {isOffline
                  ? 'Backend offline — showing cached/mock data'
                  : 'Real-time autonomous threat detection, correlation, and response telemetry.'}
              </span>
            </p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-1.5 text-xs text-soc-accent hover:text-white px-3 py-1.5 rounded-lg border border-soc-accent/30 hover:bg-soc-accent/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Offline banner */}
        {isOffline && (
          <div className="mt-3 bg-amber-950/10 border border-amber-900/30 text-amber-400/90 rounded-xl p-3 flex items-center space-x-2 text-xs">
            <WifiOff className="h-4 w-4 flex-shrink-0" />
            <span>Backend unreachable. {error ? `Error: ${error}` : 'Showing previously cached data.'}</span>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && !stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-soc-card/50 border border-soc-border/30 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-soc-border/20 rounded w-2/3 mb-4" />
              <div className="h-8 bg-soc-border/20 rounded w-1/2 mb-2" />
              <div className="h-3 bg-soc-border/20 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Stats row */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Active Alerts"
            value={activeAlerts}
            icon={ShieldAlert}
            subtext={usingMock ? 'Demo data' : 'Unresolved alerts'}
            trend={{ value: usingMock ? '+12% vs last hour' : 'Live', type: usingMock ? 'negative' : 'neutral' }}
          />
          <StatCard
            title="Open Incidents"
            value={openIncidents}
            icon={Activity}
            subtext={usingMock ? 'Demo data' : 'Correlated threat clusters'}
            trend={{ value: usingMock ? '+1 new critical' : 'Live', type: usingMock ? 'negative' : 'neutral' }}
          />
          <StatCard
            title="Avg response time (MTTR)"
            value={avgResponseTime}
            icon={Clock}
            subtext={usingMock ? 'Demo data' : 'Autonomous SOAR containment'}
            trend={{ value: usingMock ? '-12.4s from avg' : 'Live', type: 'positive' }}
          />
          <StatCard
            title="Monitored Hosts"
            value={monitoredHosts}
            icon={Monitor}
            subtext={usingMock ? 'Demo data' : 'Active Sysmon connectors'}
            trend={{ value: '100% operational', type: 'neutral' }}
          />
        </div>
      )}

      {/* Middle row: Risk dial & Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Assessment Gauge */}
        <div className="card-premium-accent p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">System Risk Index</h3>
            <p className="text-xs text-soc-muted mt-1">Aggregated platform exposure based on active telemetry.</p>
          </div>
          
          <div className="py-6 flex justify-center">
            <RiskGauge score={riskScore} size={150} />
          </div>

          <div className="bg-soc-bg/60 border border-soc-border/30 rounded-xl p-3 flex items-center space-x-2 text-xs">
            <AlertTriangle className="h-4 w-4 text-soc-high flex-shrink-0" />
            <span className="text-soc-muted">
              Current threat level: <span className="font-bold text-soc-high">{riskLevel}</span>. Action playbooks are ready.
            </span>
          </div>
        </div>

        {/* Alerts Ingestion Trend */}
        <div className="card-premium p-6 flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="font-bold text-white text-sm">Alert Ingestion Stream</h3>
            <p className="text-xs text-soc-muted mt-1">Volume of alert events triggered in the last 6 hours.</p>
          </div>

          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={alertTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#4A6580" fontSize={11} tickLine={false} axisLine={{ stroke: '#1E2A45' }} />
                <YAxis stroke="#4A6580" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A2238', border: '1px solid #1E2A45', borderRadius: '12px', padding: '12px' }}
                  labelClassName="text-white font-mono text-xs"
                  labelStyle={{ color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorAlerts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower row: MITRE Tactics & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* MITRE distribution */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">MITRE ATT&CK Tactic Volume</h3>
            <p className="text-xs text-soc-muted mt-1">Distribution of techniques matched by the correlation engine.</p>
          </div>

          <div className="h-44 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mitreTacticData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#4A6580" fontSize={10} tickLine={false} axisLine={{ stroke: '#1E2A45' }} />
                <YAxis stroke="#4A6580" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A2238', border: '1px solid #1E2A45', borderRadius: '12px' }}
                  labelClassName="text-white text-xs"
                  labelStyle={{ color: '#F8FAFC' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                  {mitreTacticData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Active Incident Spotlight */}
        <div className="card-premium-accent p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-soc-border/30">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-soc-accent animate-pulse-soft" />
                <span>Primary Incident Target</span>
              </h3>
              <p className="text-xs text-soc-muted mt-0.5">Most critical correlated threat cluster currently open.</p>
            </div>
            <SeverityBadge severity={latestIncident.severity} />
          </div>

          <div className="py-4 space-y-3">
            <h4 className="text-base font-bold text-white">{latestIncident.title}</h4>
            <p className="text-sm text-soc-text/80 leading-relaxed line-clamp-3">
              {latestIncident.ai_summary}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-soc-muted pt-1">
              <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-1.5">
                Host: <span className="text-zinc-300">{latestIncident.host}</span>
              </div>
              <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-1.5">
                User: <span className="text-zinc-300">{latestIncident.user}</span>
              </div>
              <div className="bg-soc-bg/40 border border-soc-border/20 rounded-lg px-3 py-1.5">
                Detections: <span className="text-soc-accent font-bold">{latestIncident.alerts_count} alerts</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-soc-border/30 flex justify-between items-center">
            <span className="text-xs text-soc-muted flex items-center space-x-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-soc-accent"></span>
              </span>
              <span>Autonomous containment active</span>
            </span>
            <Link 
              to="/incident"
              className="inline-flex items-center space-x-1.5 text-xs text-soc-accent hover:text-white font-semibold transition-all duration-200 group"
            >
              <span>Review Case Timeline</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
