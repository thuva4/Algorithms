def segmented_sieve(low: int, high: int) -> list[int]:
    if high < 2 or low > high:
        return []
    low = max(low, 2)
    sieve = [True] * (high + 1)
    sieve[0] = False
    sieve[1] = False
    factor = 2
    while factor * factor <= high:
        if sieve[factor]:
            for multiple in range(factor * factor, high + 1, factor):
                sieve[multiple] = False
        factor += 1
    return [value for value in range(low, high + 1) if sieve[value]]
