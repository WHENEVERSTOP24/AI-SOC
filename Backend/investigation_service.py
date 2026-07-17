"""
AI-SOC Investigation Service

Orchestrates the full investigation pipeline for a single incident:
  1. Correlates alerts using the lightweight correlation service
  2. Generates an attack story with kill chain stages
  3. Builds a graph of nodes and edges for frontend visualization

Connects to: correlation_service.py, attack_story.py
"""

from typing import Any

from correlation_service import correlate_alerts
from investigation.attack_story import build_attack_story


# ─── MITRE tactic → human-readable label ───
TACTIC_LABELS = {
    "T1059": "Execution",
    "T1059.001": "Execution",
    "T1059.003": "Execution",
    "T1047": "Execution",
    "T1071": "Command & Control",
    "T1071.004": "Command & Control",
    "T1105": "Ingress Tool Transfer",
    "T1218": "Defense Evasion",
    "T1218.005": "Defense Evasion",
    "T1218.010": "Defense Evasion",
    "T1218.011": "Defense Evasion",
    "T1218.014": "Defense Evasion",
    "T1055": "Privilege Escalation",
    "T1547": "Persistence",
    "T1053.005": "Persistence",
    "T1082": "Discovery",
    "T1003.001": "Credential Access",
    "T1490": "Impact",
    "T1562": "Defense Evasion",
}


def build_investigation(incident) -> dict[str, Any]:
    """
    Build a complete investigation payload for a single incident.

    Args:
        incident: Incident object with .alerts, .host, .user, .incident_id, etc.

    Returns:
        Dict with keys: incident_id, host, user, title,
                        attack_story, correlation, graph
    """
    alerts = incident.alerts
    if not alerts:
        return _empty_investigation(incident)

    # 1. Correlation
    corr = correlate_alerts(alerts)

    # 2. Attack story
    story = build_attack_story(alerts)

    # 3. Graph nodes and edges
    nodes, edges = _build_graph(incident, alerts, corr)

    # 4. Title
    title = _build_title(story, incident)

    return {
        "incident_id": incident.incident_id,
        "host": incident.host,
        "user": incident.user,
        "title": title,
        "attack_story": story,
        "correlation": corr,
        "graph": {"nodes": nodes, "edges": edges},
    }


def _build_graph(incident, alerts: list, corr: dict) -> tuple[list, list]:
    """Build graph nodes and edges from alerts and correlation data."""
    nodes: list[dict] = []
    edges: list[dict] = []

    # Host node
    host_id = f"host_{incident.host}"
    nodes.append({"id": host_id, "label": incident.host, "type": "host", "severity": "info"})

    # Process nodes + edges from host
    seen_processes: set[str] = set()
    for alert in alerts:
        image = alert.get("image", alert.get("process_name", ""))
        if image and image not in seen_processes:
            seen_processes.add(image)
            proc_id = f"proc_{image.replace('.', '_').replace('\\\\', '_')}"
            nodes.append({"id": proc_id, "label": image, "type": "process", "severity": "info"})
            edges.append({
                "source": host_id, "target": proc_id,
                "label": "spawns", "type": "relation",
                "reason": "Process executed on host",
                "confidence": 100,
            })

    # Alert nodes + edges from processes
    for alert in alerts:
        alert_id = alert.get("alert_id", alert.get("id", ""))
        image = alert.get("image", alert.get("process_name", ""))
        rule = alert.get("rule", alert.get("rule_name", ""))
        severity = (alert.get("severity") or "LOW").upper()
        mitre_list = _get_mitre_list(alert)

        nid = f"alert_{alert_id}"
        nodes.append({
            "id": nid, "label": rule, "type": "alert",
            "severity": severity, "alert_id": alert_id,
            "mitre": mitre_list,
        })
        if image:
            proc_id = f"proc_{image.replace('.', '_').replace('\\\\', '_')}"
            edges.append({
                "source": proc_id, "target": nid,
                "label": "triggers", "type": "detection",
                "reason": f"Detection rule matched for {rule}",
                "confidence": 95,
            })

    # MITRE nodes + edges from alerts
    seen_mitre: set[str] = set()
    for alert in alerts:
        mitre_list = _get_mitre_list(alert)
        for tech in mitre_list:
            if tech not in seen_mitre:
                seen_mitre.add(tech)
                tech_id = f"mitre_{tech.replace('.', '_')}"
                tactic = TACTIC_LABELS.get(tech, "Unknown")
                nodes.append({
                    "id": tech_id, "label": tech, "type": "mitre",
                    "severity": "info", "tactic": tactic,
                })
            alert_id = alert.get("alert_id", alert.get("id", ""))
            nid = f"alert_{alert_id}"
            tech_id = f"mitre_{tech.replace('.', '_')}"
            edges.append({
                "source": nid, "target": tech_id,
                "label": "maps_to", "type": "mapping",
                "reason": f"Alert maps to MITRE {tech}",
                "confidence": 90,
            })

    return nodes, edges


def _get_mitre_list(alert: dict) -> list[str]:
    """Extract MITRE technique IDs from an alert."""
    mitre = alert.get("mitre", [])
    if isinstance(mitre, list):
        return [m.strip().upper() for m in mitre if m and isinstance(m, str)]
    return []


def _build_title(story: dict, incident) -> str:
    """Build a descriptive investigation title."""
    stages = story.get("stages", [])
    if stages:
        stage_names = [s["stage"] for s in stages[:3]]
        return f"Multi-stage {' → '.join(stage_names)} on {incident.host} ({incident.user})"
    return f"Investigation for {incident.host} ({incident.user})"


def _empty_investigation(incident) -> dict[str, Any]:
    return {
        "incident_id": incident.incident_id,
        "host": incident.host,
        "user": incident.user,
        "title": f"No alerts for {incident.host}",
        "attack_story": {
            "title": "No alerts to analyze.",
            "stages": [],
            "narrative": "No correlated alerts found for attack story generation.",
            "next_steps": [],
            "techniques": [],
            "total_alerts": 0,
            "kill_chain_coverage": "0/11 stages",
        },
        "correlation": {
            "correlations": [],
            "global_score": 0,
            "total_alerts": 0,
            "total_clusters": 0,
        },
        "graph": {"nodes": [], "edges": []},
    }
