import subprocess

from simulator.base_attack import BaseAttack


class EncodedPowerShellAttack(BaseAttack):

    def name(self):
        return "Encoded PowerShell"

    def description(self):
        return "Executes a Base64-encoded PowerShell command."

    def execute(self):

        print("[Simulator] Running Encoded PowerShell attack...")

        encoded_command = (
            "VwByAGkAdABlAC0ASABvAHMAdAAgACIAQQBJAC0AUwBPAEMAIABFAG4AYwBvAGQAZQBkACIA"
        )

        subprocess.run(
            [
                "powershell",
                "-EncodedCommand",
                encoded_command
            ],
            shell=True
        )

        print("[Simulator] Encoded PowerShell simulation completed.")