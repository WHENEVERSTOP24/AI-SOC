severity_scores = {
    "Critical": 100,
    "High": 80,
    "Medium": 60,
    "Low": 30,
    "Informational": 10
}


def calculate_risk(alert):

    severity = alert.get("severity", "Informational")
    confidence = alert.get("confidence", 0)

    base_score = severity_scores.get(severity, 10)

    # Blend severity with confidence
    risk_score = int((base_score * 0.7) + (confidence * 0.3))

    # Assign priority
    if risk_score >= 90:
        priority = "Critical"
    elif risk_score >= 75:
        priority = "High"
    elif risk_score >= 50:
        priority = "Medium"
    else:
        priority = "Low"

    alert["risk_score"] = risk_score
    alert["priority"] = priority

    return alert