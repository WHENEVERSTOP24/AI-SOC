class PromptBuilder:

    def build(self, report):

        prompt = f"""
You are a Senior SOC Analyst.

Analyze the following investigation report.

============================================================
INCIDENT SUMMARY
============================================================

Incident ID : {report['incident_id']}
Host        : {report['host']}
User        : {report['user']}
Status      : {report['status']}
Risk Score  : {report['overall_risk']}
Total Alerts: {report['total_alerts']}

============================================================
DETECTION SUMMARY
============================================================
"""

        for rule, count in report["detection_summary"].items():
            prompt += f"- {rule}: {count}\n"

        prompt += "\n============================================================\n"
        prompt += "MITRE SUMMARY\n"
        prompt += "============================================================\n"

        for technique in report["mitre_summary"]["techniques"]:
            prompt += f"- {technique}\n"

        prompt += "\n============================================================\n"
        prompt += "TIMELINE\n"
        prompt += "============================================================\n"

        for event in report["timeline"]:

            prompt += (
                f"- {event['timestamp']} | "
                f"{event['rule']} | "
                f"{event['severity']} | "
                f"Risk {event['risk_score']}\n"
            )

        prompt += "\n============================================================\n"
        prompt += "ATTACK NARRATIVE\n"
        prompt += "============================================================\n"

        for stage in report["attack_narrative"]:
            prompt += f"- {stage}\n"

        prompt += "\n============================================================\n"
        prompt += "RECOMMENDATIONS\n"
        prompt += "============================================================\n"

        for recommendation in report["recommendations"]:
            prompt += f"- {recommendation}\n"

        prompt += """

============================================================
YOUR TASK
============================================================

You are a Senior SOC Analyst.

Analyze ONLY the information contained in the investigation report.

Rules:

1. Do NOT invent facts.
2. Do NOT assume malware families.
3. Do NOT assume cloud environments.
4. If there is insufficient evidence, explicitly say:
   "Not enough evidence in the investigation report."

Return ONLY valid JSON.

Use this exact schema:

{
    "schema_version": "1.0",
    "summary": "",
    "severity_reasoning": "",
    "impact": "",
    "attacker_next_step": "",
    "containment": [],
    "investigation": [],
    "confidence": ""
}

Rules:
- Output ONLY JSON.
- No markdown.
- No explanations outside JSON.
- Containment and investigation must be arrays.
- Confidence must be one of: Low, Medium, High.
"""
        return prompt