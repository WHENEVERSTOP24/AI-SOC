from simulator.simulator import AttackSimulator


sim = AttackSimulator()

sim.list_attacks()

print()

attack = input("Select attack: ")

sim.run(attack)

