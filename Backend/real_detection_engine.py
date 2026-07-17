def detect_event(event):
    """
    Rule-based detection engine.
    Input: Parsed Sysmon event (dictionary)
    Output: Detection result
    """

    result = {
        "matched": False,
        "rule": None,
        "severity": "Informational",
        "confidence": 0,
        "mitre": [],
        "reason": "",
        "ioc": {}
    }

    event_id = event.get("event_id")
    image = (event.get("image") or "").lower()
    command = (event.get("command_line") or "").lower()

    # Rule 1 - PowerShell
    if event_id == 1 and "powershell.exe" in image:

        result["matched"] = True
        result["rule"] = "PowerShell Execution"
        result["severity"] = "Medium"
        result["confidence"] = 75
        result["mitre"] = ["T1059.001"]
        result["reason"] = "PowerShell process created."

        result["ioc"] = {
            "process": image,
            "user": event.get("User")
        }

        if "-enc" in command or "-encodedcommand" in command:

            result["severity"] = "High"
            result["confidence"] = 95
            result["rule"] = "Encoded PowerShell Execution"
            result["reason"] = "Encoded PowerShell command detected."

    return result