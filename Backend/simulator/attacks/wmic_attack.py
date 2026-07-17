import subprocess

from simulator.base_attack import BaseAttack


class WMICAttack(BaseAttack):

    def name(self):
        return "WMIC Execution"

    def description(self):
        return "Executes a harmless WMIC command for AI-SOC simulation."

    def execute(self):

        print("[Simulator] Running WMIC attack...")

        subprocess.run(
            [
                "wmic",
                "process",
                "list",
                "brief"
            ],
            shell=True
        )

        print("[Simulator] WMIC simulation completed.")