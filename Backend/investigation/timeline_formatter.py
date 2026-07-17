class TimelineFormatter:

    def format(self, timeline):

        lines = []

        lines.append("=" * 60)
        lines.append("INCIDENT TIMELINE")
        lines.append("=" * 60)

        for event in timeline:

            lines.append(f"\n🕒 {event['timestamp']}")
            lines.append(f"Rule      : {event['rule']}")
            lines.append(f"Severity  : {event['severity']}")
            lines.append(f"Risk      : {event['risk']}")
            lines.append(f"Host      : {event['host']}")
            lines.append(f"User      : {event['user']}")

            mitre = event.get("mitre", [])

            if mitre:
                lines.append(f"MITRE     : {', '.join(mitre)}")

            lines.append("-" * 60)

        return "\n".join(lines)