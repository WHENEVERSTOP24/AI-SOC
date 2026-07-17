from datetime import datetime


def _normalize_timestamp(utc_time_str: str) -> str:
    """
    Parse Sysmon UtcTime (format: "YYYY-MM-DD HH:mm:ss.ms" or "YYYY-MM-DD HH:mm:ss")
    and return a strict ISO-8601 UTC string (e.g. "2024-01-15T14:30:22.123000Z").
    Falls back to the original string if parsing fails.
    """
    if not utc_time_str:
        return ""
    for fmt in ("%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"):
        try:
            dt = datetime.strptime(utc_time_str, fmt)
            return dt.isoformat() + "Z"
        except ValueError:
            continue
    # If already ISO-like with Z, leave as-is
    if utc_time_str.endswith("Z") or "+" in utc_time_str[-6:]:
        return utc_time_str
    return utc_time_str


def normalize_event(event):
    """
    Converts raw Sysmon events into a common AI-SOC schema.
    All timestamps are normalized to ISO-8601 UTC format.
    """

    normalized = {
        "type": "unknown",
        "event_id": event.get("event_id"),
        "timestamp": _normalize_timestamp(event.get("UtcTime")),
        "computer": event.get("computer"),
        "user": event.get("User"),

        "image": None,
        "parent_image": None,
        "command_line": None,
        "parent_command": None,

        "pid": None,
        "parent_pid": None,

        "hashes": None,
         # Network fields
        "source_ip": None,
        "source_port": None,
        "destination_ip": None,
        "destination_port": None,
        "protocol": None,


        "raw": event
    }

    # -------------------------
    # Process Creation
    # -------------------------

    if event.get("event_id") == 1:

        normalized["type"] = "process"

        normalized["image"] = event.get("Image")
        normalized["command_line"] = event.get("CommandLine")

        normalized["parent_image"] = event.get("ParentImage")
        normalized["parent_command"] = event.get("ParentCommandLine")

        normalized["pid"] = event.get("ProcessId")
        normalized["parent_pid"] = event.get("ParentProcessId")

        normalized["hashes"] = event.get("Hashes")

    # -------------------------
    # Process Termination
    # -------------------------

    elif event.get("event_id") == 5:

        normalized["type"] = "process_terminated"

        normalized["image"] = event.get("Image")
        normalized["pid"] = event.get("ProcessId")


            # -------------------------
            # Network Connection
             # -------------------------

    elif event.get("event_id") == 3:

        normalized["type"] = "network"

        normalized["image"] = event.get("Image")
        normalized["command_line"] = event.get("CommandLine")

        normalized["pid"] = event.get("ProcessId")

        normalized["source_ip"] = event.get("SourceIp")
        normalized["source_port"] = event.get("SourcePort")

        normalized["destination_ip"] = event.get("DestinationIp")
        normalized["destination_port"] = event.get("DestinationPort")

        normalized["protocol"] = event.get("Protocol")

    return normalized