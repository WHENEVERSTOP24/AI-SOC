print("LOADED REAL_ANALYZER VERSION 124 - Linux compatibility patch")

# ─── Graceful win32evtlog import (Windows only) ───
try:
    import win32evtlog
    SYSMON_AVAILABLE = True
except ImportError:
    win32evtlog = None
    SYSMON_AVAILABLE = False

import requests
from detections import detect_threat


def analyze_latest_event():

    if not SYSMON_AVAILABLE:
        return {
            "detection": {},
            "ai_summary": "Sysmon (win32evtlog) not available on this system."
        }

    server = "localhost"
    logtype = "Microsoft-Windows-Sysmon/Operational"

    hand = win32evtlog.OpenEventLog(server, logtype)

    flags = (
        win32evtlog.EVENTLOG_BACKWARDS_READ
        | win32evtlog.EVENTLOG_SEQUENTIAL_READ
    )

    events = win32evtlog.ReadEventLog(hand, flags, 0)

    event_map = {
        1: "Process Creation",
        3: "Network Connection",
        5: "Process Terminated",
        11: "File Created",
        22: "DNS Query"
    }

    if not events:
        return {
            "detection": {},
            "ai_summary": "No Sysmon events found."
        }

    # Latest event
    event = events[0]

    print("\n========== DEBUG ==========")
    print("Raw Event ID:", event.EventID)

    event_id = event.EventID & 0xFFFF

    print("Calculated Event ID:", event_id)

    event_name = event_map.get(
        event_id,
        f"Unknown Event ({event_id})"
    )

    print("Event Name:", event_name)

    event_data = ""

    if event.StringInserts:

        print("\nString Inserts:")

        for i, item in enumerate(event.StringInserts):
            print(f"[{i}] {item}")

        event_data = "\n".join(
            str(item)
            for item in event.StringInserts
        )

    else:
        print("No String Inserts Found")

    # -------------------------
    # Detection Engine
    # -------------------------

    detection = detect_threat(event_id, event_data)

    print("\n===== Detection Engine =====")
    print(detection)
    print("============================")

    print("===========================\n")

    prompt = f"""
You are a Senior SOC Analyst working in an enterprise SOC.

A rule-based Detection Engine has already analyzed this event.

==========================
Detection Results
==========================

Alert: {detection["alert"]}

Rule Triggered:
{detection["rule"]}

Severity:
{detection["severity"]}

Confidence:
{detection["confidence"]}%

MITRE ATT&CK:
{", ".join(detection["mitre"]) if detection["mitre"] else "None"}

==========================
Event Information
==========================

Event ID:
{event_id}

Event Type:
{event_name}

Raw Event Data:
{event_data}

Instructions:

- Explain WHY the detection rule triggered.
- Do NOT invent attacks.
- If the activity appears legitimate, clearly say so.
- Mention Indicators of Compromise (IOCs) if present.
- Recommend investigation steps.
- Keep the answer under 180 words.

Output Format

Threat Summary:

Risk Explanation:

Indicators of Compromise:

Recommended Actions:
"""

    try:

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "qwen2.5-coder:3b",
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()

        return {
            "detection": detection,
            "ai_summary": response.json()["response"]
        }

    except Exception as e:

        return {
            "detection": detection,
            "ai_summary": f"Analysis Error: {str(e)}"
        }


print("REACHED GET_RECENT_EVENTS")


def get_recent_events(limit=10):

    if not SYSMON_AVAILABLE:
        return []

    server = "localhost"
    logtype = "Microsoft-Windows-Sysmon/Operational"

    hand = win32evtlog.OpenEventLog(server, logtype)

    flags = (
        win32evtlog.EVENTLOG_BACKWARDS_READ
        | win32evtlog.EVENTLOG_SEQUENTIAL_READ
    )

    events = win32evtlog.ReadEventLog(hand, flags, 0)

    result = []

    if not events:
        return result

    for event in events[:limit]:

        event_id = event.EventID & 0xFFFF

        result.append({
            "event_id": event_id,
            "record_number": event.RecordNumber,
            "timestamp": event.TimeGenerated.isoformat()
        })

    return result


print("MODULE LOADED")
print(
    "Functions:",
    [x for x in globals() if callable(globals()[x])]
)