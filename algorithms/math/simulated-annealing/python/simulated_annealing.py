import math
import random


def simulated_annealing(arr: list[int]) -> int:
    if len(arr) == 0:
        return 0
    if len(arr) == 1:
        return arr[0]

    n = len(arr)
    rng = random.Random(42)

    current = 0
    best = 0
    temperature = 1000.0
    cooling_rate = 0.995
    min_temp = 0.01

    while temperature > min_temp:
        neighbor = rng.randint(0, n - 1)
        delta = arr[neighbor] - arr[current]

        if delta < 0:
            current = neighbor
        else:
            probability = math.exp(-delta / temperature) if temperature > 0 else 0
            if rng.random() < probability:
                current = neighbor

        if arr[current] < arr[best]:
            best = current

        temperature *= cooling_rate

    return arr[best]
