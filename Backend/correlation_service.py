"""
AI-SOC Correlation Service

Lightweight correlation engine that scores relationships between alerts
based on shared attributes: host, user, temporal proximity, parent process,
and MITRE ATT&CK tactic overlap.

Outputs a correlation score (0–100) and a detailed breakdown of what matched.
"""

from datetime import datetime
from typing import Any


# ─── Time window for temporal proximity (seconds) ───
TEMPORAL_WINDOW_SECONDS = 300  # 5 minutes


def correlate_alerts(alerts: list[dict]) -> dict[str, Any]:
    """
    Run lightweight correlation across all current alerts.

    Returns a dict with:
      - correlations: list of pairwise correlation results
      - clusters: alerts grouped by host + user
      - global_score: average correlation confidence across clusters
    """
    clusters = _cluster_alerts(alerts)
    correlations = []

    for cluster_key, cluster_alerts in clusters.items():
        if len(cluster_alerts) < 2:
            continue
        host, user = cluster_key
        for i in range(len(cluster_alerts)):
            for j in range(i + 1, len(cluster_alerts)):
                a = cluster_alerts[i]
                b = cluster_alerts[j]
                score, breakdown = _score_pair(a, b)
                correlations.append({
                    "alert_a": a.get("alert_id", a.get("id", "")),
                    "alert_b": b.get("alert_id", b.get("id", "")),
                    "rule_a": a.get("rule", a.get("rule_name", "")),
                    "rule_b": b.get("rule", b.get("rule_name", "")),
                    "correlation_score": score,
                    "breakdown": breakdown,
                    "host": host,
                    "user": user,
                })

    global_score = _compute_global_score(correlations)

    return {
        "correlations": correlations,
        "clusters": {str(k): v for k, v in clusters.items()},
        "global_score": global_score,
        "total_alerts": len(alerts),
        "total_clusters": len(clusters),
    }


def _cluster_alerts(alerts: list[dict]) -> dict[tuple[str, str], list[dict]]:
    """Group alerts by (host, user) pair."""
    clusters: dict[tuple[str, str], list[dict]] = {}
    for alert in alerts:
        key = (
            alert.get("computer", alert.get("host", "unknown")),
            alert.get("user", "unknown"),
        )
        clusters.setdefault(key, []).append(alert)
    return clusters


def _score_pair(a: dict, b: dict) -> tuple[int, dict]:
    """
    Score the relationship between two alerts.

    Returns (score 0–100, breakdown dict).
    """
    score = 0
    reasons = []

    # ── 1. Same host (weight: 25) ──
    host_a = a.get("computer", a.get("host", "")).lower()
    host_b = b.get("computer", b.get("host", "")).lower()
    if host_a and host_b and host_a == host_b:
        score += 25
        reasons.append("same_host")

    # ── 2. Same user (weight: 20) ──
    user_a = (a.get("user") or "").lower()
    user_b = (b.get("user") or "").lower()
    if user_a and user_b and user_a == user_b:
        score += 20
        reasons.append("same_user")

    # ── 3. Same parent process (weight: 15) ──
    parent_a = (a.get("parent_image") or "").lower()
    parent_b = (b.get("parent_image") or "").lower()
    if parent_a and parent_b and parent_a == parent_b:
        score += 15
        reasons.append("same_parent_process")

    # ── 4. Shared MITRE technique/tactic (weight: 20) ──
    mitre_a = _get_mitre_set(a)
    mitre_b = _get_mitre_set(b)
    if mitre_a and mitre_b and mitre_a & mitre_b:
        overlap = mitre_a & mitre_b
        score += 20
        reasons.append(f"shared_mitre:{','.join(sorted(overlap))}")

    # ── 5. Temporal proximity (weight: 20) ──
    ts_a = _parse_timestamp(a.get("timestamp", ""))
    ts_b = _parse_timestamp(b.get("timestamp", ""))
    if ts_a is not None and ts_b is not None:
        diff = abs((ts_a - ts_b).total_seconds())
        if diff <= TEMPORAL_WINDOW_SECONDS:
            proximity = max(0, 20 - int(diff / (TEMPORAL_WINDOW_SECONDS / 20)))
            score += proximity
            reasons.append(f"temporal_proximity:{int(diff)}s")

    return min(score, 100), reasons


def _get_mitre_set(alert: dict) -> set[str]:
    """Extract MITRE technique IDs from an alert."""
    mitre = alert.get("mitre", [])
    if isinstance(mitre, list):
        return {m.strip().upper() for m in mitre if m}
    if isinstance(mitre, str):
        return {mitre.strip().upper()}
    return set()


def _parse_timestamp(ts: str) -> datetime | None:
    """Try to parse an ISO-8601 timestamp string."""
    if not ts:
        return None
    try:
        # Strip trailing Z and parse
        cleaned = ts.replace("Z", "+00:00") if ts.endswith("Z") else ts
        return datetime.fromisoformat(cleaned)
    except (ValueError, TypeError):
        return None


def _compute_global_score(correlations: list[dict]) -> int:
    """Average correlation score across all pairs, weighted."""
    if not correlations:
        return 0
    total = sum(c["correlation_score"] for c in correlations)
    return round(total / len(correlations))
