import React from 'react';
import {
  Sparkles, Shield, Lightbulb, AlertTriangle, Clock,
  BrainCircuit, RefreshCw, AlertCircle, History, Trash2, ChevronRight,
} from 'lucide-react';
import type { AlertAnalysis } from '../types';
import MitreBadge from './MitreBadge';
import { formatTimeOnly, formatDateShort } from '../utils/formatTime';

interface AIAnalysisPanelProps {
  analysis: AlertAnalysis | null;
  analyzing: boolean;
  error: string | null;
  history: Array<{
    analysis: AlertAnalysis;
    alertId: string;
    timestamp: string;
    alertName: string;
  }>;
  selectedAlertName?: string;
  onAnalyze: () => void;
  onLoadFromHistory: (entry: { analysis: AlertAnalysis; alertId: string; timestamp: string; alertName: string }) => void;
  onClearHistory: () => void;
  onClearResult: () => void;
  className?: string;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  analysis,
  analyzing,
  error,
  history,
  selectedAlertName,
  onAnalyze,
  onLoadFromHistory,
  onClearHistory,
  onClearResult,
  className = '',
}) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return '#22C55E';
    if (score >= 75) return '#FACC15';
    return '#F97316';
  };

  const getFpColor = (fp: string) => {
    switch (fp) {
      case 'Very Low': return 'text-soc-low bg-soc-low/10 border-soc-low/20';
      case 'Low': return 'text-soc-low bg-soc-low/10 border-soc-low/20';
      case 'Medium': return 'text-soc-medium bg-soc-medium/10 border-soc-medium/20';
      case 'High': return 'text-soc-high bg-soc-high/10 border-soc-high/20';
      case 'Very High': return 'text-soc-critical bg-soc-critical/10 border-soc-critical/20';
      default: return 'text-soc-muted bg-soc-bg/40 border-soc-border/30';
    }
  };

  // SVG confidence ring
  const confidenceRadius = 28;
  const confidenceCircumference = 2 * Math.PI * confidenceRadius;
  const confidenceScore = analysis?.confidence ?? 0;
  const confidenceOffset = confidenceCircumference - (confidenceScore / 100) * confidenceCircumference;

  // Use shared utilities from formatTime.ts for local-timezone rendering

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with action buttons */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-soc-accent flex items-center space-x-1.5">
          <BrainCircuit className="h-4 w-4" />
          <span>AI Investigation</span>
        </span>
        <div className="flex items-center space-x-1.5">
          {analysis && (
            <button
              onClick={onClearResult}
              className="text-[10px] px-2 py-1 text-soc-muted hover:text-white bg-soc-bg/60 border border-soc-border/30 rounded-lg hover:bg-soc-bg transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onAnalyze}
            disabled={analyzing}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 bg-soc-accent border-soc-accent text-white hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History bar */}
      {history.length > 0 && (
        <div className="bg-soc-surface/60 border border-soc-border/40 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-[10px] text-soc-muted uppercase font-semibold tracking-wider">
              <History className="h-3 w-3" />
              <span>Recent Analyses ({history.length})</span>
            </div>
            <button
              onClick={onClearHistory}
              className="text-[10px] text-soc-muted hover:text-soc-critical flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.slice(0, 6).map((entry, idx) => (
              <button
                key={`${entry.alertId}-${idx}`}
                onClick={() => onLoadFromHistory(entry)}
                className={`group flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all duration-200 ${
                  analysis && entry.alertId === analysis.alert_id
                    ? 'bg-soc-accent/10 border-soc-accent/20 text-soc-accent'
                    : 'bg-soc-bg/40 border-soc-border/30 text-soc-muted hover:bg-soc-bg/60 hover:border-soc-accent/30 hover:text-white'
                }`}
              >
                <span className="font-mono font-bold">{entry.alertId}</span>
                <span className="text-[9px] text-soc-muted/60 hidden sm:inline truncate max-w-[80px]">
                  {entry.alertName}
                </span>
                <span className="text-[9px] text-soc-muted/50 ml-auto">{formatTimeOnly(entry.timestamp)}</span>
                <ChevronRight className="h-2.5 w-2.5 text-soc-muted/40 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {analyzing && (
        <div className="bg-soc-card border border-soc-border/60 rounded-xl p-8 text-center shadow-card">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-soc-border/30" />
            <div className="absolute inset-0 rounded-full border-2 border-soc-accent border-t-transparent animate-spin" />
            <BrainCircuit className="absolute inset-0 m-auto h-6 w-6 text-soc-accent animate-pulse-soft" />
          </div>
          <p className="text-sm font-semibold text-white">AI is investigating...</p>
          <p className="text-xs text-soc-muted mt-2 max-w-[240px] mx-auto leading-relaxed">
            Analyzing {selectedAlertName || 'the selected alert'} using local Ollama LLM. This may take a moment.
          </p>
          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-soc-accent animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !analyzing && (
        <div className="bg-soc-card border border-soc-critical/20 rounded-xl p-6 shadow-card text-center">
          <AlertCircle className="h-10 w-10 mx-auto text-soc-critical mb-3" />
          <h4 className="font-semibold text-white text-sm">Analysis Failed</h4>
          <p className="text-xs text-soc-muted mt-2 max-w-[280px] mx-auto leading-relaxed">{error}</p>
          <button
            onClick={onAnalyze}
            className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-soc-accent text-white hover:shadow-glow transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Analysis</span>
          </button>
        </div>
      )}

      {/* Empty state */}
      {!analysis && !analyzing && !error && (
        <div className="border border-dashed border-soc-border/40 rounded-xl p-8 text-center bg-soc-surface/30">
          <BrainCircuit className="h-10 w-10 mx-auto text-soc-muted/30 mb-3" />
          <h4 className="font-semibold text-soc-muted text-sm">No Analysis Yet</h4>
          <p className="text-xs text-soc-muted/60 mt-2 max-w-[220px] mx-auto leading-relaxed">
            Select an alert and click <span className="text-soc-accent font-semibold">Analyze</span> to generate an AI investigation.
          </p>
        </div>
      )}

      {/* Analysis results */}
      {analysis && !analyzing && (
        <div className="bg-soc-card border border-soc-border/60 rounded-xl shadow-card overflow-hidden">
          {/* Premium gradient header with confidence */}
          <div className="relative bg-gradient-to-r from-soc-accent/15 via-soc-accentSecondary/10 to-soc-bg px-5 py-4 border-b border-soc-border/30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_70%)]" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-2.5">
                <div className="bg-gradient-to-br from-soc-accent/30 to-soc-accentSecondary/20 p-1.5 rounded-xl border border-soc-accent/20 shadow-glow">
                  <Sparkles className="h-5 w-5 text-soc-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">AI Analysis Result</h3>
                  <p className="text-[10px] text-soc-muted mt-0.5">Ollama local LLM</p>
                </div>
              </div>

              {/* Confidence Score Ring */}
              <div className="flex items-center space-x-2">
                <div className="relative" style={{ width: 52, height: 52 }}>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r={confidenceRadius} stroke="#1E2A45" strokeWidth="5" fill="transparent" />
                    <circle
                      cx="32" cy="32" r={confidenceRadius}
                      stroke={getConfidenceColor(confidenceScore)}
                      strokeWidth="5" strokeDasharray={confidenceCircumference}
                      strokeDashoffset={confidenceOffset}
                      strokeLinecap="round" fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{confidenceScore}%</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-[9px] text-soc-muted uppercase font-semibold tracking-wider">Confidence</div>
                  <div className="text-[11px] font-semibold text-soc-low">
                    {confidenceScore >= 90 ? 'HIGH' : confidenceScore >= 75 ? 'MEDIUM' : 'LOW'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[10px] font-semibold text-soc-muted uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5 text-soc-critical" />
                <span>Summary</span>
              </div>
              <div className="bg-soc-bg/60 border border-soc-border/20 rounded-xl p-4">
                <p className="text-sm text-soc-text/90 leading-relaxed">{analysis.summary}</p>
              </div>
            </div>

            {/* MITRE + FP Probability row */}
            <div className="flex flex-wrap items-center gap-3">
              {analysis.mitre && (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-soc-muted uppercase font-semibold tracking-wider">MITRE:</span>
                  <MitreBadge techniqueId={analysis.mitre} />
                </div>
              )}
              <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${getFpColor(analysis.false_positive_probability)}`}>
                <AlertTriangle className="h-3 w-3" />
                <span>FP: {analysis.false_positive_probability}</span>
              </div>
              <div className="text-[10px] text-soc-muted font-mono">
                Severity: <span className="font-bold text-soc-text">{analysis.severity}</span>
              </div>
            </div>

            {/* Reasoning */}
            {analysis.reasoning && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[10px] font-semibold text-soc-muted uppercase tracking-wider">
                  <BrainCircuit className="h-3.5 w-3.5 text-soc-accent" />
                  <span>Reasoning</span>
                </div>
                <div className="bg-soc-bg/40 border border-soc-border/20 rounded-xl p-4">
                  <p className="text-xs text-soc-text/80 leading-relaxed">{analysis.reasoning}</p>
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[10px] font-semibold text-soc-muted uppercase tracking-wider">
                  <Lightbulb className="h-3.5 w-3.5 text-soc-accent" />
                  <span>Recommended Actions</span>
                </div>
                <div className="space-y-1.5">
                  {analysis.recommended_actions.map((action, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 p-3 bg-soc-bg/40 border border-soc-border/20 rounded-xl hover:border-soc-accent/20 transition-colors group">
                      <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-gradient-to-br from-soc-accent/20 to-soc-accentSecondary/10 border border-soc-accent/20 text-soc-accent flex items-center justify-center font-mono text-[10px] font-bold group-hover:shadow-glow transition-shadow">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-soc-text/80 leading-relaxed pt-0.5">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            {analysis.analyzed_at && (
              <div className="pt-3 border-t border-soc-border/20 flex items-center space-x-1.5 text-[10px] text-soc-muted">
                <Clock className="h-3 w-3" />
                <span>Analyzed at {formatDateShort(analysis.analyzed_at)} {formatTimeOnly(analysis.analyzed_at)}</span>
                {analysis.alert_id && (
                  <span className="font-mono ml-1">— Alert {analysis.alert_id}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
