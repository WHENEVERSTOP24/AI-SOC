import win32evtlog
import requests

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

if events:

    event = events[0]

    event_id = event.EventID & 0xFFFF

    event_name = event_map.get(
        event_id,
        "Unknown Event"
    )

    prompt = f"""
You are a SOC analyst.

Analyze this Sysmon event.

Event ID: {event_id}
Event Type: {event_name}

Provide:
1. Threat Summary
2. Severity
3. MITRE ATT&CK Technique
4. Recommended Actions

Keep response under 150 words.
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model":"qwen2.5-coder:3b",
            "prompt":prompt,
            "stream":False
        }
    )

    print(response.json()["response"])