import React from 'react';

interface MitreBadgeProps {
  techniqueId: string;
  techniqueName?: string;
  tactic?: string;
  className?: string;
}

export const MitreBadge: React.FC<MitreBadgeProps> = ({ 
  techniqueId, 
  techniqueName, 
  tactic, 
  className = '' 
}) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-soc-bg/60 border border-soc-border/40 text-xs font-medium transition-all duration-200 hover:border-soc-accent/30 hover:bg-soc-accent/5 group ${className}`}>
      {tactic && (
        <span className="text-[10px] uppercase font-bold text-soc-accent tracking-wider pr-1.5 border-r border-soc-border/40">
          {tactic}
        </span>
      )}
      <span className="font-mono font-semibold text-soc-text">{techniqueId}</span>
      {techniqueName && (
        <span className="text-soc-muted text-[11px] hidden sm:inline">— {techniqueName}</span>
      )}
    </span>
  );
};

export default MitreBadge;
