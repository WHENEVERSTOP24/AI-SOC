import win32evtlog

from event_parser import parse_event
from event_normalizer import normalize_event
from detection_engine import detect_event

from alert_builder import build_alert
from risk_engine import calculate_risk
from alert_manager import AlertManager

from correlation_engine import CorrelationEngine

from investigation.timeline_builder import TimelineBuilder
from investigation.timeline_formatter import TimelineFormatter

from investigation.attack_narrative import AttackNarrative
from investigation.investigation_report import InvestigationReport

from investigation.mitre_summary import MitreSummary
from investigation.detection_summary import DetectionSummary

from investigation.recommendation_engine import RecommendationEngine
from investigation.prompt_builder import PromptBuilder

from ai.ai_analyzer import AIAnalyzer

def get_latest_event_xml():
    """
    Reads the latest Sysmon event and returns
    the raw XML.
    """

    log_name = "Microsoft-Windows-Sysmon/Operational"

    handle = win32evtlog.EvtQuery(
        log_name,
        win32evtlog.EvtQueryChannelPath |
        win32evtlog.EvtQueryReverseDirection,
        "*"
    )

    events = win32evtlog.EvtNext(handle, 1)

    if not events:
        print("No Sysmon events found.")
        return None

    xml = win32evtlog.EvtRender(
        events[0],
        win32evtlog.EvtRenderEventXml
    )

    return xml


def get_recent_event_xml(limit=50):
    """
    Reads the most recent Sysmon events
    and returns a list of XML strings.
    """

    log_name = "Microsoft-Windows-Sysmon/Operational"

    handle = win32evtlog.EvtQuery(
        log_name,
        win32evtlog.EvtQueryChannelPath |
        win32evtlog.EvtQueryReverseDirection,
        "*"
    )

    events = win32evtlog.EvtNext(handle, limit)

    xml_events = []

    for event in events:

        xml = win32evtlog.EvtRender(
            event,
            win32evtlog.EvtRenderEventXml
        )

        xml_events.append(xml)

    return xml_events


if __name__ == "__main__":

    # -------------------------------------------------
    # Initialize Engines
    # -------------------------------------------------

    manager = AlertManager()

    correlation_engine = CorrelationEngine()

    timeline_builder = TimelineBuilder()

    timeline_formatter = TimelineFormatter()

    attack_narrative = AttackNarrative()

    report_builder = InvestigationReport()

    mitre_summary_builder = MitreSummary()

    detection_summary_builder = DetectionSummary()

    recommendation_engine = RecommendationEngine()

    prompt_builder = PromptBuilder()

    ai_analyzer = AIAnalyzer()

    # -------------------------------------------------
    # Read Sysmon Events
    # -------------------------------------------------

    xml_events = get_recent_event_xml(50)

    # -------------------------------------------------
    # Detection Pipeline
    # -------------------------------------------------

    for xml in xml_events:

        event = parse_event(xml)

        normalized = normalize_event(event)

        detections = detect_event(normalized)
        
        for detection in detections:

            alert = build_alert(
                normalized,
                detection
            )

            alert = calculate_risk(alert)

            manager.add_alert(alert)


    # -------------------------------------------------
    # Correlation Pipeline
    # -------------------------------------------------
    print(f"Total alerts collected: {len(manager.get_alerts())}")
    incidents = correlation_engine.correlate(
        manager.get_alerts()
    )

    # -------------------------------------------------
    # Print Alerts
    # -------------------------------------------------

    print("\n" + "=" * 60)
    print("AI-SOC ALERTS")
    print("=" * 60)

    for alert in manager.get_alerts():

        print(f"\n🚨 {alert['alert_id']}")
        print("-" * 60)

        print(f"Rule        : {alert.get('rule')}")
        print(f"Status      : {alert.get('status')}")
        print(f"Priority    : {alert.get('priority')}")
        print(f"Risk Score  : {alert.get('risk_score')}")
        print(f"Severity    : {alert.get('severity')}")
        print(f"Confidence  : {alert.get('confidence')}%")

        print(f"MITRE       : {', '.join(alert.get('mitre', []))}")

        print(f"Host        : {alert.get('computer')}")
        print(f"User        : {alert.get('user')}")
        print(f"Time        : {alert.get('timestamp')}")

    # -------------------------------------------------
    # Print Incidents
    # -------------------------------------------------

    print("\n" + "=" * 60)
    print("INCIDENTS")
    print("=" * 60)

    for incident in incidents:

        print(f"\n🛡️ {incident.incident_id}")
        print(f"Host      : {incident.host}")
        print(f"User      : {incident.user}")
        print(f"Status    : {incident.status}")
        print(f"Risk      : {incident.overall_risk}")
        print(f"Alerts    : {len(incident.alerts)}")

        timeline = timeline_builder.build(incident)
        narrative = attack_narrative.build(timeline)    
        mitre_summary = mitre_summary_builder.build(incident)
        detection_summary = detection_summary_builder.build(incident)
        recommendations = recommendation_engine.build(incident)
        

        report = report_builder.build(
             incident,
             timeline,
             narrative,
             mitre_summary,
             detection_summary,
             recommendations,
             
            )
        analysis = ai_analyzer.analyze(
                   report,
                   prompt_builder
                )
        print("\nAI ANALYSIS")
        print("=" * 60)
        print("\nAI ANALYSIS")
        print("=" * 60)

        print(f"Summary: {analysis['summary']}")
        print()

        print(f"Severity Reasoning: {analysis['severity_reasoning']}")
        print()

        print(f"Impact: {analysis['impact']}")
        print()

        print(f"Predicted Next Step: {analysis['attacker_next_step']}")
        print()

        print("Containment:")
        for item in analysis["containment"]:
              print(f"  • {item}")

        print()

        print("Further Investigation:")
        for item in analysis["investigation"]:
            print(f"  • {item}")

        print()

        print(f"Confidence: {analysis['confidence']}")  
        prompt = prompt_builder.build(report)

        formatted_timeline = timeline_formatter.format(
            timeline
         )
        print("\n" + "=" * 60)
        print("INVESTIGATION REPORT")
        print("=" * 60)

        print(f"Incident ID : {report['incident_id']}")
        print(f"Host        : {report['host']}")
        print(f"User        : {report['user']}")
        print(f"Status      : {report['status']}")
        print(f"Risk Score  : {report['overall_risk']}")
        print(f"Total Alerts: {report['total_alerts']}")


        print(formatted_timeline)
        print("\nATTACK NARRATIVE")
        print("-" * 60)
        print("\nMITRE SUMMARY")
        print("-" * 60)
        print("\nDETECTION SUMMARY")
        print("-" * 60)
        print("\nRECOMMENDATIONS")
        print("-" * 60)
        print("\nPROMPT SENT TO AI")
        print("=" * 60)
        print(prompt)
        #for recommendation in report["recommendations"]:
         #print(f"• {recommendation}")
        for rule, count in report["detection_summary"].items():
         print(f"{rule}: {count}")
        for technique in report["mitre_summary"]["techniques"]:
         print(technique)

        for i, stage in enumerate(narrative, start=1):
         print(f"{i}. {stage}")
         print("-" * 60)
        # print(normalized)#-------------- for debugging purpose 