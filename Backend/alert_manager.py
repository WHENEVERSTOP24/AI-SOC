class AlertManager:

    def __init__(self):

        self.alerts = []
        self.next_id = 1

    def add_alert(self, alert):

        # Assign a unique Alert ID
        alert["alert_id"] = f"ALERT-{self.next_id:04d}"

        # Every new alert starts with NEW status
        alert["status"] = "NEW"

        self.next_id += 1

        self.alerts.append(alert)

    def get_alerts(self):

        return self.alerts