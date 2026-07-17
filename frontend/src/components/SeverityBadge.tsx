import React from 'react';
import type { SeverityType } from '../types';

interface SeverityBadgeProps {
  severity: SeverityType;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  const getStyles = () => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-soc-critical/10',
          text: 'text-soc-critical',
          border: 'border-soc-critical/20',
          dot: 'bg-soc-critical',
        };
      case 'HIGH':
        return {
          bg: 'bg-soc-high/10',
          text: 'text-soc-high',
          border: 'border-soc-high/20',
          dot: 'bg-soc-high',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-soc-medium/10',
          text: 'text-soc-medium',
          border: 'border-soc-medium/20',
          dot: 'bg-soc-medium',
        };
      case 'LOW':
        return {
          bg: 'bg-soc-low/10',
          text: 'text-soc-low',
          border: 'border-soc-low/20',
          dot: 'bg-soc-low',
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-soc-info/10',
          text: 'text-soc-info',
          border: 'border-soc-info/20',
          dot: 'bg-soc-info',
        };
    }
  };

  const styles = getStyles();

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-semibold border ${styles.bg} ${styles.text} ${styles.border} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} shadow-sm`} />
      <span>{severity}</span>
    </span>
  );
};

export default SeverityBadge;
