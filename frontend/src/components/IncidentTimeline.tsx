import React from 'react';
import { formatTimeOnly } from '../utils/formatTime';
import { Sparkles, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface IncidentTimelineProps {
  timeline: TimelineEvent[];
  className?: string;
}

const MITRE_TACTIC_BADGE_COLORS: Record<string, string> = {
  'Execution': 'bg-soc-critical/10 text-soc-critical border-soc-critical/20',
  'Persistence': 'bg-soc-high/10 text-soc-high border-soc-high/20',
  'Defense Evasion': 'bg-soc-medium/10 text-soc-medium border-soc-medium/20',
  'Credential Access': 'bg-soc-critical/10 text-soc-critical border-soc-critical/20',
  'Discovery': 'bg-soc-accent/10 text-soc-accent border-soc-accent/20',
  'Lateral Movement': 'bg-soc-high/10 text-soc-high border-soc-high/20',
  'Command & Control': 'bg-soc-medium/10 text-soc-medium border-soc-medium/20',
  'Impact': 'bg-soc-critical/10 text-soc-critical border-soc-critical/20',
};

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ timeline, className = '' }) => {
  const getIcon = (type: 'alert' | 'analysis' | 'action') => {
    switch (type) {
      case 'action':
        return (
          <div className="bg-soc-low/15 text-soc-low border border-soc-low/20 p-2 rounded-xl z-10 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
        );
      case 'analysis':
        return (
          <div className="bg-soc-accent/15 text-soc-accent border border-soc-accent/20 p-2 rounded-xl z-10 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
        );
      case 'alert':
      default:
        return (
          <div className="bg-soc-critical/15 text-soc-critical border border-soc-critical/20 p-2 rounded-xl z-10 shadow-sm">
            <AlertCircle className="h-4 w-4" />
          </div>
        );
    }
  };

  const getCardBorder = (type: 'alert' | 'analysis' | 'action') => {
    switch (type) {
      case 'action': return 'border-l-soc-low/50';
      case 'analysis': return 'border-l-soc-accent/50';
      case 'alert': return 'border-l-soc-critical/50';
    }
  };

  const getMitreBadgeStyle = (tactic?: string) => {
    if (!tactic) return 'bg-soc-accent/10 text-soc-accent border-soc-accent/20';
    return MITRE_TACTIC_BADGE_COLORS[tactic] || 'bg-soc-accent/10 text-soc-accent border-soc-accent/20';
  };

  return (
    <div className={`bg-soc-card border border-soc-border/60 rounded-xl p-6 shadow-card ${className}`}>
      <div className="flex items-center space-x-2.5 pb-5 mb-6 border-b border-soc-border/30">
        <div className="bg-soc-accent/10 p-1.5 rounded-lg">
          <Zap className="h-5 w-5 text-soc-accent" />
        </div>
        <h3 className="font-bold text-white text-sm">Chronological Threat Lifecycle</h3>
      </div>

      <div className="relative pl-5">
        {/* Gradient vertical timeline line */}
        <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-soc-critical/60 via-soc-accent/40 to-soc-low/30 rounded-full" />

        <div className="space-y-6">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative flex items-start gap-5 group">
              {/* Timeline icon */}
              <div className="relative z-10 flex-shrink-0">
                {getIcon(item.type)}
              </div>

              {/* Content card with left color border */}
              <div className={`flex-1 bg-soc-bg/40 border border-soc-border/30 border-l-2 rounded-xl p-4 ${getCardBorder(item.type)} transition-all duration-200 group-hover:shadow-card-premium group-hover:border-soc-border/50`}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-sm text-white leading-snug group-hover:text-soc-accent transition-colors">
                    {item.event}
                  </h4>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    {item.mitre_tactic && (
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border font-mono ${getMitreBadgeStyle(item.mitre_tactic)}`}>
                        {item.mitre_tactic}
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-soc-muted bg-soc-bg/60 border border-soc-border/30 px-2 py-0.5 rounded-lg whitespace-nowrap">
                      {formatTimeOnly(item.time)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-soc-muted/90 leading-relaxed">
                  {item.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentTimeline;
