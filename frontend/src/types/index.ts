export type SeverityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Alert {
  id: string;
  timestamp: string;
  rule_name: string;
  severity: SeverityType;
  host: string;
  user: string;
  process_name: string;
  command_line?: string;
  mitre_tactic?: string;
  mitre_technique?: string;
  status: 'OPEN' | 'RESOLVED' | 'INVESTIGATING';
  description: string;
}

export interface MitreMapping {
  tactic: string;
  technique: string;
  id: string;
}

export interface Incident {
  id: string;
  title: string;
  status: 'OPEN' | 'RESOLVED' | 'INVESTIGATING';
  severity: SeverityType;
  risk_score: number; // 0 to 10
  created_at: string;
  host: string;
  user: string;
  alerts_count: number;
  mitre_mapping: MitreMapping[];
  ai_summary: string;
  recommendations: string[];
  confidence_score: number; // Percentage, e.g. 92
  timeline: {
    time: string;
    event: string;
    details: string;
    type: 'alert' | 'analysis' | 'action';
  }[];
}

export interface DashboardStats {
  activeAlerts: number;
  openIncidents: number;
  avgResponseTime: string; // e.g. "1.8s"
  monitoredHosts: number;
  mitreCoveragePercent: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AlertAnalysis {
  summary: string;
  confidence: number;
  severity: string;
  mitre: string;
  reasoning: string;
  recommended_actions: string[];
  false_positive_probability: string;
  analyzed_at?: string;
  alert_id?: string;
}

export interface SimulationAttack {
  id: string;
  name: string;
  description: string;
  tactic: string;
  technique: string;
}

// ─── Sprint 05: Investigation & Correlation types ───

export interface CorrelationPair {
  alert_a: string;
  alert_b: string;
  rule_a: string;
  rule_b: string;
  correlation_score: number;
  breakdown: string[];
  host: string;
  user: string;
}

export interface CorrelationResult {
  correlations: CorrelationPair[];
  global_score: number;
  total_alerts: number;
  total_clusters: number;
}

export interface AttackStage {
  stage: string;
  alert_count: number;
  alerts: { id: string; rule: string; severity: string }[];
  actions: string[];
}

export interface AttackStory {
  title: string;
  stages: AttackStage[];
  narrative: string;
  next_steps: string[];
  techniques: string[];
  total_alerts: number;
  kill_chain_coverage: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'host' | 'process' | 'alert' | 'mitre';
  severity?: string;
  alert_id?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  type: string;
}

export interface InvestigationGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Investigation {
  incident_id: string;
  host: string;
  user: string;
  title: string;
  attack_story: AttackStory;
  correlation: CorrelationResult;
  graph: InvestigationGraph;
}

export interface TimelineEvent {
  time: string;
  event: string;
  details: string;
  type: 'alert' | 'analysis' | 'action';
  mitre_tactic?: string;
  mitre_technique?: string;
}
