import React from 'react';
import type { Alert } from '../types';
import SeverityBadge from './SeverityBadge';
import { formatTimeOnly } from '../utils/formatTime';
import { ShieldAlert, ExternalLink } from 'lucide-react';

interface AlertTableProps {
  alerts: Alert[];
  onSelectAlert?: (alert: Alert) => void;
  selectedAlertId?: string;
  className?: string;
}

export const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  onSelectAlert,
  selectedAlertId,
  className = ''
}) => {
  return (
    <div className={`bg-soc-card border border-soc-border/60 rounded-xl shadow-card overflow-hidden ${className}`}>
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-soc-border/40 bg-gradient-to-r from-soc-card to-soc-bg/50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="bg-soc-accent/10 p-1.5 rounded-md">
            <ShieldAlert className="h-4 w-4 text-soc-accent" />
          </div>
          <h3 className="font-bold text-white text-sm">Recent Threat Detections</h3>
        </div>
        <div className="text-xs text-soc-muted font-mono">
          Showing {alerts.length} alerts
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-soc-border/40 bg-soc-bg/30 text-[10px] font-semibold text-soc-muted uppercase tracking-[0.1em]">
              <th className="py-3.5 px-6">ID</th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Rule Name</th>
              <th className="py-3.5 px-4">Host</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Timestamp</th>
              {onSelectAlert && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-soc-border/20 text-sm">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <ShieldAlert className="h-8 w-8 mx-auto text-soc-muted/30 mb-3" />
                  <div className="text-soc-muted font-medium">No active alerts found matching search criteria.</div>
                  <div className="text-xs text-soc-muted/50 mt-1">Try adjusting your filters or search query.</div>
                </td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const isSelected = selectedAlertId === alert.id;
                return (
                  <tr 
                    key={alert.id}
                    className={`relative transition-all duration-150 cursor-pointer group ${
                      isSelected 
                        ? 'bg-soc-accent/5' 
                        : 'hover:bg-zinc-800/15'
                    }`}
                    onClick={() => onSelectAlert && onSelectAlert(alert)}
                  >
                    {/* Left border indicator on hover/selected */}
                    <td className="relative py-4 px-6">
                      <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-full transition-all duration-200 ${
                        isSelected 
                          ? 'h-6 bg-soc-accent shadow-glow' 
                          : 'group-hover:h-4 group-hover:bg-soc-accent/50'
                      }`} />
                      <span className="font-mono text-xs font-semibold text-soc-muted">{alert.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="py-4 px-4 font-semibold text-white group-hover:text-soc-accent transition-colors max-w-[240px] truncate">
                      {alert.rule_name}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                      {alert.host}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-soc-muted">
                      {alert.user}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-soc-muted">
                      {formatTimeOnly(alert.timestamp)}
                    </td>
                    {onSelectAlert && (
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAlert(alert);
                          }}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                            isSelected
                              ? 'bg-soc-accent border-soc-accent text-white shadow-glow'
                              : 'bg-soc-bg/60 border-soc-border/40 text-soc-muted opacity-0 group-hover:opacity-100 group-hover:text-white group-hover:border-soc-accent/30'
                          }`}
                        >
                          <span>Analyze</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertTable;
