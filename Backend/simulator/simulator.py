from simulator.attacks.powershell_attack import PowerShellAttack
from simulator.attacks.encoded_powershell import EncodedPowerShellAttack
from simulator.attacks.cmd_execution import CMDExecutionAttack
from simulator.attacks.certutil_attack import CertUtilAttack
from simulator.attacks.mshta_attack import MSHTAAttack
from simulator.attacks.rundll32_attack import RunDLL32Attack
from simulator.attacks.regsvr32_attack import Regsvr32Attack
from simulator.attacks.wmic_attack import WMICAttack

class AttackSimulator:

    def __init__(self):

        self.attacks = {

            "powershell": PowerShellAttack(),
            "encoded": EncodedPowerShellAttack(),
            "cmd": CMDExecutionAttack(),
            "certutil": CertUtilAttack(),
            "mshta": MSHTAAttack(),
            "rundll32": RunDLL32Attack(),
            "regsvr32": Regsvr32Attack(),
            "wmic": WMICAttack(),

        }

    def list_attacks(self):

        for attack in self.attacks.values():

            print()

            print(attack.name())

            print(attack.description())

    def run(self, attack_name):

        attack = self.attacks.get(attack_name)

        if attack:

            attack.execute()

        else:

            print("Unknown attack.")