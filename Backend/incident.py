class Incident:

    def __init__(self, incident_id, host, user):

        self.incident_id = incident_id

        self.host = host
        self.user = user

        # List of alerts belonging to this incident
        self.alerts = []

        # Timeline
        self.start_time = None
        self.end_time = None

        # Highest risk among all alerts
        self.overall_risk = 0

        # Incident status
        self.status = "ACTIVE"

    def add_alert(self, alert):
        """
        Adds an alert to the incident and updates
        the incident metadata.
        """

        self.alerts.append(alert)

        # Set start time only for the first alert
        if self.start_time is None:
            self.start_time = alert.get("timestamp")

        # Always update the end time
        self.end_time = alert.get("timestamp")

        # Keep the highest risk score seen so far
        self.overall_risk = max(
            self.overall_risk,
            alert.get("risk_score", 0)
        )