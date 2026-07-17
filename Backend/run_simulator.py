from simulator.simulator import AttackSimulator

sim = AttackSimulator()

sim.list_attacks()

print()

choice = input("Select attack: ").strip().lower()

sim.run(choice)