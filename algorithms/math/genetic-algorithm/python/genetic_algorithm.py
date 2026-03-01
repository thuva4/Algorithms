import random


def genetic_algorithm(arr: list[int], seed: int) -> int:
    if len(arr) == 0:
        return 0
    if len(arr) == 1:
        return arr[0]

    n = len(arr)
    rng = random.Random(seed)
    pop_size = min(20, n)
    generations = 100
    mutation_rate = 0.1

    # Initialize population as random indices
    population = [rng.randint(0, n - 1) for _ in range(pop_size)]

    best_idx = min(population, key=lambda i: arr[i])

    for _ in range(generations):
        # Tournament selection
        new_pop = []
        for _ in range(pop_size):
            a = population[rng.randint(0, pop_size - 1)]
            b = population[rng.randint(0, pop_size - 1)]
            winner = a if arr[a] <= arr[b] else b
            new_pop.append(winner)

        # Crossover (uniform)
        offspring = []
        for i in range(0, pop_size - 1, 2):
            if rng.random() < 0.7:
                offspring.append(new_pop[i])
                offspring.append(new_pop[i + 1])
            else:
                offspring.append(new_pop[i + 1])
                offspring.append(new_pop[i])
        if len(offspring) < pop_size:
            offspring.append(new_pop[-1])

        # Mutation
        for i in range(len(offspring)):
            if rng.random() < mutation_rate:
                offspring[i] = rng.randint(0, n - 1)

        population = offspring

        gen_best = min(population, key=lambda i: arr[i])
        if arr[gen_best] < arr[best_idx]:
            best_idx = gen_best

    return arr[best_idx]
