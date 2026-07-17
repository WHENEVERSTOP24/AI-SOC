"""
AI-SOC Attack Story Generator

Combines multiple related alerts into a human-readable attack narrative
that explains:
  - What happened
  - Why these alerts are related
  - Probable attack sequence (kill chain stages)
  - What the SOC analyst should investigate next
"""

from typing import Any


# ─── MITRE tactic → Kill chain stage mapping ───
TACTIC_TO_STAGE = {
    "T1059": "Execution",
    "T1059.001": "Execution",
    "T1059.003": "Execution",
    "T1059.005": "Execution",
    "T1047": "Execution",
    "T1204": "Execution",
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

# ─── Stage order for sequencing ───
STAGE_ORDER = [
    "Initial Access",
    "Execution",
    "Persistence",
    "Privilege Escalation",
    "Defense Evasion",
    "Credential Access",
    "Discovery",
    "Lateral Movement",
    "Command & Control",
    "Ingress Tool Transfer",
    "Impact",
]

# ─── Action templates per stage ───
STAGE_ACTIONS = {
    "Initial Access": [
        "Investigate the initial vector — check email logs, browser history, and external connections.",
    ],
    "Execution": [
        "Review the executed command line arguments for obfuscation or encoded payloads.",
        "Check parent process ancestry to determine how the binary was launched.",
    ],
    "Persistence": [
        "Audit scheduled tasks, services, and startup registry keys on the affected host.",
        "Verify if the persistence mechanism has already triggered on other hosts.",
    ],
    "Privilege Escalation": [
        "Check for known local privilege escalation exploits on the host.",
        "Review token and session privilege levels for unusual elevation patterns.",
    ],
    "Defense Evasion": [
        "Review AV/EDR logs for tampering or exclusion creation.",
        "Check for renamed binaries or LOLBin usage in the process tree.",
    ],
    "Credential Access": [
        "Immediately rotate credentials for the affected user and service accounts.",
        "Scan memory dumps and credential stores on the impacted host.",
    ],
    "Discovery": [
        "Check network share access logs and user enumeration commands in the process history.",
    ],
    "Lateral Movement": [
        "Review authentication logs for anomalous remote logons from the compromised host.",
    ],
    "Command & Control": [
        "Block outbound connections to suspicious destinations at the firewall.",
        "Review proxy logs for beaconing patterns or data exfiltration.",
    ],
    "Ingress Tool Transfer": [
        "Check for downloaded payloads in temp directories and browser caches.",
        "Verify file hashes against threat intelligence sources.",
    ],
    "Impact": [
        "Isolate the host immediately to prevent ransomware encryption or data destruction.",
        "Check backup integrity and initiate recovery procedures if needed.",
    ],
}


def build_attack_story(alerts: list[dict]) -> dict[str, Any]:
    """
    Build a complete attack story from a list of related alerts.

    Returns:
      - title: short summary title
      - stages: ordered list of kill chain stages with matched alerts
      - narrative: human-readable paragraphs
      - next_steps: recommended investigation steps
      - techniques: set of observed MITRE techniques
    """
    if not alerts:
        return _empty_story()

    # Sort chronologically
    sorted_alerts = sorted(alerts, key=lambda a: a.get("timestamp", ""))

    # Map alerts to kill chain stages
    stage_map: dict[str, list[dict]] = {}
    all_techniques: set[str] = set()

    for alert in sorted_alerts:
        mitre_list = _get_mitre_list(alert)
        for tech in mitre_list:
            stage = TACTIC_TO_STAGE.get(tech)
            if stage:
                stage_map.setdefault(stage, []).append(alert)
                break
        all_techniques.update(mitre_list)

    # Build ordered stages
    stages = []
    for stage_name in STAGE_ORDER:
        if stage_name in stage_map:
            stage_alerts = stage_map[stage_name]
            stages.append({
                "stage": stage_name,
                "alert_count": len(stage_alerts),
                "alerts": [
                    {"id": a.get("alert_id", a.get("id", "")),
                     "rule": a.get("rule", a.get("rule_name", "")),
                     "severity": a.get("severity", "")}
                    for a in stage_alerts
                ],
                "actions": STAGE_ACTIONS.get(stage_name, []),
            })

    # Build narrative
    narrative = _build_narrative(stages, sorted_alerts)

    # Build next steps
    next_steps = _build_next_steps(stages)

    return {
        "title": _build_title(stages, sorted_alerts),
        "stages": stages,
        "narrative": narrative,
        "next_steps": next_steps,
        "techniques": sorted(all_techniques),
        "total_alerts": len(alerts),
        "kill_chain_coverage": f"{len(stages)}/{len(STAGE_ORDER)} stages",
    }


def _build_title(stages: list[dict], alerts: list[dict]) -> str:
    """Generate a short descriptive title."""
    if not stages or not alerts:
        return "No attack chain detected."

    top_stages = [s["stage"] for s in stages[:3]]
    techniques = set()
    for s in stages:
        for a in s["alerts"]:
            techniques.add(a.get("rule", ""))

    primary = ", ".join(top_stages)
    host = alerts[0].get("computer", alerts[0].get("host", ""))
    user = alerts[0].get("user", "")

    parts = [f"Multi-stage {primary}"]
    if host:
        parts.append(f"on {host}")
    if user:
        parts.append(f"({user})")
    return " ".join(parts)


def _build_narrative(stages: list[dict], alerts: list[dict]) -> str:
    """Build a human-readable attack narrative."""
    if not stages or not alerts:
        return "No attack chain detected."

    lines = []
    lines.append(f"Analysis of {len(alerts)} correlated alerts reveals a {len(stages)}-stage attack chain.")
    lines.append("")

    for s in stages:
        rule_names = ", ".join(a["rule"] for a in s["alerts"])
        lines.append(f"**{s['stage']}:** {rule_names}")

    lines.append("")
    lines.append("The alerts are related because they share common infrastructure")
    if len(alerts) > 0:
        host = alerts[0].get("computer", alerts[0].get("host", "the same host"))
        user = alerts[0].get("user", "the same user")
        lines.append(f"({host}, {user}) and form a logical progression of the attack lifecycle.")

    return "\n".join(lines)


def _build_next_steps(stages: list[dict]) -> list[str]:
    """Generate actionable next steps based on observed stages."""
    steps = []
    seen = set()

    for s in stages:
        for action in s.get("actions", []):
            if action not in seen:
                steps.append(action)
                seen.add(action)

    if not steps:
        steps = ["Review the correlated alerts and investigate the affected host."]

    return steps


def _get_mitre_list(alert: dict) -> list[str]:
    """Extract MITRE technique IDs from an alert (handles both frontend and backend shapes)."""
    # Backend shape: alert["mitre"] = ["T1059.001", ...]
    raw = alert.get("mitre", [])
    if isinstance(raw, list):
        return [m.strip().upper() for m in raw if m and isinstance(m, str)]

    # Frontend shape: mitre_technique with "(TXXXX.XXX)" suffix
    tech_str = alert.get("mitre_technique", "")
    if tech_str:
        import re
        match = re.search(r'\((\w+(?:\.\w+)?)\)', tech_str)
        if match:
            return [match.group(1).upper()]

    return []


def _empty_story() -> dict[str, Any]:
    return {
        "title": "No alerts to analyze.",
        "stages": [],
        "narrative": "No correlated alerts found for attack story generation.",
        "next_steps": [],
        "techniques": [],
        "total_alerts": 0,
        "kill_chain_coverage": "0/11 stages",
    }
