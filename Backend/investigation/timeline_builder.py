class TimelineBuilder:

    def build(self, incident):

        timeline = []

        for alert in incident.alerts:

            timeline.append({
            "timestamp": alert.get("timestamp"),
            "rule": alert.get("rule"),
            "severity": alert.get("severity"),
            "risk": alert.get("risk_score"),
            "host": alert.get("computer"),
            "user": alert.get("user"),
            "mitre": alert.get("mitre"),
            "risk_score": alert.get("risk_score", 0),
        })
        timeline.sort(key=lambda event: event["timestamp"])

        return timeline