# ─── Graceful win32evtlog import (Windows only) ───
try:
    import win32evtlog
    SYSMON_AVAILABLE = True
except ImportError:
    win32evtlog = None
    SYSMON_AVAILABLE = False

if SYSMON_AVAILABLE:
    server = "localhost"
    logtype = "Microsoft-Windows-Sysmon/Operational"

    hand = win32evtlog.OpenEventLog(server, logtype)

    flags = (
        win32evtlog.EVENTLOG_BACKWARDS_READ
        | win32evtlog.EVENTLOG_SEQUENTIAL_READ
    )

    events = win32evtlog.ReadEventLog(hand, flags, 0)

    for event in events[:10]:
        print("Event ID:", event.EventID)
        print("Time:", event.TimeGenerated)
        print("-" * 40)
else:
    print("Sysmon (win32evtlog) not available on this system. Skipping event read.")