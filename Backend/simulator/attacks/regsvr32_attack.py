import subprocess

from simulator.base_attack import BaseAttack


class Regsvr32Attack(BaseAttack):

    def name(self):
        return "Regsvr32 Execution"

    def description(self):
        return "Executes a harmless Regsvr32 command for AI-SOC simulation."

    def execute(self):

        print("[Simulator] Running Regsvr32 attack...")

        subprocess.run(
            [
                "regsvr32.exe",
                "/?"
            ],
            shell=True
        )

        print("[Simulator] Regsvr32 simulation completed.")