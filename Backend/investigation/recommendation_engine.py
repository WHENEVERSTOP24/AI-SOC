class RecommendationEngine:

    def __init__(self):

        self.playbooks = {

            "PowerShell Execution": [

                "Review PowerShell command-line arguments.",

                "Verify the parent process.",

                "Check for encoded PowerShell commands.",

                "Inspect downloaded scripts.",

                "Investigate the user account."

            ]
        }

    def build(self, incident):

        recommendations = []

        for alert in incident.alerts:

            rule = alert.get("rule")

            if rule in self.playbooks:

                recommendations.extend(
                    self.playbooks[rule]
                )

        return sorted(set(recommendations))