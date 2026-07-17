# ─── Graceful win32evtlog import (Windows only) ───
try:
    import win32evtlog
    SYSMON_AVAILABLE = True
except ImportError:
    win32evtlog = None
    SYSMON_AVAILABLE = False

if SYSMON_AVAILABLE:
    # Connect to Sysmon log
    server = "localhost"
    logtype = "Microsoft-Windows-Sysmon/Operational"

    hand = win32evtlog.OpenEventLog(server, logtype)

    flags = (
        win32evtlog.EVENTLOG_BACKWARDS_READ
        | win32evtlog.EVENTLOG_SEQUENTIAL_READ
    )

    # Read latest events
    events = win32evtlog.ReadEventLog(hand, flags, 0)

    # Event descriptions
    event_map = {
        1: "Process Creation",
        3: "Network Connection",
        5: "Process Terminated",
        11: "File Created",
        22: "DNS Query"
    }

    # Severity levels
    severity_map = {
        1: "LOW",
        3: "MEDIUM",
        5: "LOW",
        11: "MEDIUM",
        22: "LOW"
    }

    print("\n===== AI-SOC Event Parser =====\n")

    # Show latest 20 events
    for event in events[:20]:

        event_id = event.EventID & 0xFFFF

        event_name = event_map.get(
            event_id,
            "Unknown Event"
        )

        severity = severity_map.get(
            event_id,
            "LOW"
        )

        print(f"Event ID : {event_id}")
        print(f"Event    : {event_name}")
        print(f"Severity : {severity}")
        print(f"Time     : {event.TimeGenerated}")
        print("-" * 50)
else:
    print("\n===== AI-SOC Event Parser =====\n")
    print("Sysmon (win32evtlog) not available on this system.")