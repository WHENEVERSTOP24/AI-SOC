import React from 'react';
import { Sparkles, CheckCircle2, Shield, AlertTriangle, Target, Lightbulb } from 'lucide-react';
import type { Incident } from '../types';

interface AIAnalysisCardProps {
  incident: Incident;
  className?: string;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ incident, className = '' }) => {
  const getConfidenceColor = () => {
    if (incident.confidence_score >= 90) return '#22C55E';
    if (incident.confidence_score >= 75) return '#FACC15';
    return '#F97316';
  };

  // SVG confidence ring calculations
  const confidenceRadius = 28;
  const confidenceCircumference = 2 * Math.PI * confidenceRadius;
  const confidenceOffset = confidenceCircumference - (incident.confidence_score / 100) * confidenceCircumference;

  return (
    <div className={`relative bg-soc-card border border-soc-border/60 rounded-xl shadow-card overflow-hidden ${className}`}>
      {/* Premium gradient header */}
      <div className="relative bg-gradient-to-r from-soc-accent/15 via-soc-accentSecondary/10 to-soc-bg px-6 py-5 border-b border-soc-border/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_70%)]" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-soc-accent/30 to-soc-accentSecondary/20 p-2 rounded-xl border border-soc-accent/20 shadow-glow">
              <Sparkles className="h-5 w-5 text-soc-accent" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AI Investigation Report</h3>
              <p className="text-[11px] text-soc-muted mt-0.5">Ollama local LLM analysis</p>
            </div>
          </div>

          {/* Confidence Score Ring */}
          <div className="flex items-center space-x-2.5">
            <div className="relative" style={{ width: 64, height: 64 }}>
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r={confidenceRadius}
                  stroke="#1E2A45"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={confidenceRadius}
                  stroke={getConfidenceColor()}
                  strokeWidth="5"
                  strokeDasharray={confidenceCircumference}
                  strokeDashoffset={confidenceOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {incident.confidence_score}%
                </span>
              </div>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">Confidence</div>
              <div className="text-xs font-semibold text-soc-low">HIGH</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Executive Summary */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-soc-muted uppercase tracking-wider">
            <Shield className="h-4 w-4 text-soc-critical" />
            <span>Executive Summary</span>
          </div>
          <div className="bg-gradient-to-br from-soc-bg/80 to-soc-bg/40 border border-soc-border/30 rounded-2xl p-5">
            <p className="text-sm text-soc-text/90 leading-relaxed font-sans">
              {incident.ai_summary}
            </p>
            <div className="mt-4 flex items-center space-x-4 text-xs text-soc-muted font-mono">
              <div className="flex items-center space-x-1.5">
                <Target className="h-3.5 w-3.5 text-soc-accent" />
                <span>{incident.host}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-soc-accent" />
                <span>{incident.alerts_count} correlated alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-soc-muted uppercase tracking-wider">
            <Lightbulb className="h-4 w-4 text-soc-accent" />
            <span>Recommended Mitigation Steps</span>
          </div>
          
          <div className="space-y-2">
            {incident.recommendations.map((recommendation, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-soc-bg/40 border border-soc-border/20 rounded-xl hover:border-soc-accent/20 transition-colors group">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-soc-accent/20 to-soc-accentSecondary/10 border border-soc-accent/20 text-soc-accent flex items-center justify-center font-mono text-xs font-bold group-hover:shadow-glow transition-shadow">
                  {idx + 1}
                </span>
                <span className="text-sm text-soc-text/80 leading-relaxed pt-0.5">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* EDR Integration Status */}
        <div className="pt-4 border-t border-soc-border/30 flex items-center justify-between bg-soc-bg/30 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
          <div className="flex items-center space-x-2.5">
            <div className="bg-soc-low/10 p-1.5 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-soc-low" />
            </div>
            <span className="text-xs text-soc-muted">Playbook Containment Actions</span>
          </div>
          <span className="text-xs px-3 py-1.5 bg-soc-low/10 text-soc-low rounded-lg border border-soc-low/20 font-semibold flex items-center space-x-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-low opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-soc-low"></span>
            </span>
            <span>CONTAINED / ACTIVE</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisCard;
