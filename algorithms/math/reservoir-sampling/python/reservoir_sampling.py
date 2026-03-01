import random


def reservoir_sampling(stream: list[int], k: int, seed: int) -> list[int]:
    rng = random.Random(seed)
    n = len(stream)

    if k >= n:
        return stream[:]

    reservoir = stream[:k]

    for i in range(k, n):
        j = rng.randint(0, i)
        if j < k:
            reservoir[j] = stream[i]

    return reservoir
