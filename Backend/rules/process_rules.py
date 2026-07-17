def process_rules(event):

    detections = []
    

    image = (event.get("image") or "").lower()
    command = (event.get("command_line") or "").lower()

    # Rule 1
    if event.get("event_id") == 1 and "powershell.exe" in image:

        detections.append({
            "rule": "PowerShell Execution",
            "severity": "Medium",
            "confidence": 75,
            "mitre": ["T1059.001"],
            "reason": "PowerShell execution detected. Frequently abused for scripting, post-exploitation, and lateral movement."
        })

        if "-enc" in command or "-encodedcommand" in command:
            detections[-1]["rule"] = "Encoded PowerShell Execution"
            detections[-1]["severity"] = "High"
            detections[-1]["confidence"] = 95
            detections[-1]["reason"] = "Encoded PowerShell command detected. Obfuscation techniques are commonly used to evade security monitoring."

    # Rule 2
    if event.get("event_id") == 1 and "cmd.exe" in image:

        detections.append({
            "rule": "Command Prompt Execution",
            "severity": "Medium",
            "confidence": 85,
            "mitre": ["T1059.003"],
            "reason": "Command Prompt execution detected. Attackers often use cmd.exe to execute system commands and launch additional tools."
        })

    # Rule 3
    if event.get("event_id") == 1 and "certutil.exe" in image:

        detections.append({
            "rule": "CertUtil Usage",
            "severity": "High",
            "confidence": 95,
            "mitre": ["T1105"],
            "reason": "CertUtil execution detected. This LOLBin is frequently abused to download, decode, or transfer malicious payloads."
        })

    # Rule 4
    if event.get("event_id") == 1 and "mshta.exe" in image:

        detections.append({
            "rule": "MSHTA Execution",
            "severity": "High",
            "confidence": 94,
            "mitre": ["T1218.005"],
            "reason": "MSHTA execution detected. This signed Windows binary is commonly abused to execute remote or local malicious scripts."
        })

    # Rule 5
    if event.get("event_id") == 1 and "rundll32.exe" in image:

        detections.append({
            "rule": "RunDLL32 Execution",
            "severity": "High",
            "confidence": 92,
            "mitre": ["T1218.011"],
            "reason": "RunDLL32 execution detected. This LOLBin may be abused to execute malicious DLLs while bypassing application controls."
        })

    # Rule 6
    if event.get("event_id") == 1 and "regsvr32.exe" in image:

        detections.append({
            "rule": "Regsvr32 Execution",
            "severity": "High",
            "confidence": 92,
            "mitre": ["T1218.010"],
            "reason": "Regsvr32 execution detected. Attackers commonly abuse this LOLBin to execute scripts and evade traditional defenses."
        })

    # Rule 7
    if event.get("event_id") == 1 and "wmic.exe" in image:

        detections.append({
            "rule": "WMIC Execution",
            "severity": "Medium",
            "confidence": 88,
            "mitre": ["T1047"],
            "reason": "WMIC execution detected. This utility is often used for remote execution and system discovery."
        })

    return detections