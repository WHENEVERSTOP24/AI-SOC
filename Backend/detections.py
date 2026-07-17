"""
AI-SOC Detection Engine

This module performs rule-based threat detection before
sending data to the LLM.
"""

def detect_threat(event_id: int, event_data: str):

    # Normalize for easier matching
    data = event_data.lower()

    result = {
        "alert": False,
        "rule": "No suspicious rule matched",
        "severity": "Low",
        "mitre": [],
        "confidence": 100
    }

    # -----------------------------
    # Event ID Based Rules
    # -----------------------------

    if event_id == 3:
        result.update({
            "severity": "Medium",
            "rule": "Network Connection",
            "mitre": ["T1071"]
        })

    elif event_id == 22:
        result.update({
            "severity": "Low",
            "rule": "DNS Query",
            "mitre": ["T1071.004"]
        })

    elif event_id == 11:
        result.update({
            "severity": "Medium",
            "rule": "File Creation",
            "mitre": ["T1105"]
        })

    elif event_id == 1:
        result.update({
            "severity": "Low",
            "rule": "Process Creation"
        })

    # -----------------------------
    # Process Based Rules
    # -----------------------------

    if "powershell.exe" in data:

        result.update({
            "alert": True,
            "severity": "High",
            "rule": "PowerShell Execution",
            "mitre": ["T1059.001"],
            "confidence": 90
        })

    if "-enc" in data or "-encodedcommand" in data:

        result.update({
            "alert": True,
            "severity": "Critical",
            "rule": "Encoded PowerShell",
            "mitre": ["T1059.001"],
            "confidence": 98
        })

    if "cmd.exe" in data:

        result.update({
            "alert": True,
            "severity": "Medium",
            "rule": "Command Prompt Execution",
            "mitre": ["T1059"],
            "confidence": 85
        })

    if "regsvr32.exe" in data:

        result.update({
            "alert": True,
            "severity": "High",
            "rule": "Regsvr32 LOLBin",
            "mitre": ["T1218"],
            "confidence": 92
        })

    if "rundll32.exe" in data:

        result.update({
            "alert": True,
            "severity": "High",
            "rule": "RunDLL32 LOLBin",
            "mitre": ["T1218"],
            "confidence": 92
        })

    if "certutil.exe" in data:

        result.update({
            "alert": True,
            "severity": "High",
            "rule": "CertUtil Usage",
            "mitre": ["T1105"],
            "confidence": 95
        })

    if "mshta.exe" in data:

        result.update({
            "alert": True,
            "severity": "High",
            "rule": "MSHTA Execution",
            "mitre": ["T1218.005"],
            "confidence": 94
        })

    return result