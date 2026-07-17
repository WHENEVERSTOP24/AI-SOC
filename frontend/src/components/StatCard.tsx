import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtext,
  trend,
  className = ''
}) => {
  return (
    <div className={`relative bg-soc-card border border-soc-border/60 rounded-xl p-5 shadow-card hover:shadow-card-hover hover:border-soc-accentSecondary/20 transition-all duration-300 ease-out overflow-hidden group ${className}`}>
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-soc-accent/40 via-soc-accentSecondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-soc-muted">{title}</span>
        <div className="bg-soc-bg/60 p-2 rounded-lg border border-soc-border/40 text-soc-muted group-hover:border-soc-accent/20 group-hover:text-soc-accent transition-all duration-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
        
        {(subtext || trend) && (
          <div className="mt-2 flex items-center space-x-2 text-xs">
            {trend && (
              <span className={`font-medium ${
                trend.type === 'positive' 
                  ? 'text-soc-low' 
                  : trend.type === 'negative' 
                  ? 'text-soc-critical' 
                  : 'text-soc-muted'
              }`}>
                {trend.value}
              </span>
            )}
            {subtext && <span className="text-soc-muted/70">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
