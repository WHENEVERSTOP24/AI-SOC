import subprocess

from simulator.base_attack import BaseAttack


class MSHTAAttack(BaseAttack):

    def name(self):
        return "MSHTA Execution"

    def description(self):
        return "Executes a harmless MSHTA command for AI-SOC simulation."

    def execute(self):

        print("[Simulator] Running MSHTA attack...")

        subprocess.run(
            [
                "mshta",
                "about:blank"
            ],
            shell=True
        )

        print("[Simulator] MSHTA simulation completed.")