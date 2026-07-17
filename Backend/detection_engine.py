from rules.process_rules import process_rules
from rules.network_rules import network_rules


def detect_event(event):

    detections = []

    detections.extend(process_rules(event))
    detections.extend(network_rules(event))

    return detections