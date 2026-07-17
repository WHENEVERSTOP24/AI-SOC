import win32evtlog

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