import subprocess

from simulator.base_attack import BaseAttack


class CertUtilAttack(BaseAttack):

    def name(self):
        return "CertUtil Usage"

    def description(self):
        return "Executes a harmless CertUtil command for AI-SOC simulation."

    def execute(self):

        print("[Simulator] Running CertUtil attack...")

        subprocess.run(
            [
                "certutil",
                "-?"
            ],
            shell=True
        )

        print("[Simulator] CertUtil simulation completed.")