import subprocess

from simulator.base_attack import BaseAttack


class RunDLL32Attack(BaseAttack):

    def name(self):
        return "RunDLL32 Execution"

    def description(self):
        return "Executes a harmless RunDLL32 command for AI-SOC simulation."

    def execute(self):

        print("[Simulator] Running RunDLL32 attack...")

        subprocess.run(
            [
                "rundll32.exe",
                "shell32.dll,Control_RunDLL"
            ],
            shell=True
        )

        print("[Simulator] RunDLL32 simulation completed.")