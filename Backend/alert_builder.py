def build_alert(event, detection):

    alert = {
        "timestamp": event["timestamp"],
        "computer": event["computer"],
        "user": event["user"],
        "image": event["image"],
        "rule": detection["rule"],
        "severity": detection["severity"],
        "confidence": detection["confidence"],
        "reason": detection["reason"],
        "mitre": detection["mitre"]
    }

    return alert