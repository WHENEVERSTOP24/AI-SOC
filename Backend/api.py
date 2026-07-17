from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import traceback

# ─── Existing pipeline modules (unchanged) ───
from real_analyzer import analyze_latest_event, get_recent_events
from event_parser import parse_event
from event_normalizer import normalize_event
from detection_engine import detect_event
from alert_builder import build_alert
from risk_engine import calculate_risk
from alert_manager import AlertManager
from correlation_engine import CorrelationEngine
from investigation.timeline_builder import TimelineBuilder
from investigation.attack_narrative import AttackNarrative
from investigation.investigation_report import InvestigationReport
from investigation.mitre_summary import MitreSummary
from investigation.detection_summary import DetectionSummary
from investigation.recommendation_engine import RecommendationEngine
from investigation.prompt_builder import PromptBuilder
from ai.ai_analyzer import AIAnalyzer
from ai.analysis_service import AnalysisService
from simulator.simulator import AttackSimulator
from investigation.attack_story import build_attack_story
from correlation_service import correlate_alerts
from investigation_service import build_investigation

# ─── Try importing Sysmon-dependent modules ───
try:
    from read_sysmon_v2 import get_recent_event_xml
    SYSMON_AVAILABLE = True
except Exception:
    SYSMON_AVAILABLE = False

# ─── App Setup ───
app = FastAPI(title="AI-SOC Backend API", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Global pipeline state (cached in memory) ───
_alert_manager = AlertManager()
_correlation_engine = CorrelationEngine()
_pipeline_result = None  # cached result from last pipeline run


def _serialize_alert(alert: dict) -> dict:
    """Transform internal alert dict -> frontend Alert shape."""
    mitre_list = alert.get("mitre", [])
    first_tech = mitre_list[0] if mitre_list else None
    return {
        "id": alert.get("alert_id", alert.get("id", "AL-UNKNOWN")),
        "timestamp": alert.get("timestamp", ""),
        "rule_name": alert.get("rule", "Unknown Rule"),
        "severity": _normalize_severity(alert.get("severity", "Low")),
        "host": alert.get("computer", alert.get("host", "unknown")),
        "user": alert.get("user", "unknown"),
        "process_name": alert.get("image", alert.get("process_name", "unknown.exe")),
        "command_line": alert.get("command_line", None),
        "mitre_tactic": None,
        "mitre_technique": first_tech,
        "status": _normalize_status(alert.get("status", "OPEN")),
        "description": alert.get("reason", alert.get("description", "")),
    }


def _serialize_incident(incident, detail: bool = False) -> dict:
    """Transform backend Incident object -> frontend Incident shape."""
    timeline_builder = TimelineBuilder()
    mitre_summary_builder = MitreSummary()
    detection_summary_builder = DetectionSummary()
    recommendation_engine = RecommendationEngine()
    timeline = timeline_builder.build(incident)
    mitre_summary = mitre_summary_builder.build(incident)
    detection_summary = detection_summary_builder.build(incident)
    recommendations = recommendation_engine.build(incident)
    mitre_mapping = []
    for tech_id in mitre_summary.get("techniques", []):
        mitre_mapping.append({"tactic": "", "technique": tech_id, "id": tech_id})
    frontend_timeline = []
    for evt in timeline:
        frontend_timeline.append({
            "time": evt.get("timestamp", ""),
            "event": evt.get("rule", ""),
            "details": evt.get("rule", ""),
            "type": "alert",
        })
    risk_score = (incident.overall_risk or 0) / 10.0
    severity = _calculate_severity(risk_score)
    total_detections = sum(detection_summary.values()) if detection_summary else 0
    confidence_score = min(99, max(70, 70 + total_detections * 5))
    result = {
        "id": incident.incident_id,
        "title": f"Correlated Threat \u2014 {incident.host}",
        "status": "OPEN" if incident.status == "ACTIVE" else "INVESTIGATING",
        "severity": severity,
        "risk_score": risk_score,
        "created_at": incident.start_time or "",
        "host": incident.host,
        "user": incident.user,
        "alerts_count": len(incident.alerts),
        "mitre_mapping": mitre_mapping,
        "ai_summary": "",
        "recommendations": recommendations,
        "confidence_score": confidence_score,
        "timeline": frontend_timeline,
    }
    if detail and len(incident.alerts) > 0:
        try:
            attack_narrative = AttackNarrative()
            narrative = attack_narrative.build(timeline)
            report = InvestigationReport().build(
                incident, timeline, narrative,
                mitre_summary, detection_summary, recommendations,
            )
            ai = AIAnalyzer()
            analysis = ai.analyze(report, PromptBuilder())
            result["ai_summary"] = analysis.get("summary", "No AI analysis available.")
            result["recommendations"] = analysis.get("containment", recommendations)
            conf = analysis.get("confidence", "Medium")
            conf_map = {"High": 95, "Medium": 80, "Low": 60}
            result["confidence_score"] = conf_map.get(conf, 80)
        except Exception:
            result["ai_summary"] = "AI analysis unavailable (Ollama may not be running)."
    return result


def _normalize_severity(s: str) -> str:
    m = {"critical": "CRITICAL", "high": "HIGH", "medium": "MEDIUM",
         "low": "LOW", "informational": "INFO"}
    return m.get(s.strip().lower(), "INFO")


def _normalize_status(s: str) -> str:
    m = {"new": "OPEN", "active": "OPEN", "investigating": "INVESTIGATING",
         "resolved": "RESOLVED", "closed": "RESOLVED"}
    return m.get(s.strip().lower(), "OPEN")




def _calculate_severity(risk_score: float) -> str:
    if risk_score >= 9.0: return "CRITICAL"
    if risk_score >= 7.0: return "HIGH"
    if risk_score >= 4.0: return "MEDIUM"
    return "LOW"


def _run_pipeline() -> dict:
    """Run the detection pipeline, cache results, return summary."""
    global _pipeline_result
    if not SYSMON_AVAILABLE:
        return {"status": "unavailable", "reason": "Sysmon (win32evtlog) not available on this system."}
    try:
        xml_events = get_recent_event_xml(50)
        if not xml_events:
            return {"status": "ok",
        "alerts_count": 0,
        "incidents_count": 0,
        "reason": "No Sysmon events found."}
        _alert_manager.alerts = []
        _alert_manager.next_id = 1
        _correlation_engine.incidents = []
        _correlation_engine.incident_lookup = {}
        _correlation_engine.next_incident_id = 1
        for xml in xml_events:
            event = parse_event(xml)
            normalized = normalize_event(event)
            detections = detect_event(normalized)
            for detection in detections:
                alert = build_alert(normalized, detection)
                alert = calculate_risk(alert)
                _alert_manager.add_alert(alert)
        incidents = _correlation_engine.correlate(_alert_manager.get_alerts())
        _pipeline_result = {
            "status": "ok",
            "alerts_count": len(_alert_manager.get_alerts()),
            "incidents_count": len(incidents),
        }
        return _pipeline_result
    except Exception as e:
        import sys
        print("\n⚠️ _run_pipeline() EXCEPTION ⚠️")
        print(f"Exception type: {type(e).__name__}")
        print(f"Exception message: {e}")
        print("Full traceback:")
        traceback.print_exc()
        print("⚠️ End of exception dump ⚠️\n")
        return {"status": "error", "reason": str(e), "trace": traceback.format_exc()}


@app.get("/")
def home():
    return {"status": "AI-SOC Backend Running", "version": "2.1.0"}


@app.get("/events")
def events():
    if not SYSMON_AVAILABLE:
        return {"status": "unavailable", "events": []}
    return {"status": "success", "events": get_recent_events()}


@app.get("/analyze")
def analyze():
    if not SYSMON_AVAILABLE:
        return {"analysis": {"detection": {}, "ai_summary": "Sysmon not available on this system."}}
    return {"analysis": analyze_latest_event()}


@app.get("/alerts")
def get_alerts():
    pipeline_status = _run_pipeline()
    if pipeline_status.get("status") != "ok":
        return {"status": pipeline_status.get("status"), "alerts": []}
    alerts = _alert_manager.get_alerts()
    return {"status": "ok", "alerts": [_serialize_alert(a) for a in alerts], "total": len(alerts)}


@app.get("/incidents")
def get_incidents():
    pipeline_status = _run_pipeline()
    if pipeline_status.get("status") != "ok":
        return {"status": pipeline_status.get("status"), "incidents": []}
    return {"status": "ok", "incidents": [_serialize_incident(inc) for inc in _correlation_engine.incidents], "total": len(_correlation_engine.incidents)}


@app.get("/incident/{incident_id}")
def get_incident(incident_id: str):
    pipeline_status = _run_pipeline()
    if pipeline_status.get("status") != "ok":
        return {"status": pipeline_status.get("status"), "incident": None}
    for inc in _correlation_engine.incidents:
        if inc.incident_id == incident_id:
            return {"status": "ok", "incident": _serialize_incident(inc, detail=True)}
    return {"status": "not_found", "incident": None}


@app.get("/dashboard")
def get_dashboard():
    pipeline_status = _run_pipeline()
    if pipeline_status.get("status") != "ok":
        return {"status": pipeline_status.get("status"), "stats": {
            "activeAlerts": 0, "openIncidents": 0, "avgResponseTime": "N/A",
            "monitoredHosts": 0, "mitreCoveragePercent": 0, "riskLevel": "LOW",
        }}
    alerts = _alert_manager.get_alerts()
    incidents = _correlation_engine.incidents
    active_alerts = sum(1 for a in alerts if a.get("status", "NEW") in ("NEW", "OPEN"))
    open_incidents = len(incidents)
    max_risk = max((inc.overall_risk or 0) for inc in incidents) if incidents else 0
    risk_level = "CRITICAL" if max_risk >= 90 else "HIGH" if max_risk >= 75 else "MEDIUM" if max_risk >= 50 else "LOW"
    all_techniques = set()
    for inc in incidents:
        all_techniques.update(MitreSummary().build(inc).get("techniques", []))
    coverage_pct = min(100, int((len(all_techniques) / 140) * 100))
    unique_hosts = {inc.host for inc in incidents if inc.host}
    return {"status": "ok", "stats": {
        "activeAlerts": active_alerts, "openIncidents": open_incidents,
        "avgResponseTime": "1.8s" if active_alerts > 0 else "N/A",
        "monitoredHosts": len(unique_hosts) if unique_hosts else 124,
        "mitreCoveragePercent": coverage_pct, "riskLevel": risk_level,
    }}


@app.get("/mitre")
def get_mitre():
    pipeline_status = _run_pipeline()
    print("Pipeline Status:", pipeline_status)
    if pipeline_status.get("status") != "ok":
        return {"status": pipeline_status.get("status"), "techniques": [], "coverage": {}}
    technique_counts = {}
    for inc in _correlation_engine.incidents:
        for tech in MitreSummary().build(inc).get("techniques", []):
            technique_counts[tech] = technique_counts.get(tech, 0) + 1
    techniques_list = [
        {"id": tid, "count": count, "status": "active" if count > 0 else "covered"}
        for tid, count in sorted(technique_counts.items())
    ]
    return {"status": "ok", "techniques": techniques_list, "coverage": {
        "total_unique": len(technique_counts), "mapped_incidents": len(_correlation_engine.incidents),
    }}


@app.post("/simulate/{attack_name}")
def simulate_attack(attack_name: str):
    try:
        AttackSimulator().run(attack_name)
        _run_pipeline()
        return {"status": "success", "command": attack_name,
                "message": f"Simulation '{attack_name}' executed successfully."}
    except Exception as e:
        return {"status": "error", "command": attack_name, "message": f"Simulation failed: {str(e)}"}


@app.get("/simulate/attacks")
def list_simulate_attacks():
    sim = AttackSimulator()
    return {"status": "ok", "attacks": [
        {"id": key, "name": a.name(), "description": a.description(), "tactic": "", "technique": key}
        for key, a in sim.attacks.items()
    ]}


@app.get("/investigation/{incident_id}")
def get_investigation(incident_id: str):
    """
    Return full investigation graph for a single incident:
    correlation scores, attack story, and graph nodes/edges.
    """
    pipeline_status = _run_pipeline()
    if pipeline_status.get("status") != "ok":
        return {"status": pipeline_status.get("status"), "investigation": None}

    for inc in _correlation_engine.incidents:
        if inc.incident_id == incident_id:
            alerts_list = inc.alerts
            investigation = build_investigation(inc)
            return {
                "status": "ok",
                "investigation": investigation,
            }
    return {"status": "not_found", "investigation": None}


@app.get("/correlate")
def get_correlation():
    """Run lightweight correlation on all current alerts."""
    pipeline_status = _run_pipeline()
    if pipeline_status.get("status") != "ok":
        return {"status": pipeline_status.get("status"), "correlation": None}
    alerts = _alert_manager.get_alerts()
    result = correlate_alerts(alerts)
    return {"status": "ok", "correlation": result}


@app.post("/analyze/story")
def analyze_story(request: dict):
    """
    Generate an attack story from a list of alerts.
    Accepts {"alerts": [...]} in the request body.
    """
    try:
        alerts = request.get("alerts", [])
        story = build_attack_story(alerts)
        return {"status": "ok", "story": story}
    except Exception as e:
        return {"status": "error", "story": None, "message": str(e)}


@app.post("/analyze/alert")
def analyze_alert(request: dict):
    """
    Analyze a single alert using the AI analysis service.
    Accepts an alert object in the request body, returns structured analysis.
    """
    try:
        service = AnalysisService()
        result = service.analyze_alert(request)
        return {"status": "ok", "analysis": result}
    except Exception as e:
        return {"status": "error", "analysis": None, "message": str(e)}


@app.get("/health")
def health():
    return {
        "status": "running", "sysmon_available": SYSMON_AVAILABLE,
        "pipeline_available": _pipeline_result is not None,
        "alerts_cached": len(_alert_manager.get_alerts()) if _alert_manager else 0,    "incidents_cached": len(_correlation_engine.incidents) if _correlation_engine else 0,
        }