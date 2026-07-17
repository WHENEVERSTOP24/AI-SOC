import subprocess

from simulator.base_attack import BaseAttack


class PowerShellAttack(BaseAttack):

    def name(self):
        return "PowerShell Execution"

    def description(self):
        return "Executes a harmless PowerShell command for AI-SOC simulation."

    def execute(self):

        print("[Simulator] Running PowerShell attack...")

        subprocess.run(
            [
                "powershell",
                "-Command",
                "Write-Host 'AI-SOC Simulation'"
            ],
            shell=True
        )

        print("[Simulator] PowerShell simulation completed.")