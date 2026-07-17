def network_rules(event):
    """
    Detection rules for Sysmon Event ID 3 (Network Connections)
    """

    detections = []

    # Only process network events
    if event.get("event_id") != 3:
        return detections

    image = (event.get("image") or "").lower()
    destination_ip = event.get("destination_ip") or ""
    destination_port = str(event.get("destination_port") or "")

    # ---------------------------------
    # Rule 1: PowerShell Network Activity
    # ---------------------------------

    if "powershell.exe" in image:

        detections.append({
            "rule": "PowerShell Network Connection",
            "severity": "High",
            "confidence": 90,
            "mitre": ["T1105"],
            "reason": "PowerShell initiated a network connection."
        })

    # ---------------------------------
    # Rule 2: Suspicious RDP Connection
    # ---------------------------------

    if destination_port == "3389":

        detections.append({
            "rule": "Outbound RDP Connection",
            "severity": "Medium",
            "confidence": 70,
            "mitre": ["T1021.001"],
            "reason": "Outbound Remote Desktop connection detected."
        })

    return detections