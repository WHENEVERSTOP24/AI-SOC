from incident import Incident


class CorrelationEngine:

    def __init__(self):

        self.incidents = []
        self.incident_lookup = {}
        self.next_incident_id = 1

    def correlate(self, alerts):

     for alert in alerts:

        key = (
            alert.get("computer"),
            alert.get("user")
        )

        if key in self.incident_lookup:

            incident = self.incident_lookup[key]
            incident.add_alert(alert)

        else:

            incident = Incident(
                incident_id=f"INCIDENT-{self.next_incident_id:04d}",
                host=alert.get("computer"),
                user=alert.get("user")
            )

            incident.add_alert(alert)

            self.incidents.append(incident)

            self.incident_lookup[key] = incident

            self.next_incident_id += 1

     return self.incidents