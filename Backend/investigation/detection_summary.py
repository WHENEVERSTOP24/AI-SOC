class DetectionSummary:

    def build(self, incident):

        summary = {}

        for alert in incident.alerts:

            rule = alert.get("rule", "Unknown")

            summary[rule] = summary.get(rule, 0) + 1

        return summary