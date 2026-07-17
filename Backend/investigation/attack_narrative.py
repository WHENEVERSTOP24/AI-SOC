class AttackNarrative:

    def __init__(self):

        self.technique_to_stage = {

            "T1059.001": "Execution",

            "T1071": "Command & Control",

            "T1105": "Ingress Tool Transfer",

            "T1547": "Persistence",

            "T1055": "Privilege Escalation",

            "T1082": "Discovery"
        }

    def build(self, timeline):

        narrative = []

        seen = set()

        for event in timeline:

            techniques = event.get("mitre", [])

            for technique in techniques:

                stage = self.technique_to_stage.get(technique)

                if stage and stage not in seen:

                    narrative.append(stage)

                    seen.add(stage)

        return narrative