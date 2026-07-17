class InvestigationReport:

    def build(self, incident, timeline, narrative,mitre_summary, detection_summary, recommendations):

        report = {

            "incident_id": incident.incident_id,

            "host": incident.host,

            "user": incident.user,

            "status": incident.status,

            "overall_risk": incident.overall_risk,

            "total_alerts": len(incident.alerts),

            "timeline": timeline,

            "attack_narrative": narrative,

            "mitre_summary" : mitre_summary,

            "detection_summary": detection_summary,

            "recommendations": recommendations


        }

        return report