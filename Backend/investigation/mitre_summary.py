class MitreSummary:

    def build(self, incident):

        techniques = set()

        for alert in incident.alerts:

            for technique in alert.get("mitre", []):

                techniques.add(technique)

        summary = {
            "techniques": sorted(list(techniques)),
            "count": len(techniques)
        }

        return summary