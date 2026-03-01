def sieve_of_eratosthenes(n: int) -> list[int]:
    if n < 2:
        return []
    sieve = [True] * (n + 1)
    sieve[0] = False
    sieve[1] = False
    factor = 2
    while factor * factor <= n:
        if sieve[factor]:
            for multiple in range(factor * factor, n + 1, factor):
                sieve[multiple] = False
        factor += 1
    return [value for value in range(2, n + 1) if sieve[value]]
