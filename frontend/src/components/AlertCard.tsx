import React from 'react';
import type { Alert } from '../types';
import SeverityBadge from './SeverityBadge';
import MitreBadge from './MitreBadge';
import { formatTimestamp } from '../utils/formatTime';
import { Calendar, Monitor, User, Terminal, HelpCircle, Copy, Check } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, className = '' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCommand = () => {
    if (alert.command_line) {
      navigator.clipboard.writeText(alert.command_line);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`relative bg-soc-card border border-soc-border/60 rounded-xl p-5 shadow-card hover:shadow-card-premium transition-all duration-300 overflow-hidden ${className}`}>
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-soc-accent/40 via-soc-accentSecondary/20 to-transparent" />

      {/* Title block */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-soc-border/30">
        <div className="space-y-1 text-left">
          <div className="flex items-center space-x-2">
            <SeverityBadge severity={alert.severity} />
            <span className="text-xs text-soc-muted font-mono">{alert.id}</span>
          </div>
          <h3 className="font-bold text-white text-base mt-1.5 leading-snug">{alert.rule_name}</h3>
        </div>
        <div className="flex items-center text-xs text-soc-muted font-mono bg-soc-bg/60 border border-soc-border/30 px-2.5 py-1 rounded-lg whitespace-nowrap">
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-soc-muted/60" />
          {formatTimestamp(alert.timestamp)}
        </div>
      </div>

      {/* Attributes Grid — 2 columns on desktop, single on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-5 text-left border-b border-soc-border/20">
        {/* Host */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="bg-soc-accent/10 p-2 rounded-lg flex-shrink-0">
            <Monitor className="h-4 w-4 text-soc-accent" />
          </div>
          <div className="min-w-0 overflow-hidden">
            <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">Host</div>
            <div className="font-mono text-sm text-zinc-200 mt-0.5 truncate" title={alert.host}>
              {alert.host}
            </div>
          </div>
        </div>
        
        {/* User */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="bg-soc-accent/10 p-2 rounded-lg flex-shrink-0">
            <User className="h-4 w-4 text-soc-accent" />
          </div>
          <div className="min-w-0 overflow-hidden">
            <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">User</div>
            <div className="font-mono text-sm text-zinc-200 mt-0.5 truncate" title={alert.user}>
              {alert.user}
            </div>
          </div>
        </div>

        {/* Process — spans full width since it often carries the longest value */}
        <div className="flex items-center space-x-3 min-w-0 sm:col-span-2">
          <div className="bg-soc-accent/10 p-2 rounded-lg flex-shrink-0">
            <Terminal className="h-4 w-4 text-soc-accent" />
          </div>
          <div className="min-w-0 overflow-hidden">
            <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">Process</div>
            <div className="font-mono text-sm text-zinc-200 mt-0.5 truncate" title={alert.process_name}>
              {alert.process_name}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="py-4 text-left border-b border-soc-border/20">
        <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider mb-2 flex items-center">
          <HelpCircle className="h-3.5 w-3.5 mr-1.5 text-soc-muted/60" />
          Description
        </div>
        <p className="text-sm text-soc-text/80 leading-relaxed bg-soc-bg/40 p-4 rounded-xl border border-soc-border/20">
          {alert.description}
        </p>
      </div>

      {/* Technical Telemetry */}
      {alert.command_line && (
        <div className="py-4 text-left border-b border-soc-border/20">
          <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
            <span>Executed Command Line</span>
            <button
              onClick={handleCopyCommand}
              className="flex items-center space-x-1 text-soc-accent hover:text-white transition-colors normal-case font-sans"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-soc-bg/60 border border-soc-border/20 text-zinc-300 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
            <code>{alert.command_line}</code>
          </pre>
        </div>
      )}

      {/* MITRE Mapping */}
      {(alert.mitre_tactic || alert.mitre_technique) && (
        <div className="pt-4 text-left flex flex-wrap items-center justify-between gap-3">
          <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">MITRE ATT&CK Mapping</div>
          {alert.mitre_technique && (
            <MitreBadge 
              techniqueId={alert.mitre_technique.split('(')[1]?.replace(')', '') || ''} 
              techniqueName={alert.mitre_technique.split('(')[0]?.trim()}
              tactic={alert.mitre_tactic}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AlertCard;
