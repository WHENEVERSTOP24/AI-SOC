import subprocess

from simulator.base_attack import BaseAttack


class CMDExecutionAttack(BaseAttack):

    def name(self):
        return "CMD Execution"

    def description(self):
        return "Executes a harmless Command Prompt command."

    def execute(self):

        print("[Simulator] Running CMD Execution attack...")

        subprocess.run(
            [
                "cmd.exe",
                "/c",
                "echo",
                "AI-SOC CMD Simulation"
            ],
            shell=False
        )

        print("[Simulator] CMD simulation completed.")